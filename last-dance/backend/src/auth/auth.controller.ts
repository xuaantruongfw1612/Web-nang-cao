import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/register
  // Giới hạn 5 lần/phút/IP - tránh spam tạo tài khoản hàng loạt.
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /api/auth/login
  // Giới hạn 5 lần/phút/IP - chống brute-force dò mật khẩu (Câu 9).
  @ApiOperation({ summary: 'Đăng nhập, trả về accessToken + refreshToken' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // POST /api/auth/refresh - cấp accessToken mới từ refreshToken còn hiệu lực
  @ApiOperation({ summary: 'Cấp accessToken mới từ refreshToken (tự rotate refreshToken)' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto);
  }

  // POST /api/auth/logout - thu hồi refresh token hiện tại
  @ApiOperation({ summary: 'Đăng xuất - thu hồi refreshToken hiện tại' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: any) {
    return this.authService.logout(req.user.userId);
  }

  // GET /api/auth/profile - lấy thông tin của chính người dùng đang đăng nhập
  @ApiOperation({ summary: 'Thông tin tài khoản đang đăng nhập' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  // PATCH /api/auth/profile
  @ApiOperation({ summary: 'Cập nhật hồ sơ (họ tên / ảnh đại diện)' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.userId, dto);
  }

  // PATCH /api/auth/change-password
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, dto);
  }
}
