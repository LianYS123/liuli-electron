import { Dialog, DialogTitle, IconButton, Link } from "@mui/material";
import React, { useEffect, useRef } from "react";
import styles from "./index.module.css";
import type { WebviewTag } from "electron";
import CloseIcon from "@mui/icons-material/Close";

export const PageDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  src: string;
}> = ({ open, onClose, src }) => {
  const webviewRef = useRef<WebviewTag>(null);
  const onReady = () => {
    const iframe = webviewRef.current.shadowRoot.childNodes.item(
      1
    ) as HTMLIFrameElement;
    iframe.style.height = "100%";
  };
  useEffect(() => {
    webviewRef.current?.addEventListener("dom-ready", onReady);
    return () => {
      webviewRef.current?.removeEventListener("dom-ready", onReady);
    };
  }, [open, webviewRef.current]);
  return (
    <Dialog
      keepMounted={true}
      fullScreen
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ m: 0 }}>
        <div>
          <Link target="_blank" href={src}>
            {src}
          </Link>
        </div>
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <webview ref={webviewRef} className={styles.webview} src={src} />
    </Dialog>
  );
};
