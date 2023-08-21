import type { Game } from '@prisma/client';

import { GameServiceV1 } from '@lib/grpc';
import { ITimestampsMeta } from '@lib/utils';

export class GameDto implements GameServiceV1.GameDto, ITimestampsMeta<string> {
  readonly id: string;
  readonly name: string;
  readonly displayName?: string;
  readonly simultaneousEventsCount: number;
  readonly isAvailable: boolean;
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
