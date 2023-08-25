import { ApiExtraModels, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

import { type GameServiceV1 } from '@lib/grpc';
import { GameBidDto } from './game-bid.dto';
import { CurrencyAmountDto } from './shared';

@ApiExtraModels(CurrencyAmountDto)
export class ApplyBidParamsDto
  extends OmitType(GameBidDto, ['id', 'status', 'createdAt', 'updatedAt'])
  implements Omit<GameServiceV1.ApplyBidParamsDto, 'userId'>
{
  /**
   * A value tracts as a bid payload.
   */
  @IsString()
  declare readonly value: string;

  @ValidateNested()
  @Type(() => CurrencyAmountDto)
  declare readonly currencyAmount: CurrencyAmountDto;

  @ApiPropertyOptional({
    description: 'If not specified, the system will choose the wallet account automatically based on criteria.',
  })
  @IsOptional()
  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  declare readonly walletAccountId?: string;
}
