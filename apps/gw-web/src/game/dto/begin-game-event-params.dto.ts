import { OmitType } from '@nestjs/swagger';
import { IsISO8601, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { GameServiceV1 } from '@lib/grpc';
import { GameEventDto } from './game-event.dto';

export class BeginGameEventParamsDto
  extends OmitType(GameEventDto, [
    'id',
    'startAt',
    'finishAt',
    'defaultSessionDurationSeconds',
    'simultaneousSessionsCount',
    'cancellationReason',
    'isCancelled',
    'isFinished',
    'createdAt',
    'updatedAt',
  ])
  implements GameServiceV1.BeginGameEventParamsDto
{
  @Transform(({ value }) => String(value).toLocaleLowerCase())
  @IsUUID()
  declare readonly gameId: string;

  @IsOptional()
  declare readonly name?: string;

  @IsOptional()
  declare readonly displayName?: string;

  @IsOptional()
  @Min(1)
  @IsInt()
  declare readonly defaultSessionDurationSeconds?: number;

  @IsOptional()
  @Max(1000)
  @Min(1)
  @IsInt()
  declare readonly simultaneousSessionsCount?: number;

  @IsISO8601({ strict: true })
  declare readonly startAt: string;

  @IsISO8601({ strict: true })
  declare readonly finishAt: string;
}
