export interface ITimestampsMeta<T extends Date | string> {
  readonly createdAt: T;
  readonly updatedAt: T;
}
