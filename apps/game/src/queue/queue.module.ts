import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { QueueName } from '@lib/queue';
import { GameSessionsPublisherService } from './game-sessions-publisher.service';
import { GameEventsPublisherService } from './game-events-publisher.service';
import { GameBidsPublisherService } from '.';

/**
 * @description For a development velocity reason, we bound this entire module to a couple of queue.
 * Note: Please don't forget it is a PoC project :)
 */
@Module({
  imports: [
    BullModule.registerQueue(
      { name: QueueName.GameBids },
      { name: QueueName.GameEvents },
      { name: QueueName.GameSessions },
    ),
  ],
  providers: [GameBidsPublisherService, GameEventsPublisherService, GameSessionsPublisherService],
  exports: [GameBidsPublisherService, GameEventsPublisherService, GameSessionsPublisherService],
})
export class QueueModule {}
