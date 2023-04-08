export type IPageParams = {
  pageNo: number;
  pageSize: number;
  searchValue?: string;
};

export type IService<P = unknown, R = unknown> = (data: P) => Promise<{
  ok: boolean;
  message?: string;
  data: R;
}>;

export type IPageResult<T = unknown> = {
  list: T[];
  pageNo: number;
  pageSize: number;
  total: number;
};

export type IPageService<P = unknown, R = unknown> = IService<
  P,
  IPageResult<R>
>;
