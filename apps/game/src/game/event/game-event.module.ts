import { Module } from '@nestjs/common';

import { PrismaModule } from '@lib/db';
import { QueueModule } from '../../queue';
import { GameEventGrpcController } from './game-event-grpc.controller';
import { GameEventService } from './game-event.service';
import { GameSessionModule } from './session/game-session.module';
import { GameEventsQueueProcessorService } from './game-events-queue-processor.service';

@Module({
  imports: [PrismaModule, QueueModule, GameSessionModule],
  providers: [GameEventsQueueProcessorService, GameEventService],
  controllers: [GameEventGrpcController],
})
export class GameEventModule {}
