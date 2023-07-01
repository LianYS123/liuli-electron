import React from "react";
import { Box, Grid } from "@mui/material";
import ArticleItem from "./ArticleItem";
import { MyPagination } from "./MyPagination";
import { IPageData } from "@src/common/IService";
import { ArticleItemProps, IArticle } from "@src/renderer/services/types";

export const ArticleList: React.FC<{
  data: IPageData<IArticle>;
  itemProps: Omit<ArticleItemProps, "article">;
  isLoading: boolean;
  pageSize: number;
}> = ({ data, itemProps, isLoading, pageSize }) => {
  const list = data?.list;
  const total = data?.total || 0;

  const renderLayout = () => {
    if (list) {
      return (
        <Box>
          <Grid container spacing={2}>
            {list.map((it) => {
              return (
                <Grid item key={it.id} xs={12} sm={6} md={4}>
                  <ArticleItem article={it} {...itemProps} />
                </Grid>
              );
            })}
          </Grid>
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
