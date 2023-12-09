import { browserManager } from '../components/Browser/BrowserManager';
import {
  SEARCH_SETTINGS_KEY,
  SearchConfig,
  defaultSearchConfig,
} from '../layout/Settings/SearchSetting';
import { BrowserTabItem } from '../types/browser';

export const getSearchUrl = (searchValue: string) => {
  const config: SearchConfig = JSON.parse(
    localStorage.getItem(SEARCH_SETTINGS_KEY) ||
      JSON.stringify(defaultSearchConfig),
  );

  const res = /(\[.*?\])?(.*)/.exec(searchValue);
  let [, , search] = res;
  search = search.trim();
  if (config.limit) {
    search = search.slice(0, config.limit);
  }
  if (config.site) {
    search = `site:${config.site} ${search}`;
  }
  console.log(config, search);
  const url = `https://www.google.com/search?q=${encodeURIComponent(search)}`;
  return url;
};

export const searchInBrowser = (
  searchValue: string,
  config: {
    tab?: Partial<BrowserTabItem>;
  },
) => {
  const { tab = {} } = config;
  const url = getSearchUrl(searchValue);
  browserManager.openBrowser({
    url,
    ...tab,
  });
};
