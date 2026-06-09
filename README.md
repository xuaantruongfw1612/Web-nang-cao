# Xây dựng ứng dụng Nhắc việc & Quản lý Deadline cho Sinh viên (Student Deadline Manager)

Ứng dụng Backend xây dựng trên nền tảng Node.js, Express và MySQL nhằm hỗ trợ sinh viên quản lý tiến độ học tập và tự động lập lịch nhắc nhở deadline theo thời gian thực.

---

## 1. Thực trạng & Ý tưởng dự án
Sinh viên hiện nay thường phải đối mặt với khối lượng bài tập, tiểu luận và đồ án dồn dập từ nhiều môn học cùng lúc. Việc theo dõi thủ công qua sổ tay hoặc ghi chú thông thường rất dễ dẫn đến tình trạng sót bài, quên lịch hoặc nộp muộn.

**Giải pháp:** Hệ thống cung cấp các API CRUD tập trung, kết nối trực tiếp tới Cơ sở dữ liệu Cloud (Aiven). Điểm cốt lõi của dự án là **thuật toán tự động tính toán thời gian động** (`DATEDIFF`). Mỗi khi dữ liệu được truy vấn, hệ thống sẽ tự động đối chiếu với thời gian thực tế để phân loại và gắn nhãn mức độ khẩn cấp (`🚨 Gấp`, `⚠️ Chú ý`, `🟢 Thong thả`), giúp sinh viên chủ động sắp xếp thời gian làm bài.

---

## 2. Công nghệ sử dụng
- **Backend:** Node.js, Express.js
- **Database:** MySQL 8.4 (Hosted trên Aiven Cloud)
- **Thư viện kết nối:** `mysql2`, `dotenv`
- **Công cụ kiểm thử:** Thunder Client / Postman

---

## 3. Hướng dẫn cài đặt & Khởi chạy

# Bước 1: Vào đúng thư mục chứa dự án
cd /workspaces/Web-nang-cao/node-app

# Bước 2: Cài đặt toàn bộ thư viện cần thiết
npm install express mysql2 dotenv

# Bước 3: Khởi chạy server API
node src/index.js
