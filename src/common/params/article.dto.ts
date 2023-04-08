import { PageDto } from './page.dto';

export class ArticleDto extends PageDto {
  searchValue?: string;

  tags?: string[];

  order?: 'time' | 'rating_score' | 'rating_count';

  cat?: string;

  onlyPlayable?: boolean;
}

export class ConnectDto {
  fromPath?: string;

  fileId?: number;

  articleId: number;
}

export class ConnectFilesDto {
  items: ConnectDto[];
}
