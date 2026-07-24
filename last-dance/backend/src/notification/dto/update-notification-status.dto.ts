import { IsEnum } from 'class-validator';
import { NotificationStatus } from '../../common/enums/notification-status.enum';

export class UpdateNotificationStatusDto {
  @IsEnum(NotificationStatus, { message: 'Trạng thái không hợp lệ' })
  status: NotificationStatus;
}
