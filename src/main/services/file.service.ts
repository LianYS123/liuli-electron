import { PORT, STATIC_FILE_PATH } from '@src/main/config';
import { FileEntity } from '@src/main/entities/file.entity';
import { HttpException } from '@src/main/exceptions/HttpException';
import fs from 'fs-extra';
import { basename } from 'path';
import mime from 'mime-types';
import { AddFileByPathDto, GetFilesDto, RemoveFileDto, UpdateFileDto } from '@src/common/params/file.dto';
import { Like } from 'typeorm';

export class FileService {
  public getFiles = async (dto: GetFilesDto) => {
    const { pageNo, pageSize, searchValue } = dto;
    let query = FileEntity.createQueryBuilder()
      .skip(pageSize * (pageNo - 1))
      .take(pageSize);

    if (searchValue) {
      query = query.where('name like :searchValue', { searchValue: Like(`%${searchValue}%`).value });
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
      throw new HttpException(400, '文件不存在');
    }
    const stat = fs.statSync(filePath);

    if (!stat.isFile()) {
      throw new HttpException(400, '该路径内容不是一个文件');
    }
    return stat;
  };

  public removeFile = async ({ fileId, removeSource }: RemoveFileDto) => {
    const file = await this.findFileById(fileId);
    await FileEntity.delete(fileId);
    if (removeSource) {
      const path = `${STATIC_FILE_PATH}/${basename(file.url)}`;
      this.checkFilePath(path);
      await fs.rm(path);
    }
  };

  public updateFile = async ({ id, name }: UpdateFileDto) => {
    const file = await this.findFileById(id);
    const filePath = `${STATIC_FILE_PATH}/${file.name}`;
    const newPath = `${STATIC_FILE_PATH}/${name}`;
    this.checkFilePath(filePath);
    await fs.rename(filePath, newPath);
    file.name = name;
    file.url = `http://localhost:${PORT}/static/files/${name}`;
    await file.save();
  };

  public addFileByPath = async (dto: AddFileByPathDto) => {
    return this.createFileByPath(dto.fromPath);
  };

  public createFileByPath = async (fromPath: string) => {
    const stat = this.checkFilePath(fromPath);

    const name = basename(fromPath);
    const toPath = `${STATIC_FILE_PATH}/${name}`;

    if (fs.existsSync(toPath)) {
      throw new HttpException(400, '资源已存在');
    }

    await fs.move(fromPath, toPath);

    const size = stat.size;
    const url = `http://localhost:${PORT}/static/files/${name}`;
    const mimetype = mime.lookup(name) || 'unknow';
    const file = await FileEntity.save({
      name,
      size,
      url,
      mimetype,
    });
    return file;
  };

  public findFileById = async (fileId: number) => {
    const file = await FileEntity.findOneBy({
      id: fileId,
    });
    if (!file) {
      throw new HttpException(400, '数据库中未找到该文件');
    }
    return file;
  };
}
