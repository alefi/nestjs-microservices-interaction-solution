import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { type Job } from 'bullmq';
import { match } from 'ts-pattern';

import { IBeginGameSessionParams, IEndGameSessionParams, JobName, QueueName } from '@lib/queue';
import { GameSessionService } from './game-session.service';

@Injectable()
@Processor(QueueName.GameSessions)
export class GameSessionsQueueProcessorService extends WorkerHost {
  private readonly logger = new Logger(GameSessionsQueueProcessorService.name, { timestamp: true });

  constructor(private readonly gameSessionService: GameSessionService) {
    super();
  }

  async process(job: Job, token?: string) {
    this.logger.debug(`Received job ${JSON.stringify(job)} with token ${token}`);

    const jobHandler = match(job.name)
      /* eslint-disable @typescript-eslint/unbound-method */
      .with(JobName.BeginGameSession, () => this.onGameSessionBegin)
      .with(JobName.EndGameEvent, () => this.onGameSessionEnd)
      /* eslint-enable @typescript-eslint/unbound-method */
      .otherwise(() => {
        throw new Error(`Wrong routing for ${job.name}, check target queue`);
      });

    return await jobHandler(job);
  }

  async onGameSessionBegin(job: Job<IBeginGameSessionParams>) {
    const gameSession = await this.gameSessionService.beginGameSession(job.data);
    // While the game session is on, another process can handle tasks like making content and random numbers.
    return gameSession;
  }

  async onGameSessionEnd(job: Job<IEndGameSessionParams>) {
    return await this.gameSessionService.endGameSession(job.data);
  }
}
