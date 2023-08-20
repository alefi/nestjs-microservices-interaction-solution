import { Module } from '@nestjs/common';

import { PrismaModule } from '@lib/db';
import { GameGrpcController } from './game-grpc.controller';
import { GameService } from './game.service';

@Module({
  imports: [PrismaModule],
  providers: [GameService],
  controllers: [GameGrpcController],
})
export class GameModule {}
