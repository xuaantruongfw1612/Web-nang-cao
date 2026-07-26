// Bóc tách message lỗi từ response của backend (NestJS).
// Xử lý đủ 3 dạng: message là chuỗi thường, message là mảng (lỗi từ
// class-validator trả về nhiều lỗi cùng lúc), hoặc response trả nguyên
// một chuỗi. Fallback về err.message (vd: mất mạng) rồi mới tới fallback mặc định.
export function extractErrorMessage(err, fallback = 'Có lỗi xảy ra, vui lòng thử lại') {
  const responseData = err?.response?.data;

  if (responseData) {
    if (typeof responseData.message === 'string') return responseData.message;
    if (Array.isArray(responseData.message)) return responseData.message.join(', ');
    if (typeof responseData === 'string') return responseData;
  }

  if (err?.message) return err.message;

  return fallback;
}
