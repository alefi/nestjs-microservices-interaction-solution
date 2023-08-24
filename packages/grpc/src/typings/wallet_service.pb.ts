/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { CurrencyAmountDto, OperationResultDto } from "./shared/struct.pb";

export const protobufPackage = "wallet_service.v1";

export interface AuthoriseFundsParamsDto {
  userId: string;
  reference: string;
  currencyAmount:
    | CurrencyAmountDto
    | undefined;
  /** If not provided, the service will try to detect the correct wallet account by itself. */
  walletAccountId?: string | undefined;
}

export interface AuthorizeFundsResultDto {
  walletAccountId: string;
  walletEntryId: string;
  state: string;
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
  userId: string;
  currency: string;
  /** calculated */
  amount: string;
  /** calculated */
  authorisedAmount: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Currently, the code uses this message only for inheritance. */
export interface WalletEntryDto {
  id: string;
  walletAccountId: string;
  reference: string;
  amount: string;
  state: string;
  status: string;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const WALLET_SERVICE_V1_PACKAGE_NAME = "wallet_service.v1";

export interface WalletServiceClient {
  authorizeFunds(request: AuthoriseFundsParamsDto, metadata?: Metadata): Observable<AuthorizeFundsResultDto>;

  commitFunds(request: CommitFundsParamsDto, metadata?: Metadata): Observable<OperationResultDto>;

  listWallets(request: ListWalletAccountsParamsDto, metadata?: Metadata): Observable<ListWalletAccountsDto>;

  releaseFunds(request: ReleaseFundsParamsDto, metadata?: Metadata): Observable<OperationResultDto>;
}

export interface WalletServiceController {
  authorizeFunds(
    request: AuthoriseFundsParamsDto,
    metadata?: Metadata,
  ): Promise<AuthorizeFundsResultDto> | Observable<AuthorizeFundsResultDto> | AuthorizeFundsResultDto;

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
