import React, { useState } from "react";
import styles from "./style.module.css";
import {
  Add,
  ArrowBack,
  ArrowForward,
  Close,
  Lock,
  Refresh,
  Star,
  StarOutline,
} from "@mui/icons-material";
import { Box, IconButton, InputBase, Tooltip } from "@mui/material";
import { uniqueId } from "lodash";
import classNames from "classnames";

interface TabItem {
  key: string;
  title: string;
  url: string;
  icon?: React.ReactNode;
}

const Tab: React.FC<{
  tabItem: TabItem;
  isActive: boolean;
  onClick: (tab: TabItem) => void;
  onClose: (tab: TabItem) => void;
}> = ({ onClose, isActive, tabItem, onClick }) => {
  const { key, title, url, icon } = tabItem;
  return (
    <section
      onClick={() => {
        onClick(tabItem);
      }}
      className={classNames(styles.tab, { [styles.active]: isActive })}
    >
      <div className={styles.favicon}>{icon}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.closeIcon}>
        <IconButton
          sx={{ fontSize: 16 }}
          onClick={(ev) => {
            ev.stopPropagation();
            onClose(tabItem);
          }}
        >
          <Close sx={{ width: "16px", height: "16px" }} />
        </IconButton>
      </div>
    </section>
  );
};

export const BrowserHeader: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabItem | null>(null);
  const [tabs, setTabs] = useState<TabItem[]>([]);

  const addTab = (item: TabItem) => {
    setTabs([...tabs, item]);
  };

  const removeTab = (key: string) => {
    setTabs((tabs) => tabs.filter((tab) => tab.key !== key));
  };

  return (
    <section className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.tabs}>
          {tabs.map((tab) => {
            return (
              <Tab
                isActive={tab.key === activeTab?.key}
                key={tab.key}
                tabItem={tab}
                onClick={(tab) => {
                  setActiveTab(tab);
                }}
                onClose={(tab) => {
                  removeTab(tab.key);
                }}
              />
            );
          })}
          <div className={styles.addIcon}>
            <IconButton
              onClick={() => {
                const newItem = {
                  key: uniqueId(),
                  title: "Google",
                  url: "https://www.google.com",
                };
                addTab(newItem);
                setActiveTab(newItem);
              }}
            >
              <Add />
            </IconButton>
          </div>
        </div>
        <div className={styles.topRightActions}></div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomLeftActions}>
          <Tooltip title="后退">
            <IconButton
              onClick={() => {
                //   webviewRef.current.goBack();
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
                //   webviewRef.current.goForward();
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
                //   webviewRef.current.reload();
              }}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </div>
        <div className={styles.inputBar}>
          <div className={styles.inputPrefix}>
            <Lock sx={{ width: "12px", height: "12px" }} />
          </div>
          <div className={styles.inputBox}>
            <InputBase className={styles.input} defaultValue={activeTab?.url} />
          </div>
          <div className={styles.inputSuffix}>
            <IconButton>
              <StarOutline sx={{ width: "16px", height: "16px" }} />
            </IconButton>
          </div>
        </div>
        <div className={styles.bottomRightActions}></div>
      </div>
    </section>
  );
};
