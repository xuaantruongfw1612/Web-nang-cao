<<<<<<< HEAD
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './users/user.entity';
import { Subject } from './subjects/subject.entity';
=======
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { Category } from './category.entity';
>>>>>>> origin/main
import { NotificationLog } from './notification-log.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

<<<<<<< HEAD
  @Column({ length: 20 })
  type: string;

  @Column({ name: 'task_datetime', type: 'datetime' })
  taskDateTime: Date;

  @Column({ length: 50, nullable: true })
  room: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ default: 'PENDING' })
  status: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Subject, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject | null;

  @OneToMany(() => NotificationLog, (log) => log.task)
  notificationLogs: NotificationLog[];
}
=======
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ default: 'PENDING' }) 
  status: string;

  
  @ManyToOne(() => Student, student => student.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'SID' })
  student: Student;

  
  @ManyToOne(() => Category, category => category.tasks, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => NotificationLog, log => log.task)
  notificationLogs: 
}
>>>>>>> origin/main
