import { NotificationStatus } from '../../common/enums/notification-status.enum';
import { Task } from '../../tasks/entities/task.entity';
export declare class NotificationLog {
    id: number;
    task: Task;
    taskId: string;
    message: string;
    scheduledAt: Date;
    status: NotificationStatus;
    sentAt?: Date;
    createdAt: Date;
}
