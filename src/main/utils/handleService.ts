import { ipcMain } from "electron";

// eslint-disable-next-line @typescript-eslint/ban-types
export const handleService = <T extends Record<string, Function>>(
  instance: T,
  { prefix = "" }: { prefix?: string } = {}
) => {
  Object.entries(instance).forEach(([key, service]) => {
    const channel = `${prefix}-${key}`;
    console.log(channel)
    ipcMain.handle(channel, (ev, ...args) => service(...args));
  });
};
