import { getUids, get$ } from "./utils";
import dayjs from "dayjs";
import { parseURL } from "whatwg-url";
import PQueue from "p-queue";
import { range } from "lodash";
import { logger } from "@src/main/utils/logger";
import { BaseCraw } from "@src/main/utils/craw";
import { Article } from "@src/common/interfaces/article.interface";
import { ArticleEntity } from "@src/main/entities/article.entity";
import { store } from "@src/main/store";
import { STORE_KEY_ENUM } from "@src/main/store/STORE_KEY_ENUM";

type ListData = Pick<
  Article,
  "time" | "href" | "img_src" | "tags" | "content" | "cat"
>;

type DetailData = Pick<
  Article,
  | "title"
  | "entry_content"
  | "rating_count"
  | "rating_score"
  | "uid"
  | "imgs"
  | "raw_id"
>;

type CrawArticle = Omit<Article, "id">;

export class ArticleCraw extends BaseCraw {
  constructor(
    private startPage: number = 1,
    private endPage?: number,
    private config = store.get(STORE_KEY_ENUM.CRAW_LIULI)
  ) {
    super();
  }

  parseDetail = async (uri: string, listData: ListData) => {
    const { SKIP_EMPTY_UIDS } = this.config;
    logger.info(`fetching detail ${uri}`);
    const $ = await get$(uri, this.config.PROXY);
    const path = parseURL(uri)?.path;
    let raw_id;
    if (Array.isArray(path)) {
      raw_id = path.pop?.()?.replace(".html", "");
    } else if (typeof path === "string") {
      raw_id = path.replace(".html", "");
    }
    if (!raw_id) {
      throw new Error("no row id");
    }
    const title = $(".entry-title").text();
    const rating_count = $(".post-ratings strong")
      .eq(0)
      .text()
      .trim()
      .replace(",", "");
    const rating_score = $(".post-ratings strong").eq(1).text().trim();
    const entry_content = $(".entry-content").text();
    if (!title) {
      throw new Error(`skip data without title: ${uri}`);
    }
    const imgs: string[] = [];
    $(".entry-content")
      .find("img")
      .each((_, el) => {
        const src = $(el).attr("src");
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
      uid: uids.join("|"),
      imgs: imgs.join("|"),
      raw_id
    };
    const article: CrawArticle = {
      ...detailData,
      ...listData
    };
    if (SKIP_EMPTY_UIDS && uids.length === 0) {
      throw new Error(`skip data miss uids: ${article.title}`);
    }
    logger.info(`fetch detail ${uri} success`);
    return article;
  };

  parseList = async (link: string) => {
    const { SKIP_ADS } = this.config;
    logger.info(`fetching ${link}...`);
    const $ = await get$(link, this.config.PROXY);
    const hrefs: {
      uri: string;
      data: ListData;
    }[] = [];
    $("article.post").each((_, el) => {
      const timestr = $(el).find(".entry-header time").attr("datetime");
      const time = new Date(+dayjs(timestr));
      const href = $(el).find(".entry-title a").attr("href") || null;
      const img_src = $(el).find(".entry-content img").attr("src") || null;
      const content = $(el).find(".entry-content").text().trim();
      const cat = $(el).find("span.cat-links > a").text();
      const tags: string[] = [];
      if (!href) {
        throw new Error("no href...");
      }
      $(el)
        .find(".tag-links a[rel=tag]")
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
        tags: tags.join("|"),
        content,
        cat
      };
      const title = $(el).find("header > .entry-title").text().trim();
      const testStr = title + content;
      const adArr = ["广告", "点击购买", "优惠券"];
      if (
        (SKIP_ADS && !title) ||
        adArr.some((adStr) => testStr.includes(adStr))
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
    const hrefs = await this.withErrorHandler(this.parseList)(link);

    const queue = new PQueue({
      concurrency: 5,
      interval: 1000,
      intervalCap: 3
    });

    const results = await queue.addAll(
      hrefs.map(
        ({ uri, data }) =>
          () =>
            this.withErrorHandler(this.parseDetail)(uri, data)
      )
    );
    return ArticleEntity.upsert(results, ["raw_id"]);
  };

  getEndPage = async () => {
    const firstPage = `${this.config.BASE_LINK}/1`;
    const $ = await get$(firstPage, this.config.PROXY);
    const num = $("#wp_page_numbers .first_last_page > a").text();
    return parseInt(num, 10) || 100;
  };

  // 指定页面范围的所有数据
  run = async () => {
    if (!this.endPage) {
      this.endPage = await this.getEndPage();
    }
    logger.info(`start fetching from ${this.startPage} to ${this.endPage}`);
    const links = range(this.startPage, this.endPage + 1).map(
      (i) => `${this.config.BASE_LINK}/${i}`
    );
    const queue = new PQueue({
      concurrency: 5,
      interval: 1000,
      intervalCap: 3
    });
    await queue.addAll(
      links.map((link) => () => this.withErrorHandler(this.parse)(link))
    );
  };
}
