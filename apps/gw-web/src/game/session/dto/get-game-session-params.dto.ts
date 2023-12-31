import { IntersectionType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsUUID } from 'class-validator';

import { type GameServiceV1 } from '@lib/grpc';
import { GetByIdParamsDto } from '@lib/utils';
import { GameSessionDto } from './game-session.dto';

export class GetGameSessionParamsDto
  extends IntersectionType(GetByIdParamsDto, PickType(GameSessionDto, ['gameEventId']))
  implements GameServiceV1.GetGameSessionParamsDto
{
  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  declare readonly gameId: string;

  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  readonly gameEventId: string;

  declare readonly id: string;
}
