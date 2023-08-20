import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { GetEntityByIdParamsDto } from '../typings/shared/struct.pb';
import {
  USER_SERVICE_NAME,
  USER_SERVICE_V1_PACKAGE_NAME,
  UserDto,
  UserServiceClient,
} from '../typings/user_service.pb';

@Injectable()
export class UserServiceClientService implements UserServiceClient, OnModuleInit {
  private userServiceClient: UserServiceClient;

  constructor(@Inject(USER_SERVICE_V1_PACKAGE_NAME) private client: ClientGrpc) {}

  getUserById(request: GetEntityByIdParamsDto): Observable<UserDto> {
    return this.userServiceClient.getUserById(request);
  }

  onModuleInit(): void {
    this.userServiceClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }
}
