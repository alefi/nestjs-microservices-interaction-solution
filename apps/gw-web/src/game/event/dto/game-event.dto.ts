import { ApiProperty } from '@nestjs/swagger';

import { type GameServiceV1 } from '@lib/grpc';
import { type ITimestampsMeta } from '@lib/utils';

export class GameEventDto
  implements
    Omit<GameServiceV1.GameEventDto, 'startAt' | 'finishAt' | 'createdAt' | 'updatedAt'>,
    ITimestampsMeta<Date>
{
  @ApiProperty({
    description: 'A game event unique identifier.',
    format: 'uuid',
  })
  readonly id: string;

  @ApiProperty({
    description: 'A game unique identifier.',
    format: 'uuid',
  })
  readonly gameId: string;

  /**
   * Name of the game event.
   * @example 'Guess the number marathon'
   */
  readonly name?: string;

  /**
   * Extended name of the game event.
   * @example 'Guess the number marathon that comprises 200 rounds in a row'
   */
  readonly displayName?: string;

  /**
   * A game event session duration in seconds.
   * @default 120
   */
  readonly sessionDurationSeconds: number;

  @ApiProperty({
    description: 'Games event sessions limit. It would generate no more sessions if the parameter reached.',
    format: 'integer',
  })
  readonly sessionsCountLimit?: number;

  @ApiProperty({
    description: 'Maximum count of the game event sessions running at the same moment.',
    maximum: 1000,
    minimum: 1,
    format: 'integer',
  })
  readonly simultaneousSessionsCount: number;

  readonly startAt: Date;
  readonly finishAt: Date;

  @ApiProperty({
    description: 'The cancellation reason if applied.',
    example: 'Cancelled due to abuse detected',
  })
  readonly cancellationReason?: string;

  /**
   * If the property is true, the game event got aborted.
   */
  readonly isCancelled: boolean;
  readonly isFinished: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  static create(game: GameServiceV1.GameEventDto): GameEventDto {
    const objectPath: GameEventDto = {
      ...game,
      startAt: new Date(game.startAt),
      finishAt: new Date(game.finishAt),
      createdAt: new Date(game.createdAt),
      updatedAt: new Date(game.updatedAt),
    };
    return Object.assign(new GameEventDto(), objectPath);
  }
}
