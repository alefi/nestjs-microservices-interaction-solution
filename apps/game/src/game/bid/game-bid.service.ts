import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { type Bid, WalletEntryState, Prisma } from '@prisma/client';
import { PrismaService } from '@lib/db';
import { WalletServiceClientService, type GameServiceV1, WalletServiceV1 } from '@lib/grpc';
import { buildUrn } from '@lib/utils';

@Injectable()
export class GameBidService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly walletServiceClientService: WalletServiceClientService,
  ) {}

  async applyBid(applyBidParams: GameServiceV1.ApplyBidParamsDto): Promise<Bid> {
    return await this.prismaService.$transaction(async client => {
      const { currencyAmount, gameSessionId, userId } = applyBidParams;
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

      const { walletEntryId, state } = await firstValueFrom(
        this.walletServiceClientService.authorizeFunds(authoriseFundsParams),
      );

      // TODO Handle errors carefully, map them into business exceptions
      // TODO Use enum instead (think of avoiding DRY, because we already have WalletEntryState enum on database layer)
      if (state === WalletEntryState.failed) {
        throw Error('Failed to authorise funds');
      }

      const gameBid = await client.bid.create({
        data: {
          gameSessionId,
          walletEntryId,
          userId,
          // TODO make hash function
          valueHash: 'hashed_value',
        },
      });
      return gameBid;
    });
  }

  async get(getGameBidParams: GameServiceV1.GetGameBidParamsDto): Promise<Bid> {
    const { id, gameSessionId, userId } = getGameBidParams;
    const where: Prisma.BidWhereUniqueInput = { id };

    if (userId) {
      where.gameSessionId_userId = {
        gameSessionId,
        userId,
      };
    }

    return await this.prismaService.bid.findUniqueOrThrow({ where });
  }
}
