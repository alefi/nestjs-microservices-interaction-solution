import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export type Exception = HttpException | RpcException;
