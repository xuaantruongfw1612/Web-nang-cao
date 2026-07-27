import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
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

  // Đọc nhanh taskId mà không cần load quan hệ 'task'. @RelationId là decorator
  // chuyên dụng của TypeORM cho việc này - KHÔNG dùng @Column({insert:false})
  // song song với @JoinColumn trên cùng 1 cột như bản trước, vì TypeORM sẽ
  // hiểu nhầm cả quan hệ 'task' cũng bị insert:false, khiến cột task_id bị
  // bỏ hẳn khỏi câu lệnh INSERT (lỗi "Field 'task_id' doesn't have a default value").
  // Lưu ý: KHÔNG đặt @Index() ở đây vì @RelationId không phải cột thật trong
  // entity (chỉ tính toán lúc load) - MySQL đã tự đánh index cột khoá ngoại rồi.
  @RelationId((log: NotificationLog) => log.task)
  taskId: string;

  @Column()
  message: string;

  @Column({ name: 'scheduled_at' })
  scheduledAt: Date;

  // Dùng varchar thay vì type:'enum' để tương thích cả sqljs (test e2e) lẫn
  // MySQL - validate giá trị hợp lệ đảm bảo ở tầng DTO (@IsEnum).
  @Column({ type: 'varchar', length: 20, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Column({ name: 'sent_at', nullable: true })
  sentAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
