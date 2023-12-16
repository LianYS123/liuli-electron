import { PageDto } from './page.dto';

export interface GetFilesDto extends PageDto {
  searchValue?: string;
}

export interface UpdateFileDto {
  id: number;

  name: string;
}

export interface RemoveFileDto {
  fileId: number;
  removeSource: boolean;
}

export interface AddFileByPathDto {
  fromPath: string;
}
