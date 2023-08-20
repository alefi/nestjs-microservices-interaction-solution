import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { QueueService } from './queue.service';
import { QueueName } from './config';
import { GameSessionsQueueConsumerService } from './game-sessions-queue-consumer.service';

/**
 * @description For a development velocity reason, we bound this entire module to a single queue.
 * Note: Please don't forget it is a PoC project :)
 */
@Module({
  imports: [BullModule.registerQueue({ name: QueueName.GameSessions })],
  providers: [QueueService, GameSessionsQueueConsumerService],
  exports: [QueueService, GameSessionsQueueConsumerService],
})
export class QueueModule {}
