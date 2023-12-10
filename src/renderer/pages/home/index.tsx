import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { TagFilter } from "./components/TagFilter";
import { ArticleItemProps } from "../../services/types";
import { useArticles } from "../../hooks/useArticles";
import ArticleItem from "./components/ArticleItem";
import { MyPagination } from "../../components/pagination";
import { useNavigate } from "react-router-dom";
import { routers } from "@src/renderer/config";
import { scrollToTop } from "@src/renderer/utils";
import { useDebounceFn } from "ahooks";
import { useIpcEvent } from "@src/renderer/hooks/useIpcEvent";
import { IPC_CHANNEL_ENUM } from "@src/common/constants";
import { useHistoryState } from "@src/renderer/hooks/useHistoryState";
import {
  OperateArticleDrawer,
  OperateType,
} from "./components/OperateArticleDrawer";

const Home = () => {
  const {
    state: { selectedTags = [] },
    setState,
  } = useHistoryState();
  const pageSize = 18;

  const { data, refetch } = useArticles({
    pageSize,
  });
  const [operateType, setOperateType] = useState<OperateType | null>(null);

  useIpcEvent(IPC_CHANNEL_ENUM.ARTICLE_CRAW_IDLE, refetch);

  // 点击标签
  const handleTagClick = (tag: string) => {
    // 如果标签已选中，则取消选中，否则选中该标签
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(it => it !== tag)
      : [...selectedTags, tag];
    setState({ selectedTags: newTags, pageNo: 1 });
  };

  const { run: handleScrollToTop } = useDebounceFn(scrollToTop, { wait: 100 });

  const itemProps: Omit<ArticleItemProps, 'article'> = {
    handleTagClick,
    refetch,
  };

  const renderPagination = () => {
    return (
      <MyPagination
        total={data?.total}
        page={data?.pageNo}
        onChange={pageNo => {
          setState({ pageNo });
          handleScrollToTop();
        }}
        pageSize={pageSize}
      />
    );
  };

  const nav = useNavigate();

  const [keyword, setKeyword] = useState('');

  return (
    <Box>
      <TagFilter />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextField
          label="搜索"
          value={keyword}
          onChange={ev => setKeyword(ev.target.value)}
          onKeyDown={ev => {
            if (ev.key === 'Enter') {
              nav(routers.HOME, {
                state: { keyword },
              });
            }
          }}
          variant="standard"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {renderPagination()}
        <Box>
          <Button
            variant="outlined"
            onClick={() => {
              setOperateType("add");
            }}
          >
            创建文章
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {data?.list?.map(it => {
          return (
            <Grid item key={it.id} xs={12} sm={6} md={4}>
              <ArticleItem article={it} {...itemProps} />
            </Grid>
          );
        })}
      </Grid>

      {renderPagination()}
      <OperateArticleDrawer
        operateType={operateType}
        open={!!operateType}
        onClose={() => {
          setOperateType(null);
        }}
      />
    </Box>
  );
};

export default Home;
