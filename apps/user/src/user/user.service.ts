import { Injectable } from '@nestjs/common';

import { StructV1 } from '@lib/grpc';
import { PrismaService } from '@lib/db';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserById(getByIdParams: StructV1.GetEntityById) {
    return await this.prismaService.user.findUnique({ where: getByIdParams });
  }
}
