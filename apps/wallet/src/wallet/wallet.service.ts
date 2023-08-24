import { Injectable } from '@nestjs/common';

import { Prisma, type WalletAccount } from '@prisma/client';
import { PrismaService } from '@lib/db';
import { type WalletServiceV1 } from '@lib/grpc';

@Injectable()
export class WalletService {
  constructor(private readonly prismaService: PrismaService) {}

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
