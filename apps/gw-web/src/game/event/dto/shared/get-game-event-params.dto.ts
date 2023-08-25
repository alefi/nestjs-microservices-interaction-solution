import { IntersectionType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsUUID } from 'class-validator';

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

  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  declare readonly id: string;
}
