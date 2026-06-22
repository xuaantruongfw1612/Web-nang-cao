import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  // Đã fix: Bỏ tham chiếu ngược sang student.notes
  @ManyToOne(() => Student) 
  @JoinColumn({ name: 'student_id' })
  student: Student;
}