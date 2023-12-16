import { PageDto } from './page.dto';

export interface ArticleDto extends PageDto {
  searchValue?: string;

  tags?: string[];

  order?: 'time' | 'rating_score' | 'rating_count';

  cat?: string;

  onlyPlayable?: boolean;
}

export interface ConnectDto {
  fromPath?: string;

  fileId?: number;

  articleId: number;
}

export interface ConnectFilesDto {
  items: ConnectDto[];
}
