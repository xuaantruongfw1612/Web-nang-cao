import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

function createMockHost(): { host: ArgumentsHost; json: jest.Mock; status: jest.Mock } {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ method: 'POST', url: '/api/auth/register' }),
    }),
  } as unknown as ArgumentsHost;
  return { host, json, status };
}

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  it('trả đúng statusCode + message cho HttpException (lỗi nghiệp vụ)', () => {
    const { host, json, status } = createMockHost();
    filter.catch(new BadRequestException('Dữ liệu không hợp lệ'), host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, path: '/api/auth/register' }),
    );
  });

  it('trả về 500 cho lỗi hệ thống chưa lường trước (không làm crash app)', () => {
    const { host, json, status } = createMockHost();
    filter.catch(new Error('Lỗi không xác định, ví dụ mất kết nối DB'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Đã có lỗi xảy ra ở máy chủ, vui lòng thử lại sau.',
      }),
    );
  });
});
