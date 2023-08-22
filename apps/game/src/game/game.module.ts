import { Module } from '@nestjs/common';

import { PrismaModule } from '@lib/db';
import { GameGrpcController } from './game-grpc.controller';
import { GameService } from './game.service';
import { GameEventModule } from './event/game-event.module';

@Module({
  imports: [PrismaModule, GameEventModule],
  providers: [GameService],
  controllers: [GameGrpcController],
})
export class GameModule {}
