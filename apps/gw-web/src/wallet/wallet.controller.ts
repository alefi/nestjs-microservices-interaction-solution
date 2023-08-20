import { Controller, Get, Headers, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { tempAuthHeader } from '@lib/utils';
import { WalletService } from './wallet.service';
import { ListWalletAccountsDto, ListWalletAccountsParamsDto, WalletAccountDto } from './dto';

@ApiTags('wallets')
@Controller('/v1/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * @description Since this project doesn't have an authorisation at all, x-user-id should be provided by a client (of course, this approach is not ready for production).
   * TODO Make a JWT authorisation based auth service, and get rid of this approach.
   */
  @ApiResponse({ status: HttpStatus.OK, type: ListWalletAccountsDto })
  @Get()
  async listWallets(
    @Headers(tempAuthHeader) userId: string,
    @Query() listWalletAccountsParams: ListWalletAccountsParamsDto,
  ): Promise<ListWalletAccountsDto> {
    const walletList = await this.walletService.listWallets({
      ...listWalletAccountsParams,
      userId,
    });
    const items = walletList.items.map(game => WalletAccountDto.create(game));
    return ListWalletAccountsDto.create(items, walletList.total);
  }
}
