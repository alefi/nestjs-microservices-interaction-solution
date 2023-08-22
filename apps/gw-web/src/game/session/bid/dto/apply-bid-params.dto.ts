import { ApiExtraModels, OmitType } from '@nestjs/swagger';

import { type GameServiceV1 } from '@lib/grpc';
import { GameBidDto } from './game-bid.dto';
import { CurrencyAmountDto } from './shared';

@ApiExtraModels(CurrencyAmountDto)
export class ApplyBidParamsDto
  extends OmitType(GameBidDto, ['id', 'status', 'createdAt', 'updatedAt'])
  implements Omit<GameServiceV1.ApplyBidParamsDto, 'userId'>
{
  declare readonly gameSessionId: string;
  declare readonly value: string;
  declare readonly currencyAmount: CurrencyAmountDto;
  declare readonly walletAccountId?: string;
}
