import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { match } from 'ts-pattern';

import { type Bid, WalletEntryState, Prisma, Status } from '@prisma/client';
import { PrismaErrorCode, PrismaService } from '@lib/db';
import { WalletServiceClientService, type GameServiceV1, WalletServiceV1 } from '@lib/grpc';
import { IProcessGameBidParams, IProcessGameBidsParams, JobName } from '@lib/queue';
import { buildUrn, hashValue } from '@lib/utils';
import { checkGameBidConstraints } from './helpers';
import { GameBidsPublisherService } from '../../queue';
import { IGameSessionActionResult } from '../event/session/typings';

@Injectable()
export class GameBidService {
  private readonly logger = new Logger(GameBidService.name, { timestamp: true });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly gameBidsPublisherService: GameBidsPublisherService,
    private readonly walletServiceClientService: WalletServiceClientService,
  ) {}

  // Note: This method is idempotent by design. It is disallowed to change bid or create several bids on single game session.
  async applyBid(applyBidParams: GameServiceV1.ApplyBidParamsDto): Promise<Bid> {
    checkGameBidConstraints(applyBidParams);

    // TODO Try to split this long method
    return await this.prismaService.$transaction(
      async client => {
        const { currencyAmount, gameSessionId, userId } = applyBidParams;
        const gameSession = await client.gameSession.findUnique({
          where: {
            id: gameSessionId,
            isFinished: false,
          },
        });

        // TODO Handle errors carefully, map them into business exceptions
        if (!gameSession) {
          throw new Error(`No active game session found for id ${gameSessionId}`);
        }

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
              valueHash: hashValue(applyBidParams.value, gameSessionId),
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

  async listGameBids(
    listGameBidsParams: GameServiceV1.ListGameBidsParamsDto,
    select?: Prisma.BidSelect,
  ): Promise<[Bid[], number]> {
    const { gameSessionId } = listGameBidsParams;
    const where: Prisma.BidWhereInput = { gameSessionId };

    if (listGameBidsParams.valueHash) {
      where.valueHash = listGameBidsParams.valueHash;
    }

    const whereWithoutStatusFiltering = { ...where };

    if (listGameBidsParams.status) {
      where.status = listGameBidsParams.status as Status;
    }

    const bidFindManyArgs: Prisma.BidFindManyArgs = { where };

    if (select) {
      bidFindManyArgs.select = select;
    }

    const [items, total] = await Promise.all([
      this.prismaService.bid.findMany(bidFindManyArgs),
      this.prismaService.bid.count({ where: { ...whereWithoutStatusFiltering } }),
    ]);

    return [items, total];
  }

  async processBids(processGameBidsParams: IProcessGameBidsParams, gameSessionActionResult: IGameSessionActionResult) {
    const { gameSessionId } = processGameBidsParams;
    const { winningHash } = gameSessionActionResult;
    this.logger.debug(`Game session ${gameSessionId} has finished, winning hash is ${winningHash}`);

    const [gameBids] = await this.listGameBids(
      { gameSessionId, status: Status.pending },
      { id: true, valueHash: true, walletEntryId: true },
    );

    const jobs = gameBids.map(({ id, valueHash, walletEntryId }) => ({
      data: <IProcessGameBidParams>{
        id,
        walletEntryId,
      },
      name: valueHash === winningHash ? JobName.ProcessWinningGameBid : JobName.ProcessLosingGameBid,
    }));

    return await this.gameBidsPublisherService.bulk(jobs);
  }

  /**
   * If a bid has lost, we should only gain locked funds on the user's wallet.
   * In terms of this project, we should add a new wallet entry with a confirmed state.
   */
  async processLosingBid(processGameBidParams: IProcessGameBidParams) {
    const { id, walletEntryId } = processGameBidParams;
    const { status = Status.failure } = await firstValueFrom(
      this.walletServiceClientService.commitFunds({ walletEntryId }),
    );

    return await this.markBidAsProcessed(id, status as Status);
  }

  /**
   * If the bid has won, we should only release locked funds on the user's wallet.
   * It means we would remove a wallet entry having a reserved state.
   */
  async processWinningBid(processGameBidParams: IProcessGameBidParams) {
    const { id, walletEntryId } = processGameBidParams;
    const { status = Status.failure } = await firstValueFrom(
      this.walletServiceClientService.releaseFunds({ walletEntryId }),
    );

    return await this.markBidAsProcessed(id, status as Status);
  }

  private async markBidAsProcessed(id: string, status: Status) {
    return await this.prismaService.bid.update({
      data: { status },
      where: {
        id,
        status: Status.pending,
      },
    });
  }
}
