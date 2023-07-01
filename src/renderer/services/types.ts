import { Article } from "@src/common/interfaces/article.interface";

export type IArticle = Article;

export interface ArticleItemProps {
  article: IArticle;
  handleTagClick: (tag: string) => void;
  refetch: () => void;
}

export interface QueryData {
  selectedTags?: string[];
  keyword?: string;
  order?: "time" | "rating_count" | "rating_score";
  cat?: string;
  pageNo?: number;
  onlyPlayable?: boolean;
}
