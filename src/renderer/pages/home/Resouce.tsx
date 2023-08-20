import { Box, Button, Chip, Drawer, Link, Tooltip } from "@mui/material";
import { Descriptions } from "antd";
import React, { useState } from "react";
import { MagnetLinks } from "./MagnetLinks";
import { useQuery } from "react-query";
import { articleAPI } from "@src/common/api/article";
import { useNavigate } from "react-router-dom";
import { routers } from "@src/renderer/config";
import { historyAPI } from "@src/common/api/history";
import { shell } from "electron";
import { ActionStatus } from "@src/common/constants";
import { useSnackbar } from "notistack";
import { File } from "@src/common/interfaces/file.interface";
import { UnConnectDialog } from "./UnConnectDialog";
import qs from "query-string";
import { chooseMedia } from "@src/renderer/utils";
import { ArticlePageDialog } from "./ArticlePageDialog";
import { AddWebResourceDialog } from "./AddWebResourceDialog";
import { ArticleTags } from "./ArticleTags";
import { formatTimeDetail } from "@src/renderer/utils/time";
import {
  SEARCH_SETTINGS_KEY,
  SearchConfig,
  defaultSearchConfig,
} from "@src/renderer/layout/Settings/SearchSetting";

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

interface ResourceProps {
  open: boolean;
  onClose: () => void;
  title: string;
  articleId: number;
  handleTagClick: (tag: string) => void;
}

export const Resource: React.FC<ResourceProps> = ({
  articleId,
  open,
  onClose,
  title,
  handleTagClick,
}) => {
  const [articleSrc, setSrc] = useState("");
  const [showWebSourceDialog, setShowWebSourceDialog] = useState(false);
  const { data: article, refetch } = useQuery(
    ["get-article-detail", articleId],
    () => articleAPI.getArticleDetail({ articleId })
  );
  const { enqueueSnackbar } = useSnackbar();
  const {
    files = [],
    web_sources,
    tags,
    content,
    rating_score,
    time,
    href,
  } = article || {};
  const nav = useNavigate();
  const [fileToRemove, setFileToRemove] = useState<File>(null);
  const sources = parseWebSource(web_sources);

  async function handleConnect() {
    const files = await chooseMedia();
    if (!files.length) {
      return;
    }
    const pros = files.map(async (media) => {
      try {
        await articleAPI.createAndConnectFile({
          articleId,
          fromPath: media,
        });
      } catch (e) {
        enqueueSnackbar(e?.message);
      }
    });
    await Promise.allSettled(pros);
    refetch();
  }

  const handleShowWebSourceDialog = () => {
    setShowWebSourceDialog(true);
  };

  const handleSearch = () => {
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
    const src = `https://www.google.com/search?q=${encodeURIComponent(search)}`;
    setSrc(src);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ minWidth: 400, maxWidth: 400, padding: 4 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={handleConnect}>
            选择关联文件
          </Button>
          <Button variant="outlined" onClick={handleShowWebSourceDialog}>
            添加网络资源
          </Button>
          <Button variant="outlined" onClick={handleSearch}>
            google 搜索
          </Button>
        </Box>
        <Descriptions bordered extra={<></>} column={1}>
          <Descriptions.Item label={"标题"}>{title}</Descriptions.Item>
          <Descriptions.Item label={"源地址"}>
            <Link
              onClick={(ev) => {
                ev.preventDefault();
                setSrc(href);
                historyAPI.addOpenDetail({ articleId });
              }}
              target="_blank"
              href={href}
            >
              {href}
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label={"简介"}>{content}</Descriptions.Item>
          <Descriptions.Item label={"评分"}>{rating_score}</Descriptions.Item>
          <Descriptions.Item label={"发布时间"}>
            {formatTimeDetail(time)}
          </Descriptions.Item>
          <Descriptions.Item label={"资源"}>
            {!!sources.length && (
              <Box display="flex" gap="4px" flexWrap="wrap">
                {sources?.map((source) => (
                  <Tooltip title={source} key={source}>
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
                      sx={{
                        maxWidth: "130px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      variant="outlined"
                      label={source}
                    />
                  </Tooltip>
                ))}
              </Box>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={"磁力链接"}>
            <MagnetLinks articleId={articleId} uid={article?.uid} />
          </Descriptions.Item>
          <Descriptions.Item label={"标签"}>
            <ArticleTags
              handleTagClick={(tag) => {
                handleTagClick(tag);
                onClose()
              }}
              tags={tags}
            />
          </Descriptions.Item>
          <Descriptions.Item label={"关联文件"}>
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
                      articleId,
                      fileId: file.id,
                      message: error,
                      status: ActionStatus.Error,
                    });
                    enqueueSnackbar(error, {
                      variant: "error",
                    });
                  } else {
                    historyAPI.addOpenFile({
                      articleId,
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
          </Descriptions.Item>
        </Descriptions>
      </Box>

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

      <ArticlePageDialog
        refetch={refetch}
        articleId={articleId}
        src={articleSrc}
        open={!!articleSrc}
        onClose={() => setSrc("")}
      />

      <AddWebResourceDialog
        open={showWebSourceDialog}
        onClose={() => setShowWebSourceDialog(false)}
        articleId={articleId}
        refetch={refetch}
      />
    </Drawer>
  );
};
