export interface PageResult<T = unknown> {
  pageNo: number;
  pageSize: number;
  total: number;
  list: T[];
}
