import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Link, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import filesize from "filesize";
import { useFiles } from "./useFiles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "notistack";
import { File } from "@src/common/interfaces/file.interface";

export const FileList: React.FC<{
  ids: number[];
  setIds: (ids: number[]) => void;
}> = ({ ids, setIds }) => {
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const {
    data: { data }
  } = useFiles({ pageNo: page, pageSize });
  const columns: GridColDef<File>[] = [
    // { field: "id", headerName: "ID" },
    { field: "name", headerName: "文件名", width: 280 },
    { field: "mimetype", headerName: "文件类型", width: 130 },
    {
      field: "size",
      headerName: "文件大小",
      type: "number",
      width: 90,
      valueGetter: (params) => {
        return filesize(params.value);
      }
    }
  ];
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data.list}
        columns={columns}
        page={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        pageSize={pageSize}
        rowsPerPageOptions={[pageSize]}
        checkboxSelection
        getRowId={(row) => row.id}
        selectionModel={ids}
        onSelectionModelChange={(ids: number[]) => {
          setIds(ids);
        }}
      />
    </div>
  );
};

export const FileSelectorDialog: React.FC<{
  visible: boolean;
  close: () => void;
  onOk?: (ids: number[]) => void;
}> = ({ close, onOk, visible }) => {
  const [ids, setIds] = React.useState<number[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const handleOk = () => {
    if (ids.length === 0) {
      enqueueSnackbar("请选择文件");
      return;
    }
    onOk(ids);
    close();
  };
  return (
    <Dialog fullWidth open={visible} onClose={close}>
      <DialogTitle>请选择文件</DialogTitle>
      <DialogContent>
        <FileList ids={ids} setIds={setIds} />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>取消</Button>
        <Button onClick={handleOk} autoFocus>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
};
