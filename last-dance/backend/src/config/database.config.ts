import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NotificationLog } from '../notification/entities/notification-log.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../auth/entities/user.entity';

// Câu 6 (ORM/CSDL) sẽ mở rộng thêm ở đây (migration, seeding...).
// Ở Câu 4 chỉ khai báo đủ để 2 module Auth + Notification chạy được với MySQL.
export const getDatabaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get<string>('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 3306),
  username: config.get<string>('DB_USERNAME', 'root'),
  password: config.get<string>('DB_PASSWORD', ''),
  database: config.get<string>('DB_NAME', 'student_deadline_manager'),
  entities: [User, Task, NotificationLog],
  // Chỉ bật synchronize khi phát triển; ở Câu 6 nên chuyển sang migration thật.
  synchronize: config.get<string>('NODE_ENV', 'development') !== 'production',
  logging: config.get<string>('NODE_ENV', 'development') === 'development',
});
