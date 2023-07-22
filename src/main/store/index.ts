import Store from "electron-store";
import { STORE_KEY_ENUM } from "../../common/constants";

export const store = new Store({
  name: "store",
  defaults: {
    [STORE_KEY_ENUM.CRAW_LIULI]: {
      BASE_LINK: "https://www.hacg.cat/wp/page",
      PROXY: "http://localhost:1082", // 代理
      SKIP_ADS: true,
      SKIP_EMPTY_UIDS: false
    }
  }
});

export type StoreType = typeof store;
