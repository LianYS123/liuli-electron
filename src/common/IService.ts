export type IPageParams = {
  pageNo: number;
  pageSize: number;
  searchValue?: string;
};

export type IPageData<T = unknown> = {
  list: T[];
  pageNo: number;
  pageSize: number;
  total: number;
};

export type CommonResult<D> = {
  ok: boolean;
  message?: string;
  data: D;
};

export type CommonPageResult<T> = CommonResult<IPageData<T>>;

export type IService<P = unknown, R = unknown> = (
  data: P
) => Promise<CommonResult<R>>;

export type IPageService<P = unknown, R = unknown> = (
  data: P
) => Promise<CommonPageResult<R>>;
