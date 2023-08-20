import { IListResult } from '../typings';

export abstract class ListResultDto<T> implements IListResult<T> {
  readonly items: T[];
  readonly total: number;
}
