CREATE DATABASE IF NOT EXISTS Student_Deadline_Manager;
USE Student_Deadline_Manager;

-- Bảng 1: User (Người dùng / Sinh viên)
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
student_code VARCHAR(50) NOT NULL UNIQUE, -- MSSV
full_name VARCHAR(150) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
avatar_url VARCHAR(255) NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng 2: subjects (Môn học/Danh mục)
CREATE TABLE subjects (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
color VARCHAR(7) DEFAULT '#3498db',
icon VARCHAR(50) DEFAULT 'book',

user_id INT NOT NULL,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

UNIQUE KEY uq_user_subject (name, user_id),
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng 3: tasks (Công việc / Lịch trình của sinh viên)
CREATE TABLE tasks (
id VARCHAR(36) PRIMARY KEY,
title VARCHAR(100) NOT NULL,
type VARCHAR(20) NOT NULL,
task_datetime DATETIME NOT NULL,
room VARCHAR(50) NULL,
notes TEXT NULL,
status VARCHAR(20) DEFAULT 'PENDING',

user_id INT NOT NULL,
subject_id INT NULL,

CONSTRAINT fk_tasks_users FOREIGN KEY (user_id) 
    REFERENCES users(id) ON DELETE CASCADE,
    
CONSTRAINT fk_tasks_subjects FOREIGN KEY (subject_id) 
    REFERENCES subjects(id) ON DELETE SET NULL
);

SELECT id, student_code, full_name FROM users;

INSERT INTO users (student_code, full_name, email, password, avatar_url) VALUES
(
'2410xxx1',
'Vũ Xuân Trường',
'xuantruong.sv@student.edu.vn',
'$2b$10$X729m6N6wJByBihv.lqTae65G7YQxNef6y8LpM8K3yFUXGom9A4W0.', -- Mật khẩu mã hóa của: 123456
'https://api.dicebear.com/7.x/avataaars/svg?seed=leader'
),
(
'2410xxx2',
'Đặng Đức Tài',
'dangtai.sv@student.edu.vn',
'$2b$10$X729m6N6wJByBihv.lqTae65G7YQxNef6y8LpM8K3yFUXGom9A4W2.', -- Mật khẩu: 1234567
'https://api.dicebear.com/7.x/avataaars/svg?seed=tai'
),
(
'2410xxx3',
'Nguyễn Thị Yến Vi',
'yenvi.sv@student.edu.vn',
'$2b$10$X729m6N6wJByBihv.lqTae65G7YQxNef6y8LpM8K3yFUXGom9A4W3.', -- Mật khẩu: 12345677
NULL -- Trường hợp sinh viên không cài ảnh đại diện
),
(
'ADMIN01',
'Người Quản Trị Hệ Thống',
'admin.deadline@edu.vn',
'$2b$10$X729m6N6wJByBihv.lqTae65G7YQxNef6y8LpM8K3yFUXGom9A4W1.', -- Mật khẩu: 1234568
'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
);

SELECT * FROM subjects;

INSERT INTO subjects (name, color, icon, user_id) VALUES
-- Môn học của Vũ Xuân Trường (user_id = 1)
('Toán cao cấp A1', '#e74c3c', 'calculator', 1),
('Lập trình C++', '#3498db', 'code', 1),
('Tiếng Anh chuyên ngành', '#2ecc71', 'text-format', 1),

-- Môn học của Đặng Đức Tài (user_id = 2)
('Cấu trúc dữ liệu & Giải thuật', '#9b59b6', 'tree', 2),
('Cơ sở dữ liệu', '#f1c40f', 'database', 2),

-- Môn học của Nguyễn Thị Yến Vi (user_id = 3)
('Toán cao cấp A1', '#e67e22', 'calculator', 3), -- Hợp lệ: trùng tên nhưng khác user_id
('Mạng máy tính', '#1abc9c', 'globe', 3),

-- Môn học do Người Quản Trị Hệ Thống tạo (user_id = 4)
('Kỹ năng mềm', '#34495e', 'users', 4);

INSERT INTO tasks (id, title, type, task_datetime, room, notes, status, user_id, subject_id) VALUES
-- Tasks của Vũ Xuân Trường (user_id = 1)
('b3fa7d10-3882-11ed-a261-0242ac120002', 'Kiểm tra giữa kỳ Toán A1', 'EXAM', '2026-06-20 08:00:00', 'Phòng 402-A2', 'Mang theo máy tính bỏ túi Casio', 'PENDING', 1, 1),
('c4ab8e21-3882-11ed-a261-0242ac120002', 'Bài tập về nhà: Con trỏ và Đệ quy', 'ASSIGNMENT', '2026-06-18 23:59:59', NULL, 'Nộp file .cpp lên hệ thống LMS', 'PENDING', 1, 2),
('d5bc9f32-3882-11ed-a261-0242ac120002', 'Học từ vựng Unit 5', 'STUDY', '2026-06-15 14:30:00', 'Thư viện', 'Học qua Flashcard Anki', 'COMPLETED', 1, 3),

-- Tasks của Đặng Đức Tài (user_id = 2)
('e6cd0a43-3882-11ed-a261-0242ac120002', 'Thực hành Viết câu lệnh SQL Join', 'ASSIGNMENT', '2026-06-19 12:00:00', 'Phòng Lab 3', 'Làm bài tập chương 4', 'PENDING', 2, 5),
('f7de1b54-3882-11ed-a261-0242ac120002', 'Thi cuối kỳ Cấu trúc dữ liệu', 'EXAM', '2026-06-25 13:30:00', 'Hội trường G3', 'Thi trắc nghiệm trên máy', 'PENDING', 2, 4),
-- Task tự do của Tài (Không có môn học cố định -> subject_id = NULL)
('a1ab2c3d-3882-11ed-a261-0242ac120002', 'Họp nhóm CLB Tình nguyện', 'MEETING', '2026-06-16 18:00:00', 'Căng tin trường', 'Bàn về kế hoạch mùa hè xanh', 'PENDING', 2, NULL),

-- Tasks của Nguyễn Thị Yến Vi (user_id = 3)
('08ef2c65-3882-11ed-a261-0242ac120002', 'Bài tập lớn Mạng máy tính', 'ASSIGNMENT', '2026-06-22 09:00:00', NULL, 'Bấm cáp mạng và cấu hình Router Cisco', 'PENDING', 3, 7),

-- Tasks của Admin (user_id = 4)
('19fa3d76-3882-11ed-a261-0242ac120002', 'Chuẩn bị slide Kỹ năng thuyết trình', 'STUDY', '2026-06-17 07:30:00', 'Phòng Hội Thảo', 'Slide tối đa 15 trang', 'PENDING', 4, 8);