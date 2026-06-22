import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Student } from './student.entity';
import { Task } from './task/task.entity'; // Đã fix import

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 7, default: '#3498db' })
  color: string;

  @Column({ length: 50, default: 'book' })
  icon: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Student;

  // Đã fix: Đổi từ Deadline sang Task
  @OneToMany(() => Task, (task) => task.subject)
  tasks: Task[];
}