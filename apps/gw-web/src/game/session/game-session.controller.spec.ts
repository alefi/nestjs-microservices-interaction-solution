import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { GameServiceClientService } from '@lib/grpc';
import { gameServiceGrpcClientOptions } from '../../config';
import { GameSessionController } from './game-session.controller';
import { GameSessionService } from './game-session.service';

describe(GameSessionController.name, () => {
  let controller: GameSessionController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([gameServiceGrpcClientOptions])],
      providers: [GameServiceClientService, GameSessionService],
      controllers: [GameSessionController],
    }).compile();

    controller = app.get<GameSessionController>(GameSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#listGames', () => {
    it.todo('should return game session list');
  });
});
