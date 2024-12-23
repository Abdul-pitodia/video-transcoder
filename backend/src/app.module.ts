import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoDetails } from './models/video.entity';
import { TypeOrmConfigService } from './services/typeorm.config.service';
import { AppConfigService } from './services/app.config.service';
import { SqsModule, SqsService } from '@ssut/nestjs-sqs';
import { VideoStatusService } from './services/video-status.service';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { SQSClient } from '@aws-sdk/client-sqs';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: [AppModule],
    }),
    TypeOrmModule.forFeature([VideoDetails]),
    SqsModule.registerAsync({
      useFactory: (appConfigService: AppConfigService) => {
        const sqsConfig = {
          region: appConfigService.awsRegion,
          ...(appConfigService.awsProfile && {
            credentials: fromIni({
              profile: appConfigService.awsProfile,
            }),
          }),
        } as { region: string; credentials?: any };

        return {
          producers: [],
          consumers: [
            {
              queueUrl: appConfigService.getSqsUrl,
              name: appConfigService.getSqsName,
              sqs: new SQSClient(sqsConfig),
            },
          ],
        };
      },
      inject: [AppConfigService],
      imports: [AppModule],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppConfigService,
    VideoStatusService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [AppConfigService],
})
export class AppModule {}
