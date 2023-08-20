import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

import { GameServiceV1 } from '@lib/grpc';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListGameEventsParamsDto implements GameServiceV1.ListGameEventsParamsDto {
  @ApiProperty({
    description: 'Filter events by a particular game',
    format: 'uuid',
  })
  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  readonly gameId: string;

  /**
   * Filter only finished game events
   */
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  readonly isFinished?: boolean;
}
