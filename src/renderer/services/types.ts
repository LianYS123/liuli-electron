import { Article } from "@src/common/interfaces/article.interface";
import { File } from "@src/common/interfaces/file.interface";

export type IArticle = Article;

export interface ArticleItemProps {
  article: IArticle;
  openConnectDialog: (article: IArticle) => void;
  openConnectFilesDialog: (article: IArticle) => void;
  handleTagClick: (tag: string) => void;
  refetch: () => void;
  setFile: (file: File) => void;
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
