import { IntersectionType, PickType } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { type GameServiceV1 } from '@lib/grpc';
import { GetByIdParamsDto } from '@lib/utils';
import { GameSessionDto } from '.';

export class GetGameSessionParamsDto
  extends IntersectionType(GetByIdParamsDto, PickType(GameSessionDto, ['gameEventId']))
  implements GameServiceV1.GetGameSessionParamsDto
{
  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  readonly gameEventId: string;

  declare readonly id: string;
}
