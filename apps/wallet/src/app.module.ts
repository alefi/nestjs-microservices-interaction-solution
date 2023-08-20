import { ConfigModule } from '@nestjs/config';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { configParserFactory, ExceptionInterceptor } from '@lib/utils';
import { config, ConfigSchema } from './config';
import { WalletModule } from './wallet';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: configParserFactory<ConfigSchema>(config),
    }),

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
  ],
})
export class AppModule {}
