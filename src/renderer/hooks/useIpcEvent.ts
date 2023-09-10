import { IPC_CHANNEL_ENUM } from "@src/common/constants";
import { useMemoizedFn } from "ahooks";
import { ipcRenderer } from "electron";
import { useEffect } from "react";

export const useIpcEvent = (
  channel: IPC_CHANNEL_ENUM,
  callback: () => void
) => {
  const fn = useMemoizedFn(callback);
  useEffect(() => {
    ipcRenderer.on(channel, fn);
    return () => {
      ipcRenderer.off(channel, fn);
    };
  }, []);
};
