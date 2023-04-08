import { xFetch } from "../utils/fetch";
import { IPageParams, IPageService, IService } from "../../common/IService";

export interface IFile {
  id: number;
  name: string;
  mimetype: string;
  size: number;
  url: string;
}

export const GET_FILE_LIST = "/file/list";

export const getFileList: IPageService<IPageParams, IFile> = (params) => {
  return xFetch("/file/list", {
    data: params
  });
};
export class UpdateFileParams {
  id: number;
  name: string;
}

export const UPDATE_FILE = "/file/update";
export const updateFile: IService<UpdateFileParams> = (params) =>
  xFetch(UPDATE_FILE, { data: params });

export class DeleteFileParams {
  fileId: number;
  removeSource: boolean;
}
export const DELETE_FILE = "/file/delete";
export const deleteFile: IService<DeleteFileParams> = (params) =>
  xFetch(DELETE_FILE, { data: params });

export class AddFileParams {
  fromPath: string;
}
export const ADD_FILE = "/file/add";
export const addFile: IService<AddFileParams> = (params) =>
  xFetch(ADD_FILE, { data: params });
