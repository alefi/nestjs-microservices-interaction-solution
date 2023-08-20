import * as path from 'path';

import { GrpcOptions, Transport } from '@nestjs/microservices';

import { UserServiceV1 } from '@lib/grpc';
import { protoBufModulesPath } from './protobuf-modules-path.constants';

export const userServiceGrpcServerOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: [UserServiceV1.USER_SERVICE_V1_PACKAGE_NAME],
    protoPath: path.join(protoBufModulesPath, 'user_service.proto'),
    loader: {
      defaults: true,
      enums: String,
      // It allows to load an additional demanded buf modules, if needed.
      includeDirs: [protoBufModulesPath],
    },
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    url: process.env.USER_SERVICE_GRPC_URL, // TODO Fetch it through a config service
  },
};
