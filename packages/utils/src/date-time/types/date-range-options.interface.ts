import { RangeBound } from '.';

export interface IDateRangeOptions {
  format: string;
  lowerBound?: RangeBound.lowerExclusive | RangeBound.lowerInclusive;
  upperBound?: RangeBound.upperExclusive | RangeBound.upperInclusive;
}
