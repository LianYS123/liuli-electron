import type { ArticleCraw } from "@src/main/craw/liuli";
import { ChannelsType, getAPI } from "./getAPI";

const channels: ChannelsType<ArticleCraw> = {
  parseDetail: "parseDetail",
  parseList: "parseList",
  parse: "parse",
  getEndPage: "getEndPage",
  run: "run",
  autoFetch: "autoFetch",
  pending: "pending",
  stat: "stat",
  clearAll: "clearAll"
};

export const articleCrawAPI = getAPI(channels, { prefix: "ArticleCraw" });
