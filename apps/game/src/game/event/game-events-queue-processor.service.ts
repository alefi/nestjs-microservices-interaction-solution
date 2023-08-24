import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { type Job } from 'bullmq';
import { match } from 'ts-pattern';

import { IBeginGameEventParams, IBeginGameSessionParams, IEndGameEventParams, JobName, QueueName } from '@lib/queue';
import { GameEventsPublisherService, GameSessionsPublisherService } from '../../queue';
import { GameEventService } from './game-event.service';

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

    const jobHandler = match(job.name)
      /* eslint-disable @typescript-eslint/unbound-method */
      .with(JobName.BeginGameEvent, () => this.onGameEventBegin)
      .with(JobName.EndGameEvent, () => this.onGameEventEnd)
      /* eslint-enable @typescript-eslint/unbound-method */
      .otherwise(() => {
        throw new Error(`Wrong routing for ${job.name}, check target queue`);
      });

    return await jobHandler(job);
  }

  async onGameEventBegin(job: Job<IBeginGameEventParams>) {
    const gameEvent = await this.gameEventService.get({
      id: job.data.id,
      gameId: job.data.gameId,
    });

    if (gameEvent.isCancelled || gameEvent.isFinished) {
      throw new Error('The game event has illegal status');
    }

    // TODO Check other conditions

    const { id, sessionsCountLimit, sessionDurationSeconds, simultaneousSessionsCount } = job.data;

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
    return await this.gameEventsPublisherService.publish(JobName.EndGameEvent, <IEndGameEventParams>{
      id,
      isCancelled: false,
    });
  }

  async onGameEventEnd(job: Job<IEndGameEventParams>) {
    // TODO wrap into Tx
    const gameEvent = await this.gameEventService.markGameEventAsFinished(job.data);
    // TODO remove pending jobs
    return gameEvent;
  }
}
