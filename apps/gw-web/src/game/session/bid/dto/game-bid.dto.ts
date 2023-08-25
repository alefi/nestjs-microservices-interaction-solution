import { ApiProperty } from '@nestjs/swagger';

import { type GameServiceV1 } from '@lib/grpc';
import { type ITimestampsMeta } from '@lib/utils';

export class GameBidDto
  implements Omit<GameServiceV1.GameBidDto, 'valueHash' | 'createdAt' | 'updatedAt'>, ITimestampsMeta<Date>
{
  @ApiProperty({
    description: 'A game bid unique identifier.',
    format: 'uuid',
  })
  readonly id: string;

  @ApiProperty({
    description: 'A game session unique identifier.',
    format: 'uuid',
  })
  readonly gameSessionId: string;

  @ApiProperty({
    description: 'A wallet entry bound to the bid.',
    format: 'uuid',
  })
  readonly walletEntryId: string;

  @ApiProperty({
    description: 'A user that had made the bid.',
    format: 'uuid',
  })
  readonly userId: string;

  @ApiProperty({
    description: 'The bid status in a moment',
    enum: ['pending', 'success', 'failed'],
    example: 'pending',
  })
  readonly status: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  static create(bid: GameServiceV1.GameBidDto): GameBidDto {
    const {
      valueHash, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...rest
    } = bid;
    const objectPath: GameBidDto = {
      ...rest,
      createdAt: new Date(bid.createdAt),
      updatedAt: new Date(bid.updatedAt),
    };
    return Object.assign(new GameBidDto(), objectPath);
  }
}
