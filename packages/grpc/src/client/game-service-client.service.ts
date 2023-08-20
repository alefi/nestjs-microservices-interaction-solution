import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import {
  GAME_SERVICE_NAME,
  GAME_SERVICE_V1_PACKAGE_NAME,
  GameServiceClient,
  ListGamesDto,
  ListGamesParamsDto,
} from '../typings/game_service.pb';

@Injectable()
export class GameServiceClientService implements GameServiceClient, OnModuleInit {
  private gameServiceClient: GameServiceClient;

  constructor(@Inject(GAME_SERVICE_V1_PACKAGE_NAME) private client: ClientGrpc) {}

  listGames(request: ListGamesParamsDto): Observable<ListGamesDto> {
    return this.gameServiceClient.listGames(request);
  }

  onModuleInit(): void {
    this.gameServiceClient = this.client.getService<GameServiceClient>(GAME_SERVICE_NAME);
  }
}
