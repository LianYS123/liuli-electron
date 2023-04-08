/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPageData<T = any> {
  pageNo: number;
  pageSize: number;
  total: number;
  list: T[];
}

export class CommonResult<T = any> {
  ok = true;

  message: string | null = null;

  constructor(public data: T) {}

  static success<T = any>(data: T) {
    return new CommonResult(data);
  }

  static page<T = any>(p: IPageData<T>) {
    return new CommonResult(p);
  }

  static error(message: string) {
    const res = new CommonResult(null);
    res.message = message;
    res.ok = false;
    return res;
  }
}
