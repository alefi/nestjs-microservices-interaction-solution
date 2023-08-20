import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { UserServiceClientService, type UserServiceV1 } from '@lib/grpc';
import { GetByIdParamsDto } from '@lib/utils';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService', { timestamp: true });

  constructor(private readonly userServiceClientService: UserServiceClientService) {}

  async getUserById(getByIdParams: GetByIdParamsDto): Promise<UserServiceV1.UserDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(getByIdParams));
    return await firstValueFrom(this.userServiceClientService.getUserById(getByIdParams));
  }
}
