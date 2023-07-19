/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer } from "electron";
import { mapValues } from "lodash";

export type ChannelsType<T extends Record<string, any>> = {
  [key in keyof T]: key;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const getAPI = <T extends Record<string, any>>(
  instance: ChannelsType<T>,
  { prefix = "" }: { prefix?: string } = {}
): T => {
  return mapValues(instance, (key: string) => (...params: unknown[]) => {
    console.log("invoke", key, params);
    const channel = `${prefix}${key}`;
    return ipcRenderer.invoke(channel, ...params);
  }) as unknown as T;
};
