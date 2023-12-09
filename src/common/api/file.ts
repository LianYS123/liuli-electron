import type { FileService } from '@src/main/services/file.service';
import { ChannelsType, getAPI } from './getAPI';

const channels: ChannelsType<FileService> = {
  getFiles: 'getFiles',
  deleteFile: 'deleteFile',
  updateFile: 'updateFile',
  addFileByPath: 'addFileByPath',
  createFileByPath: 'createFileByPath',
  findFileById: 'findFileById',
  getAllFilesFromDir: 'getAllFilesFromDir',
};

export const fileAPI = getAPI(channels, { prefix: 'FileService' });
