import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  IconButton,
  Link,
  Rating,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { Typography as AntdTypography } from "antd";
import { red } from "@mui/material/colors";
import React, { useState } from "react";
import { ActionMenuButton } from "../../components/action/ActionMenuButton";
import { formatTimeDetail } from "../../utils/time";
import { ArticleItemProps } from "../../services/types";
import { useSnackbar } from "notistack";
import { File } from "@src/common/interfaces/file.interface";
import { UnConnectDialog } from "./UnConnectDialog";
import { chooseMedia } from "@src/renderer/utils";
import { ImageListPreviewV2 } from "./ImageListPreview";
import Icon from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { routers } from "@src/renderer/config";
import qs from "query-string";
import { shell } from "electron";
import { articleAPI } from "@src/common/api/article";
import { Launch } from "@mui/icons-material";
import { historyAPI } from "@src/common/api/history";
import { ActionStatus } from "@src/common/constants";
import QueueIcon from "@mui/icons-material/Queue";
import { PageDialog } from "@src/renderer/components/PageDialog";

const ArticleItem: React.FC<ArticleItemProps> = ({
  article,
  handleTagClick,
  refetch,
  extraActions = [],
  handleOpenDetail = window.open
}) => {
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
    files,
    cat
  } = article;

  const { enqueueSnackbar } = useSnackbar();

  const [fileToRemove, setFileToRemove] = useState<File>(null);

  const [previewDir, setPreviewDir] = useState<string>();
  const nav = useNavigate();
  const theme = useTheme();

  const handleAddToQueue = async () => {
    await historyAPI.addWatchLater({ articleId: id });
    enqueueSnackbar("添加成功");
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{background: theme => theme.palette.secondary.main}}>
            {cat?.[0]}
          </Avatar>
        }
        title={
          <Link
            onClick={(ev) => {
              ev.preventDefault();
              handleOpenDetail(href);
              historyAPI.addOpenDetail({ articleId: id });
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
        action={
          <ActionMenuButton
            actions={[
              {
                text: "稍后观看",
                onClick: handleAddToQueue
              },
              ...extraActions
            ]}
          />
          // <Tooltip title="稍后观看">
          //   <IconButton>
          //     <QueueIcon />
          //   </IconButton>
          // </Tooltip>
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
          {files?.map((file) => (
            <Chip
              onClick={async () => {
                console.log(file);
                if (file.mimetype.includes("image")) {
                  // setPreviewDir(file.directory);
                  nav({
                    pathname: routers.IMAGES,
                    search: qs.stringify({
                      dir: file.directory,
                      articleId: article.id
                    })
                  });
                  return;
                }
                // setFile(file);
                const error = await shell.openPath(file.filePath);
                if (error) {
                  historyAPI.addOpenFile({
                    articleId: id,
                    fileId: file.id,
                    message: error,
                    status: ActionStatus.Error
                  });
                  enqueueSnackbar(error, {
                    variant: "error"
                  });
                } else {
                  historyAPI.addOpenFile({
                    articleId: id,
                    fileId: file.id
                  });
                }
              }}
              onDelete={() => {
                setFileToRemove(file);
              }}
              style={{ margin: 4 }}
              variant="outlined"
              key={file.id}
              label={file.name}
            />
          ))}
        </div>

        {uid &&
          [...new Set(uid.split("|"))].map((u) => {
            const link = `magnet:?xt=urn:btih:${u}`;
            return (
              <section
                key={u}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Typography
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap"
                  }}
                  variant="body2"
                >
                  {link}
                </Typography>
                <Tooltip title="打开">
                  <Icon
                    style={{ color: theme.palette.primary.main }}
                    onClick={() => {
                      historyAPI.addOpenDownload({
                        articleId: id,
                        source: link
                      });
                      shell.openExternal(link);
                    }}
                  >
                    <Launch />
                  </Icon>
                </Tooltip>
              </section>
            );
          })}
      </CardContent>
      <CardActions>
        <Button style={{ padding: 0 }} onClick={handleAddToQueue}>
          稍后观看
        </Button>
        <Button style={{ padding: 0 }} onClick={handleConnect}>
          选择文件
        </Button>
        {/* <Button
          onClick={async () => {
            // todo
            enqueueSnackbar("已删除");
            refetch();
          }}
        >
          删除
        </Button> */}
      </CardActions>
      {fileToRemove && (
        <UnConnectDialog
          file={fileToRemove}
          article={article}
          refetch={refetch}
          open={!!fileToRemove}
          onClose={() => {
            setFileToRemove(null);
          }}
        />
      )}
      {previewDir && (
        <ImageListPreviewV2
          dir={previewDir}
          visible={!!previewDir}
          setVisible={() => setPreviewDir("")}
        />
      )}
    </Card>
  );

  async function handleConnect() {
    const files = await chooseMedia();
    if (!files.length) {
      return;
    }
    const pros = files.map(async (media) => {
      try {
        await articleAPI.createAndConnectFile({
          articleId: id,
          fromPath: media
        });
      } catch (e) {
        enqueueSnackbar(e?.message);
      }
    });
    await Promise.allSettled(pros);
    refetch();
  }
};
export default ArticleItem;
