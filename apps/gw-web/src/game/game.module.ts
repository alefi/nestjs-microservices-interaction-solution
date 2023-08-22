import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { GameServiceClientService } from '@lib/grpc';
import { gameServiceGrpcClientOptions } from '../config';
import { GameEventModule } from './event';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameBidModule } from './bid';

@Module({
  // TODO Create a dynamic module somewhere else to avoid multi-registering.
  imports: [ClientsModule.register([gameServiceGrpcClientOptions]), GameBidModule, GameEventModule],
  providers: [GameServiceClientService, GameService],
  controllers: [GameController],
})
export class GameModule {}
