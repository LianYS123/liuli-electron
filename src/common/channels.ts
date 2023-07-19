import type { FileService } from "@src/main/services/file.service";
import type { ArticleService } from "@src/main/services/article.service";
import { ipcRenderer } from "electron";
import { mapValues } from "lodash";

type MergedType = ArticleService & FileService;

type Channels = {
  [key in keyof MergedType]: key;
};

export const channels: Channels = {
  getArticles: "getArticles",
  fetchArticles: "fetchArticles",
  findArticleById: "findArticleById",
  connectArticle: "connectArticle",
  createAndConnectFile: "createAndConnectFile",
  connectFile: "connectFile",
  connectFiles: "connectFiles",
  removeFile: "removeFile",
  getFiles: "getFiles",
  updateFile: "updateFile",
  addFileByPath: "addFileByPath",
  createFileByPath: "createFileByPath",
  findFileById: "findFileById",
  getAllFilesFromDir: "getAllFilesFromDir",
  deleteFile: "deleteFile"
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const getAPI = (instance: Channels) => {
  return mapValues(instance, (key) => (...params: unknown[]) => {
    console.log("invoke", key, params);
    return ipcRenderer.invoke(key, ...params);
  });
};

export const myAPI = getAPI(channels) as unknown as MergedType;
console.log(myAPI);
