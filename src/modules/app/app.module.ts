import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ParserModule } from '../parser/parser.module';
import { ParserService } from '../parser/parser.service';

import { AnalyticsModule } from '../analytics/analytics.module';
import { AnalyticsService } from '../analytics/analytics.service';

const URL = ''

@Module({
  imports: [
    MongooseModule.forRoot('URL'),
    ParserModule,
    AnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService, ParserService, AnalyticsService],
})
export class AppModule {}
