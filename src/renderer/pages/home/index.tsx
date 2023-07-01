import React from "react";
import { Box } from "@mui/material";
import { TagFilter } from "./TagFilter";
import { useHistoryState } from "./useHistoryState";
import { ArticleItemProps } from "../../services/types";
import { CrawOptions } from "./CrawOptions";
import { useArticles } from "./useArticles";
import { ArticleList } from "./ArticleList";

const Home = () => {
  const {
    state: { selectedTags = [] },
    setState
  } = useHistoryState();
  const pageSize = 18;


  const {
    data: { data },
    refetch,
    isFetching,
    isLoading
  } = useArticles({ pageSize });

  // 点击标签
  const handleTagClick = (tag: string) => {
    // 如果标签已选中，则取消选中，否则选中该标签
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((it) => it !== tag)
      : [...selectedTags, tag];
    setState({ selectedTags: newTags, pageNo: 1 });
  };

  const itemProps: Omit<ArticleItemProps, "article"> = {
    handleTagClick,
    refetch
  };

  return (
    <Box>
      <TagFilter />

      <CrawOptions refetch={refetch} isFetching={isFetching} />

      <ArticleList
        data={data}
        itemProps={itemProps}
        isLoading={isLoading}
        pageSize={pageSize}
      />
    </Box>
  );
};

export default Home;
