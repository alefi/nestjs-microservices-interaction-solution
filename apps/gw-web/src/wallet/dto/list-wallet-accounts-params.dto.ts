import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

import { WalletServiceV1 } from '@lib/grpc';
import { Transform } from 'class-transformer';

export class ListWalletAccountsParamsDto implements WalletServiceV1.ListWalletAccountsParamsDto {
  /**
   * Filter only available wallet accounts
   */
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  readonly isAvailable?: boolean;

  @Transform(({ value }) => String(value).toLocaleLowerCase())
  @IsOptional() // TODO Remove this line after an authorisation appears
  @IsUUID()
  readonly userId: string;
}
