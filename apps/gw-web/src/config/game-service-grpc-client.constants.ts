import * as path from 'path';

import { ClientProviderOptions, Transport } from '@nestjs/microservices';

import { GameServiceV1 } from '@lib/grpc';
import { protoBufModulesPath } from './protobuf-modules-path.constants';

export const gameServiceGrpcClientOptions: ClientProviderOptions = {
  name: GameServiceV1.GAME_SERVICE_V1_PACKAGE_NAME,
  transport: Transport.GRPC,
  options: {
    channelOptions: {
      grpc_arg_enable_channelz: 0,
    },
    package: [GameServiceV1.GAME_SERVICE_V1_PACKAGE_NAME],
    protoPath: path.join(protoBufModulesPath, 'game_service.proto'),
    loader: {
      // It allows to load an additional demanded buf modules, if needed.
      includeDirs: [protoBufModulesPath],
    },
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    url: process.env.GAME_SERVICE_GRPC_URL, // TODO Fetch it through a config service
  },
};
