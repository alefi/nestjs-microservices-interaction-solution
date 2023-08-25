import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { match } from 'ts-pattern';

import { type Bid, WalletEntryState, Prisma, Status } from '@prisma/client';
import { PrismaErrorCode, PrismaService } from '@lib/db';
import { WalletServiceClientService, type GameServiceV1, WalletServiceV1 } from '@lib/grpc';
import { buildUrn } from '@lib/utils';

@Injectable()
export class GameBidService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly walletServiceClientService: WalletServiceClientService,
  ) {}

  // Note: This method is idempotent by design. It is disallowed to change bid or create several bids on single game session.
  async applyBid(applyBidParams: GameServiceV1.ApplyBidParamsDto): Promise<Bid> {
    // TODO Try to split this long method
    return await this.prismaService.$transaction(
      async client => {
        const { currencyAmount, gameSessionId, userId } = applyBidParams;
        const gameSession = await client.gameSession.findUniqueOrThrow({
          where: {
            id: gameSessionId,
            isFinished: false,
          },
        });

        // TODO Check game session's constraint, e.g., if it already has finished

        const authoriseFundsParams: WalletServiceV1.AuthoriseFundsParamsDto = {
          reference: buildUrn('game-service', 'game-sessions', gameSession.id),
          userId,
          currencyAmount,
        };

        if (applyBidParams.walletAccountId) {
          authoriseFundsParams.walletAccountId = applyBidParams.walletAccountId;
        }

        const { walletEntryId, state = WalletEntryState.failed } = await firstValueFrom(
          this.walletServiceClientService.authoriseFunds(authoriseFundsParams),
        );

        // TODO Handle errors carefully, map them into business exceptions
        if (state === WalletEntryState.failed) {
          throw Error('Unable to authorise funds');
        }

        try {
          const gameBid = await client.bid.create({
            data: {
              gameSessionId,
              walletEntryId,
              userId,
              // TODO make a real hash generator function
              valueHash: 'hashed_value',
              status: Status.success,
            },
          });
          return gameBid;
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const result: Bid | null = await match(error.code)
              .with(PrismaErrorCode.UniqueConstraintFailed, () =>
                client.bid.findUnique({
                  where: {
                    gameSessionId_userId: {
                      gameSessionId,
                      userId,
                    },
                  },
                }),
              )
              .otherwise(() => null);

            if (result) {
              return result;
            }
          }

          throw error;
        }
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000,
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );
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
