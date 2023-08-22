import { PartialType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { type GameServiceV1 } from '@lib/grpc';
import { GameEventDto } from './game-event.dto';

export class ListGameEventsParamsDto
  extends PartialType(PickType(GameEventDto, ['isFinished']))
  implements Pick<GameServiceV1.ListGameEventsParamsDto, 'isFinished'>
{
  /**
   * Filter only finished game events
   */
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  declare readonly isFinished?: boolean;
}
