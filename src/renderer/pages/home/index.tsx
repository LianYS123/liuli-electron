import React from "react";
import { Box, Grid } from "@mui/material";
import { TagFilter } from "./TagFilter";
import { useHistoryState } from "./useHistoryState";
import { ArticleItemProps } from "../../services/types";
import { CrawOptions } from "./CrawOptions";
import { useArticles } from "./useArticles";
import ArticleItem from "./ArticleItem";
import { MyPagination } from "./MyPagination";

const Home = () => {
  const {
    state: { selectedTags = [] },
    setState
  } = useHistoryState();
  const pageSize = 18;

  const { data, refetch } = useArticles({
    pageSize
  });

  // const list = useMemo(() => {
  //   return data?.pages.map((it) => it.data.list || []).flat() || [];
  // }, [data]);

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

  // useEventListener("scroll", () => {
  //   if (isScrolledToBottom(100) && !isFetching) {
  //     fetchNextPage();
  //   }
  // });

  const renderPagination = () => {
    return (
      <MyPagination
        total={data?.data?.total}
        page={data?.data?.pageNo}
        onChange={(pageNo) => {
          setState({ pageNo });
        }}
        pageSize={pageSize}
      />
    );
  };

  return (
    <Box>
      <TagFilter />

      <CrawOptions refetch={refetch} />

      {renderPagination()}

      <Grid container spacing={2}>
        {data?.data?.list?.map((it) => {
          return (
            <Grid item key={it.id} xs={12} sm={6} md={4}>
              <ArticleItem article={it} {...itemProps} />
            </Grid>
          );
        })}
      </Grid>

      {renderPagination()}
    </Box>
  );
};

export default Home;
