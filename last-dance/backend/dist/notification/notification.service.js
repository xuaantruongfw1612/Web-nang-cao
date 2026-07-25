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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_status_enum_1 = require("../common/enums/notification-status.enum");
const notification_log_entity_1 = require("./entities/notification-log.entity");
let NotificationService = class NotificationService {
    constructor(logRepo) {
        this.logRepo = logRepo;
    }
    async createLog(dto) {
        const log = this.logRepo.create({
            task: { id: dto.taskId },
            message: dto.message,
            scheduledAt: new Date(dto.scheduledAt),
            status: notification_status_enum_1.NotificationStatus.PENDING,
        });
        return this.logRepo.save(log);
    }
    async existsPendingLogForTask(taskId) {
        const count = await this.logRepo.count({
            where: { taskId, status: notification_status_enum_1.NotificationStatus.PENDING },
        });
        return count > 0;
    }
    async findAll() {
        return this.logRepo.find({ order: { scheduledAt: 'ASC' } });
    }
    async findByTask(taskId) {
        return this.logRepo.find({ where: { taskId }, order: { createdAt: 'DESC' } });
    }
    async findDueForSending(now) {
        return this.logRepo.find({
            where: { status: notification_status_enum_1.NotificationStatus.PENDING, scheduledAt: (0, typeorm_2.LessThanOrEqual)(now) },
            relations: { task: { user: true } },
        });
    }
    async updateStatus(id, status, sentAt) {
        const log = await this.findOneOrFail(id);
        log.status = status;
        if (sentAt)
            log.sentAt = sentAt;
        return this.logRepo.save(log);
    }
    async cancelNotification(id) {
        const log = await this.findOneOrFail(id);
        if (log.status !== notification_status_enum_1.NotificationStatus.PENDING) {
            throw new common_1.BadRequestException('Chỉ có thể huỷ nhắc nhở đang ở trạng thái PENDING');
        }
        log.status = notification_status_enum_1.NotificationStatus.CANCELLED;
        await this.logRepo.save(log);
        return true;
    }
    async findOneOrFail(id) {
        const log = await this.logRepo.findOne({ where: { id } });
        if (!log) {
            throw new common_1.NotFoundException('Không tìm thấy bản ghi nhắc nhở');
        }
        return log;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_log_entity_1.NotificationLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map