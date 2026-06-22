import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'; // Đã chuyển sang default import
import session from 'express-session';    // Đã chuyển sang default import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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