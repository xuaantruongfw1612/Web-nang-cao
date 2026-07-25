import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskService } from '../src/tasks/task.service';
import { Task } from '../src/tasks/entities/task.entity';
import { TaskStatus } from '../src/common/enums/task-status.enum';

type MockRepo = Partial<Record<keyof Repository<Task>, jest.Mock>>;

const createMockRepo = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('TaskService', () => {
  let service: TaskService;
  let taskRepo: MockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, { provide: getRepositoryToken(Task), useValue: createMockRepo() }],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepo = module.get(getRepositoryToken(Task));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('gán đúng userId của người gọi khi tạo task', async () => {
      taskRepo.create!.mockImplementation((dto) => dto);
      taskRepo.save!.mockImplementation((task) => Promise.resolve({ id: 'uuid-1', ...task }));

      const result = await service.create(7, {
        title: 'Nộp báo cáo',
        taskDatetime: '2026-08-01T09:00:00.000Z',
      });

      expect(taskRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Nộp báo cáo', userId: 7 }),
      );
      expect(result.id).toBe('uuid-1');
    });
  });

  describe('findAll', () => {
    it('chỉ lấy task của đúng user, sắp xếp theo taskDatetime tăng dần, kèm Subject', async () => {
      taskRepo.find!.mockResolvedValue([]);
      await service.findAll(7);

      expect(taskRepo.find).toHaveBeenCalledWith({
        where: { userId: 7 },
        order: { taskDatetime: 'ASC' },
        relations: { subject: true },
      });
    });
  });

  describe('findOne', () => {
    it('ném NotFoundException khi task không tồn tại hoặc không thuộc user', async () => {
      taskRepo.findOne!.mockResolvedValue(null);

      await expect(service.findOne(7, 'uuid-khong-ton-tai')).rejects.toThrow(NotFoundException);
    });

    it('trả về task khi tìm thấy và đúng chủ sở hữu', async () => {
      const task = { id: 'uuid-1', userId: 7, title: 'Nộp báo cáo' } as Task;
      taskRepo.findOne!.mockResolvedValue(task);

      await expect(service.findOne(7, 'uuid-1')).resolves.toBe(task);
    });
  });

  describe('update', () => {
    it('cập nhật đúng task sau khi xác thực quyền sở hữu (tái sử dụng findOne)', async () => {
      const existing = { id: 'uuid-1', userId: 7, title: 'Cũ', status: TaskStatus.PENDING } as Task;
      taskRepo.findOne!.mockResolvedValue(existing);
      taskRepo.save!.mockImplementation((task) => Promise.resolve(task));

      const result = await service.update(7, 'uuid-1', { title: 'Mới' });

      expect(result.title).toBe('Mới');
      expect(taskRepo.save).toHaveBeenCalledWith(expect.objectContaining({ title: 'Mới' }));
    });

    it('ném NotFoundException khi cập nhật task không thuộc quyền sở hữu', async () => {
      taskRepo.findOne!.mockResolvedValue(null);

      await expect(service.update(7, 'uuid-cua-nguoi-khac', { title: 'Hack' })).rejects.toThrow(
        NotFoundException,
      );
      expect(taskRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('chỉ xoá được sau khi xác thực quyền sở hữu', async () => {
      const existing = { id: 'uuid-1', userId: 7 } as Task;
      taskRepo.findOne!.mockResolvedValue(existing);

      await service.remove(7, 'uuid-1');

      expect(taskRepo.remove).toHaveBeenCalledWith(existing);
    });

    it('ném NotFoundException khi xoá task không thuộc quyền sở hữu', async () => {
      taskRepo.findOne!.mockResolvedValue(null);

      await expect(service.remove(7, 'uuid-cua-nguoi-khac')).rejects.toThrow(NotFoundException);
      expect(taskRepo.remove).not.toHaveBeenCalled();
    });
  });
});

describe('Task.isOverdue()', () => {
  const buildTask = (overrides: Partial<Task>): Task => Object.assign(new Task(), overrides);

  it('trả về true khi đã qua hạn và chưa hoàn thành/huỷ', () => {
    const task = buildTask({
      taskDatetime: new Date(Date.now() - 60_000), // 1 phút trước
      status: TaskStatus.PENDING,
    });
    expect(task.isOverdue()).toBe(true);
  });

  it('trả về false khi thời hạn còn ở tương lai', () => {
    const task = buildTask({
      taskDatetime: new Date(Date.now() + 60_000), // 1 phút nữa
      status: TaskStatus.PENDING,
    });
    expect(task.isOverdue()).toBe(false);
  });

  it('trả về false khi đã quá hạn nhưng đã COMPLETED (không tính là trễ nữa)', () => {
    const task = buildTask({
      taskDatetime: new Date(Date.now() - 60_000),
      status: TaskStatus.COMPLETED,
    });
    expect(task.isOverdue()).toBe(false);
  });

  it('trả về false khi đã quá hạn nhưng đã CANCELLED', () => {
    const task = buildTask({
      taskDatetime: new Date(Date.now() - 60_000),
      status: TaskStatus.CANCELLED,
    });
    expect(task.isOverdue()).toBe(false);
  });
});
