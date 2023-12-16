import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Stack } from '@mui/material';
import { History } from '@src/common/interfaces/history.interface';
import { formatTimeDetail } from '@src/renderer/utils/time';
import { useDispatch } from 'react-redux';
import { appSlice } from '@src/renderer/models/app';
import { historyAPI } from '@src/common/api/history';
import { Image } from 'antd';
import { useSnackbar } from 'notistack';

interface Props {
  list: History[];
  refetch: () => void;
}
export function WallpaperHistoryList({ list, refetch }: Props) {
  const dispatch = useDispatch();
  const handleSetWallpaper = (src: string) => {
    dispatch(appSlice.actions.setWallpaper(src));
  };
  const { enqueueSnackbar } = useSnackbar();

  const [previewSource, setPreviewSource] = React.useState('');

  return (
    <Stack spacing={2}>
      {list
        .filter(it => it.source)
        .map(item => {
          return (
            <Card key={item.id} sx={{ maxWidth: '100%' }}>
              <CardActionArea
                onClick={() => {
                  setPreviewSource(item.source!);
                }}
              >
                <CardMedia component="img" image={item.source} />
                <CardContent>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    gutterBottom
                    variant="subtitle1"
                    component="div"
                  >
                    {item.source}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {formatTimeDetail(item.updateTime)}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  // startIcon={<Wallpaper />}
                  onClick={async () => {
                    handleSetWallpaper(item.source!);
                    if (item.article) {
                      await historyAPI.addSetWallpaper({
                        articleId: item.article.id,
                        source: item.source,
                      });
                    }
                    // refetch();
                  }}
                  size="small"
                  color="primary"
                >
                  设为壁纸
                </Button>
                <Button
                  onClick={async () => {
                    await historyAPI.delete(item.id);
                    enqueueSnackbar('已删除');
                    refetch();
                  }}
                >
                  删除记录
                </Button>
              </CardActions>
            </Card>
          );
        })}
      {previewSource && (
        <Image
          style={{ display: 'none' }}
          src={previewSource || undefined}
          preview={{
            visible: !!previewSource,
            zIndex: 9999,
            onVisibleChange: v => {
              if (!v) {
                setPreviewSource('');
              }
            },
          }}
        />
      )}
    </Stack>
  );
}
