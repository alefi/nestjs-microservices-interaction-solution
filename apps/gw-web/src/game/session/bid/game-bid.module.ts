import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { GameServiceClientService } from '@lib/grpc';
import { gameServiceGrpcClientOptions } from '../../../config';
import { GameBidController } from './game-bid.controller';
import { GameBidService } from './game-bid.service';

@Module({
  // TODO Create a dynamic module somewhere else to avoid multi-registering.
  imports: [ClientsModule.register([gameServiceGrpcClientOptions])],
  providers: [GameServiceClientService, GameBidService],
  controllers: [GameBidController],
})
export class GameBidModule {}
