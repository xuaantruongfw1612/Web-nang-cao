import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateNotificationLogDto } from './dto/create-notification-log.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // GET /api/notifications
  @ApiOperation({ summary: 'Danh sách toàn bộ nhắc nhở' })
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  // GET /api/notifications/task/:taskId
  @ApiOperation({ summary: 'Danh sách nhắc nhở theo 1 công việc (Task)' })
  @Get('task/:taskId')
  findByTask(@Param('taskId') taskId: string) {
    return this.notificationService.findByTask(taskId);
  }

  // POST /api/notifications - tạo thủ công (thường do cron gọi nội bộ)
  @ApiOperation({ summary: 'Tạo bản ghi nhắc nhở thủ công' })
  @Post()
  create(@Body() dto: CreateNotificationLogDto) {
    return this.notificationService.createLog(dto);
  }

  // PATCH /api/notifications/:id/status
  @ApiOperation({ summary: 'Cập nhật trạng thái 1 nhắc nhở' })
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateNotificationStatusDto) {
    return this.notificationService.updateStatus(+id, dto.status);
  }

  // PATCH /api/notifications/:id/cancel
  @ApiOperation({ summary: 'Huỷ nhắc nhở (chỉ khi đang PENDING)' })
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.notificationService.cancelNotification(+id);
  }
}
