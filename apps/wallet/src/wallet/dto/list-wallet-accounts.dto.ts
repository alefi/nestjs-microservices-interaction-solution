import { ListResultDto } from '@lib/utils';
import { WalletAccountDto } from './wallet-account.dto';

export class ListWalletAccountsDto extends ListResultDto<WalletAccountDto> {
  declare readonly items: WalletAccountDto[];
  declare readonly total: number;

  static create(items: ReadonlyArray<WalletAccountDto>, total: number = items.length): ListWalletAccountsDto {
    return Object.assign(new this(), {
      items,
      total,
    });
  }
}
