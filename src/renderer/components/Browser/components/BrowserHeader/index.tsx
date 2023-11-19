import React from "react";
import styles from "./style.module.css";
import { Add, Close, Minimize, Remove } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { TabItem } from "./TabItem";
import { DefaultMaxTabs, browserManager } from "../../BrowserManager";

export const BrowserHeader: React.FC = () => {
  const { tabs, activeTab, maxTabs = DefaultMaxTabs } = browserManager.useTab();
  return (
    <section className={styles.wrap}>
      <div className={styles.tabs}>
        {tabs.map((tab) => {
          return (
            <TabItem
              isActive={tab.key === activeTab?.key}
              key={tab.key}
              tabItem={tab}
              onClick={(tab) => {
                browserManager.setActiveTab(tab.key);
              }}
              onClose={(tab) => {
                browserManager.closeTab(tab);
              }}
            />
          );
        })}
        <div hidden={tabs.length >= maxTabs} className={styles.addIcon}>
          <IconButton
            onClick={() => {
              browserManager.addTab();
            }}
          >
            <Add />
          </IconButton>
        </div>
      </div>
      <div className={styles.rightActions}>
        <IconButton
          onClick={() => {
            browserManager.hideBrowser();
          }}
        >
          {/* <Minimize /> */}
          <Remove />
        </IconButton>
        <IconButton
          onClick={() => {
            browserManager.closeBrowser();
          }}
        >
          <Close />
        </IconButton>
      </div>
    </section>
  );
};
