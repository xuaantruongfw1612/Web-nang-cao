import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificationService } from '../src/notification/notification.service';
import { NotificationLog } from '../src/notification/entities/notification-log.entity';
import { NotificationStatus } from '../src/common/enums/notification-status.enum';

type MockRepo = Partial<Record<keyof Repository<NotificationLog>, jest.Mock>>;

const createMockRepo = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
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

  describe('cancelNotification', () => {
    it('huỷ thành công khi log đang PENDING', async () => {
      const log = { id: 1, status: NotificationStatus.PENDING };
      logRepo.findOne!.mockResolvedValue(log);
      logRepo.save!.mockResolvedValue({ ...log, status: NotificationStatus.CANCELLED });

      await expect(service.cancelNotification(1)).resolves.toBe(true);
      expect(logRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: NotificationStatus.CANCELLED }),
      );
    });

    it('ném BadRequestException khi log không ở trạng thái PENDING', async () => {
      logRepo.findOne!.mockResolvedValue({ id: 1, status: NotificationStatus.SENT });

      await expect(service.cancelNotification(1)).rejects.toThrow(BadRequestException);
    });

    it('ném NotFoundException khi không tìm thấy log', async () => {
      logRepo.findOne!.mockResolvedValue(null);

      await expect(service.cancelNotification(999)).rejects.toThrow(NotFoundException);
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
});
