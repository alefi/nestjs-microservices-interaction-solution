import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { match } from 'ts-pattern';

import type { GameSession } from '@prisma/client';
import { IProcessGameBidParams, IProcessGameBidsParams, JobName, QueueName } from '@lib/queue';
import { GameBidService } from './game-bid.service';

@Injectable()
@Processor(QueueName.GameBids)
export class GameBidsQueueProcessorService extends WorkerHost {
  private readonly logger = new Logger(GameBidsQueueProcessorService.name, { timestamp: true });

  constructor(private readonly gameBidService: GameBidService) {
    super();
  }

  async process(job: Job, token?: string) {
    this.logger.debug(`Received job ${JSON.stringify(job)} with token ${token}`);

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const jobHandler = match(job.name)
      /* eslint-disable @typescript-eslint/no-unsafe-return */
      .with(JobName.ProcessGameBids, () => this.onProcessGameBids.bind(this))
      .with(JobName.ProcessLosingGameBid, () => this.onProcessLosingGameBid.bind(this))
      .with(JobName.ProcessWinningGameBid, () => this.onProcessWinningGameBid.bind(this))
      /* eslint-enable @typescript-eslint/no-unsafe-return */
      .otherwise(() => {
        throw new Error(`Wrong routing for ${job.name}, check target queue`);
      });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return await jobHandler(job);
  }

  /**
   * This method is a starting point for a tribute processing of game session according a specific game rules.
   * Since we haven't got any rules here in the project, this mechanics is not implemented.
   */
  async onProcessGameBids(job: Job<IProcessGameBidsParams>) {
    const childrenValues = await job.getChildrenValues();
    const [{ winningHash }] = Object.values<GameSession>(childrenValues);

    return await this.gameBidService.processBids(job.data, { winningHash });
  }

  async onProcessLosingGameBid(job: Job<IProcessGameBidParams>) {
    return await this.gameBidService.processLosingBid(job.data);
  }

  async onProcessWinningGameBid(job: Job<IProcessGameBidParams>) {
    return await this.gameBidService.processLosingBid(job.data);
  }
}
