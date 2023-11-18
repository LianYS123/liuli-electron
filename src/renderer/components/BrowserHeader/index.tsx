import React from "react";
import styles from "./style.module.css";
import {
  Add,
  ArrowBack,
  ArrowForward,
  Lock,
  Refresh,
  StarOutline,
} from "@mui/icons-material";
import { IconButton, InputBase, Tooltip } from "@mui/material";
import { BrowserTabItem } from "@src/renderer/types/browser";
import { TabItem } from "./TabItem";

interface BrowserHeaderProps {
  tabs: BrowserTabItem[];
  activeTab: BrowserTabItem | null;
  onTabClick: (tab: BrowserTabItem) => void;
  onTabClose: (tab: BrowserTabItem) => void;
  onAddTab: () => void;
  onRefresh: () => void;
  onForward: () => void;
  onBack: () => void;
}

export const BrowserHeader: React.FC<BrowserHeaderProps> = ({
  tabs,
  activeTab,
  onTabClick,
  onTabClose,
  onAddTab,
  onRefresh,
  onBack,
  onForward,
}) => {
  return (
    <section className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.tabs}>
          {tabs.map((tab) => {
            return (
              <TabItem
                isActive={tab.key === activeTab?.key}
                key={tab.key}
                tabItem={tab}
                onClick={(tab) => {
                  onTabClick(tab);
                }}
                onClose={(tab) => {
                  onTabClose(tab);
                }}
              />
            );
          })}
          <div className={styles.addIcon}>
            <IconButton
              onClick={() => {
                onAddTab();
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
                onBack();
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
                onForward();
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
                onRefresh();
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
