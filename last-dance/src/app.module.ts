import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

// Import toàn bộ các Entity
import { Student } from './student.entity';
import { Subject } from './subject.entity';
import { Note } from './note.entity';
import { NotificationLog } from './notification-log.entity';
import { Task } from './task/task.entity'; // Quan trọng: Phải có Task

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        
        // ĐÃ FIX: Liệt kê đầy đủ tất cả các Entity vào mảng này
        entities: [Student, Subject, Task, Note, NotificationLog], 
        
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}