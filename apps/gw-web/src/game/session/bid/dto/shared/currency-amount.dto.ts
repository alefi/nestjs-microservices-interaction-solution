import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString } from 'class-validator';

import { Currency } from '@lib/utils';

export class CurrencyAmountDto {
  @ApiProperty({
    enum: Currency,
    example: Currency.USD,
  })
  @IsEnum(Object.values(Currency))
  readonly currency: string;

  /**
   * @example: '100.55'
   */
  @IsNumberString()
  readonly amount: string;
}
