import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationScheduler } from '../src/notification/notification.scheduler';
import { NotificationService } from '../src/notification/notification.service';
import { MailService } from '../src/notification/mail/mail.service';
import { Task } from '../src/tasks/entities/task.entity';
import { TaskStatus } from '../src/common/enums/task-status.enum';
import { NotificationStatus } from '../src/common/enums/notification-status.enum';

type MockTaskRepo = Partial<Record<keyof Repository<Task>, jest.Mock>>;

describe('NotificationScheduler', () => {
  let scheduler: NotificationScheduler;
  let taskRepo: MockTaskRepo;
  let notificationService: {
    existsPendingLogForTask: jest.Mock;
    createLog: jest.Mock;
    findDueForSending: jest.Mock;
    updateStatus: jest.Mock;
  };
  let mailService: { sendDeadlineReminder: jest.Mock };

  beforeEach(async () => {
    taskRepo = { find: jest.fn() };
    notificationService = {
      existsPendingLogForTask: jest.fn(),
      createLog: jest.fn(),
      findDueForSending: jest.fn(),
      updateStatus: jest.fn(),
    };
    mailService = { sendDeadlineReminder: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationScheduler,
        { provide: getRepositoryToken(Task), useValue: taskRepo },
        { provide: NotificationService, useValue: notificationService },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    scheduler = module.get<NotificationScheduler>(NotificationScheduler);
  });

  afterEach(() => jest.clearAllMocks());

  describe('scheduleUpcomingReminders', () => {
    it('bỏ qua task đã có log PENDING (không tạo trùng)', async () => {
      taskRepo.find!.mockResolvedValue([
        { id: 'task-1', title: 'Bài tập lớn', taskDatetime: new Date(), status: TaskStatus.PENDING },
      ] as Task[]);
      notificationService.existsPendingLogForTask!.mockResolvedValue(true);

      await scheduler.scheduleUpcomingReminders();

      expect(notificationService.createLog).not.toHaveBeenCalled();
    });

    it('tạo log mới cho task chưa có log', async () => {
      taskRepo.find!.mockResolvedValue([
        { id: 'task-2', title: 'Đồ án', taskDatetime: new Date(), status: TaskStatus.PENDING },
      ] as Task[]);
      notificationService.existsPendingLogForTask!.mockResolvedValue(false);

      await scheduler.scheduleUpcomingReminders();

      expect(notificationService.createLog).toHaveBeenCalledWith(
        expect.objectContaining({ taskId: 'task-2' }),
      );
    });

    it('không văng lỗi khi truy vấn DB thất bại (bắt lỗi, log rồi dừng)', async () => {
      taskRepo.find!.mockRejectedValue(new Error('DB down'));

      await expect(scheduler.scheduleUpcomingReminders()).resolves.not.toThrow();
      expect(notificationService.createLog).not.toHaveBeenCalled();
    });
  });

  describe('sendDueReminderEmails', () => {
    it('cập nhật SENT khi gửi email thành công', async () => {
      notificationService.findDueForSending!.mockResolvedValue([
        { id: 1, message: 'Nhắc nhở', task: { user: { email: 'a@gmail.com' } } } as any,
      ]);
      mailService.sendDeadlineReminder!.mockResolvedValue(true);

      await scheduler.sendDueReminderEmails();

      expect(notificationService.updateStatus).toHaveBeenCalledWith(
        1,
        NotificationStatus.SENT,
        expect.any(Date),
      );
    });

    it('cập nhật FAILED khi gửi email thất bại', async () => {
      notificationService.findDueForSending!.mockResolvedValue([
        { id: 2, message: 'Nhắc nhở', task: { user: { email: 'a@gmail.com' } } } as any,
      ]);
      mailService.sendDeadlineReminder!.mockResolvedValue(false);

      await scheduler.sendDueReminderEmails();

      expect(notificationService.updateStatus).toHaveBeenCalledWith(2, NotificationStatus.FAILED, undefined);
    });

    it('cập nhật FAILED khi không xác định được người nhận (thiếu email)', async () => {
      notificationService.findDueForSending!.mockResolvedValue([
        { id: 3, message: 'Nhắc nhở', task: { user: null } } as any,
      ]);

      await scheduler.sendDueReminderEmails();

      expect(mailService.sendDeadlineReminder).not.toHaveBeenCalled();
      expect(notificationService.updateStatus).toHaveBeenCalledWith(3, NotificationStatus.FAILED);
    });
  });
});
