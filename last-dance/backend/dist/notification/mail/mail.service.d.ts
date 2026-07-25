import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    sendDeadlineReminder(to: string, subject: string, content: string): Promise<boolean>;
}
