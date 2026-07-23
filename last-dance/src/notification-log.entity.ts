<<<<<<< HEAD
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
=======
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
>>>>>>> origin/main
import { Task } from './task.entity';

@Entity()
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
<<<<<<< HEAD
  milestone: string;
  @CreateDateColumn()
  sentAt: Date;

  @ManyToOne(() => Task, (task) => task.notificationLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: Task;
}
=======
  milestone: string; 
  @CreateDateColumn()
  sentAt: Date; 

  @ManyToOne(() => Task, task => task.notificationLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;
}
>>>>>>> origin/main
