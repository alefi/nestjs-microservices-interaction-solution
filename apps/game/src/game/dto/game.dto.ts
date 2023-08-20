import type { Game } from '@prisma/client';

import { GameServiceV1 } from '@lib/grpc';

export class GameDto implements GameServiceV1.GameDto {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  static fromModel(game: Game): GameDto {
    const objectPath: GameDto = {
      ...game,
      createdAt: game.createdAt.toISOString(),
      updatedAt: game.updatedAt.toISOString(),
    };
    return Object.assign(new GameDto(), objectPath);
  }
}
