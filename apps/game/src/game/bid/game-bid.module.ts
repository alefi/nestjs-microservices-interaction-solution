import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { PrismaModule } from '@lib/db';
import { WalletServiceClientService } from '@lib/grpc';
import { walletServiceGrpcClientOptions } from '../../config';
import { GameBidGrpcController } from './game-bid-grpc.controller';
import { GameBidService } from './game-bid.service';

@Module({
  imports: [PrismaModule, ClientsModule.register([walletServiceGrpcClientOptions])],
  providers: [WalletServiceClientService, GameBidService],
  controllers: [GameBidGrpcController],
})
export class GameBidModule {}
