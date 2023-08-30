import { GameServiceV1 } from '@lib/grpc';
import { calculateDelayByFutureTimestamp } from './calculate-delay-by-future-timestamp';

export const checkGameEventConstraints = (beginGameEventParams: GameServiceV1.BeginGameEventParamsDto) => {
  const delay = calculateDelayByFutureTimestamp(beginGameEventParams.startAt);

  if (delay < 0) {
    throw new Error('The game event start moment scheduled in the past');
  }

  // Here could be another validations
};
