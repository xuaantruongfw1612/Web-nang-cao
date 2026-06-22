import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // Yêu cầu 3: Logic Đăng ký & Băm mật khẩu
  async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, password } = createUserDto;

    // Kiểm tra xem Username đã tồn tại trong CSDL chưa
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('Tài khoản username này đã tồn tại!');
    }

    // Tiến hành băm (mã hóa) mật khẩu với Salt rounds = 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lưu thông tin người dùng mới với mật khẩu đã mã hóa vào CSDL
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  // Yêu cầu 4: Logic Đăng nhập và Cấp JWT Token
  async login(loginDto: CreateUserDto) {
    const { username, password } = loginDto;

    // Tìm kiếm user theo tên đăng nhập
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác!');
    }

    // So sánh mật khẩu thô gửi lên với mật khẩu đã băm trong CSDL
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác!');
    }

    // Tạo payload và ký mã Token (JWT)
    const payload = { username: user.username, sub: user.id };
    return {
      message: 'Đăng nhập thành công!',
      access_token: this.jwtService.sign(payload),
    };
  }
}