import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { WalletServiceClientService } from '@lib/grpc';
import { walletServiceGrpcClientOptions } from '../config';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

describe(WalletController.name, () => {
  let controller: WalletController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([walletServiceGrpcClientOptions])],
      providers: [WalletServiceClientService, WalletService],
      controllers: [WalletController],
    }).compile();

    controller = app.get<WalletController>(WalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#listWallets', () => {
    it.todo('should return wallet accounts of authorised user');
  });
});
