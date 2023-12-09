import { Box, Typography } from '@mui/material';
import { historyAPI } from '@src/common/api/history';
import { ActionEnum } from '@src/common/constants';
import React, { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { ArticleList } from './ArticleList';
import { ActionList } from './ActionList';
import { WallpaperHistoryList } from './WallpaperHistoryList';

const pageSize = 5;

export const History: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const [currentAction, setCurrentAction] = useState<ActionEnum>(
    ActionEnum.OpenDownload,
  );

  const { data, refetch, fetchNextPage, hasNextPage, isIdle, isLoading } =
    useInfiniteQuery(
      ['getHistory', currentAction],
      ({ pageParam }) =>
        historyAPI.list({
          pageNo: pageParam || 1,
          pageSize,
          action: currentAction,
        }),
      {
        enabled,
        getNextPageParam: ({ pageNo, pageSize, total }) => {
          if (pageNo * pageSize < total) {
            return pageNo + 1;
          }
        },
      },
    );

  const list = data?.pages?.flatMap(it => it.list) ?? [];
  const total = data?.pages?.[data.pages.length - 1]?.total ?? 0;
  const handleScroll: React.UIEventHandler<HTMLDivElement> = ev => {
    const { scrollTop, clientHeight, scrollHeight } = ev.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  };

  const commonProps = {
    list,
    refetch,
  };

  const renderList = () => {
    switch (currentAction) {
      case ActionEnum.SetWallpaper:
        return <WallpaperHistoryList {...commonProps} />;

      default:
        return <ArticleList {...commonProps} />;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 450,
        minWidth: 450,
        padding: 2,
        height: '100%',
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <ActionList
        currentAction={currentAction}
        setCurrentAction={setCurrentAction}
      />
      <Box sx={{ height: 30 }} />
      {!total && !isIdle && !isLoading && (
        <Box>
          <Typography align="center">暂无数据</Typography>
        </Box>
      )}
      {renderList()}
    </Box>
  );
};
