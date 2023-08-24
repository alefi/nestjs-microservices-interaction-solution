import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { configParserFactory, ExceptionInterceptor } from '@lib/utils';
import { config, ConfigSchema } from './config';
import { GameModule } from './game';
import { QueueModule } from './queue';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: configParserFactory<ConfigSchema>(config),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    QueueModule,

    GameModule,
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
