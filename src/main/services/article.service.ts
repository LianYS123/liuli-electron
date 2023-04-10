import { ArticleCraw } from "@src/main/craw/liuli";
import {
  ArticleDto,
  ConnectDto,
  ConnectFilesDto
} from "@src/common/params/article.dto";
import { CrawDto } from "@src/common/params/craw.dto";
import { ArticleEntity } from "@src/main/entities/article.entity";
import { IpcException } from "@src/common/exceptions/IpcException";
import { Brackets, Like } from "typeorm";
import { FileService } from "./file.service";

class ArticleService {
  fileService = new FileService();
  // 分页查找
  public getArticles = async (params: ArticleDto) => {
    const {
      pageNo,
      pageSize = 20,
      searchValue,
      cat,
      order,
      tags,
      onlyPlayable
    } = params;

    let query = ArticleEntity.createQueryBuilder('article')
      .skip(pageSize * (pageNo - 1))
      .take(pageSize)
      .leftJoinAndSelect("article.files", "files");

    if (onlyPlayable) {
      query = query.andWhere((qb) => {
        qb.where("files.id is not null");
      });
    }

    if (searchValue) {
      query = query.andWhere(
        new Brackets((qb) => {
          const value = Like(`%${searchValue}%`).value;
          qb.where("article.title like :searchValue", {
            searchValue: value
          }).orWhere("article.content like :searchValue", {
            searchValue: value
          });
        })
      );
    }

    if (cat && cat !== "全部") {
      query = query.andWhere("article.cat like :cat", {
        cat: Like(`%${cat}%`).value
      });
    }

    if (tags && tags.length) {
      query.andWhere(
        new Brackets((qb) => {
          tags.forEach((tag, index) => {
            qb = qb.orWhere(`tags like :tag${index}`, {
              [`tag${index}`]: Like(`%${tag}%`).value
            });
          });
        })
      );
    }

    if (order) {
      query = query
        .orderBy(`article.${order}`, "DESC")
        .addOrderBy("article.time", "DESC");
    } else {
      query = query.orderBy("article.time", "DESC");
    }

    const [articles, total] = await query.getManyAndCount();

    return {
      pageNo,
      pageSize,
      total,
      list: articles
    };
  };

  // 爬虫;
  public async fetchArticles(params: CrawDto): Promise<null> {
    const craw = new ArticleCraw(params.startPage, params.endPage);
    await craw.start();
    return null;
  }

  public findArticleById = async (articleId: number) => {
    const article = await ArticleEntity.findOne({
      where: { id: articleId },
      relations: {
        files: true
      }
    });
    if (!article) {
      throw new IpcException(400, "文章不存在");
    }
    return article;
  };

  // 关联文章
  public connectArticle = async (articleId: number, fileId: number) => {
    const article = await this.findArticleById(articleId);
    const file = await this.fileService.findFileById(fileId);

    if (!article.files.some((it) => it.id === file.id)) {
      article.files.push(file);
    }
    await article.save();
  };

  // 创建文件并关联
  public createAndConnectFile = async ({ articleId, fromPath }: ConnectDto) => {
    const file = await this.fileService.createFileByPath(fromPath);
    await this.connectArticle(articleId, file.id);
  };

  // 创建已有关联
  public connectFile = async ({ articleId, fileId }: ConnectDto) => {
    await this.connectArticle(articleId, fileId);
  };

  async connectFiles({ items }: ConnectFilesDto) {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      console.log(it);
      await this.connectArticle(it.articleId, it.fileId);
    }
  }

  // 移除关联
  public removeFile = async ({ articleId, fileId }: ConnectDto) => {
    const article = await this.findArticleById(articleId);
    const file = await this.fileService.findFileById(fileId);
    article.files = article.files.filter((it) => {
      return it.id !== file.id;
    });
    await article.save();
  };
}

export default ArticleService;
