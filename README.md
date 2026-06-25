# Xây dựng ứng dụng Nhắc việc & Quản lý Deadline cho Sinh viên (Student Deadline Manager)

Ứng dụng Backend xây dựng trên nền tảng Node.js, NestJS và MySQL nhằm hỗ trợ sinh viên quản lý tiến độ học tập và tự động lập lịch nhắc nhở deadline theo thời gian thực.

## 1. Thực trạng & Ý tưởng dự án

Sinh viên hiện nay thường phải đối mặt với khối lượng bài tập, tiểu luận và đồ án dồn dập từ nhiều môn học cùng lúc. Việc theo dõi thủ công qua sổ tay hoặc ghi chú thông thường rất dễ dẫn đến tình trạng sót bài, quên lịch hoặc nộp muộn.

**Giải pháp:** Hệ thống cung cấp các API CRUD tập trung, kết nối trực tiếp tới Cơ sở dữ liệu Cloud (Aiven). Điểm cốt lõi của dự án là thuật toán tự động tính toán thời gian động (DATEDIFF). Mỗi khi dữ liệu được truy vấn, hệ thống sẽ tự động đối chiếu với thời gian thực tế để phân loại và gắn nhãn mức độ khẩn cấp (🚨 Gấp, ⚠️ Chú ý, 🟢 Thong thả), giúp sinh viên chủ động sắp xếp thời gian làm bài.

## 2. Công nghệ sử dụng

* **Backend:** Node.js, NestJS (Framework)
* **Database:** MySQL 8.4 (Hosted trên Aiven Cloud)
* **ORM & Bảo mật:** TypeORM, Passport (JWT Authentication), bcrypt
* **Công cụ kiểm thử:** Postman / Thunder Client

## 3. Hướng dẫn cài đặt & Khởi chạy

Để triển khai dự án, trước tiên bạn cần đảm bảo đã tạo file `.env` ở thư mục gốc chứa thông tin kết nối tới CSDL Aiven (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`). Sau đó, mở Terminal và chạy trực tiếp cụm lệnh dưới đây để vào thư mục, tải thư viện và khởi động server:

```bash
cd /workspaces/Web-nang-cao/last-dance
npm install
npm run start:dev
