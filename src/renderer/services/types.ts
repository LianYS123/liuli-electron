import { IFile } from "./file";

export interface IArticle {
  id: number;

  raw_id: string;

  title: string;

  time: Date;

  href: string;

  img_src: string;

  tags: string;

  content: string;

  cat: string;

  entry_content: string;

  rating_count: number;

  rating_score: number;

  uid: string;

  imgs: string;

  files?: IFile[];
}

export interface ArticleItemProps {
  article: IArticle;
  openConnectDialog: (article: IArticle) => void;
  openConnectFilesDialog: (article: IArticle) => void;
  handleTagClick: (tag: string) => void;
  refetch: () => void;
  setFile: (file: IFile) => void;
}

export interface QueryData {
  selectedTags?: string[];
  keyword?: string;
  order?: "time" | "rating_count" | "rating_score";
  cat?: string;
  layout?: "grid" | "single" | "masonry";
  pageNo?: number;
  onlyPlayable?: boolean;
}
