import type { Dialog } from "electron";
import { ChannelsType, getAPI } from "./getAPI";

const channels: ChannelsType<Dialog> = {
  showCertificateTrustDialog: "showCertificateTrustDialog",
  showErrorBox: "showErrorBox",
  showMessageBox: "showMessageBox",
  showMessageBoxSync: "showMessageBoxSync",
  showOpenDialog: "showOpenDialog",
  showOpenDialogSync: "showOpenDialogSync",
  showSaveDialog: "showSaveDialog",
  showSaveDialogSync: "showSaveDialogSync"
};

export const dialogAPI = getAPI(channels, { prefix: "Dialog" });
