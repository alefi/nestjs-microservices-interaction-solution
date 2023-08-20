import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { GameServiceClientService } from '@lib/grpc';
import { gameServiceGrpcClientOptions } from '../config';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [ClientsModule.register([gameServiceGrpcClientOptions])],
  providers: [GameServiceClientService, GameService],
  controllers: [GameController],
})
export class GameModule {}
