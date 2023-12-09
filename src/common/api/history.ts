import type { HistoryService } from '@src/main/services/history.service';
import { ChannelsType, getAPI } from './getAPI';

const channels: ChannelsType<HistoryService> = {
  list: 'list',
  add: 'add',
  delete: 'delete',
  addOpenDownload: 'addOpenDownload',
  addOpenFile: 'addOpenFile',
  addOpenDetail: 'addOpenDetail',
  addWatchLater: 'addWatchLater',
  addSetWallpaper: 'addSetWallpaper',
};

export const historyAPI = getAPI(channels, { prefix: 'History' });
