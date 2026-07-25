import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subject } from '../../subjects/entities/subject.entity';
import { Task } from '../../tasks/entities/task.entity'; // <-- Thêm import Task

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ name: 'student_code', unique: true })
  studentCode: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  // Lưu bản băm bcrypt, không bao giờ trả về client (xem toJSON bên dưới)
  @Column()
  password: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  // Băm (bcrypt) của refresh token hiện hành, cho phép thu hồi khi logout
  // hoặc khi phát hiện refresh token bị đánh cắp/dùng lại (token reuse).
  // null = chưa đăng nhập / đã logout / đã bị thu hồi.
  @Column({ name: 'refresh_token_hash', type: 'varchar', nullable: true })
  refreshTokenHash?: string | null;

  // Quan hệ ngược với Subject (subject.entity.ts dùng (user) => user.subjects)
  @OneToMany(() => Subject, (subject) => subject.user)
  subjects: Subject[];

  // <-- Thêm mối quan hệ: 1 User có nhiều Tasks
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Đảm bảo không rò rỉ password / refreshTokenHash khi entity được serialize ra JSON
  toJSON() {
    const { password, refreshTokenHash, ...safe } = this;
    return safe;
  }
}