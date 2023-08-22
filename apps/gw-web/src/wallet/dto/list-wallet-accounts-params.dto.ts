import { PartialType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

import { type WalletServiceV1 } from '@lib/grpc';
import { WalletAccountDto } from './wallet-account.dto';

export class ListWalletAccountsParamsDto
  extends PartialType(PickType(WalletAccountDto, ['isAvailable', 'userId']))
  implements WalletServiceV1.ListWalletAccountsParamsDto
{
  /**
   * Filter only available wallet accounts
   */
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  declare readonly isAvailable?: boolean;

  @Transform(({ value }) => String(value).toLocaleLowerCase())
  // TODO Remove a following line after an authorisation appears, remove `?` character below, and `userId` from type definition above
  @IsOptional()
  @IsUUID()
  declare readonly userId: string;
}
