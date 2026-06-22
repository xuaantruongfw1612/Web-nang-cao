import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../student.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Student) 
    private studentRepo: Repository<Student>,
    private jwtService: JwtService,
  ) {}

  // Thực hiện POST API đăng kí thông tin người dùng
  async register(studentCode: string, fullName: string, email: string, pass: string) {
    // Kiểm tra xem email sinh viên đã tồn tại hay chưa
    const existing = await this.studentRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email này đã được đăng ký!');

    // Mã hóa hàm băm password sử dụng thư viện bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    // Lưu giữ thông tin mật khẩu đã được mã hóa vào CSDL Aiven
    const newStudent = this.studentRepo.create({
      studentCode,
      fullName,
      email,
      password: hashedPassword, // Lưu chuỗi hash
    });

    await this.studentRepo.save(newStudent);
    return { message: 'Đăng ký thành công!', email: newStudent.email };
  }

  // Khớp mã băm khi đăng nhập
  async validateUser(email: string, pass: string): Promise<any> {
    const student = await this.studentRepo.findOne({ where: { email } });
    if (student && await bcrypt.compare(pass, student.password)) {
      const { password, ...result } = student;
      return result;
    }
    return null;
  }

  // Sinh và cấp phát token JWT
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}