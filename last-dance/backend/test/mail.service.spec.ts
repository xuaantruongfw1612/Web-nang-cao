import { ConfigService } from '@nestjs/config';

const sendMailMock = jest.fn();

// Mock toàn bộ module nodemailer để không gọi SMTP thật khi chạy test
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: sendMailMock })),
}));

import { MailService } from '../src/notification/mail/mail.service';

describe('MailService', () => {
  let service: MailService;
  let config: Partial<ConfigService>;

  beforeEach(() => {
    config = { get: jest.fn((_key: string, def?: unknown) => def) };
    service = new MailService(config as ConfigService);
  });

  afterEach(() => jest.clearAllMocks());

  it('trả về true khi gửi email thành công', async () => {
    sendMailMock.mockResolvedValue({ messageId: '123' });

    const result = await service.sendDeadlineReminder('a@gmail.com', 'Subject', 'Nội dung');

    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'a@gmail.com', subject: 'Subject' }),
    );
  });

  it('trả về false (không throw) khi SMTP lỗi', async () => {
    sendMailMock.mockRejectedValue(new Error('SMTP timeout'));

    const result = await service.sendDeadlineReminder('a@gmail.com', 'Subject', 'Nội dung');

    expect(result).toBe(false);
  });
});
