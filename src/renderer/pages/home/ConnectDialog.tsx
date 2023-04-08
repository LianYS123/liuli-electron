import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField } from "@mui/material";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { noop } from "lodash";
import { IArticle } from "@src/renderer/services/types";
import { createAndConnectFile } from "@src/renderer/services/article";

export const ConnectDialog: React.FC<{
  article: IArticle;
  visible: boolean;
  close: () => void;
  onSuccess?: () => void;
}> = ({ close, onSuccess = noop, visible, article }) => {
  const [fromPath, setFromPath] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync, isLoading } = useMutation(createAndConnectFile);
  const handleCancel = () => {
    close();
  };
  const handleOk = async () => {
    if (!fromPath) {
      enqueueSnackbar("请输入资源文件位置", {
        variant: "error"
      });
      return;
    }
    await mutateAsync({ fromPath, articleId: article.id });
    enqueueSnackbar("同步成功", {
      variant: "success"
    });
    close();
    onSuccess();
  };
  return (
    <Dialog fullWidth open={visible} onClose={handleCancel}>
      <DialogTitle>关联文件</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          sx={{ mt: 1 }}
          label="文件位置"
          type="text"
          value={fromPath}
          onChange={(ev) => {
            setFromPath(ev.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>取消</Button>
        <LoadingButton loading={isLoading} onClick={handleOk} autoFocus>
          确认
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
