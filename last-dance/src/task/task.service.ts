import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  
  private async checkDuplicateTask(title: string, dateTime: Date, userId: number, excludeTaskId?: string) {
    const query = this.taskRepository.createQueryBuilder('task')
      .where('task.title = :title', { title })
      .andWhere('task.dateTime = :dateTime', { dateTime })
      .andWhere('task.user_id = :userId', { userId }); 

    
    if (excludeTaskId) {
      query.andWhere('task.id != :excludeTaskId', { excludeTaskId });
    }

    const isDuplicate = await query.getOne();
    if (isDuplicate) {
      throw new ConflictException('Lỗi: Bạn đã có một lịch trình trùng tên và thời gian này rồi!');
    }
  }

  
  async create(data: Partial<Task>): Promise<Task> {
    
    if ((data.type === 'EXAM' || data.type === 'CLASS') && !data.room) {
      throw new BadRequestException('Lịch thi/học phải có phòng cụ thể!');
    }

    
    const userId = data.user ? data.user.id : (data as any).user_id; 
    if (data.title && data.dateTime && userId) {
      await this.checkDuplicateTask(data.title, data.dateTime, userId);
    }

   
    const newTask = this.taskRepository.create(data);
    return await this.taskRepository.save(newTask);
  }

  
  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      relations: ['subject', 'user'],
      order: { dateTime: 'ASC' }
    });
  }

  
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['subject', 'user']
    });
    if (!task) throw new NotFoundException('Không tìm thấy lịch/deadline này');
    return task;
  }

  
  async update(id: string, data: Partial<Task>): Promise<Task> {
    const existingTask = await this.findOne(id); 

    
    const userId = existingTask.user?.id;

    
    const checkTitle = data.title || existingTask.title;
    const checkDateTime = data.dateTime || existingTask.dateTime;

    if (userId) {
      /
      await this.checkDuplicateTask(checkTitle, checkDateTime, userId, id);
    }

    await this.taskRepository.update(id, data);
    return this.findOne(id);
  }

 
  async remove(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Không tìm thấy lịch/deadline để xóa');
    }
  }
}