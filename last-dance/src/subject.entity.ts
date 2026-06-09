import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Deadline } from './deadline.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  SUBJECT_ID: number;

  @Column({ length: 100 })
  SUBJECT_NAME: string;

  @Column('text')
  DESCRIPTION: string;

  @OneToMany(() => Deadline, (deadline) => deadline.subject)
  deadlines: Deadline[];
}