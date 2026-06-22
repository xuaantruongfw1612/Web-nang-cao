import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Yêu cầu số 3: Viết POST API đăng ký từ phía người dùng
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(
      body.studentCode,
      body.fullName,
      body.email,
      body.password,
    );
  }

  // POST API Đăng nhập để lấy chuỗi JWT Token
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác');
    return this.authService.login(user);
  }

  // Yêu cầu số 4: Kiểm tra Authorisation/Authentication bằng cách gắn Guard kiểm soát Token
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // Trả về thông tin nếu gửi kèm Header Bearer Token hợp lệ
  }
}