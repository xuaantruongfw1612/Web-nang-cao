import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { NotificationStatus } from '../../common/enums/notification-status.enum';

export class UpdateNotificationStatusDto {
  @ApiProperty({ enum: NotificationStatus, example: NotificationStatus.SENT })
  @IsEnum(NotificationStatus, { message: 'Trạng thái không hợp lệ' })
  status: NotificationStatus;
}
