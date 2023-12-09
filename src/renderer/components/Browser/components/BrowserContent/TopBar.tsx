import React from 'react';
import styles from './style.module.css';
import {
  Add,
  ArrowBack,
  ArrowForward,
  Lock,
  Refresh,
  StarOutline,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { IconButton, InputBase, Tooltip } from '@mui/material';
import { BrowserTabItem } from '@src/renderer/types/browser';
import { Loading } from '@src/renderer/components/Loading';
import { ActionMenuButton } from '@src/renderer/components/action/ActionMenuButton';

interface TopBarProps {
  tab: BrowserTabItem;
  onRefresh: () => void;
  onForward: () => void;
  onBack: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  tab,
  onBack,
  onForward,
  onRefresh,
}) => {
  console.log(tab);
  return (
    <div className={styles.topBar}>
      <div className={styles.bottomLeftActions}>
        <Tooltip title="后退">
          <IconButton
            onClick={() => {
              onBack();
            }}
            sx={{
              color: theme => theme.palette.grey[500],
            }}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>

        <Tooltip title="前进">
          <IconButton
            onClick={() => {
              onForward();
            }}
            sx={{
              color: theme => theme.palette.grey[500],
            }}
          >
            <ArrowForward />
          </IconButton>
        </Tooltip>

        <Tooltip title="刷新">
          {tab.loading ? (
            <div
              style={{
                display: 'inline-flex',
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Loading style={{ fontSize: 18 }} />
            </div>
          ) : (
            <IconButton
              onClick={() => {
                onRefresh();
              }}
              sx={{
                color: theme => theme.palette.grey[500],
              }}
            >
              <Refresh />
            </IconButton>
          )}
        </Tooltip>
      </div>
      <div className={styles.inputBar}>
        <div className={styles.inputPrefix}>
          <Lock sx={{ width: '12px', height: '12px' }} />
        </div>
        <div className={styles.inputBox}>
          <InputBase
            readOnly
            className={styles.input}
            value={decodeURIComponent(tab.url)}
          />
        </div>
        <div className={styles.inputSuffix}>
          <IconButton>
            <StarOutline sx={{ width: '16px', height: '16px' }} />
          </IconButton>
        </div>
      </div>
      {!!tab.actions?.length && (
        <div className={styles.bottomRightActions}>
          <ActionMenuButton
            actions={tab.actions.map(it => ({
              ...it,
              onClick: () => {
                it.onClick({ tab });
              },
            }))}
            // icon={<MenuIcon />}
          />
        </div>
      )}
    </div>
  );
};
