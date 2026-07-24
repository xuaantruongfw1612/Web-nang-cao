import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { getDatabaseConfig } from './config/database.config';
import { NotificationModule } from './notification/notification.module';
import { TaskModule } from './tasks/entities/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    ScheduleModule.forRoot(), // bật @nestjs/schedule cho 2 cron job của Notification
    AuthModule,
    NotificationModule,
    TaskModule, // Đăng ký TaskModule vào hệ thống
  ],
})
export class AppModule {}