import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import type { JobsOptions, Job } from 'bullmq';
import { match } from 'ts-pattern';

import type { GameEvent } from '@prisma/client';
import { IBeginGameEventParams, IBeginGameSessionParams, IEndGameEventParams, JobName, QueueName } from '@lib/queue';
import { GameEventsPublisherService, GameSessionsPublisherService } from '../../queue';
import { GameEventService } from './game-event.service';
import { calculateDelayByFutureTimestamp } from './helpers';

@Injectable()
@Processor(QueueName.GameEvents)
export class GameEventsQueueProcessorService extends WorkerHost {
  private readonly logger = new Logger(GameEventsQueueProcessorService.name, { timestamp: true });

  constructor(
    private readonly gameEventService: GameEventService,
    private readonly gameEventsPublisherService: GameEventsPublisherService,
    private readonly gameSessionsPublisherService: GameSessionsPublisherService,
  ) {
    super();
  }

  async process(job: Job, token?: string) {
    this.logger.debug(`Received job ${JSON.stringify(job)} with token ${token}`);

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const jobHandler = match(job.name)
      /* eslint-disable @typescript-eslint/no-unsafe-return */
      .with(JobName.BeginGameEvent, () => this.onGameEventBegin.bind(this))
      .with(JobName.EndGameEvent, () => this.onGameEventEnd.bind(this))
      /* eslint-enable @typescript-eslint/no-unsafe-return */
      .otherwise(() => {
        throw new Error(`Wrong routing for ${job.name}, check target queue`);
      });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return await jobHandler(job);
  }

  async onGameEventBegin(job: Job<IBeginGameEventParams>): Promise<GameEvent> {
    const gameEvent = await this.gameEventService.get({
      id: job.data.id,
      gameId: job.data.gameId,
    });

    if (gameEvent.isCancelled || gameEvent.isFinished) {
      // TODO Map errors to reach the goal of error understandability on the gateway side.
      throw new Error('The game event has illegal status');
    }

    // TODO Check other conditions

    const { id, finishAt, sessionsCountLimit, sessionDurationSeconds, simultaneousSessionsCount } = job.data;

    for (let sessionCount = 1; sessionCount <= simultaneousSessionsCount; sessionCount++) {
      const payload: IBeginGameSessionParams = {
        gameEventId: id,
        sessionDurationSeconds,
        sessionsCountLimit,
      };
      await this.gameSessionsPublisherService.publish(JobName.BeginGameSession, payload);
    }

    // Schedule the game event end moment.
    // It is no need to stop children sessions because of these sessions will stop automatically.
    const payload: IEndGameEventParams = {
      id,
      isCancelled: false,
    };
    const options: JobsOptions = { delay: calculateDelayByFutureTimestamp(finishAt) };
    await this.gameEventsPublisherService.publish(JobName.EndGameEvent, payload, options);

    return gameEvent;
  }

  async onGameEventEnd(job: Job<IEndGameEventParams>): Promise<GameEvent> {
    const gameEvent = await this.gameEventService.markGameEventAsFinished(job.data);
    // TODO remove pending jobs
    return gameEvent;
  }
}
