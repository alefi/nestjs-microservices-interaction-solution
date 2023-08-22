import { ApiProperty } from '@nestjs/swagger';

import { type GameServiceV1 } from '@lib/grpc';
import { type ITimestampsMeta } from '@lib/utils';

export class GameSessionDto
  implements
    Omit<GameServiceV1.GameSessionDto, 'winningHash' | 'startAt' | 'finishAt' | 'createdAt' | 'updatedAt'>,
    ITimestampsMeta<Date>
{
  @ApiProperty({
    description: 'A game event unique identifier.',
    format: 'uuid',
  })
  readonly id: string;

  @ApiProperty({
    description: 'A game event unique identifier.',
    format: 'uuid',
  })
  readonly gameEventId: string;

  readonly startAt: Date;
  readonly finishAt: Date;
  readonly isFinished: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  static create(gameSession: GameServiceV1.GameSessionDto): GameSessionDto {
    // Note: We mustn't expose winningHash to a client.
    const {
      winningHash, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...rest
    } = gameSession;
    const objectPath: GameSessionDto = {
      ...rest,
      startAt: new Date(gameSession.startAt),
      finishAt: new Date(gameSession.finishAt),
      createdAt: new Date(gameSession.createdAt),
      updatedAt: new Date(gameSession.updatedAt),
    };
    return Object.assign(new GameSessionDto(), objectPath);
  }
}
