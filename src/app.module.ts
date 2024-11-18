import { Module } from '@nestjs/common';
import { AuthenticationController } from './Authentication/authentication.controller';
import { AuthenticationModule } from './Authentication/authentication.module';
import { AuthenticationService } from './Authentication/authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { configuration } from './config/index';

@Module({
  imports: [
    AuthenticationModule,

    // Configure environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // Get the required configuration settings from the ConfigService
        uri: configService.get('database.uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule { }
