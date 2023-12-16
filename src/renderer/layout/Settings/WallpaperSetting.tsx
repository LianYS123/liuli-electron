import { Box, Button, Typography } from '@mui/material';
import { historyAPI } from '@src/common/api/history';
import { ActionEnum } from '@src/common/constants';
import React from 'react';
import { useInfiniteQuery } from 'react-query';
import { WallpaperHistoryList } from '../History/WallpaperHistoryList';
import { dialogAPI } from '@src/common/api/dialog';
import { useTheme } from '@src/renderer/hooks/useTheme';
import { WallpaperContext } from '@src/renderer/providers/WallpaperProvider';

const pageSize = 5;

export const WallpaperSetting: React.FC<{ enabled: boolean }> = ({
  enabled,
}) => {
  const { setWallpaper } = React.useContext(WallpaperContext);
  const { toggleTheme } = useTheme();
  const { data, refetch, fetchNextPage, hasNextPage, isIdle, isLoading } =
    useInfiniteQuery(
      ['getHistory', ActionEnum.SetWallpaper],
      ({ pageParam }) =>
        historyAPI.list({
          pageNo: pageParam || 1,
          pageSize,
          action: ActionEnum.SetWallpaper,
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

  const handleSetWallpaper = async (src: string) => {
    setWallpaper(src);
    await historyAPI.addSetWallpaper({
      source: src,
    });
    refetch();
  };
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

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <Box display={'flex'} gap={1}>
        <Button
          variant="outlined"
          onClick={async () => {
            const { filePaths } = await dialogAPI.showOpenDialog({
              properties: ['openFile', 'dontAddToRecent', 'multiSelections'],
              filters: [{ name: 'File', extensions: ['png', 'jpg', 'jpeg'] }],
            });
            if (filePaths.length) {
              handleSetWallpaper(filePaths[0]);
            }
          }}
        >
          选择壁纸
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            handleSetWallpaper('');
          }}
        >
          重置
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            toggleTheme();
          }}
        >
          切换主题
        </Button>
      </Box>

      <Typography sx={{ my: 2 }}>操作历史</Typography>

      {!total && !isIdle && !isLoading && (
        <Box>
          <Typography align="center">暂无数据</Typography>
        </Box>
      )}
      <WallpaperHistoryList {...commonProps} />
    </Box>
  );
};
