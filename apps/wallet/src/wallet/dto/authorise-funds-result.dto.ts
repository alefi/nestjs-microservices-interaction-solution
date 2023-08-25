import { WalletEntry } from '@prisma/client';
import { WalletServiceV1 } from '@lib/grpc';
import { WalletEntryDto } from './wallet-entry.dto';

export class AuthoriseFundsResultDto implements WalletServiceV1.AuthoriseFundsResultDto {
  readonly walletAccountId: string;
  readonly walletEntryId: string;
  readonly state: string;

  static create(walletEntry: WalletEntry): AuthoriseFundsResultDto {
    const walletEntryDto = WalletEntryDto.fromModel(walletEntry);

    const objectPath: AuthoriseFundsResultDto = {
      walletAccountId: walletEntryDto.walletAccountId,
      walletEntryId: walletEntryDto.id,
      state: walletEntryDto.state,
    };

    return Object.assign(new AuthoriseFundsResultDto(), objectPath);
  }
}
