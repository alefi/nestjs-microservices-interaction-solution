import { PartialType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

import { type GameServiceV1 } from '@lib/grpc';
import { GameSessionDto } from './game-session.dto';

export class ListGameSessionsParamsDto
  extends PartialType(PickType(GameSessionDto, ['gameEventId', 'isFinished']))
  implements Pick<GameServiceV1.ListGameSessionsParamsDto, 'isFinished'>
{
  @Transform(({ value }) => String(value).toLowerCase())
  @IsOptional()
  @IsUUID()
  declare readonly gameEventId?: string;

  /**
   * Filter only finished game events
   */
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  declare readonly isFinished?: boolean;
}
