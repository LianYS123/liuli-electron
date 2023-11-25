import { Grid } from "@mui/material";
import { historyAPI } from "@src/common/api/history";
import { History } from "@src/common/interfaces/history.interface";
import { useHistoryState } from "@src/renderer/hooks/useHistoryState";
import ArticleItem from "@src/renderer/pages/home/components/ArticleItem";
import { ArticleItemProps } from "@src/renderer/services/types";
import { useSnackbar } from "notistack";
import React from "react";

interface ArticleListProps {
  list: History[];
  refetch: () => void;
}

export function ArticleList({ list, refetch }: ArticleListProps) {
  const {
    state: { selectedTags = [] },
    setState
  } = useHistoryState();
  const { enqueueSnackbar } = useSnackbar();
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
    <Grid container spacing={2}>
      {list
        ?.filter((it) => it.article)
        ?.map((it) => {
          return (
            <Grid item key={it.id} xs={12}>
              <ArticleItem
                extraActions={[
                  {
                    text: "删除记录",
                    onClick: async () => {
                      await historyAPI.delete(it.id);
                      refetch();
                      enqueueSnackbar("已删除");
                    }
                  }
                ]}
                article={it.article}
                {...itemProps}
              />
            </Grid>
          );
        })}
    </Grid>
  );
}
