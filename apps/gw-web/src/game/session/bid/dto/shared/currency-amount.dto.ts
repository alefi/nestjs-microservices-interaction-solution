import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString } from 'class-validator';

import { Currency } from '@lib/db';
import { type StructV1 } from '@lib/grpc';

export class CurrencyAmountDto implements StructV1.CurrencyAmountDto {
  @ApiProperty({
    enum: Currency,
    example: Currency.USD,
  })
  @IsEnum(Currency)
  readonly currency: string;

  @ApiProperty({ example: '100.55' })
  @IsNumberString()
  readonly amount: string;
}
