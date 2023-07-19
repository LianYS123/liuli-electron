import { myAPI } from "@src/common/channels";

export const getFileList = myAPI.getFiles;

export const updateFile = myAPI.updateFile;

export const deleteFile = myAPI.deleteFile;

export const addFile = myAPI.addFileByPath;
