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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Rating,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Typography as AntdTypography } from "antd";
import React, { useState } from "react";
import { ActionMenuButton } from "../../components/action/ActionMenuButton";
import { formatTimeDetail } from "../../utils/time";
import { ArticleItemProps } from "../../services/types";
import { useSnackbar } from "notistack";
import { File } from "@src/common/interfaces/file.interface";
import { UnConnectDialog } from "./UnConnectDialog";
import { chooseMedia } from "@src/renderer/utils";
import { ImageListPreviewV2 } from "./ImageListPreview";
import { useNavigate } from "react-router-dom";
import { routers } from "@src/renderer/config";
import qs from "query-string";
import { shell } from "electron";
import { articleAPI } from "@src/common/api/article";
import { Launch } from "@mui/icons-material";
import { historyAPI } from "@src/common/api/history";
import { ActionStatus } from "@src/common/constants";
import { MagnetLinks } from "./MagnetLinks";
import { PageDialog } from "@src/renderer/components/PageDialog";
import { ArticlePageDialog } from "./ArticlePageDialog";
import {
  SEARCH_SETTINGS_KEY,
  SearchConfig,
  defaultSearchConfig,
} from "@src/renderer/layout/Settings/SearchSetting";
import { urlReg } from "@src/renderer/constants";


function parseWebSource(source?: string): string[] {
  if (!source) {
    return [];
  }
  try {
    const res = JSON.parse(source);
    if (Array.isArray(res)) {
      return res as string[];
    }
  } catch {
    return [];
  }
  return [];
}

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
    uid,
    content,
    rating_count,
    rating_score,
    files,
    cat,
    web_sources,
  } = article;

  const { enqueueSnackbar } = useSnackbar();

  const [fileToRemove, setFileToRemove] = useState<File>(null);

  const sources = parseWebSource(web_sources);
  const [webSource, setWebSource] = useState("");

  const [showWebSourceDialog, setShowWebSourceDialog] = useState(false);

  const [articleSrc, setSrc] = useState("");

  const [previewDir, setPreviewDir] = useState<string>();
  const nav = useNavigate();
  const theme = useTheme();

  const handleAddToQueue = async () => {
    await historyAPI.addWatchLater({ articleId: id });
    enqueueSnackbar("添加成功");
  };

  async function handleConnect() {
    const files = await chooseMedia();
    if (!files.length) {
      return;
    }
    const pros = files.map(async (media) => {
      try {
        await articleAPI.createAndConnectFile({
          articleId: id,
          fromPath: media,
        });
      } catch (e) {
        enqueueSnackbar(e?.message);
      }
    });
    await Promise.allSettled(pros);
    refetch();
  }

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
              setSrc(href);
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
                text: "关联文件",
                onClick: handleConnect,
              },
              {
                text: "稍后观看",
                onClick: handleAddToQueue,
              },
              {
                text: "检索",
                onClick: () => {
                  const config: SearchConfig = JSON.parse(
                    localStorage.getItem(SEARCH_SETTINGS_KEY) ||
                      JSON.stringify(defaultSearchConfig)
                  );

                  const res = /(\[.*?\])?(.*)/.exec(title);
                  if (!res) {
                    enqueueSnackbar("关键词异常");
                  }
                  let [, , search] = res;
                  if (!search) {
                    enqueueSnackbar("关键词异常");
                  }
                  search = search.trim();
                  if (config.limit) {
                    search = search.slice(0, config.limit);
                  }
                  if (config.site) {
                    search = `site:${config.site} ${search}`;
                  }
                  console.log(config, search);
                  const src = `https://www.google.com/search?q=${encodeURIComponent(
                    search
                  )}`;
                  setSrc(src);
                },
              },
              {
                text: "添加网络资源",
                onClick: () => {
                  setShowWebSourceDialog(true);
                },
              },
              ...extraActions,
            ]}
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
                      articleId: article.id,
                    }),
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
                    status: ActionStatus.Error,
                  });
                  enqueueSnackbar(error, {
                    variant: "error",
                  });
                } else {
                  historyAPI.addOpenFile({
                    articleId: id,
                    fileId: file.id,
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

        <MagnetLinks articleId={id} uid={uid} />
        {!!sources.length && (
          <Box sx={{ mt: 2 }}>
            {sources?.map((source) => (
              <Chip
                onClick={async () => {
                  await setSrc(source);
                }}
                onDelete={async () => {
                  await articleAPI.removeSource({
                    source,
                    articleId: article.id,
                  });
                  refetch();
                }}
                style={{ margin: 4 }}
                variant="outlined"
                key={source}
                label={source}
              />
            ))}
          </Box>
        )}
      </CardContent>

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
      <Dialog
        fullWidth
        open={showWebSourceDialog}
        onClose={() => setShowWebSourceDialog(false)}
      >
        <DialogTitle>添加网络资源地址</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ width: "100%" }}
            value={webSource}
            onChange={(ev) => {
              setWebSource(ev.target.value);
            }}
            label="资源地址"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWebSourceDialog(false)}>取消</Button>
          <Button
            onClick={async () => {
              if (!webSource) {
                enqueueSnackbar("请输入");
                return;
              }
              if (!urlReg.test(webSource)) {
                enqueueSnackbar("格式错误");
                return;
              }
              await articleAPI.addSource({ articleId: id, source: webSource });
              refetch();
              setShowWebSourceDialog(false);
            }}
          >
            确认
          </Button>
        </DialogActions>
      </Dialog>

      <ArticlePageDialog
        refetch={refetch}
        articleId={id}
        src={articleSrc}
        open={!!articleSrc}
        onClose={() => setSrc("")}
      />
    </Card>
  );
};
export default ArticleItem;
