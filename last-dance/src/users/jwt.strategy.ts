import { Injectable } from '@nestjs/common'; // Sửa thành @nestjs/common
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ?? 'fallback-secret-key',
    });
  }

  validate(payload: {
    sub: number;
    email: string;
    student_code: string;
    full_name: string;
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      studentCode: payload.student_code,
      fullName: payload.full_name,
    };
  }
}
