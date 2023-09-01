import { GrpcMethod, GrpcService } from '@nestjs/microservices';

import { WalletServiceV1 } from '@lib/grpc';
import { OperationResultDto } from '@lib/utils';
import { AuthoriseFundsResultDto, ListWalletAccountsDto, WalletAccountDto } from './dto';
import { WalletService } from './wallet.service';

@GrpcService()
export class WalletGrpcController {
  constructor(private readonly walletService: WalletService) {}

  @GrpcMethod('WalletService')
  async authoriseFunds(
    authoriseFundsParams: WalletServiceV1.AuthoriseFundsParamsDto,
  ): Promise<AuthoriseFundsResultDto> {
    const walletEntry = await this.walletService.authoriseFunds(authoriseFundsParams);
    return AuthoriseFundsResultDto.create(walletEntry);
  }

  @GrpcMethod('WalletService')
  async commitFunds(commitFundsParams: WalletServiceV1.CommitFundsParamsDto): Promise<OperationResultDto> {
    const walletEntry = await this.walletService.commitFunds(commitFundsParams);
    return OperationResultDto.create(walletEntry);
  }

  @GrpcMethod('WalletService')
  async listWallets(
    listWalletAccountsParams: WalletServiceV1.ListWalletAccountsParamsDto,
  ): Promise<ListWalletAccountsDto> {
    const [walletAccounts, total] = await this.walletService.listWallets(listWalletAccountsParams);
    const items = walletAccounts.map(wallet => WalletAccountDto.fromModel(wallet));
    return ListWalletAccountsDto.create(items, total);
  }

  @GrpcMethod('WalletService')
  async releaseFunds(releaseFundsParams: WalletServiceV1.ReleaseFundsParamsDto): Promise<OperationResultDto> {
    const walletEntry = await this.walletService.releaseFunds(releaseFundsParams);
    return OperationResultDto.create(walletEntry);
  }
}
