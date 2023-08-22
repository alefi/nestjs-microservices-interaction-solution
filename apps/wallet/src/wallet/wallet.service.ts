import { Injectable } from '@nestjs/common';
import { WalletAccount } from '@prisma/client';

import { PrismaService } from '@lib/db';
import { type WalletServiceV1 } from '@lib/grpc';

@Injectable()
export class WalletService {
  constructor(private readonly prismaService: PrismaService) {}

  // TODO Include amount calculations:
  async listWallets(
    listWalletsParams: WalletServiceV1.ListWalletAccountsParamsDto,
  ): Promise<[WalletAccount[], number]> {
    const [items, total] = await Promise.all([
      this.prismaService.walletAccount.findMany({ where: listWalletsParams }),
      this.prismaService.walletAccount.count({ where: { userId: listWalletsParams.userId } }),
    ]);

    return [items, total];
  }
}
