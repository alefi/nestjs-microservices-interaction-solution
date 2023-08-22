/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";
import { Struct } from "./google/protobuf/struct.pb";
import { CurrencyAmountDto } from "./shared/struct.pb";

export const protobufPackage = "game_service.v1";

export interface ApplyBidParamsDto {
  gameSessionId: string;
  userId: string;
  /** Each game has its own value model */
  value: { [key: string]: any } | undefined;
  currencyAmount: CurrencyAmountDto | undefined;
  walletAccountId?: string | undefined;
}

export interface BeginGameEventParamsDto {
  gameId: string;
  name?: string | undefined;
  displayName?: string | undefined;
  defaultSessionDurationSeconds?: number | undefined;
  sessionsCountLimit?: number | undefined;
  simultaneousSessionsCount?: number | undefined;
  startAt: string;
  finishAt: string;
}

export interface EndGameEventParamsDto {
  id: string;
  gameId: string;
  cancellationReason?: string | undefined;
}

export interface GameBidDto {
  id: string;
  gameSessionId: string;
  walletEntryId: string;
  /** Don't return this to a client. */
  bidHash: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameEventDto {
  id: string;
  gameId: string;
  name?: string | undefined;
  displayName?: string | undefined;
  defaultSessionDurationSeconds: number;
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

export interface GetGameEventParamsDto {
  id: string;
  gameId: string;
}

export interface ListGameEventsDto {
  /** If items is empty, only total would be passed */
  items: GameEventDto[];
  total: number;
}

export interface ListGameEventsParamsDto {
  gameId?:
    | string
    | undefined;
  /** TODO add filtering range */
  isFinished?: boolean | undefined;
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

wrappers[".google.protobuf.Struct"] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface GameServiceClient {
  applyBid(request: ApplyBidParamsDto, metadata?: Metadata): Observable<GameBidDto>;

  beginGameEvent(request: BeginGameEventParamsDto, metadata?: Metadata): Observable<GameEventDto>;

  endGameEvent(request: EndGameEventParamsDto, metadata?: Metadata): Observable<GameEventDto>;

  getGameEventById(request: GetGameEventParamsDto, metadata?: Metadata): Observable<GameEventDto>;

  listGameEvents(request: ListGameEventsParamsDto, metadata?: Metadata): Observable<ListGameEventsDto>;

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

  getGameEventById(
    request: GetGameEventParamsDto,
    metadata?: Metadata,
  ): Promise<GameEventDto> | Observable<GameEventDto> | GameEventDto;

  listGameEvents(
    request: ListGameEventsParamsDto,
    metadata?: Metadata,
  ): Promise<ListGameEventsDto> | Observable<ListGameEventsDto> | ListGameEventsDto;

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
      "getGameEventById",
      "listGameEvents",
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
