import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { NotificationStatus } from '../common/enums/notification-status.enum';
import { TaskStatus } from '../common/enums/task-status.enum';
import { Task } from '../tasks/entities/task.entity';
import { MailService } from './mail/mail.service';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
  ) {}

  // Activity Diagram "Hệ thống Lập lịch (Cronjob) và Cơ sở dữ liệu"
  // Chạy mỗi giờ: tìm task PENDING sắp hết hạn trong 24h, tạo NotificationLog nếu chưa có.
  // Toàn bộ truy vấn dùng TypeORM Repository (find + toán tử Between), không raw SQL.
  @Cron(CronExpression.EVERY_HOUR)
  async scheduleUpcomingReminders() {
    this.logger.log('Cron kích hoạt định kỳ: quét task sắp hết hạn');

    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    let dueTasks: Task[] = [];
    try {
      dueTasks = await this.taskRepo.find({
        where: {
          status: TaskStatus.PENDING,
          taskDatetime: Between(now, in24h),
        },
      });
    } catch (error) {
      this.logger.error(`Không thể truy vấn task PENDING: ${(error as Error).message}`);
      return;
    }

    if (dueTasks.length === 0) {
      this.logger.log('Không có task thoả mãn điều kiện nhắc nhở');
      return;
    }

    for (const task of dueTasks) {
      // "Kiểm tra Task ID trong NotificationLog" -> "Log tồn tại?" trên Activity Diagram
      const alreadyLogged = await this.notificationService.existsPendingLogForTask(task.id);
      if (alreadyLogged) continue; // Đã có -> bỏ qua, không tạo trùng

      // Chưa có -> tạo nội dung nhắc nhở và lưu bản ghi Log trạng thái PENDING
      await this.notificationService.createLog({
        taskId: task.id,
        message: `Nhắc nhở: "${task.title}" sắp đến hạn lúc ${task.taskDatetime}${
          task.room ? ` tại phòng ${task.room}` : ''
        }.`,
        scheduledAt: now.toISOString(),
      });
    }
  }

  // Activity Diagram "Gửi nhắc nhở qua Email (Cronjob - Send Emails)"
  // Chạy mỗi 5 phút: lấy log PENDING đã đến giờ gửi (kèm relations task.user), gửi mail.
  @Cron(CronExpression.EVERY_5_MINUTES)
  async sendDueReminderEmails() {
    const now = new Date();
    const dueLogs = await this.notificationService.findDueForSending(now);

    if (dueLogs.length === 0) return;

    for (const log of dueLogs) {
      const recipient = log.task?.user;

      // Không JOIN được người nhận (dữ liệu thiếu/không nhất quán) -> đánh dấu FAILED
      if (!recipient?.email) {
        this.logger.warn(`Log #${log.id} không xác định được người nhận`);
        await this.notificationService.updateStatus(log.id, NotificationStatus.FAILED);
        continue;
      }

      const sent = await this.mailService.sendDeadlineReminder(
        recipient.email,
        'Nhắc nhở deadline - Student Deadline Manager',
        log.message,
      );

      await this.notificationService.updateStatus(
        log.id,
        sent ? NotificationStatus.SENT : NotificationStatus.FAILED,
        sent ? new Date() : undefined,
      );
    }
  }
}
