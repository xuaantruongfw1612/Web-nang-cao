import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: { userId: number; email: string };
}

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Tạo công việc/deadline mới' })
  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(req.user.userId, createTaskDto);
  }

  @ApiOperation({ summary: 'Danh sách công việc của người dùng' })
  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.taskService.findAll(req.user.userId);
  }

  @ApiOperation({ summary: 'Chi tiết 1 công việc' })
  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.taskService.findOne(req.user.userId, id);
  }

  @ApiOperation({ summary: 'Cập nhật công việc' })
  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(req.user.userId, id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Xoá công việc' })
  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.taskService.remove(req.user.userId, id);
  }
}
