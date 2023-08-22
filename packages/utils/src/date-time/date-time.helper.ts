import { DateInput, DateTime, Duration, Interval, Settings } from 'luxon';

import { IDateRangeOptions, RangeBound, TimeSource } from './types';

// Globally enable throw on invalid Luxon objects.
Settings.throwOnInvalid = true;

const EMPTY_BOUND = '';

export const dateTime = {
  now(): DateTime {
    return DateTime.utc();
  },

  buildDateRange(start: string | null, end: string | null, options: IDateRangeOptions): string {
    if (start === null && end === null) {
      throw new Error("Can't create date range that have both bounds opened");
    }

    const { format, lowerBound = RangeBound.lowerInclusive, upperBound = RangeBound.upperExclusive } = options;
    const lowerEdge = start ? DateTime.fromFormat(start, format).toFormat('y-LL-dd') : EMPTY_BOUND;
    const upperEdge = end ? DateTime.fromFormat(end, format).toFormat('y-LL-dd') : EMPTY_BOUND;
    const dateRange = `${lowerBound}${lowerEdge},${upperEdge}${upperBound}`;

    return dateRange;
  },

  parse(timestamp: TimeSource): DateTime {
    if (timestamp instanceof DateTime) {
      return timestamp;
    }

    if (timestamp instanceof Date) {
      return DateTime.fromJSDate(timestamp);
    }

    return DateTime.fromISO(timestamp);
  },

  splitToParts(timestamp: TimeSource) {
    const parsedTimestamp = this.parse(timestamp);
    const { hour, weekday } = parsedTimestamp;

    return {
      hour,
      weekday,
      date: parsedTimestamp.toISODate(),
    };
  },
};

export { type DateInput, DateTime, Duration, Interval };
