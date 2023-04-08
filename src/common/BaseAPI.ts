
export interface BaseAPI {
  getAppInfo(): Promise<{ appName: string; }>;

  getArticle(id: string): Promise<{id: string}>
}
