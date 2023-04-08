import { useQuery } from "react-query";
import { useHistoryState } from "./useHistoryState";
import { getArticles } from "../../services/article";

export const useArticles = ({ pageSize }: { pageSize: number }) => {
  const {
    state: {
      selectedTags = [],
      keyword,
      order = "time",
      cat = "动画",
      pageNo = 1,
      onlyPlayable
    }
  } = useHistoryState();
  return useQuery(
    ["/article/list", selectedTags, keyword, order, cat, pageNo, onlyPlayable],
    () => {
      return getArticles({
        tags: selectedTags,
        searchValue: keyword,
        order,
        cat,
        onlyPlayable,
        pageNo,
        pageSize
      });
    },
    {
      placeholderData: {
        ok: true,
        data: {
          list: [],
          total: 0,
          pageNo: 1,
          pageSize
        }
      },
      keepPreviousData: true
    }
  );
};
