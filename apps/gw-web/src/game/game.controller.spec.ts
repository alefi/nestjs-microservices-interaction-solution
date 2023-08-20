import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { GameServiceClientService } from '@lib/grpc';
import { gameServiceGrpcClientOptions } from '../config';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe(GameController.name, () => {
  let controller: GameController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([gameServiceGrpcClientOptions])],
      providers: [GameServiceClientService, GameService],
      controllers: [GameController],
    }).compile();

    controller = app.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#listGames', () => {
    it.todo('should return game list');
  });
});
