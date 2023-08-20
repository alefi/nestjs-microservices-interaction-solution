import { Module } from '@nestjs/common';

import { PrismaModule } from '@lib/db';
import { UserGrpcController } from './user-grpc.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserGrpcController],
})
export class UserModule {}
