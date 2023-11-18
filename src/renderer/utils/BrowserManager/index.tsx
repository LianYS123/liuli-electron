import React from "react";
import { BrowserTabItem } from "@src/renderer/types/browser";
import { StateManager } from "@src/renderer/utils/StateManager";
import { BrowserHeader } from "../../components/BrowserHeader";
import { flow, uniqueId } from "lodash";

export class BrowserManager {
  private tabsStateManager: StateManager<BrowserTabItem[]>;
  private activeTabStateManager: StateManager<BrowserTabItem | null>;

  BrowserHeader: React.FC = () => {
    const tabs = this.tabsStateManager.useState();
    const activeTab = this.activeTabStateManager.useState();
    const that = this;
    return (
      <BrowserHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(tab: BrowserTabItem) => {
          that.setActiveTab(tab);
        }}
        onTabClose={(tab: BrowserTabItem) => {
          that.removeTab(tab);
        }}
        onAddTab={() => {
          that.addTab();
        }}
        onRefresh={() => {
          throw new Error("Function not implemented.");
        }}
        onForward={() => {
          throw new Error("Function not implemented.");
        }}
        onBack={() => {
          throw new Error("Function not implemented.");
        }}
      />
    );
  };

  constructor(tags: BrowserTabItem[] = []) {
    this.tabsStateManager = new StateManager(tags);
    this.activeTabStateManager = new StateManager(null);
    this.initComponents();
  }

  initComponents = () => {
    this.BrowserHeader = flow(
      this.tabsStateManager.hoc,
      this.activeTabStateManager.hoc
    )(this.BrowserHeader);
  };

  addTab = () => {
    const item = {
      key: uniqueId(),
      title: "Google",
      url: "https://www.google.com",
    };
    this.tabsStateManager.produce((list) => {
      list.push(item);
      return list;
    });
    this.setActiveTab(item);
  };

  removeTab = (tab: BrowserTabItem) => {
    const { key } = tab;
    this.tabsStateManager.produce((list) => {
      return list.filter((tab) => tab.key !== key);
    });
  };

  setActiveTab(activeTab: BrowserTabItem) {
    this.activeTabStateManager.setState(activeTab);
  }
}
