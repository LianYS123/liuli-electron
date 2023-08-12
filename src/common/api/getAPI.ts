/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer } from "electron";
import { mapValues } from "lodash";

export type ChannelsType<T extends Record<string, any>> = {
  [key in keyof T]: key;
};

// type Func = (...args: any) => any;

// type PType<T> = T extends Promise<any> ? T : Promise<T>

// type MapPV<T extends Record<keyof T, Func>> = {
//   [key in keyof T]: (
//     ...params: Parameters<T[key]>
//   ) => Promise<ReturnType<T[key]>>;
// };

export const getAPI = <T extends Record<string, any>>(
  instance: ChannelsType<T>,
  { prefix = "" }: { prefix?: string } = {}
): T => {
  return mapValues(instance, (key: string) => async (...params: unknown[]) => {
    const channel = `${prefix}-${key}`;
    console.log("invoke", channel, params);
    const res = await ipcRenderer.invoke(channel, ...params);
    console.log("invoke result", channel, res);
    return res;
  }) as T;
};
