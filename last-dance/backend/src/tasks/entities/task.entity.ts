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
import { Subject } from '../../subjects/subject.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Bản thân Task vẫn giữ nguyên UUID là chuẩn

  @Column({ name: 'user_id' })
  userId: number; // Đã khớp với id của User

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'subject_id', nullable: true })
  subjectId?: number; // Đã khớp với id của Subject

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

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}