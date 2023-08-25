import { type WalletAccount } from '@prisma/client';
import { StructV1, WalletServiceV1 } from '@lib/grpc';
import { Currency, IAuthorisedCurrencyAmount, ICurrencyAmount, ITimestampsMeta } from '@lib/utils';

export class WalletAccountDto
  implements
    WalletServiceV1.WalletAccountDto,
    StructV1.CurrencyAmountDto,
    ICurrencyAmount,
    IAuthorisedCurrencyAmount,
    ITimestampsMeta<string>
{
  readonly id: string;
  readonly userId: string;
  readonly currency: Currency;
  readonly amount: string;
  readonly authorisedAmount: string;
  readonly isAvailable: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;

  static fromModel(walletAccount: WalletAccount): WalletAccountDto {
    const objectPath: WalletAccountDto = {
      ...walletAccount,
      amount: '0.0',
      authorisedAmount: '0.0',
      currency: walletAccount.currency as Currency,
      createdAt: walletAccount.createdAt.toISOString(),
      updatedAt: walletAccount.updatedAt.toISOString(),
    };
    return Object.assign(new WalletAccountDto(), objectPath);
  }
}
