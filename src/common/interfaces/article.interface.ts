import { File } from './file.interface';

export interface Article {
  id: number;

  raw_id: string;

  title: string;

  time: Date;

  href: string;

  img_src?: string;

  tags: string;

  content: string;

  cat: string;

  entry_content: string;

  rating_count: number;

  rating_score: number;

  uid: string;

  imgs?: string;

  files?: File[];

  web_sources?: string;
}
