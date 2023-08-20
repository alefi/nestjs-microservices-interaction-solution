import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { UserServiceClientService } from '@lib/grpc';
import { userServiceGrpcClientOptions } from '../config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe(UserController.name, () => {
  let controller: UserController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([userServiceGrpcClientOptions])],
      providers: [UserServiceClientService, UserService],
      controllers: [UserController],
    }).compile();

    controller = app.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#me', () => {
    it.todo('should return user profile for an authorised user');
  });
});
