import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task/task.entity';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  // Đã fix: Bỏ tham chiếu ngược sang task.notificationLogs
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;
}