import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'; // Đã chuyển sang default import
import session from 'express-session';    // Đã chuyển sang default import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật CORS để cho phép Frontend (React) gọi API mà không bị trình duyệt chặn
  app.enableCors({
    origin: true, // Cho phép mọi nguồn (hoặc bạn có thể điền url frontend của bạn vào đây)
    credentials: true, // Quan trọng: Cho phép gửi cookie/session qua lại giữa 2 domain
  });

  app.use(cookieParser());
  app.use(
    session({
      secret: 'my-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );

  await app.listen(3001);
}
bootstrap();