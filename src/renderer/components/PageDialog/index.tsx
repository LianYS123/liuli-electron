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
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { shell, type WebviewTag } from 'electron';
import CloseIcon from '@mui/icons-material/Close';
import { WebView } from '../WebView';
import { BrowserHeader } from '../Browser/components/BrowserHeader';
import { BrowserManager } from '../Browser/BrowserManager';

interface Props {
  open: boolean;
  onClose: () => void;
  src: string;
  actions?: React.ReactNode;
}

const tabManager = new BrowserManager();

export const PageDialog: React.FC<Props> = ({
  open,
  onClose,
  src,
  actions,
}) => {
  const webviewRef = useRef<WebviewTag>(null);
  const [topSrc, setTopSrc] = useState(src);
  useEffect(() => {
    setTopSrc(src);
  }, [src]);
  useEffect(() => {
    function handleNav(event: Electron.DidNavigateEvent) {
      setTopSrc(event.url);
    }
    webviewRef.current?.addEventListener('did-navigate', handleNav);
    return () => {
      webviewRef.current?.removeEventListener('did-navigate', handleNav);
    };
  }, [webviewRef.current]);
  return (
    <Dialog keepMounted={false} fullScreen open={open} onClose={onClose}>
      {/* <tabManager.BrowserHeader /> */}
      {/* <BrowserHeader tabManager={tabManager} /> */}
      {/* <WebView ref={webviewRef} src={src} /> */}
      <DialogTitle sx={{ m: 0 }}>
        <Box mr={4}>
          <Input fullWidth readOnly value={topSrc} />
        </Box>
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <WebView ref={webviewRef} src={src} />
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
