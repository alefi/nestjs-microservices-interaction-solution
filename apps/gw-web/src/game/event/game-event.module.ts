import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { GameServiceClientService } from '@lib/grpc';
import { gameServiceGrpcClientOptions } from '../../config';
import { GameEventController } from './game-event.controller';
import { GameEventService } from './game-event.service';

@Module({
  // TODO Create a dynamic module somewhere else to avoid multi-registering.
  imports: [ClientsModule.register([gameServiceGrpcClientOptions])],
  providers: [GameServiceClientService, GameEventService],
  controllers: [GameEventController],
})
export class GameEventModule {}
