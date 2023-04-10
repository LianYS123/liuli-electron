/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseAPI } from "@src/common/BaseAPI";
import {
  ArticleDto,
  ConnectDto,
  ConnectFilesDto
} from "@src/common/params/article.dto";
import { CrawDto } from "@src/common/params/craw.dto";
import {
  GetFilesDto,
  RemoveFileDto,
  UpdateFileDto,
  AddFileByPathDto
} from "@src/common/params/file.dto";
import { FileService } from "../services/file.service";
import ArticleService from "../services/article.service";
import { CommonResult } from "../common";
import { DB_PATH } from "../config";
import { dialog, shell } from "electron";

const fileService = new FileService();
const articleService = new ArticleService();

export type HandlerAPI = {
  [key in keyof BaseAPI]: BaseAPI[key] extends (...args: unknown[]) => unknown
    ? (
        event: Electron.IpcMainInvokeEvent,
        ...args: Parameters<BaseAPI[key]>
      ) => ReturnType<BaseAPI[key]> | Awaited<ReturnType<BaseAPI[key]>>
    : never;
};

export const handlers: HandlerAPI = {
  getArticles: async function (
    event: Electron.IpcMainInvokeEvent,
    data: ArticleDto
  ) {
    return CommonResult.success(await articleService.getArticles(data));
  },
  fetchArticles: async function (
    event: Electron.IpcMainInvokeEvent,
    data: CrawDto
  ) {
    return CommonResult.success(await articleService.fetchArticles(data));
  },
  createAndConnectFile: async function (
    event: Electron.IpcMainInvokeEvent,
    data: ConnectDto
  ) {
    return CommonResult.success(
      await articleService.createAndConnectFile(data)
    );
  },
  connectFile: async function (
    event: Electron.IpcMainInvokeEvent,
    data: ConnectDto
  ) {
    return CommonResult.success(await articleService.connectFile(data));
  },
  connectFiles: async function (
    event: Electron.IpcMainInvokeEvent,
    data: ConnectFilesDto
  ) {
    return CommonResult.success(await articleService.connectFiles(data));
  },
  removeFile: async function (
    event: Electron.IpcMainInvokeEvent,
    data: ConnectDto
  ) {
    return CommonResult.success(await articleService.removeFile(data));
  },
  getFileList: async function (
    event: Electron.IpcMainInvokeEvent,
    data: GetFilesDto
  ) {
    return CommonResult.success(await fileService.getFiles(data));
  },
  deleteFile: async function (
    event: Electron.IpcMainInvokeEvent,
    data: RemoveFileDto
  ) {
    return CommonResult.success(await fileService.removeFile(data));
  },
  updateFile: async function (
    event: Electron.IpcMainInvokeEvent,
    data: UpdateFileDto
  ) {
    return CommonResult.success(await fileService.updateFile(data));
  },
  addFile: async function (
    event: Electron.IpcMainInvokeEvent,
    data: AddFileByPathDto
  ) {
    return CommonResult.success(await fileService.addFileByPath(data));
  },
  getAppInfo: function () {
    return {
      DB_PATH
      // MAIN_WINDOW_WEBPACK_ENTRY,
      // MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    };
  },
  showOpenDialog: function (event, params) {
    return dialog.showOpenDialog(params);
  },
  openPath(ev, path) {
    return shell.openPath(path);
  }
};
