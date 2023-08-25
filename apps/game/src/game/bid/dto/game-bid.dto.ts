import type { Bid } from '@prisma/client';
import { GameServiceV1 } from '@lib/grpc';
import { ITimestampsMeta } from '@lib/utils';

export class GameBidDto implements GameServiceV1.GameBidDto, ITimestampsMeta<string> {
  readonly id: string;
  readonly gameSessionId: string;
  readonly walletEntryId: string;
  readonly userId: string;
  readonly valueHash: string; // Don't expose this to a client.
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  static fromModel(bid: Bid): GameBidDto {
    const objectPath: GameBidDto = {
      ...bid,
      createdAt: bid.createdAt.toISOString(),
      updatedAt: bid.updatedAt.toISOString(),
    };
    return Object.assign(new GameBidDto(), objectPath);
  }
}
