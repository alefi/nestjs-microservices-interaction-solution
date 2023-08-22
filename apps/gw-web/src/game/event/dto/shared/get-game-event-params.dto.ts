import { IntersectionType, PickType } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { type GameServiceV1 } from '@lib/grpc';
import { GetByIdParamsDto } from '@lib/utils';
import { GameEventDto } from '../game-event.dto';

export class GetGameEventParamsDto
  extends IntersectionType(GetByIdParamsDto, PickType(GameEventDto, ['gameId']))
  implements GameServiceV1.GetGameEventParamsDto
{
  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  readonly gameId: string;

  declare readonly id: string;
}
