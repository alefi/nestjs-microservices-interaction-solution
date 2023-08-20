import { Module } from '@nestjs/common';

import { PrismaModule } from '@lib/db';
import { WalletGrpcController } from './wallet-grpc.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [PrismaModule],
  providers: [WalletService],
  controllers: [WalletGrpcController],
})
export class WalletModule {}
