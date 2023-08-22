import { Module } from '@nestjs/common';

import { PrismaModule } from '@lib/db';
import { QueueModule } from '../../queue';
import { GameEventGrpcController } from './game-event-grpc.controller';
import { GameEventService } from './game-event.service';
import { GameSessionModule } from './session/game-session.module';

@Module({
  imports: [PrismaModule, QueueModule, GameSessionModule],
  providers: [GameEventService],
  controllers: [GameEventGrpcController],
})
export class GameEventModule {}
