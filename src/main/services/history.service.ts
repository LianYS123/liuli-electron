import { GetHistoriesDto } from '@src/common/params/history.dto';
import { HistoryEntity } from '../entity/history.entity';
import { PageResult } from '@src/common/types';
import { ActionEnum, ActionStatus } from '@src/common/constants';
import { History } from '@src/common/interfaces/history.interface';

interface AddParams {
  articleId?: number;
  fileId?: number;
  source?: string;
  action: ActionEnum;
  status?: ActionStatus;
  message?: string;
}

export class HistoryService {
  list = async (params: GetHistoriesDto): Promise<PageResult<History>> => {
    const { pageNo, pageSize = 10, action } = params;
    const [list, total] = await HistoryEntity.findAndCount({
      where: { action },
      take: pageSize,
      skip: pageSize * (pageNo - 1),
      order: {
        updateTime: {
          direction: 'DESC',
        },
      },
      relations: {
        file: true,
        article: true,
      },
    });
    return {
      list,
      total,
      pageNo,
      pageSize,
    };
  };

  add = async ({ articleId, fileId, ...rest }: AddParams) => {
    const params = {
      article: articleId ? { id: articleId } : undefined,
      file: fileId ? { id: fileId } : undefined,
      ...rest,
    };
    const old = await HistoryEntity.findOneBy(params);
    if (old) {
      old.updateTime = new Date();
      return await old.save();
    }
    return await HistoryEntity.save(params);
  };

  // OpenDownload = 'open_download',
  // OpenFile = 'open_file',
  // Detail = 'detail',
  // WatchLater = 'watch_later',
  // SetWallpaper = 'set_wallpaper'

  addOpenDownload = (params: Pick<AddParams, 'articleId' | 'source'>) => {
    return this.add({ ...params, action: ActionEnum.OpenDownload });
  };

  addOpenFile = (
    params: Pick<AddParams, 'articleId' | 'fileId' | 'message' | 'status'>,
  ) => {
    return this.add({ ...params, action: ActionEnum.OpenFile });
  };

  addOpenDetail = (params: Pick<AddParams, 'articleId'>) => {
    return this.add({ ...params, action: ActionEnum.Detail });
  };

  addWatchLater = (params: Pick<AddParams, 'articleId'>) => {
    return this.add({ ...params, action: ActionEnum.WatchLater });
  };

  addSetWallpaper = (params: Pick<AddParams, 'articleId' | 'source'>) => {
    return this.add({ ...params, action: ActionEnum.SetWallpaper });
  };

  delete = (id: number) => {
    return HistoryEntity.delete(id);
  };
}
export const historyService = new HistoryService();
