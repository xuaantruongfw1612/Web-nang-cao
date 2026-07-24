import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationStatus } from '../../common/enums/notification-status.enum';
import { Task } from '../../tasks/entities/task.entity';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn()
  id: number;

  // Quan hệ TypeORM thật (Task 1 -- n NotificationLog) để có thể
  // dùng relations: ['task', 'task.user'] khi truy vấn, thay vì raw SQL.
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  // Cột "bóng" chỉ để đọc nhanh taskId mà không cần load quan hệ 'task'.
  // insert/update: false vì việc ghi dữ liệu cột task_id do quan hệ 'task' đảm nhiệm,
  // tránh TypeORM báo lỗi 2 property cùng ánh xạ 1 cột.
  @Index()
  @Column({ name: 'task_id', insert: false, update: false })
  taskId: string;

  @Column()
  message: string;

  @Column({ name: 'scheduled_at' })
  scheduledAt: Date;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Column({ name: 'sent_at', nullable: true })
  sentAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
