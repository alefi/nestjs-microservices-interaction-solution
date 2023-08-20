import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { WalletServiceClientService } from '@lib/grpc';
import { walletServiceGrpcClientOptions } from '../config';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [ClientsModule.register([walletServiceGrpcClientOptions])],
  providers: [WalletServiceClientService, WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
