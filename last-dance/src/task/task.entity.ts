import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';       
import { Subject } from '../subject/subject.entity'; 

@Entity('tasks') 
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string; 

  @Column({ type: 'varchar', length: 20 })
  type: string; // 'EXAM', 'CLASS', 'ASSIGNMENT'

  @Column({ type: 'datetime' })
  dateTime: Date; 

  @Column({ length: 50, nullable: true })
  room: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: 'PENDING' })
  status: string;

  
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  
  @ManyToOne(() => Subject, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'subject_id' }) 
  subject: Subject;
}