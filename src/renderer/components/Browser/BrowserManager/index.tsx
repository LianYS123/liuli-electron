import React from "react";
import { BrowserTabItem } from "@src/renderer/types/browser";
import { StateManager } from "@src/renderer/utils/StateManager";
import { BrowserHeader } from "../components/BrowserHeader";
import { debounce, flow, uniqueId } from "lodash";
import { parseURL } from "whatwg-url";

interface BrowserState {
  maxTabs: number;
  tabs: BrowserTabItem[];
  activeTabKey: string;
  open: boolean;
  keepMounted: boolean;
}

export const DefaultMaxTabs = 10;

export class BrowserManager {
  browserStateManager: StateManager<BrowserState>;

  private generateTab = (tab: Partial<BrowserTabItem> = {}): BrowserTabItem => {
    const key = uniqueId();
    const item: BrowserTabItem = {
      ...tab,
      key: tab.key || key,
      title: tab.title || tab.url || "Google",
      url: tab.url || "https://www.google.com",
      loading: tab.loading || false,
    };
    return item;
  };

  constructor() {
    const defaultState = this.getDefaultState();
    this.browserStateManager = new StateManager<BrowserState>(defaultState);
  }

  addTab = () => {
    const tab = this.generateTab();
    this.browserStateManager.produce((state) => {
      if (state.tabs.length < state.maxTabs) {
        state.tabs.push(tab);
        state.activeTabKey = tab.key;
        // this.setActiveTab(tab.key);
      }
    });
  };

  closeTab = (tab: BrowserTabItem) => {
    const { key } = tab;
    this.browserStateManager.produce((state) => {
      const newTabs = state.tabs.filter((tab) => tab.key !== key);
      state.tabs = newTabs;
      if (!newTabs.length) {
        state.open = false;
      } else if (key === state.activeTabKey) {
        state.activeTabKey = state.tabs[state.tabs.length - 1].key;
      }
    });
  };

  private getDefaultState(): BrowserState {
    // const tab = this.generateTab();
    // const defaultState = {
    //   tabs: [],
    //   activeTabKey: '',
    //   open: false,
    //   keepMounted: true,
    // };
    return {
      maxTabs: DefaultMaxTabs,
      tabs: [],
      activeTabKey: "",
      open: false,
      keepMounted: true,
    };
  }

  setActiveTab(activeTabKey: string) {
    this.browserStateManager.produce((state) => {
      const activeTab = state.tabs.find((it) => it.key === activeTabKey);
      if (!activeTab) {
        return;
      }
      state.activeTabKey = activeTab.key;
    });
  }

  openBrowser = ({ url, title }: { url?: string; title?: string } = {}) => {
    this.browserStateManager.produce((state) => {
      state.open = true;
      // const targetTab = state.tabs.find((tab) => {
      //   return (
      //     !!tab.url &&
      //     !!url &&
      //     parseURL(tab.url, { baseURL: tab.url }).host ===
      //       parseURL(url, { baseURL: tab.url }).host
      //   );
      // });

      if (!state.tabs.length || url) {
        const newTab = this.generateTab({ url, title });
        state.activeTabKey = newTab.key;
        state.tabs.push(newTab);
      }
    });
  };

  hideBrowser = () => {
    this.browserStateManager.produce((state) => {
      state.open = false;
    });
  };

  closeBrowser = () => {
    this.browserStateManager.produce((state) => {
      state.open = false;
      state.tabs = [];
      state.activeTabKey = "";
    });
  };

  updateTab = (tab: BrowserTabItem) => {
    this.browserStateManager.produce((state) => {
      const index = state.tabs.findIndex((it) => it.key === tab.key);
      if (index !== -1) {
        state.tabs[index] = tab;
      }
    });
  };

  setTabTitle = (key: string, title: string) => {
    this.browserStateManager.produce((state) => {
      const index = state.tabs.findIndex((it) => it.key === key);
      if (index !== -1) {
        state.tabs[index].title = title;
      }
    });
  };

  setTabLoading = (key: string, loading: boolean) => {
    this.browserStateManager.produce((state) => {
      const index = state.tabs.findIndex((it) => it.key === key);
      if (index !== -1) {
        state.tabs[index].loading = loading;
      }
    });
  };

  loadingStart = (key: string) => {
    this.setTabLoading(key, true);
  };
  loadingEnd = (key: string) => {
    this.setTabLoading(key, false);
  };

  useTab = () => {
    const { activeTabKey, tabs, maxTabs } = this.browserStateManager.useState();
    const activeTab = tabs.find((it) => it.key === activeTabKey);
    return { activeTab, tabs, activeTabKey, maxTabs };
  };
}

export const browserManager = new BrowserManager();
