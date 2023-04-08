import { BaseAPI } from "@src/common/BaseAPI";

export type HandlerAPI = {
  [key in keyof BaseAPI]: BaseAPI[key] extends (...args: unknown[]) => unknown
    ? (
        event: Electron.IpcMainInvokeEvent,
        ...args: Parameters<BaseAPI[key]>
      ) => ReturnType<BaseAPI[key]> | Awaited<ReturnType<BaseAPI[key]>>
    : never;
};

export const handlers: HandlerAPI = {
  getAppInfo: function () {
    return {
      appName: "My App"
    };
  },
  getArticle: function () {
    throw new Error("Function not implemented.");
  }
};
