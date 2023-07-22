import { Pagination } from "@mui/material";
import { Box } from "@mui/system";
import React, { useMemo } from "react";

interface IProps {
  total?: number;
  page?: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export const MyPagination: React.FC<IProps> = ({
  total = 0,
  pageSize,
  page = 1,
  onChange
}) => {
  const pages = useMemo(() => {
    return Math.ceil(total / pageSize);
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
          onChange(value);
          // window.scrollTo({
          //   top: 0,
          //   behavior: "smooth"
          // });
        }}
      />
    </Box>
  );
};
