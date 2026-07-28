import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificationService } from '../src/notification/notification.service';
import { NotificationLog } from '../src/notification/entities/notification-log.entity';
import { NotificationStatus } from '../src/common/enums/notification-status.enum';

type MockRepo = Partial<Record<keyof Repository<NotificationLog>, jest.Mock>>;

// Mock query builder chainable, dùng cho các hàm có kiểm tra quyền sở hữu
// (findOwnedLogOrFail, findAllForUser, findByTaskForUser) - đều đi qua
// createQueryBuilder().innerJoin(...).where(...).andWhere(...).getOne()/getMany()
// thay vì repo.findOne()/find() trực tiếp.
const createMockQueryBuilder = () => {
  const qb: any = {
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
  };
  return qb;
};

const createMockRepo = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('NotificationService', () => {
  let service: NotificationService;
  let logRepo: MockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: getRepositoryToken(NotificationLog), useValue: createMockRepo() },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    logRepo = module.get(getRepositoryToken(NotificationLog));
  });

  afterEach(() => jest.clearAllMocks());

  describe('createLog', () => {
    it('tạo NotificationLog mới với trạng thái mặc định PENDING', async () => {
      logRepo.create!.mockImplementation((dto) => dto);
      logRepo.save!.mockImplementation((log) => Promise.resolve({ id: 1, ...log }));

      const result = await service.createLog({
        taskId: 'task-uuid-1',
        message: 'Nhắc nhở deadline',
        scheduledAt: new Date().toISOString(),
      });

      expect(result.status).toBe(NotificationStatus.PENDING);
      expect(logRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('existsPendingLogForTask', () => {
    it('trả về true nếu đã có log PENDING cho task', async () => {
      logRepo.count!.mockResolvedValue(1);
      await expect(service.existsPendingLogForTask('task-uuid-1')).resolves.toBe(true);
    });

    it('trả về false nếu chưa có log PENDING cho task', async () => {
      logRepo.count!.mockResolvedValue(0);
      await expect(service.existsPendingLogForTask('task-uuid-1')).resolves.toBe(false);
    });
  });

  // cancelNotification(userId, id) - đã sửa lại toàn bộ nhóm test này.
  // Bản cũ gọi service.cancelNotification(1) (thiếu userId) và mock qua
  // logRepo.findOne, không còn đúng với code thật (dùng createQueryBuilder
  // để chỉ tìm log thuộc về đúng userId đang đăng nhập).
  describe('cancelNotification', () => {
    it('huỷ thành công khi log đang PENDING và thuộc về đúng user', async () => {
      const qb = createMockQueryBuilder();
      qb.getOne.mockResolvedValue({ id: 1, status: NotificationStatus.PENDING });
      logRepo.createQueryBuilder!.mockReturnValue(qb);
      logRepo.save!.mockImplementation((log) => Promise.resolve(log));

      const userId = 10;
      const logId = 1;
      await expect(service.cancelNotification(userId, logId)).resolves.toBe(true);

      expect(qb.andWhere).toHaveBeenCalledWith('task.userId = :userId', { userId });
      expect(logRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: NotificationStatus.CANCELLED }),
      );
    });

    it('ném BadRequestException khi log không ở trạng thái PENDING', async () => {
      const qb = createMockQueryBuilder();
      qb.getOne.mockResolvedValue({ id: 1, status: NotificationStatus.SENT });
      logRepo.createQueryBuilder!.mockReturnValue(qb);

      await expect(service.cancelNotification(10, 1)).rejects.toThrow(BadRequestException);
      expect(logRepo.save).not.toHaveBeenCalled();
    });

    it('ném NotFoundException khi không tìm thấy log (hoặc log không thuộc về user)', async () => {
      const qb = createMockQueryBuilder();
      qb.getOne.mockResolvedValue(null);
      logRepo.createQueryBuilder!.mockReturnValue(qb);

      await expect(service.cancelNotification(10, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('cập nhật status và sentAt', async () => {
      const log = { id: 1, status: NotificationStatus.PENDING, sentAt: undefined };
      logRepo.findOne!.mockResolvedValue(log);
      logRepo.save!.mockImplementation((l) => Promise.resolve(l));

      const sentAt = new Date();
      const result = await service.updateStatus(1, NotificationStatus.SENT, sentAt);

      expect(result.status).toBe(NotificationStatus.SENT);
      expect(result.sentAt).toBe(sentAt);
    });
  });

  // updateStatusForUser(userId, id, status) - thêm mới để phủ đúng API thật
  // (PATCH /:id/status) có kiểm tra quyền sở hữu trước khi cho cập nhật.
  describe('updateStatusForUser', () => {
    it('cập nhật thành công khi log thuộc về đúng user', async () => {
      const qb = createMockQueryBuilder();
      qb.getOne.mockResolvedValue({ id: 1, status: NotificationStatus.PENDING });
      logRepo.createQueryBuilder!.mockReturnValue(qb);
      logRepo.findOne!.mockResolvedValue({ id: 1, status: NotificationStatus.PENDING });
      logRepo.save!.mockImplementation((l) => Promise.resolve(l));

      const result = await service.updateStatusForUser(10, 1, NotificationStatus.SENT);
      expect(result.status).toBe(NotificationStatus.SENT);
    });

    it('ném NotFoundException khi log không thuộc về user gọi request', async () => {
      const qb = createMockQueryBuilder();
      qb.getOne.mockResolvedValue(null);
      logRepo.createQueryBuilder!.mockReturnValue(qb);

      await expect(
        service.updateStatusForUser(10, 1, NotificationStatus.SENT),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
