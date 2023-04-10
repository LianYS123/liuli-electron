import { BaseAPI } from "./BaseAPI";

type Channels = {
  [key in keyof BaseAPI]: key;
};

export const channels: Channels = {
  getArticles: "getArticles",
  fetchArticles: "fetchArticles",
  createAndConnectFile: "createAndConnectFile",
  connectFile: "connectFile",
  connectFiles: "connectFiles",
  removeFile: "removeFile",
  getFileList: "getFileList",
  deleteFile: "deleteFile",
  updateFile: "updateFile",
  addFile: "addFile",
  getAppInfo: "getAppInfo",
  showOpenDialog: "showOpenDialog",
  openPath: "openPath"
};
