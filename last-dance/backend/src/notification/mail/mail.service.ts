import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  /**
   * Gửi email nhắc nhở deadline.
   * Trả về true/false thay vì throw, vì lỗi gửi mail (Chưa thành công trong
   * Activity Diagram 3) là một luồng nghiệp vụ bình thường cần được xử lý
   * (cập nhật NotificationLog -> FAILED), không phải lỗi hệ thống.
   */
  async sendDeadlineReminder(to: string, subject: string, content: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('SMTP_FROM', 'no-reply@sdm.edu.vn'),
        to,
        subject,
        text: content,
      });
      return true;
    } catch (error) {
      this.logger.error(`Gửi email thất bại tới ${to}: ${(error as Error).message}`);
      return false;
    }
  }
}
