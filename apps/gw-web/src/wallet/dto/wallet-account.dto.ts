import { ApiProperty } from '@nestjs/swagger';

import { WalletServiceV1 } from '@lib/grpc';

export class WalletAccountDto implements Omit<WalletServiceV1.WalletAccountDto, 'createdAt' | 'updatedAt'> {
  @ApiProperty({
    description: 'A wallet unique identifier',
    format: 'uuid',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  readonly currency: string;
  readonly amount: string;

  @ApiProperty({
    description: 'The authorised (aka locked) money amount, which is not available for payments.',
    example: 'USD',
  })
  readonly authorisedAmount: string;

  /**
   * If false, the wallet account is unavailable for any operations.
   */
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
