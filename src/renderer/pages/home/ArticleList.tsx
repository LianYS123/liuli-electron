import React from "react";
import { Box, Grid, Stack } from "@mui/material";
import { Masonry } from "@mui/lab";
import SingleArticleItem from "./SingleArticleItem";
import ArticleItem from "./ArticleItem";
import { MyPagination } from "./MyPagination";
import { IPageData } from "@src/common/IService";
import { ArticleItemProps, IArticle } from "@src/renderer/services/types";
import { useHistoryState } from "./useHistoryState";

export const ArticleList: React.FC<{
  data: IPageData<IArticle>;
  itemProps: Omit<ArticleItemProps, "article">;
  isLoading: boolean;
  pageSize: number;
}> = ({ data, itemProps, isLoading, pageSize }) => {
  const {
    state: { layout = "grid" }
  } = useHistoryState();
  const list = data?.list;
  const total = data?.total || 0;

  // 网格
  const renderGrid = () => {
    return (
      <Grid container spacing={2}>
        {list.map((it) => {
          return (
            <Grid item key={it.id} xs={12} sm={6} md={4}>
              <ArticleItem article={it} {...itemProps} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // 瀑布流
  const renderMasonry = () => {
    return (
      <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
        {list.map((it) => {
          return <ArticleItem article={it} key={it.id} {...itemProps} />;
        })}
      </Masonry>
    );
  };

  // 单列
  const renderSingle = () => {
    return (
      <Stack spacing={2}>
        {list.map((it) => {
          return <SingleArticleItem article={it} key={it.id} {...itemProps} />;
        })}
      </Stack>
    );
  };

  const renderLayout = () => {
    if (list) {
      return (
        <Box>
          {layout === "grid" && renderGrid()}
          {layout === "single" && renderSingle()}
          {layout === "masonry" && renderMasonry()}
          <MyPagination total={total} pageSize={pageSize} />
        </Box>
      );
    }
    if (isLoading) {
      return null;
    }
    return "no data...";
  };

  return (
    <>
      <MyPagination total={total} pageSize={pageSize} />
      {isLoading && "loading..."}
      {renderLayout()}
    </>
  );
};
