import * as path from 'path';

import { GrpcOptions, Transport } from '@nestjs/microservices';

import { WalletServiceV1 } from '@lib/grpc';
import { protoBufModulesPath } from './protobuf-modules-path.constants';

export const walletServiceGrpcServerOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: [WalletServiceV1.WALLET_SERVICE_V1_PACKAGE_NAME],
    protoPath: path.join(protoBufModulesPath, 'wallet_service.proto'),
    loader: {
      defaults: true,
      enums: String,
      // It allows to load an additional demanded buf modules, if needed.
      includeDirs: [protoBufModulesPath],
    },
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    url: process.env.WALLET_SERVICE_GRPC_URL, // TODO Fetch it through a config service
  },
};
