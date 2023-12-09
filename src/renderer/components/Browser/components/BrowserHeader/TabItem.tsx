import React from 'react';
import styles from './style.module.css';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import classNames from 'classnames';
import { BrowserTabItem } from '@src/renderer/types/browser';
import { Loading } from '@src/renderer/components/Loading';

export const TabItem: React.FC<{
  tabItem: BrowserTabItem;
  isActive: boolean;
  onClick: (tab: BrowserTabItem) => void;
  onClose: (tab: BrowserTabItem) => void;
}> = ({ onClose, isActive, tabItem, onClick }) => {
  const { key, title, url, icon, loading } = tabItem;
  return (
    <section
      onClick={() => {
        onClick(tabItem);
      }}
      className={classNames(styles.tab, { [styles.active]: isActive })}
    >
      {/* <div hidden={!loading} className={styles.loading}>
        <Loading />
      </div> */}
      <div className={styles.favicon}>{icon}</div>
      <div title={title} className={styles.title}>
        {title}
      </div>
      <div className={styles.closeIcon}>
        <IconButton
          sx={{ fontSize: 16 }}
          onClick={ev => {
            ev.stopPropagation();
            onClose(tabItem);
          }}
        >
          <Close sx={{ width: '16px', height: '16px' }} />
        </IconButton>
      </div>
    </section>
  );
};
