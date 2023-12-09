import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  FormControlLabel,
} from '@mui/material';
import { articleAPI } from '@src/common/api/article';
import { fileAPI } from '@src/common/api/file';
import { Article } from '@src/common/interfaces/article.interface';
import { File } from '@src/common/interfaces/file.interface';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

interface IProps extends DialogProps {
  file: File;
  onClose: () => void;
  article: Article;
  refetch: () => void;
}

export const UnConnectDialog: React.FC<IProps> = ({
  file,
  article,
  refetch,
  ...dialogProps
}) => {
  const [removeSourceFlag, setRemoveSourceFlag] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Dialog {...dialogProps}>
      <DialogTitle>提示</DialogTitle>
      <DialogContent>
        <DialogContentText>你确定要解除该关联吗？</DialogContentText>
        <DialogContentText>
          <FormControlLabel
            label="同时删除资源和硬盘中的文件"
            control={
              <Checkbox
                checked={removeSourceFlag}
                onChange={(ev, checked) => {
                  setRemoveSourceFlag(checked);
                }}
              />
            }
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dialogProps.onClose();
          }}
        >
          取消
        </Button>
        <Button
          onClick={async () => {
            await articleAPI.removeFile({
              fileId: file.id,
              articleId: article.id,
            });
            if (removeSourceFlag) {
              await fileAPI.deleteFile({
                fileId: file.id,
                removeSource: true,
              });
            }
            dialogProps.onClose();
            enqueueSnackbar('操作成功', {
              variant: 'success',
            });
            refetch();
          }}
          autoFocus
        >
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
};
