import { useQuery } from 'react-query';
import { useHistoryState } from './useHistoryState';
import { articleAPI } from '@src/common/api/article';

export const useArticles = ({ pageSize }: { pageSize: number }) => {
  const {
    state: {
      selectedTags = [],
      keyword,
      order = 'time',
      cat = '全部',
      onlyPlayable,
      pageNo = 1,
    },
  } = useHistoryState();
  return useQuery(
    ['/article/list', selectedTags, keyword, order, cat, onlyPlayable, pageNo],
    () => {
      return articleAPI.getArticles({
        tags: selectedTags,
        searchValue: keyword,
        order,
        cat,
        onlyPlayable,
        pageNo,
        pageSize,
      });
    },
    {
      keepPreviousData: true,
    },
    // {
    //   getNextPageParam(lastPage) {
    //     const { pageNo, pageSize, total } = lastPage.data;
    //     if (pageNo * pageSize < total) {
    //       return pageNo + 1;
    //     }
    //   }
    // }
  );
};
