import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Link,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import { Typography as AntdTypography } from "antd";
import React, { useState } from "react";
import { ActionMenuButton } from "../../components/action/ActionMenuButton";
import { formatTimeDetail } from "../../utils/time";
import { ArticleItemProps } from "../../services/types";
import { useSnackbar } from "notistack";
import { ImageListPreviewV2 } from "./ImageListPreview";
import { historyAPI } from "@src/common/api/history";
import { ArticlePageDialog } from "./ArticlePageDialog";
import { ArticleTags } from "./ArticleTags";
import { Resource, useSearchHandler } from "./Resouce";
import { PageDialog } from "@src/renderer/components/PageDialog";
import { browserManager } from "@src/renderer/components/Browser/BrowserManager";

const ArticleItem: React.FC<ArticleItemProps> = ({
  article,
  handleTagClick,
  refetch,
  extraActions = [],
}) => {
  const {
    id,
    title,
    img_src,
    href,
    time,
    tags = "",
    content,
    rating_count,
    rating_score,
    cat,
  } = article;

  const { enqueueSnackbar } = useSnackbar();

  const [resourceDrawerVisible, setResourceDrawerVisible] = useState(false);

  // const [articleSrc, setSrc] = useState("");
  const setSrc = (url: string) => {
    browserManager.openBrowser({ url });
  };

  const [previewDir, setPreviewDir] = useState<string>();

  const handleAddToQueue = async () => {
    await historyAPI.addWatchLater({ articleId: id });
    enqueueSnackbar("添加成功");
  };

  const handleSearch = useSearchHandler({
    searchValue: title,
    onSearch: setSrc,
  });

  function handleOpenResourceDrawer() {
    setResourceDrawerVisible(true);
  }

  const handleOpenDetail = () => {
    setSrc(href);
    historyAPI.addOpenDetail({ articleId: id });
  };

  const actions = [
    {
      text: "稍后观看",
      onClick: handleAddToQueue,
    },
    {
      text: "google搜索",
      onClick: handleSearch,
    },
    {
      text: "详情",
      onClick: handleOpenResourceDrawer,
    },
    ...extraActions,
  ];

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ background: (theme) => theme.palette.secondary.main }}>
            {cat?.[0]}
          </Avatar>
        }
        title={
          <Link
            onClick={(ev) => {
              ev.preventDefault();
              handleOpenDetail();
            }}
            style={{ textDecoration: "none" }}
            target="_blank"
            href={href}
          >
            <AntdTypography.Paragraph
              style={{ color: "inherit", margin: 0 }}
              ellipsis={{ rows: 2 }}
            >
              {title}
            </AntdTypography.Paragraph>
          </Link>
        }
        subheader={formatTimeDetail(time)}
        action={<ActionMenuButton actions={actions} />}
      />

      <CardActionArea onClick={handleOpenResourceDrawer}>
        {img_src && <CardMedia component="img" src={img_src} />}

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Tooltip title={rating_score || ""}>
            <IconButton>
              <Rating readOnly precision={0.1} value={rating_score} />
            </IconButton>
          </Tooltip>
          <Box sx={{ ml: 2 }}>评分人数: {rating_count}</Box>
        </CardActions>
      </CardActionArea>
      <CardContent>
        <ArticleTags tags={tags} handleTagClick={handleTagClick} />
      </CardContent>

      {previewDir && (
        <ImageListPreviewV2
          dir={previewDir}
          visible={!!previewDir}
          setVisible={() => setPreviewDir("")}
        />
      )}

      {/* <PageDialog
        // refetch={refetch}
        // articleId={id}
        src={articleSrc}
        open={!!articleSrc}
        onClose={() => setSrc("")}
      /> */}

      <Resource
        handleTagClick={handleTagClick}
        title={title}
        open={resourceDrawerVisible}
        onClose={() => {
          setResourceDrawerVisible(false);
        }}
        articleId={id}
      />
    </Card>
  );
};
export default ArticleItem;
