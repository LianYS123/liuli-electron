import { load } from 'cheerio';
import config from './config';
import fetch from 'node-fetch';

import { HttpsProxyAgent } from 'https-proxy-agent';

export function getUids(content: string) {
  if (!content) return [];
  const uids = [];

  let hasNext = true;
  const reg = /([0-9a-z]{40}|[0-9a-z]{32}|[0-9a-z]+本站不提供下载[0-9a-f]+)/gi;
  while (hasNext) {
    const matchs = reg.exec(content);
    if (matchs) {
      uids.push(matchs[0].split('本站不提供下载').join(''));
    } else {
      hasNext = false;
    }
  }
  return uids;
}

export const createProxyFetch = (proxyAddress: string) => {
  const agent = new HttpsProxyAgent(proxyAddress);
  const xFetch = (link: string, options?: any) => {
    return fetch(link, { ...options, agent });
  };
  return xFetch;
};

export const get$ = async (link: string) => {
  const xFetch = createProxyFetch(config.PROXY);
  const text = await xFetch(link).then((res: any) => res.text());
  return load(text);
};
