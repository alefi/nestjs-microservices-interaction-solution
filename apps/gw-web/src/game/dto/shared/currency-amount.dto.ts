import { IsNumberString, IsString } from 'class-validator';

import { type StructV1 } from '@lib/grpc';

export class CurrencyAmountDto implements StructV1.CurrencyAmountDto {
  @IsString()
  readonly currency: string;

  @IsNumberString()
  readonly amount: string;
}
