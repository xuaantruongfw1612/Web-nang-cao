import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { MailService } from './mail/mail.service';
import { NotificationService } from './notification.service';
export declare class NotificationScheduler {
    private readonly taskRepo;
    private readonly notificationService;
    private readonly mailService;
    private readonly logger;
    constructor(taskRepo: Repository<Task>, notificationService: NotificationService, mailService: MailService);
    scheduleUpcomingReminders(): Promise<void>;
    sendDueReminderEmails(): Promise<void>;
}
