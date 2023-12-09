import { ActionEnum } from '../constants';
import { PageDto } from './page.dto';

export interface GetHistoriesDto extends PageDto {
  action: ActionEnum;
}
