import { ChannelsType, getAPI } from "./getAPI";
import type { StoreType } from "@src/main/store";

const channels: ChannelsType<Pick<StoreType, "get" | "set" | "delete">> = {
  get: "get",
  set: "set",
  delete: "delete"
};

export const storeAPI = getAPI(channels, { prefix: "Store" });
