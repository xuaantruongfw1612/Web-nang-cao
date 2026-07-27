import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { getDatabaseConfig } from './config/database.config';
import { NotificationModule } from './notification/notification.module';
import { SubjectModule } from './subjects/subject.module';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 1000 }]),
    AuthModule,
    NotificationModule,
    SubjectModule,
    TaskModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
