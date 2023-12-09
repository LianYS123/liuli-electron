import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { articleAPI } from '@src/common/api/article';
import { urlReg } from '@src/renderer/constants';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

export const AddWebResourceDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  articleId: number;
}> = ({ open, onClose, refetch, articleId }) => {
  const [webSource, setWebSource] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>添加网络资源地址</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ width: '100%' }}
          value={webSource}
          onChange={ev => {
            setWebSource(ev.target.value);
          }}
          label="资源地址"
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={async () => {
            if (!webSource) {
              enqueueSnackbar('请输入');
              return;
            }
            if (!urlReg.test(webSource)) {
              enqueueSnackbar('格式错误');
              return;
            }
            await articleAPI.addSource({ articleId, source: webSource });
            refetch();
            onClose();
          }}
        >
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
};
