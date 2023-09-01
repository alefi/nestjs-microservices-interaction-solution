import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import {
  ApplyBidParamsDto,
  BeginGameEventParamsDto,
  EndGameEventParamsDto,
  GAME_SERVICE_NAME,
  GAME_SERVICE_V1_PACKAGE_NAME,
  GameBidDto,
  GameEventDto,
  GameServiceClient,
  GameSessionDto,
  GetGameBidParamsDto,
  GetGameEventParamsDto,
  GetGameSessionParamsDto,
  ListGameBidsParamsDto,
  ListGameBidsDto,
  ListGameEventsDto,
  ListGameEventsParamsDto,
  ListGameSessionsDto,
  ListGameSessionsParamsDto,
  ListGamesDto,
  ListGamesParamsDto,
} from '../typings/game_service.pb';

@Injectable()
export class GameServiceClientService implements GameServiceClient, OnModuleInit {
  private gameServiceClient: GameServiceClient;

  constructor(@Inject(GAME_SERVICE_V1_PACKAGE_NAME) private client: ClientGrpc) {}

  applyBid(request: ApplyBidParamsDto): Observable<GameBidDto> {
    return this.gameServiceClient.applyBid(request);
  }

  beginGameEvent(request: BeginGameEventParamsDto): Observable<GameEventDto> {
    return this.gameServiceClient.beginGameEvent(request);
  }

  endGameEvent(request: EndGameEventParamsDto): Observable<GameEventDto> {
    return this.gameServiceClient.endGameEvent(request);
  }

  getGameBidById(request: GetGameBidParamsDto): Observable<GameBidDto> {
    return this.gameServiceClient.getGameBidById(request);
  }

  getGameEventById(request: GetGameEventParamsDto): Observable<GameEventDto> {
    return this.gameServiceClient.getGameEventById(request);
  }

  getGameSessionById(request: GetGameSessionParamsDto): Observable<GameSessionDto> {
    return this.gameServiceClient.getGameSessionById(request);
  }

  listGameBids(request: ListGameBidsParamsDto): Observable<ListGameBidsDto> {
    return this.gameServiceClient.listGameBids(request);
  }

  listGameEvents(request: ListGameEventsParamsDto): Observable<ListGameEventsDto> {
    return this.gameServiceClient.listGameEvents(request);
  }

  listGameSessions(request: ListGameSessionsParamsDto): Observable<ListGameSessionsDto> {
    return this.gameServiceClient.listGameSessions(request);
  }

  listGames(request: ListGamesParamsDto): Observable<ListGamesDto> {
    return this.gameServiceClient.listGames(request);
  }

  onModuleInit(): void {
    this.gameServiceClient = this.client.getService<GameServiceClient>(GAME_SERVICE_NAME);
  }
}
