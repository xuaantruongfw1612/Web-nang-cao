import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  create(data: Partial<Task>) {
    const task = this.taskRepository.create(data);
    return this.taskRepository.save(task);
  }

  // Hàm này quan trọng nhất để trả dữ liệu về cho React
  findAll() {
    return this.taskRepository.find();
  }

  findOne(id: string) {
    return this.taskRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Task>) {
    await this.taskRepository.update(id, data);
    return this.taskRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.taskRepository.delete(id);
    return { deleted: true };
  }
}