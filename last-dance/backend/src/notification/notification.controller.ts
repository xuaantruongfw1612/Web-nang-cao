import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateNotificationLogDto } from './dto/create-notification-log.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { NotificationService } from './notification.service';

@UseGuards(JwtAuthGuard)
@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // GET /api/notifications
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  // GET /api/notifications/task/:taskId
  @Get('task/:taskId')
  findByTask(@Param('taskId') taskId: string) {
    return this.notificationService.findByTask(taskId);
  }

  // POST /api/notifications - tạo thủ công (thường do cron gọi nội bộ)
  @Post()
  create(@Body() dto: CreateNotificationLogDto) {
    return this.notificationService.createLog(dto);
  }

  // PATCH /api/notifications/:id/status
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateNotificationStatusDto) {
    return this.notificationService.updateStatus(+id, dto.status);
  }

  // PATCH /api/notifications/:id/cancel
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.notificationService.cancelNotification(+id);
  }
}
