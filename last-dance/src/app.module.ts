import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { User } from './users/user.entity';
import { SubjectModule } from './subjects/subject.module';
import { Subject } from './subjects/subject.entity';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const caPath = path.resolve(
          process.cwd(),
          process.env.DB_SSL_CA_PATH || 'ca.pem',
        );

        let sslConfig: { rejectUnauthorized: boolean; ca?: string } = {
          rejectUnauthorized: true,
        };

        try {
          // Đọc nội dung file ca.pem
          sslConfig.ca = fs.readFileSync(caPath).toString();
        } catch {
          console.error(
            `Không thể đọc file CA tại đường dẫn: ${caPath}. Kiểm tra lại vị trí file ca.pem!`,
          );
          sslConfig = { rejectUnauthorized: false };
        }

        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [User, Subject],
          synchronize: false,
          ssl: sslConfig, // SSL ca.pem
        };
      },
    }),
    UserModule,
    SubjectModule,
  ],
})
export class AppModule {}
