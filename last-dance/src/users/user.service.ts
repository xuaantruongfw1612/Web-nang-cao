import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto, LoginDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Yêu cầu 3: Thực hiện viết POST API đăng kí username và password từ người dùng
  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    const { student_code, email, password, full_name, avatar_url } = registerDto;

    // Kiểm tra xem email hoặc mã số sinh viên (student_code) đã tồn tại trong CSDL chưa
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { student_code }],
    });
    
    if (existingUser) {
      throw new BadRequestException('Email hoặc Mã số sinh viên đã tồn tại!');
    }

    // Mã hóa hàm băm password (Salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lưu giữ thông tin username và password đã được mã hóa vào CSDL
    const newUser = this.userRepository.create({
      student_code,
      full_name,
      email,
      password: hashedPassword,
      avatar_url,
    });

    const savedUser = await this.userRepository.save(newUser);
    
    // Ẩn trường password trước khi trả về kết quả JSON để bảo mật
    delete savedUser.password;
    return savedUser;
  }

  // Yêu cầu 4: Thực hiện chức năng Authentication/Authorization sử dụng JWT
  async login(loginDto: LoginDto, res: any, req: any) {
    const { email, password } = loginDto;

    // Tìm kiếm người dùng dựa trên email trong CSDL
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // So sánh mật khẩu người dùng nhập vào với mật khẩu đã băm trong CSDL
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // Tạo JWT Payload chứa các thông tin cơ bản của sinh viên
    const payload = { sub: user.id, email: user.email, student_code: user.student_code };
    const accessToken = await this.jwtService.signAsync(payload);

    // [Yêu cầu 1 & 2]: Lưu thông tin token vào Cookies và lưu vết ID vào Session
    res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 3600000 });
    req.session.userId = user.id;

    return {
      message: 'Đăng nhập thành công',
      accessToken,
    };
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}