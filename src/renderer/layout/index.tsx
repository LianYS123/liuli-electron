import {
  Box,
  Container,
  Drawer,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import React, { useState } from 'react';
import {
  ArrowBack,
  ArrowForward,
  DarkMode,
  HistoryOutlined,
  KeyboardArrowUp,
  LightMode,
  Refresh,
  Settings as SettingsIcon,
  Sync,
  Web,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataSync } from './DataSync';
import { useTheme } from '../hooks/useTheme';
import { History } from './History';
import { scrollToTop } from '../utils';
import { Settings } from './Settings';
import { browserManager } from '../components/Browser/BrowserManager';
import { useEventListener, useThrottleFn } from 'ahooks';
import { webFrame } from 'electron';
import { WallpaperContext } from '../providers/WallpaperProvider';

const isWin = process.platform === 'win32';

const useMetaPressed = () => {
  const [pressed, setPressed] = useState(false);
  useEventListener('keydown', ev => {
    if (ev.key === 'Control' || ev.key === 'Command') {
      setPressed(true);
    }
  });
  useEventListener('keyup', ev => {
    if (ev.key === 'Control' || ev.key === 'Command') {
      setPressed(false);
    }
  });
  return pressed;
};

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const nav = useNavigate();
  const [open, setOpen] = useState(true);
  const [dataSyncDrawerVisible, setDataSyncDrawerVisible] = useState(false);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const { wallpaper } = React.useContext(WallpaperContext);
  console.log(wallpaper)
  const { isDark, toggleTheme } = useTheme();

  const zoomKeyPressed = useMetaPressed();
  const { run: handleWheel } = useThrottleFn(
    (ev: WheelEvent): void => {
      if (!zoomKeyPressed) {
        return;
      }
      const fac = webFrame.getZoomFactor();
      const isMinimize = ev.deltaY > 0;
      const min = 0.3;
      const max = 3;
      if (isMinimize && fac <= min) {
        return;
      }
      if (!isMinimize && fac >= max) {
        return;
      }
      webFrame.setZoomFactor(isMinimize ? fac - 0.1 : fac + 0.1);
    },
    { wait: 0 },
  );

  useEventListener('wheel', handleWheel);

  return (
    <Box
      sx={{
        height: '100%',
        backgroundImage: wallpaper
          ? `url('${isWin ? wallpaper.replaceAll('\\', '\\\\') : wallpaper}')`
          : undefined,
        overflow: 'auto',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <Container
        id="app-container"
        sx={{
          height: '100%',
          overflow: 'auto',
        }}
      >
        {/* <AppHeader /> */}
        {children}
        <SpeedDial
          open={open}
          onClick={() => {
            setOpen(!open);
          }}
          onOpen={() => setOpen(true)}
          sx={{ position: 'fixed', bottom: 30, right: 30 }}
          icon={<SpeedDialIcon />}
          ariaLabel={''}
        >
          <SpeedDialAction
            onClick={ev => {
              ev.stopPropagation();
              setSettingsDrawerVisible(true);
            }}
            icon={<SettingsIcon />}
            tooltipTitle={'设置'}
          />

          <SpeedDialAction
            onClick={ev => {
              ev.stopPropagation();
              browserManager.openBrowser();
            }}
            icon={<Web />}
            tooltipTitle={'浏览器'}
          />

          <SpeedDialAction
            onClick={ev => {
              toggleTheme();
              ev.stopPropagation();
            }}
            icon={isDark ? <LightMode /> : <DarkMode />}
            tooltipTitle={'切换主题'}
          />
          <SpeedDialAction
            onClick={ev => {
              setHistoryDrawerVisible(true);
              ev.stopPropagation();
            }}
            icon={<HistoryOutlined />}
            tooltipTitle={'历史'}
          />
          <SpeedDialAction
            onClick={ev => {
              setDataSyncDrawerVisible(true);
              ev.stopPropagation();
            }}
            icon={<Sync />}
            tooltipTitle={'数据同步'}
          />
          <SpeedDialAction
            onClick={ev => {
              ev.stopPropagation();
              location.reload();
            }}
            icon={<Refresh />}
            tooltipTitle={'刷新'}
          />
          <SpeedDialAction
            onClick={ev => {
              ev.stopPropagation();
              nav(1);
            }}
            icon={<ArrowForward />}
            tooltipTitle={'前进'}
          />
          <SpeedDialAction
            onClick={ev => {
              ev.stopPropagation();
              nav(-1);
            }}
            icon={<ArrowBack />}
            tooltipTitle={'后退'}
          />
          <SpeedDialAction
            onClick={ev => {
              ev.stopPropagation();
              scrollToTop();
            }}
            icon={<KeyboardArrowUp />}
            tooltipTitle={'回到顶部'}
          />
        </SpeedDial>

        <Drawer
          ModalProps={{ keepMounted: true }}
          anchor={'right'}
          open={historyDrawerVisible}
          onClose={() => setHistoryDrawerVisible(false)}
        >
          <History enabled={historyDrawerVisible} />
        </Drawer>
        <Drawer
          anchor={'right'}
          open={dataSyncDrawerVisible}
          onClose={() => setDataSyncDrawerVisible(false)}
        >
          <DataSync />
        </Drawer>
        <Drawer
          anchor={'right'}
          open={settingsDrawerVisible}
          onClose={() => setSettingsDrawerVisible(false)}
        >
          <Settings enabled={settingsDrawerVisible} />
        </Drawer>
      </Container>
    </Box>
  );
};
