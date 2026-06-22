import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // Ánh xạ chính xác vào bảng 'users' trong Student_Deadline_Manager
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_code', unique: true, length: 50 })
  studentCode: string;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ name: 'avatar_url', length: 255, nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}