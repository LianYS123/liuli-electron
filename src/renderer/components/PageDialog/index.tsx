import { Dialog, DialogTitle, IconButton } from "@mui/material";
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
    console.log("222", webviewRef.current);
    const iframe = webviewRef.current.shadowRoot.childNodes.item(
      1
    ) as HTMLIFrameElement;
    console.log("333", iframe);
    iframe.style.height = "100%";
    // webviewRef.current.insertCSS("iframe {height: 100%;}");
  };
  useEffect(() => {
    // console.log(webviewRef.current);
    console.log("111", webviewRef.current);
    webviewRef.current?.addEventListener("dom-ready", onReady);
    return () => {
      webviewRef.current?.removeEventListener("dom-ready", onReady);
    };
  }, [open, webviewRef.current]);
  // useEventListener("dom-ready", onReady, {
  //   target: webviewRef
  // });
  return (
    <Dialog
      // maxWidth={"xs"}
      // sx={{ maxWidth: "80vw" }}
      keepMounted={true}
      fullScreen
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ m: 0 }}>
        <div>{src}</div>
        {/* {children} */}
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
