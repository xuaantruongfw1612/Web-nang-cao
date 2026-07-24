// Trạng thái của một bản ghi nhắc nhở (NotificationLog)
export enum NotificationStatus {
  PENDING = 'PENDING', // đã lên lịch, chưa gửi
  SENT = 'SENT', // đã gửi email thành công
  FAILED = 'FAILED', // gửi thất bại (lỗi mạng, sai email...)
  CANCELLED = 'CANCELLED', // người dùng huỷ trước khi gửi
}
