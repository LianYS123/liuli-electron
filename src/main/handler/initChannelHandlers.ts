import { BaseAPI } from "@src/common/BaseAPI";
import { handlers } from "./handlers";

import { ipcMain } from "electron";

type HandlerMethod = (
  event: Electron.IpcMainInvokeEvent,
  ...args: unknown[]
) => unknown;

const handle = <T extends HandlerMethod>(
  channel: keyof BaseAPI,
  listener: T
) => {
  ipcMain.handle(channel as string, listener);
};

export const initChannelHandlers = () => {
  Object.keys(handlers).forEach((key) => {
    const fn = handlers[key as keyof BaseAPI];
    if (typeof fn !== "function") {
      return;
    }
    handle(key as keyof BaseAPI, async (event, ...args) => {
      const result = await (fn as HandlerMethod)(event, ...args);
      return result;
    });
  });
};
