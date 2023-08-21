import type { GameEvent } from '@prisma/client';

import { GameServiceV1 } from '@lib/grpc';

export class GameEventDto implements GameServiceV1.GameEventDto {
  readonly id: string;
  readonly gameId: string;
  readonly name?: string;
  readonly displayName?: string;
  readonly simultaneousSessionsCount: number;
  readonly startAt: string;
  readonly finishAt: string;
  readonly cancellationReason?: string;
  readonly isCancelled: boolean;
  readonly isFinished: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;

  static fromModel(gameEvent: GameEvent): GameEventDto {
    const objectPath: GameEventDto = {
      ...gameEvent,
      startAt: gameEvent.startAt.toISOString(),
      finishAt: gameEvent.finishAt.toISOString(),
      createdAt: gameEvent.createdAt.toISOString(),
      updatedAt: gameEvent.updatedAt.toISOString(),
    };
    return Object.assign(new GameEventDto(), objectPath);
  }
}
