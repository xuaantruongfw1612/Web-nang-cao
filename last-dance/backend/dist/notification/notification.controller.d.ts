import { CreateNotificationLogDto } from './dto/create-notification-log.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { NotificationService } from './notification.service';
import { NotificationScheduler } from './notification.scheduler';
export declare class NotificationController {
    private readonly notificationService;
    private readonly notificationScheduler;
    constructor(notificationService: NotificationService, notificationScheduler: NotificationScheduler);
    findAll(): Promise<import("./entities/notification-log.entity").NotificationLog[]>;
    findByTask(taskId: string): Promise<import("./entities/notification-log.entity").NotificationLog[]>;
    create(dto: CreateNotificationLogDto): Promise<import("./entities/notification-log.entity").NotificationLog>;
    updateStatus(id: string, dto: UpdateNotificationStatusDto): Promise<import("./entities/notification-log.entity").NotificationLog>;
    cancel(id: string): Promise<boolean>;
    runSchedulerNow(): Promise<{
        message: string;
    }>;
}
