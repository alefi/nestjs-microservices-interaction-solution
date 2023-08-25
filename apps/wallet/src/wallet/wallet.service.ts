import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import { Currency, Prisma, WalletEntryState, type WalletAccount, Status, WalletEntry } from '@prisma/client';
import { PrismaErrorCode, PrismaService } from '@lib/db';
import { type WalletServiceV1 } from '@lib/grpc';

@Injectable()
export class WalletService {
  constructor(private readonly prismaService: PrismaService) {}

  async authoriseFunds(authoriseFundsParams: WalletServiceV1.AuthoriseFundsParamsDto) {
    return await this.prismaService.$transaction(
      async client => {
        const { currencyAmount, reference, userId } = authoriseFundsParams;
        const where: Prisma.WalletAccountWhereUniqueInput = {
          userId_currency: {
            currency: currencyAmount.currency as Currency,
            userId,
          },
        };

        if (authoriseFundsParams.walletAccountId) {
          where.id = authoriseFundsParams.walletAccountId;
        }

        // TODO: Replace ..OrThrow ending method to general and check results on each step
        const { id: walletAccountId } = await client.walletAccount.findUniqueOrThrow({ where });
        try {
          const walletEntry = await client.walletEntry.create({
            data: {
              walletAccount: {
                connect: {
                  id: walletAccountId,
                },
              },
              reference,
              amount: `-${currencyAmount.amount}`,
              state: WalletEntryState.reserved,
              status: Status.success,
              postedAt: new Date(),
            },
          });
          return walletEntry;
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const result: WalletEntry | null = await match(error.code)
              .with(PrismaErrorCode.UniqueConstraintFailed, () =>
                client.walletEntry.findUnique({
                  where: {
                    reference_walletAccountId: {
                      reference,
                      walletAccountId,
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
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );
  }

  // TODO Include amount calculations:
  async listWallets(
    listWalletAccountsParams: WalletServiceV1.ListWalletAccountsParamsDto,
  ): Promise<[WalletAccount[], number]> {
    const where: Prisma.WalletAccountWhereInput = listWalletAccountsParams;

    if (listWalletAccountsParams.isAvailable !== undefined) {
      where.isAvailable = listWalletAccountsParams.isAvailable;
    }

    const [items, total] = await Promise.all([
      this.prismaService.walletAccount.findMany({ where }),
      this.prismaService.walletAccount.count({ where: { userId: listWalletAccountsParams.userId } }),
    ]);

    return [items, total];
  }
}
