import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { PrismaService } from '@lib/db';
import { AppModule } from './app.module';
import { gameServiceGrpcServerOptions } from './config';

async function main() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, gameServiceGrpcServerOptions);

  /**
   * @description Prisma listens for shutdown signals and will call process.exit() before application shutdown hooks fire.
   * The following is prevents a such behaviour.
   */
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  /**
   * Enables the usage of shutdown hooks. Will call the `onApplicationShutdown`
   * function of a provider if the process receives a shutdown signal.
   */
  app.enableShutdownHooks();

  await app.listen();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
