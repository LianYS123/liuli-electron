import { Box, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMutation, useQueryClient } from "react-query";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { articleAPI } from "@src/common/api/article";

export const CrawOptions: React.FC = () => {
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const client = useQueryClient();
  function refetch() {
    client.refetchQueries(["/article/list"], { active: true });
  }
  const { mutateAsync: craw, isLoading: crawing } = useMutation(
    articleAPI.fetchArticles,
    {
      onSuccess() {
        enqueueSnackbar("同步成功");
        refetch();
      }
    }
  );
  return (
    <Box>
      <Typography mb={1}>数据同步</Typography>
      <Stack spacing={4} mb={2}>
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
          onClick={() => {
            craw({ startPage, endPage });
          }}
          loading={crawing}
        >
          同步
        </LoadingButton>
      </Stack>
    </Box>
  );
};
