import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subject } from '../../subjects/entities/subject.entity';
import { Task } from '../../tasks/entities/task.entity'; // <-- Thêm import Task

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // ĐÃ TẠM THỜI TẮT UNIQUE
  // @Index({ unique: true })
  @Column({ name: 'student_code' })
  studentCode: string;

  @Column({ name: 'full_name' })
  fullName: string;

  // ĐÃ TẠM THỜI TẮT UNIQUE
  // @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @OneToMany(() => Subject, (subject) => subject.user)
  subjects: Subject[];

  // <-- Thêm mối quan hệ: 1 User có nhiều Tasks
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  toJSON() {
    const { password, ...safe } = this;
    return safe;
  }
}