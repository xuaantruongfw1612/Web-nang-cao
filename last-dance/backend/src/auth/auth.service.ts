import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Tương ứng use case "Đăng ký tài khoản" (Sequence Diagram)
  async register(dto: RegisterDto): Promise<User> {
    const existed = await this.userRepo.findOne({
      where: [{ email: dto.email }, { studentCode: dto.studentCode }],
    });

    // Đã tồn tại (trùng lặp) -> 409 Conflict, đúng như sequence diagram mô tả
    if (existed) {
      throw new ConflictException('Email hoặc mã sinh viên đã được đăng ký');
    }

    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = this.userRepo.create({
      ...dto,
      password: hashed,
    });

    return this.userRepo.save(user);
  }

  // Tương ứng use case "Đăng nhập tài khoản" (Activity Diagram)
  async login(dto: LoginDto): Promise<{ accessToken: string; user: User }> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    // Không tiết lộ email/mật khẩu sai cụ thể để tránh dò tài khoản (bảo mật - Câu 9)
    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, user };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findByIdOrFail(userId);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<boolean> {
    const user = await this.findByIdOrFail(userId);

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    user.password = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.userRepo.save(user);
    return true;
  }

  private async findByIdOrFail(userId: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }
}
