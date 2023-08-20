import { ApiExtraModels } from '@nestjs/swagger';

import { ListResultDto } from '@lib/utils';
import { WalletAccountDto } from './wallet-account.dto';

@ApiExtraModels(WalletAccountDto)
export class ListWalletAccountsDto extends ListResultDto<WalletAccountDto> {
  declare items: WalletAccountDto[];

  /**
   * Total count of items
   * @example 1
   */
  declare total: number;

  static create(items: ReadonlyArray<WalletAccountDto>, total: number): ListWalletAccountsDto {
    return Object.assign(new this(), {
      items,
      total,
    });
  }
}
