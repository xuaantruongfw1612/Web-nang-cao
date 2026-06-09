import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { Category } from './category.entity';
import { NotificationLog } from './notification-log.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

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