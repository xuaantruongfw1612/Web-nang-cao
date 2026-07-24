import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Entity('subjects')
@Index('uq_user_subject', ['name', 'user'], { unique: true })
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 7, default: '#3498db' })
  color: string;

  @Column({ length: 50, default: 'book' })
  icon: string;

  @ManyToOne(() => User, (user) => user.subjects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
