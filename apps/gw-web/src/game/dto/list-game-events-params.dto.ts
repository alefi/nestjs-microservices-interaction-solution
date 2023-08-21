import { ApiProperty, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

import { GameServiceV1 } from '@lib/grpc';
import { GameEventDto } from './game-event.dto';

export class ListGameEventsParamsDto
  extends IntersectionType(PickType(GameEventDto, ['gameId']), PartialType(PickType(GameEventDto, ['isFinished'])))
  implements GameServiceV1.ListGameEventsParamsDto
{
  @ApiProperty({
    description: 'Filter events by a particular game.',
    format: 'uuid',
  })
  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  declare readonly gameId: string;

  /**
   * Filter only finished game events
   */
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  declare readonly isFinished?: boolean;
}
