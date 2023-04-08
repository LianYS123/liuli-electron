import { Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { useAlertDialog } from "../../providers/AlertDialogProvider";
import React, { useState } from "react";

export const CrawOptions: React.FC<{
  refetch: () => void;
  isFetching: boolean;
}> = ({ refetch, isFetching }) => {
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: craw, isLoading: crawing } = useMutation(
    window.myAPI.fetchArticles,
    {
      onSuccess() {
        enqueueSnackbar("同步成功");
        refetch();
      }
    }
  );
  const { open: openAlertDialog } = useAlertDialog();
  // 数据同步
  const handleCraw = () => {
    openAlertDialog({
      content: `你确定要同步从第 ${startPage || 1} 页到${
        endPage ? `第 ${endPage} 页` : "最后一页"
      }的数据? `,
      onOk: async () => {
        craw({ startPage, endPage });
      }
    });
  };
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end" }} mb={2}>
      <TextField
        type="number"
        value={startPage}
        onChange={(ev) => {
          setStartPage(Number(ev.target.value));
        }}
        sx={{ mr: 2 }}
        label="Start Page"
        variant="standard"
      />
      <TextField
        type="number"
        value={endPage}
        onChange={(ev) => {
          setEndPage(Number(ev.target.value));
        }}
        sx={{ mr: 2 }}
        label="End Page"
        variant="standard"
      />
      <LoadingButton
        variant="outlined"
        sx={{ mr: 1 }}
        onClick={() => {
          handleCraw();
        }}
        loading={crawing}
      >
        同步
      </LoadingButton>

      <LoadingButton
        variant="outlined"
        sx={{ mr: 1 }}
        onClick={() => {
          refetch();
        }}
        loading={isFetching}
      >
        刷新
      </LoadingButton>
    </Box>
  );
};
