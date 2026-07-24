import { CreateNotificationLogDto } from './dto/create-notification-log.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAll(): Promise<import("./entities/notification-log.entity").NotificationLog[]>;
    findByTask(taskId: string): Promise<import("./entities/notification-log.entity").NotificationLog[]>;
    create(dto: CreateNotificationLogDto): Promise<import("./entities/notification-log.entity").NotificationLog>;
    updateStatus(id: string, dto: UpdateNotificationStatusDto): Promise<import("./entities/notification-log.entity").NotificationLog>;
    cancel(id: string): Promise<boolean>;
}
