import type { WalletEntry } from '@prisma/client';

import { WalletServiceV1 } from '@lib/grpc';
import { ITimestampsMeta } from '@lib/utils';

export class WalletEntryDto implements WalletServiceV1.WalletEntryDto, ITimestampsMeta<string> {
  readonly id: string;
  readonly walletAccountId: string;
  readonly reference: string;
  readonly amount: string;
  readonly state: string;
  readonly status: string;
  readonly postedAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  static fromModel(walletEntry: WalletEntry): WalletEntryDto {
    const objectPath: WalletEntryDto = {
      ...walletEntry,
      amount: walletEntry.amount.toString(),
      postedAt: walletEntry.createdAt.toISOString(),
      createdAt: walletEntry.createdAt.toISOString(),
      updatedAt: walletEntry.updatedAt.toISOString(),
    };
    return Object.assign(new WalletEntryDto(), objectPath);
  }
}
