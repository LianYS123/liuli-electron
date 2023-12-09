import { Box, Button, Chip, Drawer, Link, Tooltip } from '@mui/material';
import { Descriptions } from 'antd';
import React, { useState } from 'react';
import { MagnetLinks } from './MagnetLinks';
import { useQuery } from 'react-query';
import { articleAPI } from '@src/common/api/article';
import { historyAPI } from '@src/common/api/history';
import { shell } from 'electron';
import { ActionStatus } from '@src/common/constants';
import { useSnackbar } from 'notistack';
import { File } from '@src/common/interfaces/file.interface';
import { UnConnectDialog } from './UnConnectDialog';
import { chooseFiles } from '@src/renderer/utils';
import { AddWebResourceDialog } from './AddWebResourceDialog';
import { ArticleTags } from './ArticleTags';
import { formatTimeDetail } from '@src/renderer/utils/time';
import { browserManager } from '@src/renderer/components/Browser/BrowserManager';

interface ResourceProps {
  open: boolean;
  onClose: () => void;
  title: string;
  articleId: number;
  handleTagClick: (tag: string) => void;
  handleSearch: () => void;
}

export const Resource: React.FC<ResourceProps> = ({
  articleId,
  open,
  onClose,
  title,
  handleTagClick,
  handleSearch,
}) => {
  const [showWebSourceDialog, setShowWebSourceDialog] = useState(false);
  const { data: article, refetch } = useQuery(
    ['get-article-detail', articleId, open],
    () => articleAPI.getArticleDetail({ articleId }),
    { enabled: open },
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
  const [fileToRemove, setFileToRemove] = useState<File | null>(null);
  const sources: string[] = JSON.parse(web_sources || '[]');

  async function handleConnect() {
    const files = await chooseFiles();
    if (!files.length) {
      return;
    }
    const pros = files.map(async media => {
      try {
        await articleAPI.createAndConnectFile({
          articleId,
          fromPath: media,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        enqueueSnackbar(e?.message);
      }
    });
    await Promise.allSettled(pros);
    refetch();
  }

  const handleShowWebSourceDialog = () => {
    setShowWebSourceDialog(true);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ minWidth: 400, maxWidth: 400, padding: 4 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={handleConnect}>
            选择关联文件
          </Button>
          <Button variant="outlined" onClick={handleShowWebSourceDialog}>
            添加网络资源
          </Button>
          <Button variant="outlined" onClick={handleSearch}>
            搜索
          </Button>
        </Box>
        <Descriptions bordered extra={<></>} column={1}>
          <Descriptions.Item label={'标题'}>{title}</Descriptions.Item>

          {!!sources.length && (
            <Descriptions.Item label={'网络资源'}>
              <Box display="flex" gap="4px" flexWrap="wrap">
                {sources?.map(source => (
                  <Tooltip title={source} key={source}>
                    <Chip
                      onClick={async () => {
                        await browserManager.openBrowser({
                          url: source,
                        });
                      }}
                      onDelete={async () => {
                        await articleAPI.removeSource({
                          source,
                          articleId,
                        });
                        refetch();
                      }}
                      sx={{
                        maxWidth: '130px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      variant="outlined"
                      color="secondary"
                      label={source}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Descriptions.Item>
          )}

          {!!files.length && (
            <Descriptions.Item label={'关联文件'}>
              {files?.map(file => (
                <Tooltip title={file.name}>
                  <Chip
                    color="primary"
                    sx={{
                      maxWidth: '130px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    onClick={async () => {
                      const error = await shell.openPath(file.filePath);
                      if (error) {
                        historyAPI.addOpenFile({
                          articleId,
                          fileId: file.id,
                          message: error,
                          status: ActionStatus.Error,
                        });
                        enqueueSnackbar(error, {
                          variant: 'error',
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
                </Tooltip>
              ))}
            </Descriptions.Item>
          )}

          {article?.uid && (
            <Descriptions.Item label={'磁力链接'}>
              <MagnetLinks articleId={articleId} uid={article?.uid} />
            </Descriptions.Item>
          )}

          <Descriptions.Item label={'评分'}>{rating_score}</Descriptions.Item>
          <Descriptions.Item label={'发布时间'}>
            {formatTimeDetail(time)}
          </Descriptions.Item>
          <Descriptions.Item label={'源地址'}>
            <Link
              onClick={ev => {
                ev.preventDefault();
                browserManager.openBrowser({
                  url: href,
                });
                historyAPI.addOpenDetail({ articleId });
              }}
              target="_blank"
              href={href}
            >
              {href}
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label={'简介'}>{content}</Descriptions.Item>

          <Descriptions.Item label={'标签'}>
            <ArticleTags
              handleTagClick={tag => {
                handleTagClick(tag);
                onClose();
              }}
              tags={tags}
            />
          </Descriptions.Item>
        </Descriptions>
      </Box>

      {fileToRemove && article && (
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

      <AddWebResourceDialog
        open={showWebSourceDialog}
        onClose={() => setShowWebSourceDialog(false)}
        articleId={articleId}
        refetch={refetch}
      />
    </Drawer>
  );
};
