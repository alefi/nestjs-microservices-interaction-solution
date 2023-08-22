import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { OperationResultDto } from '../typings/shared/struct.pb';
import {
  ApplyBidParamsDto,
  BeginGameEventParamsDto,
  EndGameEventParamsDto,
  GAME_SERVICE_NAME,
  GAME_SERVICE_V1_PACKAGE_NAME,
  GameEventDto,
  GameServiceClient,
  GetGameEventParamsDto,
  ListGameEventsDto,
  ListGameEventsParamsDto,
  ListGamesDto,
  ListGamesParamsDto,
} from '../typings/game_service.pb';

@Injectable()
export class GameServiceClientService implements GameServiceClient, OnModuleInit {
  private gameServiceClient: GameServiceClient;

  constructor(@Inject(GAME_SERVICE_V1_PACKAGE_NAME) private client: ClientGrpc) {}

  applyBid(request: ApplyBidParamsDto): Observable<OperationResultDto> {
    return this.gameServiceClient.applyBid(request);
  }

  beginGameEvent(request: BeginGameEventParamsDto): Observable<GameEventDto> {
    return this.gameServiceClient.beginGameEvent(request);
  }

  endGameEvent(request: EndGameEventParamsDto): Observable<GameEventDto> {
    return this.gameServiceClient.endGameEvent(request);
  }

  getGameEventById(request: GetGameEventParamsDto): Observable<GameEventDto> {
    return this.gameServiceClient.getGameEventById(request);
  }

  listGameEvents(request: ListGameEventsParamsDto): Observable<ListGameEventsDto> {
    return this.gameServiceClient.listGameEvents(request);
  }

  listGames(request: ListGamesParamsDto): Observable<ListGamesDto> {
    return this.gameServiceClient.listGames(request);
  }

  onModuleInit(): void {
    this.gameServiceClient = this.client.getService<GameServiceClient>(GAME_SERVICE_NAME);
  }
}
