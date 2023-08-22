import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { GameServiceClientService } from '@lib/grpc';
import { gameServiceGrpcClientOptions } from '../../config';
import { GameBidModule } from './bid';
import { GameSessionController } from './game-session.controller';
import { GameSessionService } from './game-session.service';

@Module({
  // TODO Create a dynamic module somewhere else to avoid multi-registering.
  imports: [ClientsModule.register([gameServiceGrpcClientOptions]), GameBidModule],
  providers: [GameServiceClientService, GameSessionService],
  controllers: [GameSessionController],
})
export class GameSessionModule {}
