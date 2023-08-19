import { Dialog, DialogTitle, IconButton, Link } from "@mui/material";
import React, { useRef } from "react";
import type { WebviewTag } from "electron";
import CloseIcon from "@mui/icons-material/Close";
import { WebView } from "../WebView";

export const PageDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  src: string;
}> = ({ open, onClose, src }) => {
  const webviewRef = useRef<WebviewTag>(null);
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
      <WebView ref={webviewRef} src={src} />
    </Dialog>
  );
};
