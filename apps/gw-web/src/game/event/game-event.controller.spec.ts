import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { GameServiceClientService } from '@lib/grpc';
import { gameServiceGrpcClientOptions } from '../../config';
import { GameEventController } from './game-event.controller';
import { GameEventService } from './game-event.service';

describe(GameEventController.name, () => {
  let controller: GameEventController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([gameServiceGrpcClientOptions])],
      providers: [GameServiceClientService, GameEventService],
      controllers: [GameEventController],
    }).compile();

    controller = app.get<GameEventController>(GameEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#listGames', () => {
    it.todo('should return game event list');
  });
});
