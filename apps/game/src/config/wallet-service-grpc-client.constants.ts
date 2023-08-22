import * as path from 'path';

import { ClientProviderOptions, Transport } from '@nestjs/microservices';

import { WalletServiceV1 } from '@lib/grpc';
import { protoBufModulesPath } from './protobuf-modules-path.constants';

export const walletServiceGrpcClientOptions: ClientProviderOptions = {
  name: WalletServiceV1.WALLET_SERVICE_V1_PACKAGE_NAME,
  transport: Transport.GRPC,
  options: {
    channelOptions: {
      grpc_arg_enable_channelz: 0,
    },
    package: [WalletServiceV1.WALLET_SERVICE_V1_PACKAGE_NAME],
    protoPath: path.join(protoBufModulesPath, 'wallet_service.proto'),
    loader: {
      // It allows to load an additional demanded buf modules, if needed.
      includeDirs: [protoBufModulesPath],
    },
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    url: process.env.WALLET_SERVICE_GRPC_URL, // TODO Fetch it through a config service
  },
};
