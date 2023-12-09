import { getUids, get$ } from './utils';
import dayjs from 'dayjs';
import { parseURL } from 'whatwg-url';
import { range } from 'lodash';
import { logger } from '@src/main/utils/logger';
import { BaseCraw } from '@src/main/utils/craw';
import { Article } from '@src/common/interfaces/article.interface';
import { ArticleEntity } from '@src/main/entities/article.entity';
import { store } from '@src/main/store';
import { IPC_CHANNEL_ENUM, STORE_KEY_ENUM } from '@src/common/constants';
import { windowManager } from '@src/main/window';

type ListData = Pick<
  Article,
  'time' | 'href' | 'img_src' | 'tags' | 'content' | 'cat'
>;

interface ListHref {
  uri: string;
  data: ListData;
}

type DetailData = Pick<
  Article,
  | 'title'
  | 'entry_content'
  | 'rating_count'
  | 'rating_score'
  | 'uid'
  | 'imgs'
  | 'raw_id'
>;

type CrawArticle = Omit<Article, 'id'>;

export class ArticleCraw extends BaseCraw {
  private get config() {
    return store.get(STORE_KEY_ENUM.CRAW_LIULI);
  }

  constructor() {
    super();
    this.queue.addListener('idle', () => {
      windowManager.mainWindow.webContents.send(
        IPC_CHANNEL_ENUM.ARTICLE_CRAW_IDLE,
      );
    });
    this.queue.addListener('active', () => {
      windowManager.mainWindow.webContents.send(
        IPC_CHANNEL_ENUM.ARTICLE_CRAW_STATUS_CHANGE,
      );
    });
    this.queue.addListener('completed', () => {
      windowManager.mainWindow.webContents.send(
        IPC_CHANNEL_ENUM.ARTICLE_CRAW_STATUS_CHANGE,
      );
    });
  }

  parseDetail = async ({ uri, data: listData }: ListHref) => {
    const { SKIP_EMPTY_UIDS } = this.config;
    logger.info(`fetching detail ${uri}`);
    const $ = await get$(uri);
    const path = parseURL(uri)?.path;
    let raw_id;
    if (Array.isArray(path)) {
      raw_id = path.pop?.()?.replace('.html', '');
    } else if (typeof path === 'string') {
      raw_id = path.replace('.html', '');
    }
    if (!raw_id) {
      throw new Error('no row id');
    }
    const title = $('.entry-title').text();
    const rating_count = $('.post-ratings strong')
      .eq(0)
      .text()
      .trim()
      .replace(',', '');
    const rating_score = $('.post-ratings strong').eq(1).text().trim();
    const entry_content = $('.entry-content').text();
    if (!title) {
      throw new Error(`skip data without title: ${uri}`);
    }
    const imgs: string[] = [];
    $('.entry-content')
      .find('img')
      .each((_, el) => {
        const src = $(el).attr('src');
        if (src) {
          imgs.push(src);
        }
      });
    const uids = getUids(entry_content);

    const detailData: DetailData = {
      title,
      entry_content,
      rating_count: parseInt(rating_count, 10) || 0,
      rating_score: parseFloat(rating_score) || 0,
      uid: uids.join('|'),
      imgs: imgs.join('|'),
      raw_id,
    };
    const article: CrawArticle = {
      ...detailData,
      ...listData,
    };
    if (SKIP_EMPTY_UIDS && uids.length === 0) {
      throw new Error(`skip data miss uids: ${article.title}`);
    }

    const { identifiers } = await ArticleEntity.upsert(article, {
      conflictPaths: {
        raw_id: true,
      },
    });

    const insertIds = identifiers.filter(Boolean);

    this.insertCount += insertIds.length;
    this.updateCount += 1 - insertIds.length;

    // return ArticleEntity.upsert(results, ["raw_id"]);
    return article;
  };

  parseList = async (link: string) => {
    const { SKIP_ADS } = this.config;
    logger.info(`fetching ${link}...`);
    const $ = await get$(link);

    const hrefs: ListHref[] = [];
    $('article.post').each((_, el) => {
      const timestr = $(el).find('.entry-header time').attr('datetime');
      const time = new Date(+dayjs(timestr));
      const href = $(el).find('.entry-title a').attr('href') || null;
      const img_src = $(el).find('.entry-content img').attr('src') || null;
      const content = $(el).find('.entry-content').text().trim();
      const cat = $(el).find('span.cat-links > a').text();
      const tags: string[] = [];
      if (!href) {
        throw new Error('no href...');
      }
      $(el)
        .find('.tag-links a[rel=tag]')
        // eslint-disable-next-line func-names
        .each(function () {
          const tag = $(this).text();
          if (tag) {
            tags.push(tag);
          }
        });
      const data: ListData = {
        time,
        href,
        img_src,
        tags: tags.join('|'),
        content,
        cat,
      };
      const title = $(el).find('header > .entry-title').text().trim();
      const testStr = title + content;
      const adArr = ['广告', '点击购买', '优惠券'];
      if (
        (SKIP_ADS && !title) ||
        adArr.some(adStr => testStr.includes(adStr))
      ) {
        return;
      }
      if (!href) {
        logger.warn(`miss href`);
        return;
      }
      hrefs.push({ uri: href, data });
    });
    logger.info(`fetch ${link} success.`);
    return hrefs;
  };

  parse = async (link: string) => {
    const hrefs = await this.parseList(link);
    this.queue.addAll(
      hrefs.map(d => () => this.parseDetail(d)),
      {
        priority: 2, // 详情页具有更高的优先级
      },
    );
  };

  private getPageLink = (num: number) => {
    if (this.config.BASE_LINK.includes('html')) {
      return `${this.config.BASE_LINK.replace(
        /\.html.*$/,
        '.html',
      )}/page/${num}`;
    }
    return `${this.config.BASE_LINK.replace(/\/?page\/?\d*$/, '').replace(
      /\/$/,
      '',
    )}/page/${num}`;
  };

  getEndPage = async () => {
    if (!this.config.BASE_LINK) {
      return 0;
    }
    const firstPage = this.getPageLink(1);
    const $ = await get$(firstPage);
    const pagesText = $('#content .pages').text();
    const [, total] = pagesText.match(/共 (\d+) 页/) || ['0', '0'];
    const oldTotal = $('#wp_page_numbers .first_last_page > a').text();
    return parseInt(total || oldTotal, 10);
  };

  // 指定页面范围的所有数据
  run = async (startPage = 1, endPage?: number) => {
    if (!this.config.BASE_LINK) {
      return;
    }
    if (!endPage) {
      endPage = (await this.getEndPage()) || 100;
    }
    this.resetStat();
    logger.info(`start fetching from ${startPage} to ${endPage}`);
    const links = range(startPage, endPage + 1)
      //   .reverse()
      .map(this.getPageLink);
    await this.queue.addAll(
      links.map(link => () => this.parse(link)),
      {
        priority: 1,
      },
    );
  };

  async autoFetch() {
    if (!this.config.BASE_LINK) {
      return;
    }
    logger.info('Start auto fetch...');
    // const endPage = await this.getEndPage();
    // const total = await ArticleEntity.count();
    // const remoteTotal = (endPage || 0) * 10;
    // const remainPageCount = Math.ceil((remoteTotal - total) / 10);
    // const min = 3;
    // const fetchPageCount = Math.max(remainPageCount, min);
    await this.run(1, 1);
  }
}

export const articleCraw = new ArticleCraw();
