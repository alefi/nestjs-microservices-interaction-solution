import { ApiProperty } from '@nestjs/swagger';

import { GameServiceV1 } from '@lib/grpc';

export class GameEventDto
  implements Omit<GameServiceV1.GameEventDto, 'startAt' | 'finishAt' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({
    description: 'A game event unique identifier',
    format: 'uuid',
  })
  readonly id: string;

  @ApiProperty({
    description: 'A game unique identifier',
    format: 'uuid',
  })
  readonly gameId: string;

  /**
   * Name of the game event
   * @example 'Guess the number marathon'
   */
  readonly name?: string;

  /**
   * Extended name of the game event
   * @example 'Guess the number marathon that comprises 200 rounds in a row'
   */
  readonly displayName?: string;

  @ApiProperty({
    description: 'Maximum count of the game event sessions running at the same moment',
    maximum: 1000,
    minimum: 1,
    format: 'integer',
  })
  readonly simultaneousSessionsCount: number;

  readonly startAt: Date;
  readonly finishAt: Date;

  @ApiProperty({
    description: 'The cancellation reason if applied',
    example: 'Cancelled due to abuse detected',
  })
  readonly cancellationReason?: string;

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
