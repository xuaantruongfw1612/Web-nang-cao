import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // app.enableCors({
  //   origin: true,
  //   credentials: true,
  // });

app.enableCors({
  origin: 'https://bookish-fishstick-4jwgx96rp94vhgr9-3000.app.github.dev', // Điền chính xác URL trang React của bạn vào đây
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});

  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'fallback-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
        httpOnly: true,
      },
    }),
  );

  // Lưu ý: Cổng đang chạy là 3001
  await app.listen(process.env.PORT || 3001);
}
bootstrap();