import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // 1. Tạo một công việc (Task) mới
  async create(createTaskDto: any): Promise<Task> {
    const newTask = this.taskRepository.create(createTaskDto);
    // ĐÃ FIX: Dùng ép kiểu kép (unknown -> Task) để vượt qua strict mode của TypeScript
    return (await this.taskRepository.save(newTask)) as unknown as Task;
  }

  // 2. Lấy toàn bộ danh sách công việc
  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      relations: {
        subject: true,
        user: true,
      },
    });
  }

  // 3. Tìm một công việc cụ thể theo ID
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: {
        subject: true,
        user: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Không tìm thấy công việc với ID: ${id}`);
    }
    return task;
  }

  // 4. Cập nhật thông tin công việc theo ID
  async update(id: string, updateTaskDto: any): Promise<Task> {
    const task = await this.findOne(id); 
    const updatedTask = Object.assign(task, updateTaskDto);
    // ĐÃ FIX: Ép kiểu kép tương tự hàm create
    return (await this.taskRepository.save(updatedTask)) as unknown as Task;
  }

  // 5. Xóa bỏ một công việc khỏi hệ thống
  async remove(id: string): Promise<{ message: string }> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    return { message: `Đã xóa thành công công việc với ID: ${id}` };
  }
}