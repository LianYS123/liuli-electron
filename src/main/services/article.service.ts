import { articleCraw } from '@src/main/craw/liuli';
import {
  ArticleDto,
  ConnectDto,
  ConnectFilesDto,
} from '@src/common/params/article.dto';
import { CrawDto } from '@src/common/params/craw.dto';
import { ArticleEntity } from '@src/main/entity/article.entity';
import { IpcException } from '@src/common/exceptions/IpcException';
import { Brackets, Like } from 'typeorm';
import { fileService } from './file.service';
import { uniq } from 'lodash';

export class ArticleService {
  // 分页查找
  public getArticles = async (params: ArticleDto) => {
    const {
      pageNo,
      pageSize = 20,
      searchValue,
      cat,
      order,
      tags,
      onlyPlayable,
    } = params;

    let query = ArticleEntity.createQueryBuilder('article')
      .skip(pageSize * (pageNo - 1))
      .take(pageSize)
      .leftJoinAndSelect('article.files', 'files');

    if (onlyPlayable) {
      query = query.andWhere(
        new Brackets(qb => {
          qb.where('article.web_sources is not null').orWhere(
            'files.id is not null',
          );
        }),
      );
    }

    if (searchValue) {
      query = query.andWhere(
        new Brackets(qb => {
          const value = Like(`%${searchValue}%`).value;
          qb.where('article.title like :searchValue', {
            searchValue: value,
          }).orWhere('article.content like :searchValue', {
            searchValue: value,
          });
        }),
      );
    }

    if (cat && cat !== '全部') {
      query = query.andWhere('article.cat like :cat', {
        cat: Like(`%${cat}%`).value,
      });
    }

    if (tags && tags.length) {
      query.andWhere(
        new Brackets(qb => {
          tags.forEach((tag, index) => {
            qb = qb.orWhere(`tags like :tag${index}`, {
              [`tag${index}`]: Like(`%${tag}%`).value,
            });
          });
        }),
      );
    }

    if (order) {
      query = query
        .orderBy(`article.${order}`, 'DESC')
        .addOrderBy('article.time', 'DESC');
    } else {
      query = query.orderBy('article.time', 'DESC');
    }

    const [articles, total] = await query.getManyAndCount();

    return {
      pageNo,
      pageSize,
      total,
      list: articles,
    };
  };

  public getArticleDetail = async ({ articleId }: { articleId: number }) => {
    return ArticleEntity.findOne({
      where: { id: articleId },
      relations: { files: true },
    });
  };

  // 爬虫;
  public fetchArticles = async (params: CrawDto): Promise<null> => {
    await articleCraw.run(params.startPage, params.endPage);
    return null;
  };

  public findArticleById = async (articleId: number) => {
    const article = await ArticleEntity.findOne({
      where: { id: articleId },
      relations: {
        files: true,
      },
    });
    if (!article) {
      throw new IpcException(400, '文章不存在');
    }
    return article;
  };

  // 关联文章
  public connectArticle = async (articleId: number, fileId: number) => {
    const article = await this.findArticleById(articleId);
    const file = await fileService.findFileById(fileId);

    if (!article.files.some(it => it.id === file.id)) {
      article.files.push(file);
    }
    await article.save();
  };

  // 创建文件并关联
  public createAndConnectFile = async ({ articleId, fromPath }: ConnectDto) => {
    if (!fromPath) {
      throw new Error('请选择关联文件');
    }
    const file = await fileService.createFileByPath(fromPath);
    await this.connectArticle(articleId, file.id);
  };

  // 创建已有关联
  public connectFile = async ({ articleId, fileId }: ConnectDto) => {
    if (!fileId) {
      throw new Error('文件不存在');
    }
    await this.connectArticle(articleId, fileId);
  };

  async connectFiles({ items }: ConnectFilesDto) {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.fileId) {
        continue;
      }
      await this.connectArticle(it.articleId, it.fileId);
    }
  }

  // 移除关联
  public removeFile = async ({ articleId, fileId }: ConnectDto) => {
    const article = await this.findArticleById(articleId);
    if (!fileId) {
      throw new Error('文件不存在');
    }
    const file = await fileService.findFileById(fileId);
    article.files = article.files.filter(it => {
      return it.id !== file.id;
    });
    await article.save();
  };

  private parseWebSource(source?: string): string[] {
    if (!source) {
      return [];
    }
    try {
      const res = JSON.parse(source);
      if (Array.isArray(res)) {
        return res as string[];
      }
    } catch {
      return [];
    }
    return [];
  }

  public addSource = async ({
    source,
    articleId,
  }: {
    source: string;
    articleId: number;
  }) => {
    const article = await this.findArticleById(articleId);
    const sources = this.parseWebSource(article.web_sources);
    article.web_sources = JSON.stringify(uniq([...sources, source]));
    return article.save();
  };

  public removeSource = async ({
    source,
    articleId,
  }: {
    source: string;
    articleId: number;
  }) => {
    const article = await this.findArticleById(articleId);
    const sources = this.parseWebSource(article.web_sources);
    article.web_sources = JSON.stringify(sources.filter(it => it !== source));
    return article.save();
  };
}

export const articleService = new ArticleService();
