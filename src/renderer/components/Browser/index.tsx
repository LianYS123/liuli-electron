import React from 'react';
import { BrowserHeader } from './components/BrowserHeader';
import { browserManager } from './BrowserManager';
import { BrowserContent } from './components/BrowserContent';
import { Dialog, DialogContent } from '@mui/material';

const BrowserInner: React.FC = () => {
  const { keepMounted, open } = browserManager.browserStateManager.useState();
  return (
    <Dialog
      keepMounted={keepMounted}
      fullScreen
      open={open}
      onClose={() => {
        browserManager.hideBrowser();
      }}
    >
      <BrowserHeader />
      <BrowserContent />
    </Dialog>
  );
};

export const Browser = browserManager.browserStateManager.hoc(BrowserInner);
