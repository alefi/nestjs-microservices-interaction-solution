import { type DateTime, dateTime } from '@lib/utils';

export const calculateDelayByFutureTimestamp = (timestamp: string | Date | DateTime): number => {
  const remainingTimeToEventStart = dateTime.parse(timestamp).diffNow();
  return remainingTimeToEventStart.toMillis();
};
