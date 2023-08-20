/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "game_service.v1";

export interface GameDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListGamesParamsDto {
  isAvailable?: boolean | undefined;
}

export interface ListGamesDto {
  /** If items is empty, only total would be passed */
  items: GameDto[];
  total: number;
}

export const GAME_SERVICE_V1_PACKAGE_NAME = "game_service.v1";

export interface GameServiceClient {
  listGames(request: ListGamesParamsDto, metadata?: Metadata): Observable<ListGamesDto>;
}

export interface GameServiceController {
  listGames(
    request: ListGamesParamsDto,
    metadata?: Metadata,
  ): Promise<ListGamesDto> | Observable<ListGamesDto> | ListGamesDto;
}

export function GameServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["listGames"];
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
