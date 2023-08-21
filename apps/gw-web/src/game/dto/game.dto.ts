import { ApiProperty } from '@nestjs/swagger';

import { GameServiceV1 } from '@lib/grpc';
import { ITimestampsMeta } from '@lib/utils';

export class GameDto implements Omit<GameServiceV1.GameDto, 'createdAt' | 'updatedAt'>, ITimestampsMeta<Date> {
  @ApiProperty({
    description: 'A game unique identifier.',
    format: 'uuid',
  })
  readonly id: string;

  /**
   * Name of the game.
   * @example 'Guess the number'
   */
  readonly name: string;

  /**
   * Extended name of the game.
   */
  readonly displayName?: string;

  @ApiProperty({
    description: 'Maximum count of the game events running at the same moment.',
    maximum: 100,
    minimum: 1,
    format: 'integer',
  })
  readonly simultaneousEventsCount: number;

  /**
   * If the property is false, the game isn't available to play.
   */
  readonly isAvailable: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  static create(game: GameServiceV1.GameDto): GameDto {
    const objectPath: GameDto = {
      ...game,
      createdAt: new Date(game.createdAt),
      updatedAt: new Date(game.updatedAt),
    };
    return Object.assign(new GameDto(), objectPath);
  }
}
