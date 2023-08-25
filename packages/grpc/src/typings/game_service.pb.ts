/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { CurrencyAmountDto } from "./shared/struct.pb";

export const protobufPackage = "game_service.v1";

export interface ApplyBidParamsDto {
  gameSessionId: string;
  userId: string;
  /** To improve a development velocity, it is just a string. */
  value: string;
  currencyAmount: CurrencyAmountDto | undefined;
  walletAccountId?: string | undefined;
}

export interface BeginGameEventParamsDto {
  gameId: string;
  name?: string | undefined;
  displayName?: string | undefined;
  sessionDurationSeconds?: number | undefined;
  sessionsCountLimit?: number | undefined;
  simultaneousSessionsCount?: number | undefined;
  startAt: string;
  finishAt: string;
}

export interface EndGameEventParamsDto {
  id: string;
  gameId: string;
  isCancelled: boolean;
  cancellationReason?: string | undefined;
}

export interface GameBidDto {
  id: string;
  gameSessionId: string;
  walletEntryId: string;
  userId: string;
  /** Don't expose this to a client. */
  valueHash: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameEventDto {
  id: string;
  gameId: string;
  name?: string | undefined;
  displayName?: string | undefined;
  sessionDurationSeconds: number;
  sessionsCountLimit?: number | undefined;
  simultaneousSessionsCount: number;
  startAt: string;
  finishAt: string;
  cancellationReason?: string | undefined;
  isCancelled: boolean;
  isFinished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameDto {
  id: string;
  name: string;
  displayName?: string | undefined;
  simultaneousEventsCount: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameSessionDto {
  id: string;
  gameEventId: string;
  startAt: string;
  finishAt: string;
  isFinished: boolean;
  winningHash?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface GetGameBidParamsDto {
  id: string;
  gameSessionId: string;
  userId?: string | undefined;
}

export interface GetGameEventParamsDto {
  id: string;
  gameId: string;
}

export interface GetGameSessionParamsDto {
  id: string;
  gameEventId: string;
}

export interface ListGameEventsDto {
  /** If items is empty, only total would be passed */
  items: GameEventDto[];
  total: number;
}

export interface ListGameEventsParamsDto {
  gameId?: string | undefined;
  isCancelled?:
    | boolean
    | undefined;
  /** TODO add filtering range */
  isFinished?: boolean | undefined;
}

export interface ListGameSessionsParamsDto {
  gameEventId?:
    | string
    | undefined;
  /** TODO add filtering range */
  isFinished?: boolean | undefined;
}

export interface ListGameSessionsDto {
  /** If items is empty, only total would be passed */
  items: GameSessionDto[];
  total: number;
}

export interface ListGamesDto {
  /** If items is empty, only total would be passed */
  items: GameDto[];
  total: number;
}

export interface ListGamesParamsDto {
  isAvailable?: boolean | undefined;
}

export const GAME_SERVICE_V1_PACKAGE_NAME = "game_service.v1";

export interface GameServiceClient {
  applyBid(request: ApplyBidParamsDto, metadata?: Metadata): Observable<GameBidDto>;

  beginGameEvent(request: BeginGameEventParamsDto, metadata?: Metadata): Observable<GameEventDto>;

  endGameEvent(request: EndGameEventParamsDto, metadata?: Metadata): Observable<GameEventDto>;

  getGameBidById(request: GetGameBidParamsDto, metadata?: Metadata): Observable<GameBidDto>;

  getGameEventById(request: GetGameEventParamsDto, metadata?: Metadata): Observable<GameEventDto>;

  getGameSessionById(request: GetGameSessionParamsDto, metadata?: Metadata): Observable<GameSessionDto>;

  listGameEvents(request: ListGameEventsParamsDto, metadata?: Metadata): Observable<ListGameEventsDto>;

  listGameSessions(request: ListGameSessionsParamsDto, metadata?: Metadata): Observable<ListGameSessionsDto>;

  listGames(request: ListGamesParamsDto, metadata?: Metadata): Observable<ListGamesDto>;
}

export interface GameServiceController {
  applyBid(request: ApplyBidParamsDto, metadata?: Metadata): Promise<GameBidDto> | Observable<GameBidDto> | GameBidDto;

  beginGameEvent(
    request: BeginGameEventParamsDto,
    metadata?: Metadata,
  ): Promise<GameEventDto> | Observable<GameEventDto> | GameEventDto;

  endGameEvent(
    request: EndGameEventParamsDto,
    metadata?: Metadata,
  ): Promise<GameEventDto> | Observable<GameEventDto> | GameEventDto;

  getGameBidById(
    request: GetGameBidParamsDto,
    metadata?: Metadata,
  ): Promise<GameBidDto> | Observable<GameBidDto> | GameBidDto;

  getGameEventById(
    request: GetGameEventParamsDto,
    metadata?: Metadata,
  ): Promise<GameEventDto> | Observable<GameEventDto> | GameEventDto;

  getGameSessionById(
    request: GetGameSessionParamsDto,
    metadata?: Metadata,
  ): Promise<GameSessionDto> | Observable<GameSessionDto> | GameSessionDto;

  listGameEvents(
    request: ListGameEventsParamsDto,
    metadata?: Metadata,
  ): Promise<ListGameEventsDto> | Observable<ListGameEventsDto> | ListGameEventsDto;

  listGameSessions(
    request: ListGameSessionsParamsDto,
    metadata?: Metadata,
  ): Promise<ListGameSessionsDto> | Observable<ListGameSessionsDto> | ListGameSessionsDto;

  listGames(
    request: ListGamesParamsDto,
    metadata?: Metadata,
  ): Promise<ListGamesDto> | Observable<ListGamesDto> | ListGamesDto;
}

export function GameServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "applyBid",
      "beginGameEvent",
      "endGameEvent",
      "getGameBidById",
      "getGameEventById",
      "getGameSessionById",
      "listGameEvents",
      "listGameSessions",
      "listGames",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("GameService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("GameService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const GAME_SERVICE_NAME = "GameService";
