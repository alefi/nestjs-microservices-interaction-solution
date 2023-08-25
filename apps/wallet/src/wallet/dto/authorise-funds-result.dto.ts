import { WalletEntry } from '@prisma/client';
import { WalletServiceV1 } from '@lib/grpc';
import { WalletEntryDto } from './wallet-entry.dto';

export class AuthorizeFundsResultDto implements WalletServiceV1.AuthorizeFundsResultDto {
  readonly walletAccountId: string;
  readonly walletEntryId: string;
  readonly state: string;

  static create(walletEntry: WalletEntry): AuthorizeFundsResultDto {
    const walletEntryDto = WalletEntryDto.fromModel(walletEntry);

    const objectPath: AuthorizeFundsResultDto = {
      walletAccountId: walletEntryDto.walletAccountId,
      walletEntryId: walletEntryDto.id,
      state: walletEntryDto.state,
    };

    return Object.assign(new AuthorizeFundsResultDto(), objectPath);
  }
}
