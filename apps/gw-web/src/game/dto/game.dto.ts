import { ApiProperty } from '@nestjs/swagger';

import { GameServiceV1 } from '@lib/grpc';

export class GameDto implements Omit<GameServiceV1.GameDto, 'createdAt' | 'updatedAt'> {
  @ApiProperty({
    description: 'A game unique identifier',
    format: 'uuid',
  })
  readonly id: string;

  /**
   * Name of the game
   * @example 'Guess the number'
   */
  readonly name: string;

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
