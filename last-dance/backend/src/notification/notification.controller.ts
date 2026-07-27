import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateNotificationLogDto } from './dto/create-notification-log.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { NotificationScheduler } from './notification.scheduler';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationScheduler: NotificationScheduler,
  ) {}

  // GET /api/notifications - CHỈ trả nhắc nhở thuộc về chính người gọi
  @ApiOperation({ summary: 'Danh sách nhắc nhở của chính người dùng đang đăng nhập' })
  @Get()
  findAll(@Req() req: any) {
    return this.notificationService.findAllForUser(req.user.userId);
  }

  // GET /api/notifications/task/:taskId
  @ApiOperation({ summary: 'Danh sách nhắc nhở theo 1 công việc (Task) của chính mình' })
  @Get('task/:taskId')
  findByTask(@Req() req: any, @Param('taskId') taskId: string) {
    return this.notificationService.findByTaskForUser(req.user.userId, taskId);
  }

  // POST /api/notifications - tạo thủ công (thường do cron gọi nội bộ)
  @ApiOperation({ summary: 'Tạo bản ghi nhắc nhở thủ công' })
  @Post()
  create(@Body() dto: CreateNotificationLogDto) {
    return this.notificationService.createLog(dto);
  }

  // PATCH /api/notifications/:id/status - chỉ sửa được log của chính mình
  @ApiOperation({ summary: 'Cập nhật trạng thái 1 nhắc nhở (của chính mình)' })
  @Patch(':id/status')
  updateStatus(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateNotificationStatusDto) {
    return this.notificationService.updateStatusForUser(req.user.userId, +id, dto.status);
  }

  // PATCH /api/notifications/:id/cancel - chỉ huỷ được log của chính mình
  @ApiOperation({ summary: 'Huỷ nhắc nhở của chính mình (chỉ khi đang PENDING)' })
  @Patch(':id/cancel')
  cancel(@Req() req: any, @Param('id') id: string) {
    return this.notificationService.cancelNotification(req.user.userId, +id);
  }

  // POST /api/notifications/run-now
  // CHỈ phục vụ test/demo: kích hoạt ngay 2 cron job (lập lịch + gửi email)
  // thay vì phải chờ đúng đầu giờ (lập lịch) và tối đa 5 phút (gửi email).
  // Lưu ý: task đã QUÁ HẠN sẽ không được lên lịch nhắc - đây là hành vi đúng
  // theo thiết kế (chỉ nhắc task sắp đến hạn trong 24h, không nhắc task trễ).
  @ApiOperation({
    summary: '[Demo/Test] Chạy ngay 2 cronjob (lập lịch + gửi email), không cần chờ',
  })
  @Post('run-now')
  async runSchedulerNow() {
    await this.notificationScheduler.scheduleUpcomingReminders();
    await this.notificationScheduler.sendDueReminderEmails();
    return { message: 'Đã chạy xong: lập lịch nhắc nhở + gửi email cho các log đến hạn.' };
  }
}
