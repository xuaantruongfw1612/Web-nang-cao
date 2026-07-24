import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
// Giả định bạn đã có JwtAuthGuard bảo vệ route
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('tasks')
// @UseGuards(JwtAuthGuard) // Nhớ bật Guard này để đảm bảo chỉ user đã đăng nhập mới gọi được API
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    const userId = req.user.id; // Lấy ID của user đang gọi request
    return this.taskService.create(userId, createTaskDto);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.taskService.findAll(userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.taskService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const userId = req.user.id;
    return this.taskService.update(userId, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.taskService.remove(userId, id);
  }
}