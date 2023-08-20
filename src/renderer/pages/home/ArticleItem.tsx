import {
  Avatar,
  Box,
  Card,
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
import { Resource } from "./Resouce";

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

  const [articleSrc, setSrc] = useState("");

  const [previewDir, setPreviewDir] = useState<string>();

  const handleAddToQueue = async () => {
    await historyAPI.addWatchLater({ articleId: id });
    enqueueSnackbar("添加成功");
  };

  function handleOpenResourceDrawer() {
    setResourceDrawerVisible(true);
  }

  const actions = [
    {
      text: "稍后观看",
      onClick: handleAddToQueue,
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
              handleOpenResourceDrawer();
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

      <ArticlePageDialog
        refetch={refetch}
        articleId={id}
        src={articleSrc}
        open={!!articleSrc}
        onClose={() => setSrc("")}
      />

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
