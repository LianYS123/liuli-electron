import { Pagination } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useHistoryState } from "./useHistoryState";

export const MyPagination: React.FC<{
  total: number;
  pageSize: number;
}> = ({ total, pageSize }) => {
  const [pages, setPages] = useState(0);
  const {
    state: { pageNo: page = 1 },
    setState
  } = useHistoryState();
  useEffect(() => {
    if (total) {
      setPages(Math.ceil(total / pageSize));
    }
  }, [total]);
  return (
    <Box sx={{ my: 2, display: "flex", justifyContent: "flex-start" }}>
      <Pagination
        variant="outlined"
        color="primary"
        shape="rounded"
        size="large"
        count={pages}
        page={page}
        onChange={(_, value) => {
          setState({ pageNo: value });
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }}
      />
    </Box>
  );
};
