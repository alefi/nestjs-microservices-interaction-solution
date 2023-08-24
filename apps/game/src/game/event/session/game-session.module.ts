import { Module } from '@nestjs/common';

import { PrismaModule } from '@lib/db';
import { QueueModule } from '../../../queue';
import { GameSessionService } from './game-session.service';
import { GameSessionGrpcController } from './game-session-grpc.controller';
import { GameSessionsQueueProcessorService } from './game-sessions-queue-processor.service';

@Module({
  imports: [PrismaModule, QueueModule],
  providers: [GameSessionsQueueProcessorService, GameSessionService],
  controllers: [GameSessionGrpcController],
})
export class GameSessionModule {}
