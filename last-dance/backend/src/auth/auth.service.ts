import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';

const SALT_ROUNDS = 10;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const existed = await this.userRepo.findOne({
      where: [{ email: dto.email }, { studentCode: dto.studentCode }],
    });

    // Đã tồn tại (trùng lặp) -> 409 Conflict
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

  async login(dto: LoginDto): Promise<TokenPair & { user: User }> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    // Không tiết lộ email/mật khẩu sai cụ thể để tránh dò tài khoản (bảo mật - Câu 9)
    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    const tokens = await this.generateTokenPair(user);
    await this.storeRefreshToken(user, tokens.refreshToken);

    return { ...tokens, user };
  }

  // Cấp lại accessToken mới từ refreshToken còn hiệu lực, đồng thời "xoay vòng"
  // (rotate) refreshToken: phát hành refreshToken mới và vô hiệu hoá cái cũ.
  // Nếu refreshToken bị dùng lại (đã bị rotate trước đó) -> nghi ngờ bị đánh
  // cắp -> thu hồi toàn bộ, buộc đăng nhập lại.
  async refreshTokens(dto: RefreshTokenDto): Promise<TokenPair> {
    let payload: { sub: number; email: string };
    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: this.getRefreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Phiên đăng nhập không tồn tại, vui lòng đăng nhập lại');
    }

    if (!this.matchesStoredToken(dto.refreshToken, user.refreshTokenHash)) {
      // Refresh token cũ bị dùng lại sau khi đã rotate -> khả năng bị đánh cắp.
      // Thu hồi ngay toàn bộ phiên để bắt buộc đăng nhập lại.
      user.refreshTokenHash = null;
      await this.userRepo.save(user);
      throw new UnauthorizedException('Refresh token không hợp lệ, vui lòng đăng nhập lại');
    }

    const tokens = await this.generateTokenPair(user);
    await this.storeRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  // Thu hồi refresh token hiện tại (đăng xuất khỏi thiết bị này)
  async logout(userId: number): Promise<boolean> {
    const user = await this.findByIdOrFail(userId);
    user.refreshTokenHash = null;
    await this.userRepo.save(user);
    return true;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findByIdOrFail(userId);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async getProfile(userId: number): Promise<User> {
    return this.findByIdOrFail(userId);
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<boolean> {
    const user = await this.findByIdOrFail(userId);

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    user.password = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    // Đổi mật khẩu xong thì thu hồi luôn phiên cũ, buộc đăng nhập lại bằng mật khẩu mới.
    user.refreshTokenHash = null;
    await this.userRepo.save(user);
    return true;
  }

  private async generateTokenPair(user: User): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.getAccessSecret(),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES', '15m') as any,
    });

    // jti (JWT ID) ngẫu nhiên riêng cho từng refresh token: JWT chỉ có độ phân
    // giải thời gian theo GIÂY (iat/exp), nên 2 token phát trong cùng 1 giây
    // với cùng payload {sub, email} sẽ giống hệt nhau nếu không có jti - khiến
    // cơ chế phát hiện "dùng lại token cũ sau khi đã rotate" mất tác dụng.
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, jti: randomUUID() },
      {
        secret: this.getRefreshSecret(),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES', '7d') as any,
      },
    );

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(user: User, refreshToken: string): Promise<void> {
    user.refreshTokenHash = this.hashToken(refreshToken);
    await this.userRepo.save(user);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private matchesStoredToken(incomingToken: string, storedHash: string): boolean {
    const incoming = Buffer.from(this.hashToken(incomingToken), 'hex');
    const stored = Buffer.from(storedHash, 'hex');
    // So sánh độ dài trước (timingSafeEqual yêu cầu 2 buffer cùng độ dài),
    // rồi dùng so sánh an toàn thời gian để tránh timing attack.
    return incoming.length === stored.length && timingSafeEqual(incoming, stored);
  }

  private getAccessSecret(): string {
    return this.config.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret-change-me');
  }

  private getRefreshSecret(): string {
    return this.config.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me');
  }

  private async findByIdOrFail(userId: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }
}
