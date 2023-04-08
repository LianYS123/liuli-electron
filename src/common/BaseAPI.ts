import { IPageService, IService } from "./IService";
import { ArticleDto, ConnectDto, ConnectFilesDto } from "./params/article.dto";
import { Article } from "./interfaces/article.interface";
import { CrawDto } from "./params/craw.dto";
import {
  AddFileByPathDto,
  GetFilesDto,
  RemoveFileDto,
  UpdateFileDto
} from "./params/file.dto";
import { File } from "./interfaces/file.interface";

export interface BaseAPI {
  // 分页查找
  getArticles: IPageService<ArticleDto, Article>;

  // 爬虫;
  fetchArticles: IService<CrawDto, void>;

  // 创建文件并关联
  createAndConnectFile: IService<ConnectDto, void>;

  // 创建已有关联
  connectFile: IService<ConnectDto, void>;

  connectFiles: IService<ConnectFilesDto, void>;

  // 移除关联
  removeFile: IService<ConnectDto, void>;

  getFileList: IPageService<GetFilesDto, File>;

  deleteFile: IService<RemoveFileDto, void>;

  updateFile: IService<UpdateFileDto, void>;

  addFile: IService<AddFileByPathDto, File>;
}
