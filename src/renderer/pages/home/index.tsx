import React, { useState } from "react";
import { Box, Grid, TextField } from "@mui/material";
import { TagFilter } from "./TagFilter";
import { useHistoryState } from "./useHistoryState";
import { ArticleItemProps } from "../../services/types";
import { CrawOptions } from "./CrawOptions";
import { useArticles } from "./useArticles";
import ArticleItem from "./ArticleItem";
import { MyPagination } from "./MyPagination";
import { useNavigate } from "react-router-dom";
import { routers } from "@src/renderer/config";

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
        total={data?.total}
        page={data?.pageNo}
        onChange={(pageNo) => {
          setState({ pageNo });
        }}
        pageSize={pageSize}
      />
    );
  };

  const nav = useNavigate();

  const [keyword, setKeyword] = useState("");

  return (
    <Box>
      <TagFilter />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <CrawOptions refetch={refetch} />
        <TextField
          label="搜索"
          value={keyword}
          onChange={(ev) => setKeyword(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              nav(routers.HOME, {
                state: { keyword }
              });
            }
          }}
          variant="standard"
        />
      </Box>

      {renderPagination()}

      <Grid container spacing={2}>
        {data?.list?.map((it) => {
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
