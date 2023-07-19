import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery } from "react-query";
import { Box, FormControlLabel, Link, Stack, Switch } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import filesize from "filesize";
import {
  addFile,
  deleteFile,
  getFileList,
  updateFile
} from "@src/renderer/services/file";
import { useSnackbar } from "notistack";
import { useAlertDialog } from "@src/renderer/providers/AlertDialogProvider";
import { File } from "@src/common/interfaces/file.interface";

export function FileList() {
  const [page, setPage] = React.useState(0);
  const [pageSize] = React.useState(10);
  const [selectionModel, setSelectedModel] = React.useState<number[]>([]);
  const { data, isLoading } = useQuery(
    ["GET_FILE_LIST", page, pageSize],
    () => {
      return getFileList({
        pageNo: page + 1,
        pageSize
      });
    }
  );
  const { open: openAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: del } = useMutation(deleteFile, {
    onSuccess: () => {
      enqueueSnackbar("删除成功");
    }
  });
  const { mutateAsync: update } = useMutation(updateFile, {
    onSuccess: () => {
      enqueueSnackbar("修改成功");
    }
  });
  const { mutateAsync: add } = useMutation(addFile, {
    onSuccess: () => {
      enqueueSnackbar("添加成功");
    }
  });

  const columns: GridColDef<File>[] = [
    { field: "name", headerName: "文件名", editable: true, width: 400 },
    { field: "mimetype", headerName: "文件类型", width: 200 },
    {
      field: "size",
      headerName: "文件大小",
      type: "number",
      width: 90,
      valueGetter: (params) => {
        return filesize(params.value);
      }
    },
    {
      field: "opt",
      headerName: "操作",
      sortable: false,
      width: 160,
      renderCell: ({ row }) => {
        let removeSource = true;
        return (
          <Stack spacing={1} direction="row">
            <Link
              sx={{ cursor: "pointer" }}
              onClick={() => {
                openAlertDialog({
                  title: "确认删除？",
                  content: (
                    <Box component="span">
                      {/* <Typography variant="subtitle1">
                        你确认要移除此资源？
                      </Typography> */}
                      <FormControlLabel
                        control={
                          <Switch
                            defaultChecked
                            onChange={(ev, checked) => (removeSource = checked)}
                          />
                        }
                        label="同时移除资源文件"
                      />
                    </Box>
                  ),
                  onOk: async () => {
                    del({ fileId: row.id, removeSource });
                  }
                });
              }}
            >
              删除
            </Link>
            <Link component={RouterLink} to="/video" state={row}>
              播放
            </Link>
          </Stack>
        );
      }
    }
  ];

  const processRowUpdate = React.useCallback(
    async (newRow: File, oldRow: File) => {
      if (oldRow.name === newRow.name) {
        return oldRow;
      }
      await update({ id: newRow.id, name: newRow.name });
      return newRow;
    },
    []
  );

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        loading={isLoading}
        rows={data.list}
        rowCount={data.total}
        columns={columns}
        page={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        autoHeight
        pageSize={pageSize}
        rowsPerPageOptions={[pageSize]}
        paginationMode="server"
        checkboxSelection
        getRowId={(row) => row.id}
        selectionModel={selectionModel}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        onSelectionModelChange={(ids: number[]) => {
          setSelectedModel(ids);
        }}
      />
    </div>
  );
}
