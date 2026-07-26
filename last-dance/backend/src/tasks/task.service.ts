import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    // 1. Kiểm tra trùng tên công việc (hoặc trùng cả ngày/giờ nếu cần) của cùng user
    const existingTask = await this.taskRepository.findOne({
      where: {
        userId,
        title: createTaskDto.title, // Nếu tên thuộc tính trong DTO của bạn là taskName, hãy đổi thành createTaskDto.taskName
      },
    });

    if (existingTask) {
      throw new ConflictException('Công việc này đã tồn tại trong danh sách của bạn!');
    }

    const newTask = this.taskRepository.create({
      ...createTaskDto,
      userId,
    });
    return await this.taskRepository.save(newTask);
  }

  async findAll(userId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { userId },
      order: { taskDatetime: 'ASC' },
      relations: { subject: true },
    });
  }

  async findOne(userId: number, id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId },
      relations: { subject: true },
    });

    if (!task) {
      throw new NotFoundException('Không tìm thấy công việc này hoặc bạn không có quyền truy cập');
    }
    return task;
  }

  async update(userId: number, id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(userId, id); // Check tồn tại và quyền

    // 2. Kiểm tra trùng tên với các công việc KHÁC của cùng user (trừ chính nó ra)
    if (updateTaskDto.title) {
      const duplicateTask = await this.taskRepository.findOne({
        where: {
          userId,
          title: updateTaskDto.title,
          id: Not(id), // Khác ID hiện tại
        },
      });

      if (duplicateTask) {
        throw new ConflictException('Tên công việc này đã bị trùng với một deadline khác!');
      }
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async remove(userId: number, id: string): Promise<void> {
    const task = await this.findOne(userId, id);
    await this.taskRepository.remove(task);
  }
}