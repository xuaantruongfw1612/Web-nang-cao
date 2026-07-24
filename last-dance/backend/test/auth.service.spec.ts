import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/auth/entities/user.entity';

// Mock repository giả lập TypeORM Repository<User>, không cần DB thật
type MockRepo = Partial<Record<keyof Repository<User>, jest.Mock>>;

const createMockRepo = (): MockRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: MockRepo;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: createMockRepo() },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('fake-jwt-token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('tạo user mới thành công khi email/mã SV chưa tồn tại', async () => {
      userRepo.findOne!.mockResolvedValue(null);
      userRepo.create!.mockImplementation((dto) => dto);
      userRepo.save!.mockImplementation((user) => Promise.resolve({ id: 1, ...user }));

      const result = await service.register({
        studentCode: 'SV001',
        fullName: 'Nguyen Van A',
        email: 'a@gmail.com',
        password: '123456',
      });

      expect(result).toHaveProperty('id', 1);
      // Mật khẩu phải được hash, không lưu plain text
      expect(result.password).not.toBe('123456');
      expect(userRepo.save).toHaveBeenCalledTimes(1);
    });

    it('ném ConflictException khi email hoặc mã SV đã tồn tại', async () => {
      userRepo.findOne!.mockResolvedValue({ id: 1, email: 'a@gmail.com' });

      await expect(
        service.register({
          studentCode: 'SV001',
          fullName: 'Nguyen Van A',
          email: 'a@gmail.com',
          password: '123456',
        }),
      ).rejects.toThrow(ConflictException);

      expect(userRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('trả về accessToken khi email/mật khẩu đúng', async () => {
      const hashed = await bcrypt.hash('123456', 10);
      userRepo.findOne!.mockResolvedValue({ id: 1, email: 'a@gmail.com', password: hashed });

      const result = await service.login({ email: 'a@gmail.com', password: '123456' });

      expect(result.accessToken).toBe('fake-jwt-token');
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1, email: 'a@gmail.com' });
    });

    it('ném UnauthorizedException khi email không tồn tại', async () => {
      userRepo.findOne!.mockResolvedValue(null);

      await expect(
        service.login({ email: 'khongton@gmail.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('ném UnauthorizedException khi sai mật khẩu', async () => {
      const hashed = await bcrypt.hash('mat-khau-dung', 10);
      userRepo.findOne!.mockResolvedValue({ id: 1, email: 'a@gmail.com', password: hashed });

      await expect(
        service.login({ email: 'a@gmail.com', password: 'sai-mat-khau' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    it('ném UnauthorizedException khi mật khẩu hiện tại không đúng', async () => {
      const hashed = await bcrypt.hash('mat-khau-dung', 10);
      userRepo.findOne!.mockResolvedValue({ id: 1, password: hashed });

      await expect(
        service.changePassword(1, { oldPassword: 'sai', newPassword: 'moi123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
