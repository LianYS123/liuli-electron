import type { ArticleService } from "@src/main/services/article.service";
import { ChannelsType, getAPI } from "./getAPI";

const channels: ChannelsType<ArticleService> = {
  getArticles: "getArticles",
  fetchArticles: "fetchArticles",
  findArticleById: "findArticleById",
  connectArticle: "connectArticle",
  createAndConnectFile: "createAndConnectFile",
  connectFile: "connectFile",
  connectFiles: "connectFiles",
  removeFile: "removeFile",
  addSource: "addSource",
  removeSource: "removeSource",
  getArticleDetail: "getArticleDetail"
};

export const articleAPI = getAPI(channels, { prefix: "ArticleService" });
