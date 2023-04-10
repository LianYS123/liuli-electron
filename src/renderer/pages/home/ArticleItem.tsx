import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Rating,
  Tooltip,
  Typography
} from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useState } from "react";
import { ActionMenuButton } from "../../components/action/ActionMenuButton";
import { Text } from "../../components/text";
// import { useSnackbar } from 'notistack';
// import { useMutation } from 'react-query';
import { formatTimeDetail } from "../../utils/time";
import { ArticleItemProps } from "../../services/types";
import { useMutation } from "react-query";
import { removeFile } from "../../services/article";
import { useAlertDialog } from "../../providers/AlertDialogProvider";
import { chooseImages, chooseVideos } from "@src/renderer/utils";
import { useSnackbar } from "notistack";

const ArticleItem: React.FC<ArticleItemProps> = ({
  article,
  handleTagClick,
  refetch,
  openConnectDialog,
  openConnectFilesDialog,
  setFile
}) => {
  // const url = `/craw/${id}`;
  // const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: deleteConnect } = useMutation(removeFile);
  const {
    id,
    title,
    img_src,
    href,
    time,
    tags = "",
    uid,
    content,
    rating_count,
    rating_score,
    files
  } = article;
  const { open: openAlertDialog } = useAlertDialog();

  const { enqueueSnackbar } = useSnackbar();
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {id}
          </Avatar>
        }
        title={
          <Link style={{ textDecoration: "none" }} target="_blank" href={href}>
            <Text limit={20}>{title}</Text>
          </Link>
        }
        subheader={formatTimeDetail(time)}
        action={
          <ActionMenuButton
            actions={[
              {
                text: "关联",
                onClick: async () => {
                  const videos = await chooseVideos();
                  if (!videos.length) {
                    return;
                  }
                  videos.forEach(async (video) => {
                    try {
                      await window.myAPI.createAndConnectFile({
                        articleId: id,
                        fromPath: video
                      });
                    } catch (e) {
                      enqueueSnackbar(e?.message);
                    }
                  });
                  refetch()
                }
              }
            ].filter(Boolean)}
          />
        }
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
        <div style={{ marginBottom: 8 }}>
          {tags && tags.length
            ? tags
                .split("|")
                .map((tag) => (
                  <Chip
                    onClick={() => handleTagClick(tag)}
                    style={{ margin: 4 }}
                    variant="outlined"
                    key={tag}
                    label={tag}
                  />
                ))
            : null}
        </div>

        <div style={{ marginBottom: 8 }}>
          {files && files.length
            ? files.map((file) => (
                <Chip
                  onClick={() => {
                    // setFile(file);
                    window.myAPI.openPath(file.filePath);
                  }}
                  onDelete={() => {
                    //
                    openAlertDialog({
                      content: "你确定要确认该关联吗？",
                      async onOk() {
                        await deleteConnect({ fileId: file.id, articleId: id });
                        refetch();
                      }
                    });
                  }}
                  style={{ margin: 4 }}
                  variant="outlined"
                  key={file.id}
                  label={file.name}
                />
              ))
            : null}
        </div>

        {uid &&
          [...new Set(uid.split("|"))].map((u) => {
            return (
              <div key={u}>
                <Text copy wrap={false}>
                  {`magnet:?xt=urn:btih:${u}`}
                </Text>
                {/* <Divider /> */}
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
};
export default ArticleItem;
