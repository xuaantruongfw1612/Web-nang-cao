import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Note } from './note.entity';
import { Deadline } from './deadline.entity';

@Entity()
export class Student {
  @PrimaryColumn({ length: 10 })
  SID: string;

  @Column({ length: 30 })
  SNAME: string;

  @Column({ length: 50 })
  EMAIL: string;

  @Column({ length: 100 })
  PASSWORD: string;

  @Column({ length: 10 })
  Tutor_id: string;

  @OneToMany(() => Note, (note) => note.student)
  notes: Note[];

  @OneToMany(() => Deadline, (deadline) => deadline.student)
  deadlines: Deadline[];
}