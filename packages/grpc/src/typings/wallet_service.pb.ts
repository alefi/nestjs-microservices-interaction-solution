/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { OperationResultDto } from "./shared/struct.pb";

export const protobufPackage = "wallet_service.v1";

export interface AuthoriseFundsParamsDto {
  userId: string;
  reference: string;
  currency: string;
  amount: string;
}

export interface CommitFundsParamsDto {
  walletEntryId: string;
}

export interface ListWalletAccountsDto {
  /** If items is empty, only total would be passed */
  items: WalletAccountDto[];
  total: number;
}

export interface ListWalletAccountsParamsDto {
  userId: string;
  isAvailable?: boolean | undefined;
}

export interface ReleaseFundsParamsDto {
  walletEntryId: string;
}

export interface WalletAccountDto {
  id: string;
  currency: string;
  amount: string;
  authorisedAmount: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export const WALLET_SERVICE_V1_PACKAGE_NAME = "wallet_service.v1";

export interface WalletServiceClient {
  authorizeFunds(request: AuthoriseFundsParamsDto, metadata?: Metadata): Observable<OperationResultDto>;

  commitFunds(request: CommitFundsParamsDto, metadata?: Metadata): Observable<OperationResultDto>;

  listWallets(request: ListWalletAccountsParamsDto, metadata?: Metadata): Observable<ListWalletAccountsDto>;

  releaseFunds(request: ReleaseFundsParamsDto, metadata?: Metadata): Observable<OperationResultDto>;
}

export interface WalletServiceController {
  authorizeFunds(
    request: AuthoriseFundsParamsDto,
    metadata?: Metadata,
  ): Promise<OperationResultDto> | Observable<OperationResultDto> | OperationResultDto;

  commitFunds(
    request: CommitFundsParamsDto,
    metadata?: Metadata,
  ): Promise<OperationResultDto> | Observable<OperationResultDto> | OperationResultDto;

  listWallets(
    request: ListWalletAccountsParamsDto,
    metadata?: Metadata,
  ): Promise<ListWalletAccountsDto> | Observable<ListWalletAccountsDto> | ListWalletAccountsDto;

  releaseFunds(
    request: ReleaseFundsParamsDto,
    metadata?: Metadata,
  ): Promise<OperationResultDto> | Observable<OperationResultDto> | OperationResultDto;
}

export function WalletServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["authorizeFunds", "commitFunds", "listWallets", "releaseFunds"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("WalletService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("WalletService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const WALLET_SERVICE_NAME = "WalletService";
