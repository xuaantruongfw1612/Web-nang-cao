import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationLogDto {
  @IsString()
  @IsNotEmpty({ message: 'taskId không được để trống' })
  taskId: string;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung nhắc nhở không được để trống' })
  message: string;

  @IsDateString({}, { message: 'scheduledAt phải là định dạng ngày giờ hợp lệ' })
  scheduledAt: string;
}
