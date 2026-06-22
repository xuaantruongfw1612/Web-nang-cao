import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../student.entity'; // Đã fix đường dẫn & tên entity
import { Subject } from '../subject.entity'; // Đã fix đường dẫn

@Entity('tasks')
export class Task {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 20 })
  type: string;

  @Column({ name: 'task_datetime', type: 'datetime' })
  taskDatetime: Date;

  @Column({ length: 50, nullable: true })
  room: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ length: 20, default: 'PENDING' })
  status: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Student;

  @ManyToOne(() => Subject, (subject) => subject.tasks, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;
}