import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Module({
  // Import Entity để TypeORM nhận diện bảng 'tasks'
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService], // Export nếu các module khác cần dùng
})
export class TaskModule {}