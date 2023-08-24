import type { WalletAccount } from '@prisma/client';
import { StructV1, WalletServiceV1 } from '@lib/grpc';
import { IAuthorisedCurrencyAmount, ITimestampsMeta } from '@lib/utils';

export class WalletAccountDto
  implements
    WalletServiceV1.WalletAccountDto,
    StructV1.CurrencyAmountDto,
    IAuthorisedCurrencyAmount,
    ITimestampsMeta<string>
{
  readonly id: string;
  readonly userId: string;
  readonly currency: string;
  readonly amount: string;
  readonly authorisedAmount: string;
  readonly isAvailable: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;

  static fromModel(wallet: WalletAccount): WalletAccountDto {
    const objectPath: WalletAccountDto = {
      ...wallet,
      amount: '0.0',
      authorisedAmount: '0.0',
      createdAt: wallet.createdAt.toISOString(),
      updatedAt: wallet.updatedAt.toISOString(),
    };
    return Object.assign(new WalletAccountDto(), objectPath);
  }
}
