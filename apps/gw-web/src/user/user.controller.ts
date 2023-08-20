import { Controller, Get, Headers, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { tempAuthHeader } from '@lib/utils';
import { UserProfileDto } from './dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @description Since this project doesn't have an authorisation at all, x-user-id should be provided by a client (of course, this approach is not ready for production).
   * TODO Make a JWT authorisation based auth service, and get rid of this approach.
   */
  @ApiResponse({ status: HttpStatus.OK, type: UserProfileDto })
  @Get('profile/me')
  async me(@Headers(tempAuthHeader) userId: string): Promise<UserProfileDto> {
    const user = await this.userService.getUserById({ id: userId });
    return UserProfileDto.create(user);
  }
}
