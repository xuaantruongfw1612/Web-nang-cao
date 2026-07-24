import { Repository } from 'typeorm';
import { NotificationStatus } from '../common/enums/notification-status.enum';
import { CreateNotificationLogDto } from './dto/create-notification-log.dto';
import { NotificationLog } from './entities/notification-log.entity';
export declare class NotificationService {
    private readonly logRepo;
    constructor(logRepo: Repository<NotificationLog>);
    createLog(dto: CreateNotificationLogDto): Promise<NotificationLog>;
    existsPendingLogForTask(taskId: string): Promise<boolean>;
    findAll(): Promise<NotificationLog[]>;
    findByTask(taskId: string): Promise<NotificationLog[]>;
    findDueForSending(now: Date): Promise<NotificationLog[]>;
    updateStatus(id: number, status: NotificationStatus, sentAt?: Date): Promise<NotificationLog>;
    cancelNotification(id: number): Promise<boolean>;
    private findOneOrFail;
}
