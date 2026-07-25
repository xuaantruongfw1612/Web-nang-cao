import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
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
    const task = await this.findOne(userId, id); // Tái sử dụng hàm findOne để check tồn tại và quyền

    // Cập nhật các trường mới vào đối tượng task cũ
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async remove(userId: number, id: string): Promise<void> {
    const task = await this.findOne(userId, id);
    await this.taskRepository.remove(task);
  }
}
