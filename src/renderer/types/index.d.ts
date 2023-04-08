import { BaseAPI } from "@src/common/BaseAPI";

declare global {
  interface Window {
    myAPI: BaseAPI;
  }
}
