import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigSchema } from './config';

async function main() {
  const app = await NestFactory.create(AppModule);

  /**
   * Note: This API contains both public and internal endpoints.
   * However, the current approach mustn't use on production.
   * Frankly, internal endpoints acts as triggers. Each method covered under these endpoints
   * should be called the other way (it might be an external orchestration, service, job, etc.)
   */
  const openApiConfig = new DocumentBuilder()
    .setTitle('Sample game REST API')
    .setDescription('public endpoints')
    .setVersion(process.env.npm_package_version ?? '')
    // .addBearerAuth() // In this demo we omit authorisation at all, so our API is open.
    .build();

  const openApiDocument = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('docs', app, openApiDocument);

  await app.startAllMicroservices();

  const configService = app.get(ConfigService<ConfigSchema, true>);
  const port = configService.get<string>('WEB_GATEWAY_SERVICE_HTTP_PORT');

  await app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
