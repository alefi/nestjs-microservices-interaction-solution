import { IntersectionType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsUUID } from 'class-validator';

import { type GameServiceV1 } from '@lib/grpc';
import { GetByIdParamsDto } from '@lib/utils';
import { GameBidDto } from './game-bid.dto';

export class GetGameBidParamsDto
  extends IntersectionType(GetByIdParamsDto, PickType(GameBidDto, ['id', 'gameSessionId', 'userId']))
  implements GameServiceV1.GetGameBidParamsDto
{
  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  declare readonly gameId: string;

  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  readonly gameEventId: string;

  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  readonly gameSessionId: string;

  declare readonly id: string;
}
