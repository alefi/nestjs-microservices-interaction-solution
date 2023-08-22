import { Module } from '@nestjs/common';

import { PrismaModule } from '@lib/db';
import { GameSessionService } from './game-session.service';
import { GameSessionGrpcController } from './game-session-grpc.controller';

@Module({
  imports: [PrismaModule],
  providers: [GameSessionService],
  controllers: [GameSessionGrpcController],
})
export class GameSessionModule {}
