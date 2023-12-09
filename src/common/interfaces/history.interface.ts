import { ActionEnum, ActionStatus } from '../constants';
import { Article } from './article.interface';
import { File } from './file.interface';

export interface History {
  id: number;
  article?: Article;
  file?: File;
  source?: string;
  action: ActionEnum;
  status: ActionStatus;
  message?: string;
  createTime: Date;
  updateTime: Date;
}
