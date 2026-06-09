import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Student } from './student.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  NOTE_ID: number;

  @Column('text')
  CONTENT: string;

  @Column()
  CREATED_AT: Date;

  @ManyToOne(() => Student, (student) => student.notes)
  student: Student;
}