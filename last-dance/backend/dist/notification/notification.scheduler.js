"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_status_enum_1 = require("../common/enums/notification-status.enum");
const task_status_enum_1 = require("../common/enums/task-status.enum");
const task_entity_1 = require("../tasks/entities/task.entity");
const mail_service_1 = require("./mail/mail.service");
const notification_service_1 = require("./notification.service");
let NotificationScheduler = NotificationScheduler_1 = class NotificationScheduler {
    taskRepo;
    notificationService;
    mailService;
    logger = new common_1.Logger(NotificationScheduler_1.name);
    constructor(taskRepo, notificationService, mailService) {
        this.taskRepo = taskRepo;
        this.notificationService = notificationService;
        this.mailService = mailService;
    }
    async scheduleUpcomingReminders() {
        this.logger.log('Cron kích hoạt định kỳ: quét task sắp hết hạn');
        const now = new Date();
        const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        let dueTasks = [];
        try {
            dueTasks = await this.taskRepo.find({
                where: {
                    status: task_status_enum_1.TaskStatus.PENDING,
                    taskDatetime: (0, typeorm_2.Between)(now, in24h),
                },
            });
        }
        catch (error) {
            this.logger.error(`Không thể truy vấn task PENDING: ${error.message}`);
            return;
        }
        if (dueTasks.length === 0) {
            this.logger.log('Không có task thoả mãn điều kiện nhắc nhở');
            return;
        }
        for (const task of dueTasks) {
            const alreadyLogged = await this.notificationService.existsPendingLogForTask(task.id);
            if (alreadyLogged)
                continue;
            await this.notificationService.createLog({
                taskId: task.id,
                message: `Nhắc nhở: "${task.title}" sắp đến hạn lúc ${task.taskDatetime}${task.room ? ` tại phòng ${task.room}` : ''}.`,
                scheduledAt: now.toISOString(),
            });
        }
    }
    async sendDueReminderEmails() {
        const now = new Date();
        const dueLogs = await this.notificationService.findDueForSending(now);
        if (dueLogs.length === 0)
            return;
        for (const log of dueLogs) {
            const recipient = log.task?.user;
            if (!recipient?.email) {
                this.logger.warn(`Log #${log.id} không xác định được người nhận`);
                await this.notificationService.updateStatus(log.id, notification_status_enum_1.NotificationStatus.FAILED);
                continue;
            }
            const sent = await this.mailService.sendDeadlineReminder(recipient.email, 'Nhắc nhở deadline - Student Deadline Manager', log.message);
            await this.notificationService.updateStatus(log.id, sent ? notification_status_enum_1.NotificationStatus.SENT : notification_status_enum_1.NotificationStatus.FAILED, sent ? new Date() : undefined);
        }
    }
};
exports.NotificationScheduler = NotificationScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationScheduler.prototype, "scheduleUpcomingReminders", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationScheduler.prototype, "sendDueReminderEmails", null);
exports.NotificationScheduler = NotificationScheduler = NotificationScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService,
        mail_service_1.MailService])
], NotificationScheduler);
//# sourceMappingURL=notification.scheduler.js.map