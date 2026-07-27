export function extractErrorMessage(err, fallback = 'Có lỗi xảy ra, vui lòng thử lại') {
  const responseData = err?.response?.data;

  if (responseData) {
    // Xử lý trường hợp bị lồng 2 lớp do HttpExceptionFilter của NestJS
    const innerMessage = responseData.message;
    if (innerMessage && typeof innerMessage === 'object' && !Array.isArray(innerMessage)) {
      if (typeof innerMessage.message === 'string') return innerMessage.message;
      if (Array.isArray(innerMessage.message)) return innerMessage.message.join(', ');
    }

    // Trả về message nếu là chuỗi thông thường
    if (typeof responseData.message === 'string') return responseData.message;
    
    // Trả về chuỗi gộp nếu message là mảng
    if (Array.isArray(responseData.message)) return responseData.message.join(', ');
    
    // Nếu bản thân responseData chỉ là 1 chuỗi
    if (typeof responseData === 'string') return responseData;
    
    // Bắt các lỗi HTTP mặc định
    if (typeof responseData.error === 'string') {
        if (responseData.statusCode === 401) return 'Sai thông tin đăng nhập hoặc phiên làm việc đã hết hạn.';
        if (responseData.statusCode === 403) return 'Bạn không có quyền thực hiện hành động này.';
        if (responseData.statusCode === 404) return 'Không tìm thấy dữ liệu yêu cầu.';
        return responseData.error; 
    }
  }

  // Lỗi do sập server hoặc mất mạng
  if (err?.code === 'ERR_NETWORK') {
    return 'Lỗi kết nối mạng! Không thể kết nối tới máy chủ.';
  }

  return fallback;
}
