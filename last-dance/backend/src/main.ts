import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Tự động validate DTO (class-validator) trên mọi request, trả 400 kèm message rõ ràng
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // loại bỏ field lạ không khai báo trong DTO
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger/OpenAPI - truy cập tại /api/docs sau khi chạy server.
  // Bấm nút "Authorize" và dán accessToken (không cần gõ chữ "Bearer ") để
  // test thử các API cần đăng nhập ngay trên giao diện Swagger.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Student Deadline Manager API')
    .setDescription(
      'API quản lý tài khoản, môn học, công việc/deadline và nhắc nhở tự động qua email.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // tên định danh, tham chiếu trong @ApiBearerAuth('access-token')
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Server đang chạy tại http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger docs tại http://localhost:${port}/api/docs`);
}
bootstrap();
