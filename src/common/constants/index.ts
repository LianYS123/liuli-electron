export enum STORE_KEY_ENUM {
  CRAW_LIULI = 'CRAW_LIULI',
}

export enum ActionEnum {
  OpenDownload = 'open_download',
  OpenFile = 'open_file',
  Detail = 'detail',
  WatchLater = 'watch_later',
  SetWallpaper = 'set_wallpaper',
}

export enum ActionStatus {
  Error = 'error',
  Success = 'success',
}

export enum IPC_CHANNEL_ENUM {
  ARTICLE_CRAW_IDLE = 'ARTICLE_CRAW_IDLE',
  ARTICLE_CRAW_STATUS_CHANGE = 'ARTICLE_CRAW_STATUS_CHANGE',
}
