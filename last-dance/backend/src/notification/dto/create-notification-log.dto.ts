import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationLogDto {
  @ApiProperty({ description: 'ID (UUID) của Task cần nhắc nhở' })
  @IsString()
  @IsNotEmpty({ message: 'taskId không được để trống' })
  taskId: string;

  @ApiProperty({ example: 'Nhắc nhở: "Bài tập lớn" sắp đến hạn' })
  @IsString()
  @IsNotEmpty({ message: 'Nội dung nhắc nhở không được để trống' })
  message: string;

  @ApiProperty({ example: '2026-08-01T09:00:00.000Z' })
  @IsDateString({}, { message: 'scheduledAt phải là định dạng ngày giờ hợp lệ' })
  scheduledAt: string;
}
