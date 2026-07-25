import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { User } from '../../auth/entities/user.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'subject_id', nullable: true })
  subjectId?: number;

  @ManyToOne(() => Subject, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject?: Subject;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 20, nullable: true })
  type?: string;

  @Column({ name: 'task_datetime', type: 'datetime' })
  taskDatetime: Date;

  @Column({ length: 50, nullable: true })
  room?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Dùng varchar thay vì type:'enum' - driver sql.js (dùng khi chạy test e2e)
  // không hỗ trợ kiểu cột 'enum' native, dù MySQL thật vẫn nhận string bình
  // thường. Validate giá trị hợp lệ đảm bảo ở tầng DTO (@IsEnum trong task.dto.ts).
  @Column({ type: 'varchar', length: 20, default: TaskStatus.PENDING })
  status: TaskStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Tương ứng method isOverdue() trên Class Diagram (Chương 3).
  // Một công việc được coi là "quá hạn" khi: chưa hoàn thành/chưa huỷ VÀ
  // đã qua thời điểm taskDatetime. Tính động (không dựa vào 1 giá trị status
  // OVERDUE cố định trong DB) để luôn chính xác tại thời điểm gọi, không cần
  // thêm cronjob riêng chỉ để cập nhật trạng thái quá hạn.
  isOverdue(): boolean {
    const isFinished = this.status === TaskStatus.COMPLETED || this.status === TaskStatus.CANCELLED;
    if (isFinished) return false;
    return new Date(this.taskDatetime).getTime() < Date.now();
  }
}
