import { BaseAPI } from "./BaseAPI";

type Channels = {
  [key in keyof BaseAPI]: key;
};

export const channels: Channels = {
  getAppInfo: "getAppInfo",
  getArticle: "getArticle"
};
