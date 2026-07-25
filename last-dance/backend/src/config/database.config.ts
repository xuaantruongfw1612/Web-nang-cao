import { existsSync, readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NotificationLog } from '../notification/entities/notification-log.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../auth/entities/user.entity';
import { Subject } from '../subjects/entities/subject.entity';

// Aiven MySQL bắt buộc kết nối qua SSL/TLS, khác với MySQL local thông thường.
function buildSslOption(config: ConfigService) {
  const caPath = config.get<string>('DB_SSL_CA_PATH', './certs/aiven-ca.pem');
  if (!existsSync(caPath)) {
    throw new Error(
      `Không tìm thấy CA certificate tại "${caPath}". Tải file CA certificate từ ` +
        `Aiven Console (trang service MySQL > Overview > "CA certificate") và đặt đúng đường dẫn.`,
    );
  }
  return { ca: readFileSync(caPath).toString(), rejectUnauthorized: true };
}

// Câu 6 (ORM/CSDL) sẽ mở rộng thêm ở đây (migration, seeding...).
// Ở Câu 4 chỉ khai báo đủ để 2 module Auth + Notification chạy được với MySQL.
export const getDatabaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get<string>('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 3306),
  username: config.get<string>('DB_USERNAME', 'avnadmin'), // Aiven: KHÔNG phải 'root'
  password: config.get<string>('DB_PASSWORD', ''),
  database: config.get<string>('DB_NAME', 'defaultdb'),
  ssl: config.get<string>('DB_SSL', 'true') === 'true' ? buildSslOption(config) : undefined,
  entities: [User, Subject, Task, NotificationLog],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  //   npm run migration:run
  synchronize: false,
  logging: config.get<string>('NODE_ENV', 'development') === 'development',
});
