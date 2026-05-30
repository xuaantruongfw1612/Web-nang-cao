Student Registration API
Dự án Node.js thực hiện chức năng quản lý sinh viên (CRUD) sử dụng MySQL trên Aiven Cloud.

🛠 Cài đặt
npm install

Tạo file .env với các thông tin kết nối DB.

Chạy ứng dụng: node src/index.js

🔗 API Endpoints
GET /api/students - Lấy danh sách sinh viên

POST /api/students - Thêm sinh viên mới

PUT /api/students/:id - Cập nhật sinh viên

DELETE /api/students/:id - Xóa sinh viên
