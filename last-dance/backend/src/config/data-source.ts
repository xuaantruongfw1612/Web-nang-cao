import 'dotenv/config';
import { existsSync, readFileSync } from 'fs';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { Task } from '../tasks/entities/task.entity';
import { NotificationLog } from '../notification/entities/notification-log.entity';

function buildSslOption() {
  if (process.env.DB_SSL === 'false') return undefined;
  const caPath = process.env.DB_SSL_CA_PATH || './certs/aiven-ca.pem';
  if (!existsSync(caPath)) {
    throw new Error(
      `Không tìm thấy CA certificate tại "${caPath}". Tải từ Aiven Console và đặt đúng đường dẫn.`,
    );
  }
  return { ca: readFileSync(caPath).toString(), rejectUnauthorized: true };
}

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'avnadmin',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'defaultdb',
  ssl: buildSslOption(),
  entities: [User, Subject, Task, NotificationLog],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
