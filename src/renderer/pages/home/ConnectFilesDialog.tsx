import React from "react";
import { useMutation } from "react-query";
import { IArticle } from "../../services/types";
import { useSnackbar } from "notistack";
import { noop } from "lodash";
import { FileSelectorDialog } from "../../components/file";
import { connectFiles } from "../../services/article";

export const ConnectFilesDialog: React.FC<{
  article: IArticle;
  visible: boolean;
  close: () => void;
  onSuccess?: () => void;
}> = ({ close, onSuccess = noop, visible, article }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync, isLoading } = useMutation(connectFiles);
  return (
    <FileSelectorDialog
      visible={visible}
      close={close}
      onOk={async (ids) => {
        await mutateAsync({
          items: ids.map((fileId) => ({
            articleId: article.id,
            fileId: fileId
          }))
        });
        enqueueSnackbar("关联成功", {
          variant: "success"
        });
        close();
        onSuccess();
      }}
    />
  );
};
