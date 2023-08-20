import { ConfigModule } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  Module,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationError } from 'class-validator';

import { configParserFactory, ExceptionInterceptor } from '@lib/utils';
import { config, ConfigSchema } from './config';
import { GameModule } from './game';
import { UserModule } from './user';
import { WalletModule } from './wallet';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: configParserFactory<ConfigSchema>(config),
    }),

    GameModule,
    UserModule,
    WalletModule,
  ],

  /**
   * @description Order has meaning. For instance, if we considering response flow, the first interceptor would be called after others, placed below.
   * Exception handler should be the last, so it has the most top place.
   * * @see https://docs.nestjs.com/interceptors#binding-interceptors
   */
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      // Register validation pipe in module, instead of main.ts,
      // So that during end-to-end tests, validation is applied.
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          // Prohibit additional properties that aren’t described in DTO.
          forbidUnknownValues: true,
          transform: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory: (validationErrors: ValidationError[] = []) => {
            return new UnprocessableEntityException(validationErrors);
          },
        });
      },
    },
  ],
})
export class AppModule {}
