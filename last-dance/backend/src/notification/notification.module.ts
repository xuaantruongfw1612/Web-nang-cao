import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity';
import { NotificationLog } from './entities/notification-log.entity';
import { MailService } from './mail/mail.service';
import { NotificationController } from './notification.controller';
import { NotificationScheduler } from './notification.scheduler';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    // Đăng ký cả Task để dùng Repository<Task> trong scheduler (relations, không raw SQL)
    TypeOrmModule.forFeature([NotificationLog, Task]),
    ConfigModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationScheduler, MailService],
  exports: [NotificationService],
})
export class NotificationModule {}
