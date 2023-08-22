import { OmitType } from '@nestjs/swagger';
import { IsISO8601, IsInt, IsOptional, Max, Min } from 'class-validator';

import { GameServiceV1 } from '@lib/grpc';
import { GameEventDto } from './game-event.dto';

export class BeginGameEventParamsDto
  extends OmitType(GameEventDto, [
    'id',
    'gameId',
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
  implements Omit<GameServiceV1.BeginGameEventParamsDto, 'gameId'>
{
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
