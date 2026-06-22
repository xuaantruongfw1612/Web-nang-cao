import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Yêu cầu 1: Cài đặt Cookies
  app.use(cookieParser());

  // Yêu cầu 2: Cài đặt Session
  app.use(
    session({
      secret: 'nest-secret-key-123456', // Khóa bí mật dùng để mã hóa session ID
      resave: false,
      saveUninitialized: false,
      cookie: { 
        maxAge: 3600000, // Session tồn tại trong 1 giờ (tính bằng mili-giây)
        httpOnly: true,
      },
    }),
  );

  await app.listen(3000);
  console.log('Ứng dụng đang chạy tại cổng: http://localhost:3000');
}
bootstrap();