import React from 'react';
import { browserManager } from '../../BrowserManager';
import { ContentView } from './ContentView';

export const BrowserContent = () => {
  const { tabs, activeTab } = browserManager.useTab();
  return (
    <section style={{ height: '100%' }}>
      {tabs.map(tab => {
        return (
          <ContentView
            hidden={activeTab.key !== tab.key}
            key={tab.key}
            tab={tab}
          />
        );
      })}
    </section>
  );
};
