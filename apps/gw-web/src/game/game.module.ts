import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { GameServiceClientService } from '@lib/grpc';
import { gameServiceGrpcClientOptions } from '../config';
import { GameEventModule } from './event';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameSessionModule } from './session';

@Module({
  // TODO Create a dynamic module somewhere else to avoid multi-registering.
  imports: [ClientsModule.register([gameServiceGrpcClientOptions]), GameEventModule, GameSessionModule],
  providers: [GameServiceClientService, GameService],
  controllers: [GameController],
})
export class GameModule {}
