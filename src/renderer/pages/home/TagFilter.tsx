import {
  Box,
  Chip,
  FormControlLabel,
  Link,
  Switch,
  Typography
} from "@mui/material";
import React from "react";
import { useHistoryState } from "./useHistoryState";

export const TagFilter = () => {
  const { state, setState } = useHistoryState();
  const {
    selectedTags = [],
    keyword,
    order = "time",
    cat = "动画",
    layout = "grid",
    onlyPlayable
  } = state;

  const upSM = true;

  const orders = [
    ["time", "时间"],
    ["rating_count", "热度"],
    ["rating_score", "评分"]
  ];
  const cats = ["全部", "动画", "文章", "漫画", "小说", "音乐"];

  const layouts = [
    ["grid", "网格"],
    ["single", "单列"],
    ["masonry", "瀑布流"]
  ];

  return (
    <Box sx={{ my: 2 }}>
      {/* 布局 */}
      <Box mb={1}>
        {layouts.map(([cur, name]) => {
          return (
            <Chip
              color={layout === cur ? "primary" : "default"}
              onClick={() => setState({ layout: cur as any })}
              size="medium"
              sx={{ mr: 1, mb: 1 }}
              key={cur}
              label={name}
            />
          );
        })}
      </Box>

      {/* 排序 */}
      <Box mb={1}>
        {orders.map(([cur, name]) => {
          return (
            <Chip
              color={order === cur ? "primary" : "default"}
              onClick={() => setState({ order: cur as any, pageNo: 1 })}
              size="medium"
              sx={{ mr: 1, mb: 1 }}
              key={cur}
              label={name}
            />
          );
        })}
      </Box>

      {/* 分类 */}
      <Box mb={2}>
        {cats.map((cur) => {
          return (
            <Chip
              color={cat === cur ? "primary" : "default"}
              onClick={() => setState({ cat: cur, pageNo: 1 })}
              size="medium"
              sx={{ mr: 1, mb: 1 }}
              key={cur}
              label={cur}
            />
          );
        })}
      </Box>

      <Box mb={2}>
        <FormControlLabel
          control={
            <Switch
              checked={onlyPlayable}
              onChange={(ev, checked) => setState({ onlyPlayable: checked })}
            />
          }
          label="仅看可播放"
        />
      </Box>

      {/* 关键词 */}
      {keyword ? (
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1" sx={{ mr: 1 }} component="span">
            关键词:
          </Typography>
          <Typography variant="body1" component="span">
            {keyword}
          </Typography>

          <Link
            ml={2}
            sx={{ cursor: "pointer" }}
            onClick={() => setState({ keyword: undefined })}
          >
            重置
          </Link>
        </Box>
      ) : null}

      {/* 标签 */}
      {selectedTags.length ? (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {selectedTags.map((tag) => {
            return (
              <Chip
                onDelete={() => {
                  setState({
                    selectedTags: selectedTags.filter((it) => it !== tag)
                  });
                }}
                size="medium"
                sx={{ mr: 1 }}
                key={tag}
                label={tag}
              />
            );
          })}

          <Chip
            label="清空"
            onClick={() => setState({ selectedTags: [] })}
            size="medium"
          />
        </Box>
      ) : null}
    </Box>
  );
};
