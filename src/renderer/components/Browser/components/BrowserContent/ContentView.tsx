import React, { useEffect, useRef } from 'react';
import { type WebviewTag } from 'electron';
import { BrowserTabItem } from '@src/renderer/types/browser';
import { WebView } from '@src/renderer/components/WebView';
import { browserManager } from '../../BrowserManager';
import { TopBar } from './TopBar';
import { useDebounceFn } from 'ahooks';

interface Props {
  tab: BrowserTabItem;
  hidden: boolean;
}

export const ContentView: React.FC<Props> = ({ tab, hidden }) => {
  const webviewRef = useRef<WebviewTag>(null);

  const { run: loadingStart } = useDebounceFn(
    () => {
      if (webviewRef.current?.isLoading()) {
        browserManager.loadingStart(tab.key);
      }
    },
    { wait: 200 },
  );

  const { run: loadingFinished } = useDebounceFn(
    () => {
      if (!webviewRef.current?.isLoading()) {
        browserManager.loadingEnd(tab.key);
      }
    },
    { wait: 200 },
  );

  const handleNav = async (event: Electron.DidNavigateEvent) => {
    const webview = webviewRef.current;
    const title = await webview?.executeJavaScript('document.title');

    browserManager.browserStateManager.produce(state => {
      const targetTab = state.tabs.find(it => it.key === tab.key);
      if (targetTab) {
        targetTab.url = event.url;
        targetTab.title = title || event.url;
      }
    });
  };

  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {
      webview.addEventListener('did-navigate', handleNav);
      webview.addEventListener('did-start-loading', loadingStart);
      webview.addEventListener('did-finish-load', loadingFinished);
      const onDomReady = async () => {
        const title = await webview.executeJavaScript('document.title');
        if (title) {
          browserManager.setTabTitle(tab.key, title);
        }
      };
      webview.addEventListener('dom-ready', onDomReady);
      return () => {
        webview.removeEventListener('did-navigate', handleNav);
        webview.removeEventListener('did-start-loading', loadingStart);
        webview.removeEventListener('did-finish-load', loadingFinished);
        webview.removeEventListener('dom-ready', onDomReady);
      };
    }
  }, [webviewRef.current]);

  return (
    <section hidden={hidden} style={{ height: '100%' }}>
      <TopBar
        onBack={() => {
          webviewRef.current?.goBack();
        }}
        tab={tab}
        onRefresh={() => {
          webviewRef.current?.reload();
        }}
        onForward={() => {
          webviewRef.current?.goForward();
        }}
      />
      <WebView ref={webviewRef} src={tab.url} />
    </section>
  );
};
