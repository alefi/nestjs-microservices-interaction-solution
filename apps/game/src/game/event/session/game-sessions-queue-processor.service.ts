import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { type Job } from 'bullmq';
import { match } from 'ts-pattern';

import type { GameSession } from '@prisma/client';
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

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const jobHandler = match(job.name)
      /* eslint-disable @typescript-eslint/no-unsafe-return */
      .with(JobName.BeginGameSession, () => this.onGameSessionBegin.bind(this))
      .with(JobName.EndGameEvent, () => this.onGameSessionEnd.bind(this))
      /* eslint-enable @typescript-eslint/no-unsafe-return */
      .otherwise(() => {
        throw new Error(`Wrong routing for ${job.name}, check target queue`);
      });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return await jobHandler(job);
  }

  async onGameSessionBegin(job: Job<IBeginGameSessionParams>): Promise<GameSession> {
    const gameSession = await this.gameSessionService.beginGameSession(job.data);
    // While the game session is on, another process can handle tasks like making content and random numbers.
    return gameSession;
  }

  async onGameSessionEnd(job: Job<IEndGameSessionParams>): Promise<GameSession> {
    return await this.gameSessionService.endGameSession(job.data);
  }
}
