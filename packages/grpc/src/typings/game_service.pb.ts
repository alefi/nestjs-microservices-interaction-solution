/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { CurrencyAmountDto, GetEntityByIdParamsDto, OperationResultDto } from "./shared/struct.pb";

export const protobufPackage = "game_service.v1";

export interface ApplyBidParamsDto {
  gameSessionId: string;
  userId: string;
  walletAccountId?: string | undefined;
  currencyAmount: CurrencyAmountDto | undefined;
}

export interface BeginGameEventParamsDto {
  gameId: string;
  name?: string | undefined;
  displayName?: string | undefined;
  simultaneousSessionsCount: number;
  startAt: string;
  finishAt: string;
}

export interface EndGameEventParamsDto {
  id: string;
}

export interface GameEventDto {
  id: string;
  gameId: string;
  name?: string | undefined;
  displayName?: string | undefined;
  simultaneousSessionsCount: number;
  startAt: string;
  finishAt: string;
  isFinished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
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

export interface GameServiceClient {
  applyBid(request: ApplyBidParamsDto, metadata?: Metadata): Observable<OperationResultDto>;

  beginGameEvent(request: BeginGameEventParamsDto, metadata?: Metadata): Observable<GameEventDto>;

  endGameEvent(request: EndGameEventParamsDto, metadata?: Metadata): Observable<GameEventDto>;

  getGameEventById(request: GetEntityByIdParamsDto, metadata?: Metadata): Observable<GameEventDto>;

  listGameEvents(request: ListGameEventsParamsDto, metadata?: Metadata): Observable<ListGameEventsDto>;

  listGames(request: ListGamesParamsDto, metadata?: Metadata): Observable<ListGamesDto>;
}

export interface GameServiceController {
  applyBid(
    request: ApplyBidParamsDto,
    metadata?: Metadata,
  ): Promise<OperationResultDto> | Observable<OperationResultDto> | OperationResultDto;

  beginGameEvent(
    request: BeginGameEventParamsDto,
    metadata?: Metadata,
  ): Promise<GameEventDto> | Observable<GameEventDto> | GameEventDto;

  endGameEvent(
    request: EndGameEventParamsDto,
    metadata?: Metadata,
  ): Promise<GameEventDto> | Observable<GameEventDto> | GameEventDto;

  getGameEventById(
    request: GetEntityByIdParamsDto,
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
