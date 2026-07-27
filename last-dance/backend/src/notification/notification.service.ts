import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { NotificationStatus } from '../common/enums/notification-status.enum';
import { Task } from '../tasks/entities/task.entity';
import { CreateNotificationLogDto } from './dto/create-notification-log.dto';
import { NotificationLog } from './entities/notification-log.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationLog)
    private readonly logRepo: Repository<NotificationLog>,
  ) {}

  // Được cron "Lập lịch" gọi, hoặc gọi thủ công.
  async createLog(dto: CreateNotificationLogDto): Promise<NotificationLog> {
    const log = this.logRepo.create({
      task: { id: dto.taskId } as Task, // chỉ cần id để TypeORM ghi đúng cột task_id
      message: dto.message,
      scheduledAt: new Date(dto.scheduledAt),
      status: NotificationStatus.PENDING,
    });
    return this.logRepo.save(log);
  }

  // tránh tạo trùng nhắc nhở cho cùng 1 task.
  async existsPendingLogForTask(taskId: string): Promise<boolean> {
    const count = await this.logRepo.count({
      where: { task: { id: taskId }, status: NotificationStatus.PENDING },
    });
    return count > 0;
  }

  async findAll(): Promise<NotificationLog[]> {
    return this.logRepo.find({ order: { scheduledAt: 'ASC' } });
  }

  async findByTask(taskId: string): Promise<NotificationLog[]> {
    return this.logRepo.find({
      where: { task: { id: taskId } },
      order: { createdAt: 'DESC' },
    });
  }

  // Lấy các log đến hạn gửi, dùng bởi cron "Gửi nhắc nhở qua Email".
  // relations: ['task', 'task.user'] để lấy kèm thông tin Task và User (email)
  // qua đúng quan hệ Entity của TypeORM, không dùng raw SQL / JOIN thủ công.
  async findDueForSending(now: Date): Promise<NotificationLog[]> {
    return this.logRepo.find({
      where: { status: NotificationStatus.PENDING, scheduledAt: LessThanOrEqual(now) },
      relations: { task: { user: true } },
    });
  }

  async updateStatus(id: number, status: NotificationStatus, sentAt?: Date): Promise<NotificationLog> {
    const log = await this.findOneOrFail(id);
    log.status = status;
    if (sentAt) log.sentAt = sentAt;
    return this.logRepo.save(log);
  }

  // Tương ứng method cancelNotification() - chỉ huỷ được khi đang PENDING
  async cancelNotification(id: number): Promise<boolean> {
    const log = await this.findOneOrFail(id);
    if (log.status !== NotificationStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể huỷ nhắc nhở đang ở trạng thái PENDING');
    }
    log.status = NotificationStatus.CANCELLED;
    await this.logRepo.save(log);
    return true;
  }

  private async findOneOrFail(id: number): Promise<NotificationLog> {
    const log = await this.logRepo.findOne({ where: { id } });
    if (!log) {
      throw new NotFoundException('Không tìm thấy bản ghi nhắc nhở');
    }
    return log;
  }
}
