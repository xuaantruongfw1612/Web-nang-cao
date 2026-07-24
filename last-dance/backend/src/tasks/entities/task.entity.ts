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

// LƯU Ý: entity này phản ánh bảng "tasks" do module Task/Subject (bạn cùng nhóm)
// chịu trách nhiệm chính (CRUD, migration). Notification module chỉ cần entity
// này để dùng TypeORM relations/QueryBuilder (không raw SQL) khi quét task sắp
// đến hạn và khi lấy email người nhận. Không thêm method nghiệp vụ Task ở đây.
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'subject_id', nullable: true })
  subjectId?: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ name: 'task_datetime' })
  taskDatetime: Date;

  @Column({ nullable: true })
  room?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
