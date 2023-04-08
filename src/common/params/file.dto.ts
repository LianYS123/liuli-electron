import { PageDto } from './page.dto';

export class GetFilesDto extends PageDto {
  searchValue?: string;
}

export class UpdateFileDto {
  id: number;

  name: string;
}

export class RemoveFileDto {
  fileId: number;
  removeSource: boolean;
}

export class AddFileByPathDto {
  fromPath: string;
}
