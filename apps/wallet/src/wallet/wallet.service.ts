import { Injectable } from '@nestjs/common';

import { Currency, Prisma, WalletEntryState, type WalletAccount } from '@prisma/client';
import { PrismaService } from '@lib/db';
import { type WalletServiceV1 } from '@lib/grpc';

@Injectable()
export class WalletService {
  constructor(private readonly prismaService: PrismaService) {}

  async authorizeFund(authorizeFundsParams: WalletServiceV1.AuthoriseFundsParamsDto) {
    return await this.prismaService.$transaction(async client => {
      const { currencyAmount, reference, userId } = authorizeFundsParams;
      const where: Prisma.WalletAccountWhereUniqueInput = {
        userId_currency: {
          currency: currencyAmount.currency as Currency,
          userId,
        },
      };

      if (authorizeFundsParams.walletAccountId) {
        where.id = authorizeFundsParams.walletAccountId;
      }

      const { id: walletAccountId } = await client.walletAccount.findUniqueOrThrow({ where });
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
          postedAt: new Date(),
        },
      });

      return walletEntry;
    });
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
