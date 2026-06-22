import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // API Đăng ký: POST http://localhost:3000/users/register
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.register(createUserDto);
    return {
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data: {
        id: user.id,
        username: user.username,
      },
    };
  }

  // API Đăng nhập: POST http://localhost:3000/users/login
  @Post('login')
  async login(@Body() loginDto: CreateUserDto) {
    return this.userService.login(loginDto);
  }

  // Thêm một Route bảo mật để test tính năng Authorization của JWT (Yêu cầu 4)
  // Gửi Bearer Token nhận được từ API Login vào Header để gọi API này
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: 'Truy cập API bảo mật thành công!',
      user: req.user,
    };
  }
}