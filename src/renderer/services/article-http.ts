import { xFetch } from "../utils/fetch";
import { IArticle } from "./types";
import { IPageService, IService } from "../../common/IService";

export const getArticles: IPageService<any, IArticle> = async (params: any) => {
  return xFetch("/article/list", {
    method: "POST",
    data: params
  });
};

export const createAndConnectFile: IService<{
  fromPath: string;
  articleId: number;
}> = async (data) => {
  return xFetch("/article/connect", {
    method: "POST",
    data
  });
};

export const connectFile: IService<{
  fileId: number;
  articleId: number;
}> = async (data) => {
  return xFetch("/article/connect", {
    method: "POST",
    data
  });
};

export const connectFiles: IService<{
  items: {
    fileId: number;
    articleId: number;
  }[];
}> = async (data) => {
  return xFetch("/article/connectFiles", {
    method: "POST",
    data
  });
};

export const removeFile: IService<{
  fileId: number;
  articleId: number;
}> = async (data) => {
  return xFetch("/article/connect/delete", {
    method: "POST",
    data
  });
};
