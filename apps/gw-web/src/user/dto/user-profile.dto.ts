import { ApiProperty } from '@nestjs/swagger';

import { UserServiceV1 } from '@lib/grpc';
import { ITimestampsMeta } from '@lib/utils';

export class UserProfileDto implements Omit<UserServiceV1.UserDto, 'createdAt' | 'updatedAt'>, ITimestampsMeta<Date> {
  @ApiProperty({
    description: 'A user unique identifier',
    format: 'uuid',
  })
  readonly id: string;

  /**
   * User name
   */
  readonly name: string;

  /**
   * User display name
   */
  readonly displayName?: string;

  @ApiProperty({
    description: 'User email',
    format: 'email',
  })
  readonly email?: string;
  readonly isEmailConfirmed: boolean;
  readonly diallingCode?: string;

  /**
   * User phone number
   */
  readonly phoneNumber?: string;
  readonly isPhoneConfirmed?: boolean;

  @ApiProperty({
    description: 'User authentication method.',
    enum: ['local', 'social'],
    example: 'local',
  })
  readonly authMethod: string;

  /**
   * If the property is false, the user blocked and can't sign-in
   */
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
