import { load } from 'cheerio';
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

export const get$ = async (link: string, proxy: string) => {
  // const agent = new HttpsProxyAgent(proxy);
  const text = await fetch(link).then(res => res.text());
  return load(text);
};
