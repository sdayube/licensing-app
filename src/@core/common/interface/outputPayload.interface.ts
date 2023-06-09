import { Pagination } from './pagination.interface';

export interface OutputPayload<T> {
  data: T[];
  pagination: Pagination;
}
