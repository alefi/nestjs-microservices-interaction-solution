import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { UserServiceClientService } from '@lib/grpc';
import { userServiceGrpcClientOptions } from '../config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ClientsModule.register([userServiceGrpcClientOptions])],
  providers: [UserServiceClientService, UserService],
  controllers: [UserController],
})
export class UserModule {}
