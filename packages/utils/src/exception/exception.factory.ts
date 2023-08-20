import { StatusBuilder, status as GrpcStatus } from '@grpc/grpc-js';
import { ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { match } from 'ts-pattern';

import { Exception } from './typings';

export const getExceptionFactory = (ctx: ExecutionContext) => {
  /**
   * It only handles gRpc and Http exceptions.
   * For demo purpose, response codes are hardcoded below.
   */
  const exceptionFactory = (exception: Exception): Exception | undefined =>
    match(ctx.getType())
      .with('rpc', () => {
        const statusObject = new StatusBuilder()
          .withCode(GrpcStatus.INVALID_ARGUMENT)
          .withDetails(JSON.stringify(ctx.switchToHttp().getResponse()))
          .withMetadata(ctx.switchToRpc().getContext())
          .build();
        return new RpcException(statusObject);
      })
      .otherwise(() => exception);

  return exceptionFactory;
};
