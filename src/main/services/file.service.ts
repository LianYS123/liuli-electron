import { FileEntity } from '@src/main/entities/file.entity';
import { IpcException } from '@src/common/exceptions/IpcException';
import fs from 'fs-extra';
import { basename, dirname, join } from 'path';
import mime from 'mime-types';
import {
  AddFileByPathDto,
  GetFilesDto,
  RemoveFileDto,
  UpdateFileDto,
} from '@src/common/params/file.dto';
import { Like } from 'typeorm';

export class FileService {
  public getFiles = async (dto: GetFilesDto) => {
    const { pageNo, pageSize, searchValue } = dto;
    let query = FileEntity.createQueryBuilder()
      .skip(pageSize * (pageNo - 1))
      .take(pageSize);

    if (searchValue) {
      query = query.where('name like :searchValue', {
        searchValue: Like(`%${searchValue}%`).value,
      });
    }

    const [articles, total] = await query.getManyAndCount();

    return {
      pageNo,
      pageSize,
      total,
      list: articles,
    };
  };

  private checkFilePath = (filePath: string) => {
    if (!fs.existsSync(filePath)) {
      throw new IpcException(400, '文件不存在');
    }
    const stat = fs.statSync(filePath);

    if (!stat.isFile()) {
      throw new IpcException(400, '该路径内容不是一个文件');
    }
    return stat;
  };

  public deleteFile = async ({ fileId, removeSource }: RemoveFileDto) => {
    const file = await this.findFileById(fileId);
    await FileEntity.delete(fileId);
    if (removeSource) {
      this.checkFilePath(file.filePath);
      await fs.rm(file.filePath);
    }
  };

  public updateFile = async ({ id, name }: UpdateFileDto) => {
    const file = await this.findFileById(id);
    this.checkFilePath(file.filePath);
    const newPath = join(file.directory, name);
    await fs.rename(file.filePath, newPath);
    file.name = name;
    file.filePath = newPath;
    await file.save();
  };

  public addFileByPath = async (dto: AddFileByPathDto) => {
    return this.createFileByPath(dto.fromPath);
  };

  public createFileByPath = async (fromPath: string) => {
    const old = await FileEntity.findOneBy({
      filePath: fromPath,
    });
    if (old) {
      // throw new HttpException(400, "文件已存在");
      return old;
    }
    const stat = this.checkFilePath(fromPath);

    const name = basename(fromPath);
    const directory = dirname(fromPath);

    const size = stat.size;
    const mimetype = mime.lookup(name) || 'unknow';
    const file = await FileEntity.save({
      name,
      directory,
      size,
      filePath: fromPath,
      mimetype,
    });
    return file;
  };

  public findFileById = async (fileId: number) => {
    const file = await FileEntity.findOneBy({
      id: fileId,
    });
    if (!file) {
      throw new IpcException(400, '数据库中未找到该文件');
    }
    return file;
  };

  public getAllFilesFromDir = (dir: string, type?: string) => {
    const stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
      throw new IpcException(400, '不是一个文件夹');
    }
    const files = fs
      .readdirSync(dir)
      .filter(name => {
        const filePath = join(dir, name);

        const stat = fs.statSync(filePath);
        if (!stat.isFile()) {
          return false;
        }
        const mimetype = mime.lookup(name) || 'unknow';
        if (type && !mimetype.includes(type)) {
          return false;
        }
        return true;
      })
      .map(name => join(dir, name));
    return files;
  };
}

export const fileService = new FileService();
