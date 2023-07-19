import { ipcMain } from "electron";

// eslint-disable-next-line @typescript-eslint/ban-types
export const handleService = <T extends Record<string, Function>>(
  instance: T
) => {
  Object.entries(instance).forEach(([key, service]) => {
    console.log(key);
    ipcMain.handle(key, (ev, ...args) => service(...args));
  });
};
