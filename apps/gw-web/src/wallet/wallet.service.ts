import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { WalletServiceClientService, type WalletServiceV1 } from '@lib/grpc';
import { ListWalletAccountsParamsDto } from './dto';

@Injectable()
export class WalletService {
  private readonly logger = new Logger('WalletService', { timestamp: true });

  constructor(private readonly walletServiceClientService: WalletServiceClientService) {}

  async listWallets(
    listWalletAccountsParams: ListWalletAccountsParamsDto,
  ): Promise<WalletServiceV1.ListWalletAccountsDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(listWalletAccountsParams));
    return await firstValueFrom(this.walletServiceClientService.listWallets(listWalletAccountsParams));
  }
}
