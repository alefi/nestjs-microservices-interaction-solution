import { ApiProperty } from '@nestjs/swagger';

import { UserServiceV1 } from '@lib/grpc';

export class UserProfileDto implements Omit<UserServiceV1.UserDto, 'authMethod' | 'createdAt' | 'updatedAt'> {
  @ApiProperty({
    description: 'A user unique identifier',
    format: 'uuid',
  })
  readonly id: string;

  readonly name: string;
  readonly displayName?: string;
  readonly email?: string;
  readonly isEmailConfirmed: boolean;
  readonly diallingCode?: string;
  readonly phoneNumber?: string;
  readonly isPhoneConfirmed?: boolean;
  readonly isActive: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  static create(user: UserServiceV1.UserDto): UserProfileDto {
    const objectPath: UserProfileDto = {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
    return Object.assign(new UserProfileDto(), objectPath);
  }
}
