import { GrpcMethod, GrpcService } from '@nestjs/microservices';

import { WalletServiceV1 } from '@lib/grpc';
import { ListWalletAccountsDto, WalletAccountDto } from './dto';
import { WalletService } from './wallet.service';

@GrpcService()
export class WalletGrpcController {
  constructor(private readonly walletService: WalletService) {}

  @GrpcMethod('WalletService')
  async listWallets(
    listWalletAccountsParams: WalletServiceV1.ListWalletAccountsParamsDto,
  ): Promise<ListWalletAccountsDto> {
    const [walletAccounts, total] = await this.walletService.listWallets(listWalletAccountsParams);
    const items = walletAccounts.map(wallet => WalletAccountDto.fromModel(wallet));
    return ListWalletAccountsDto.create(items, total);
  }
}
