import { ApiProperty } from '@nestjs/swagger';

import { WalletServiceV1 } from '@lib/grpc';

export class WalletAccountDto implements Omit<WalletServiceV1.WalletAccountDto, 'createdAt' | 'updatedAt'> {
  @ApiProperty({
    description: 'A wallet unique identifier',
    format: 'uuid',
  })
  readonly id: string;

  readonly currency: string;
  readonly amount: string;
  readonly authorisedAmount: string;
  readonly isAvailable: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  static create(wallet: WalletServiceV1.WalletAccountDto): WalletAccountDto {
    const objectPath: WalletAccountDto = {
      ...wallet,
      createdAt: new Date(wallet.createdAt),
      updatedAt: new Date(wallet.updatedAt),
    };
    return Object.assign(new WalletAccountDto(), objectPath);
  }
}
