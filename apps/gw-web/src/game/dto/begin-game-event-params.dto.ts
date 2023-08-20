import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { GameServiceV1 } from '@lib/grpc';

export class BeginGameEventParamsDto implements GameServiceV1.BeginGameEventParamsDto {
  @ApiProperty({
    description: 'A user unique identifier',
    format: 'uuid',
  })
  @Transform(({ value }) => String(value).toLocaleLowerCase())
  @IsUUID()
  gameId: string;

  @IsOptional()
  name?: string | undefined;

  @IsOptional()
  displayName?: string | undefined;

  /**
   * Maximum count of the game event sessions running at the same moment
   */
  @Max(1000)
  @Min(1)
  @IsInt()
  simultaneousSessionsCount: number;

  @IsISO8601({ strict: true })
  startAt: string;

  @IsISO8601({ strict: true })
  finishAt: string;
}
