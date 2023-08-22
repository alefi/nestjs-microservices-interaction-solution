import type { GameSession } from '@prisma/client';

import { GameServiceV1 } from '@lib/grpc';
import { ITimestampsMeta } from '@lib/utils';

export class GameSessionDto implements GameServiceV1.GameSessionDto, ITimestampsMeta<string> {
  readonly id: string;
  readonly gameEventId: string;
  readonly startAt: string;
  readonly finishAt: string;
  readonly isFinished: boolean;
  readonly winningHash?: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  static fromModel(gameSession: GameSession): GameSessionDto {
    const objectPath: GameSessionDto = {
      ...gameSession,
      startAt: gameSession.startAt.toISOString(),
      finishAt: gameSession.finishAt.toISOString(),
      createdAt: gameSession.createdAt.toISOString(),
      updatedAt: gameSession.updatedAt.toISOString(),
    };
    return Object.assign(new GameSessionDto(), objectPath);
  }
}
