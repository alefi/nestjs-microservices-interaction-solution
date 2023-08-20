import { GrpcMethod, GrpcService } from '@nestjs/microservices';

import { StructV1 } from '@lib/grpc';
import { UserDto } from './dto';
import { UserService } from './user.service';

@GrpcService()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService')
  async getUserById(getByIdParams: StructV1.GetEntityByIdParamsDto): Promise<UserDto> {
    const user = await this.userService.getUserById(getByIdParams);
    return UserDto.fromModel(user);
  }
}
