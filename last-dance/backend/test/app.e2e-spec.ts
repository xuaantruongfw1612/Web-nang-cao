import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/auth/entities/user.entity';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { NotificationModule } from '../src/notification/notification.module';
import { NotificationLog } from '../src/notification/entities/notification-log.entity';
import { SubjectModule } from '../src/subjects/subject.module';
import { Subject } from '../src/subjects/subject.entity';
import { Task } from '../src/tasks/entities/task.entity';

// Test này dựng toàn bộ ứng dụng thật (đi qua ValidationPipe, Controller, Service,
// TypeORM, ExceptionFilter) và gọi API qua HTTP thật bằng supertest.
// Dùng SQLite in-memory thay cho Aiven MySQL để test chạy nhanh, không phụ thuộc
// mạng/CSDL thật, không sợ để lại dữ liệu rác.
describe('Auth API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [User, Subject, Task, NotificationLog],
          synchronize: true,
          dropSchema: true,
        }),
        AuthModule,
        NotificationModule,
        SubjectModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/register -> 201 khi dữ liệu hợp lệ', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/register').send({
      studentCode: 'SV001',
      fullName: 'Nguyen Van A',
      email: 'a@gmail.com',
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('a@gmail.com');
    expect(res.body.password).toBeUndefined(); // không lộ password
  });

  it('POST /api/auth/register -> 409 khi trùng email', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/register').send({
      studentCode: 'SV999',
      fullName: 'Trùng email',
      email: 'a@gmail.com', // đã đăng ký ở test trước
      password: '123456',
    });

    expect(res.status).toBe(409);
  });

  it('POST /api/auth/register -> 400 khi thiếu field / sai định dạng email', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/register').send({
      studentCode: 'SV002',
      fullName: 'Thiếu email',
      email: 'khong-phai-email',
      password: '123456',
    });

    expect(res.status).toBe(400);
  });

  it('POST /api/auth/register -> 400 khi gửi field lạ không khai báo trong DTO', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/register').send({
      studentCode: 'SV003',
      fullName: 'Field lạ',
      email: 'b@gmail.com',
      password: '123456',
      isAdmin: true, // field không có trong RegisterDto -> forbidNonWhitelisted chặn
    });

    expect(res.status).toBe(400);
  });

  it('POST /api/auth/login -> 200 + accessToken khi đúng thông tin', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'a@gmail.com',
      password: '123456',
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('POST /api/auth/login -> 401 khi sai mật khẩu', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'a@gmail.com',
      password: 'sai-mat-khau',
    });

    expect(res.status).toBe(401);
  });

  it('GET /api/auth/profile -> 401 khi không có JWT', async () => {
    const res = await request(app.getHttpServer()).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/profile -> 200 khi có JWT hợp lệ', async () => {
    const login = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'a@gmail.com',
      password: '123456',
    });

    const res = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${login.body.accessToken}`);

    expect(res.status).toBe(200);
  });
});
