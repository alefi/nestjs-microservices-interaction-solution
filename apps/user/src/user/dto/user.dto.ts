import type { User } from '@prisma/client';
import { UserServiceV1 } from '@lib/grpc';
import { ITimestampsMeta } from '@lib/utils';

export class UserDto implements UserServiceV1.UserDto, ITimestampsMeta<string> {
  readonly id: string;
  readonly name: string;

  readonly displayName?: string;
  readonly email?: string;
  readonly isEmailConfirmed: boolean;
  readonly diallingCode?: string;
  readonly phoneNumber?: string;
  readonly isPhoneConfirmed?: boolean;
  readonly authMethod: string;
  readonly isActive: boolean;

  readonly createdAt: string;
  readonly updatedAt: string;

  static fromModel(user: User): UserDto {
    const objectPath: UserDto = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
    return Object.assign(new UserDto(), objectPath);
  }
}
