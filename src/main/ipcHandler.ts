import { favoriteItemService } from './services/favorite-item.service';
import { dialog } from 'electron';
import { handleService } from './utils/handleService';
import { articleService } from './services/article.service';
import { fileService } from './services/file.service';
import { store } from './store';
import { historyService } from './services/history.service';
import { articleCraw } from './craw/liuli';

const storeService = {
  get: (key: string) => {
    return store.get(key);
  },
  set: (key: string, value?: unknown) => store.set(key, value),
  delete: (key: string) => store.get(key),
};

export function ipcHandler() {
  handleService({ ...articleService }, { prefix: 'ArticleService' });
  handleService({ ...fileService }, { prefix: 'FileService' });
  handleService({ ...dialog }, { prefix: 'Dialog' });
  handleService({ ...historyService }, { prefix: 'History' });
  handleService({ ...articleCraw }, { prefix: 'ArticleCraw' });
  handleService({ ...favoriteItemService }, { prefix: 'FavoriteItemService' });
  handleService(storeService, { prefix: 'Store' });
}
