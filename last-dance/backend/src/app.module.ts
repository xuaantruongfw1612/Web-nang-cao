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
    ScheduleModule.forRoot(), // bật @nestjs/schedule cho 2 cron job của Notification
    // Giới hạn tần suất request mặc định: 20 request / 60s / IP cho MỌI endpoint.
    // Endpoint /login được siết chặt hơn (5 request/60s) bằng @Throttle riêng
    // trong AuthController để chống brute-force dò mật khẩu.
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 20 }]),
    AuthModule,
    NotificationModule,
    SubjectModule,
    TaskModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
