import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Link,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { shell, type WebviewTag } from "electron";
import CloseIcon from "@mui/icons-material/Close";
import { WebView } from "@src/renderer/components/WebView";
import { articleAPI } from "@src/common/api/article";
import { useSnackbar } from "notistack";
import {
  ArrowBack,
  ArrowForward,
  MoreVert,
  Refresh,
} from "@mui/icons-material";
import { ActionMenuButton } from "@src/renderer/components/action/ActionMenuButton";
import { useDebounceFn } from "ahooks";
import { urlReg } from "@src/renderer/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  src: string;
  articleId: number;
  refetch: () => void;
}

export const ArticlePageDialog: React.FC<Props> = ({
  open,
  onClose,
  src,
  articleId,
  refetch,
}) => {
  const webviewRef = useRef<WebviewTag>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [topSrc, setTopSrc] = useState(src);
  useEffect(() => {
    setTopSrc(src);
  }, [src]);
  useEffect(() => {
    function handleNav(event: Electron.DidNavigateEvent) {
      setTopSrc(event.url);
    }
    webviewRef.current?.addEventListener("did-navigate", handleNav);
    return () => {
      webviewRef.current?.removeEventListener("did-navigate", handleNav);
    };
  }, [webviewRef.current]);
  const handleAddToSource = async () => {
    await articleAPI.addSource({ articleId, source: topSrc });
    enqueueSnackbar("操作成功");
    refetch();
  };

  const { run: handleNavigate } = useDebounceFn(
    () => {
      if (!urlReg.test(topSrc)) {
        enqueueSnackbar("格式错误");
        return;
      }
      webviewRef.current.loadURL(topSrc);
    },
    { wait: 100 }
  );

  return (
    <Dialog
      scroll="paper"
      keepMounted={false}
      fullScreen
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ m: 0, display: "flex" }}>
        <Box sx={{ display: "flex", gap: "2px", mr: 2 }}>
          <Tooltip title="后退">
            <IconButton
              onClick={() => {
                webviewRef.current.goBack();
              }}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>

          <Tooltip title="前进">
            <IconButton
              onClick={() => {
                webviewRef.current.goForward();
              }}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <ArrowForward />
            </IconButton>
          </Tooltip>

          <Tooltip title="刷新">
            <IconButton
              onClick={() => {
                webviewRef.current.reload();
              }}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>

          <Tooltip title="关闭">
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ flex: 1, mr: 2 }}>
          <Input
            fullWidth
            value={topSrc}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                handleNavigate();
              }
            }}
            onChange={(ev) => {
              setTopSrc(ev.target.value);
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: "2px" }}>
          <ActionMenuButton
            actions={[
              {
                text: "添加为网络资源",
                onClick: handleAddToSource,
              },
            ]}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <WebView ref={webviewRef} src={src} />
      </DialogContent>
    </Dialog>
  );
};
