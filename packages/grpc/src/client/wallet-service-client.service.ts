import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { OperationResultDto } from '../typings/shared/struct.pb';
import {
  AuthoriseFundsParamsDto,
  AuthoriseFundsResultDto,
  CommitFundsParamsDto,
  ListWalletAccountsDto,
  ListWalletAccountsParamsDto,
  ReleaseFundsParamsDto,
  WALLET_SERVICE_NAME,
  WALLET_SERVICE_V1_PACKAGE_NAME,
  WalletServiceClient,
} from '../typings/wallet_service.pb';

@Injectable()
export class WalletServiceClientService implements WalletServiceClient, OnModuleInit {
  private walletServiceClient: WalletServiceClient;

  constructor(@Inject(WALLET_SERVICE_V1_PACKAGE_NAME) private client: ClientGrpc) {}

  authoriseFunds(request: AuthoriseFundsParamsDto): Observable<AuthoriseFundsResultDto> {
    return this.walletServiceClient.authoriseFunds(request);
  }

  commitFunds(request: CommitFundsParamsDto): Observable<OperationResultDto> {
    return this.walletServiceClient.commitFunds(request);
  }

  listWallets(request: ListWalletAccountsParamsDto): Observable<ListWalletAccountsDto> {
    return this.walletServiceClient.listWallets(request);
  }

  releaseFunds(request: ReleaseFundsParamsDto): Observable<OperationResultDto> {
    return this.walletServiceClient.releaseFunds(request);
  }

  onModuleInit(): void {
    this.walletServiceClient = this.client.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }
}
