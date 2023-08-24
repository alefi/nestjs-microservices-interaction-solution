import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { type Bid, Status } from '@prisma/client';
import { PrismaService } from '@lib/db';
import { buildUrn } from '@lib/utils';
import { WalletServiceClientService, type GameServiceV1, type WalletServiceV1 } from '@lib/grpc';

@Injectable()
export class GameBidService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly walletServiceClientService: WalletServiceClientService,
  ) {}

  async applyBid(applyBidParams: GameServiceV1.ApplyBidParamsDto): Promise<Bid> {
    const { currencyAmount, gameSessionId, userId } = applyBidParams;

    return await this.prismaService.$transaction(async client => {
      const gameSession = await client.gameSession.findUniqueOrThrow({
        where: {
          id: gameSessionId,
          isFinished: false,
        },
      });

      const authoriseFundsParams: WalletServiceV1.AuthoriseFundsParamsDto = {
        reference: buildUrn('game-service', 'game-sessions', gameSession.id),
        userId,
        currencyAmount,
      };

      if (applyBidParams.walletAccountId) {
        authoriseFundsParams.walletAccountId = applyBidParams.walletAccountId;
      }

      const { walletEntryId, status } = await firstValueFrom(
        this.walletServiceClientService.authorizeFunds(authoriseFundsParams),
      );

      // TODO Handle errors carefully, map them into business exceptions
      // TODO Use enum instead (think of avoiding DRY, because we already have Status enum on database layer)
      if (status === 'failure') {
        throw Error('Failed to authorise funds');
      }

      const gameBid = await client.bid.create({
        data: {
          gameSessionId,
          walletEntryId,
          status: Status.pending,
          // TODO make hash function
          valueHash: 'hashed_value',
        },
      });

      return gameBid;
    });
  }
}
