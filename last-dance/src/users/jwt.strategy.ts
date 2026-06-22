import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MY_SUPER_SECRET_KEY_JWT_2026', // Trùng với secret bên Module
    });
  }

  async validate(payload: any) {
    // Trả về dữ liệu đính kèm vào req.user
    return { userId: payload.sub, username: payload.username };
  }
}