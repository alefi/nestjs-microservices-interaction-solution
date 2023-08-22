import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { GameServiceClientService } from '@lib/grpc';
import { gameServiceGrpcClientOptions } from '../../../config';
import { GameBidController } from './game-bid.controller';
import { GameBidService } from './game-bid.service';

describe(GameBidController.name, () => {
  let controller: GameBidController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([gameServiceGrpcClientOptions])],
      providers: [GameServiceClientService, GameBidService],
      controllers: [GameBidController],
    }).compile();

    controller = app.get<GameBidController>(GameBidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#applyBid', () => {
    it.todo('should apply a bid');
  });
});
