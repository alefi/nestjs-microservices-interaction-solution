import { ApiExtraModels, OmitType } from '@nestjs/swagger';

import { type GameServiceV1 } from '@lib/grpc';
import { GameBidDto } from './game-bid.dto';
import { CurrencyAmountDto } from './shared';

@ApiExtraModels(CurrencyAmountDto)
export class ApplyBidParamsDto
  extends OmitType(GameBidDto, ['id', 'status', 'createdAt', 'updatedAt'])
  implements GameServiceV1.ApplyBidParamsDto
{
  declare readonly gameSessionId: string;
  declare readonly userId: string;
  declare readonly value: string;
  declare readonly currencyAmount: CurrencyAmountDto;
  declare readonly walletAccountId?: string;
}
