import { ipcRenderer } from "electron";
import { BaseAPI } from "./BaseAPI";
import { mapValues } from "lodash";
import { channels } from "./channels";

const invoke = <T>(channel: keyof BaseAPI, ...params: T[]) => {
  return ipcRenderer.invoke(channel as unknown as string, ...params);
};

export const myAPI = mapValues(
  channels,
  (value) =>
    (...args: Parameters<BaseAPI[keyof BaseAPI]>) =>
      invoke(value, ...args)
) as BaseAPI;
