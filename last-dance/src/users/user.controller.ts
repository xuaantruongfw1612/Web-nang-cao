import { Controller, Post, Get, Body, Res, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto, LoginDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return this.userService.login(loginDto, res, req);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    return {
      message: 'Bạn đã truy cập thành công vào route bảo mật',
      userLogedIn: req.user,
    };
  }
}
