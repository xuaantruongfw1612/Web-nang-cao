require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Kết nối tới Aiven Cloud (Sử dụng Pool để tối ưu hiệu năng)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: false }
});

// 1. READ: Lấy toàn bộ danh sách sinh viên
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM STUDENT');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. CREATE: Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
    const { SID, SNAME, EMAIL, Tutor_Id } = req.body;
    try {
        await pool.promise().query(
            'INSERT INTO STUDENT (SID, SNAME, EMAIL, Tutor_Id) VALUES (?, ?, ?, ?)',
            [SID, SNAME, EMAIL, Tutor_Id]
        );
        res.status(201).json({ message: "Thêm sinh viên thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE: Cập nhật email sinh viên theo SID
app.put('/api/students/:id', async (req, res) => {
    const { EMAIL } = req.body;
    try {
        await pool.promise().query('UPDATE STUDENT SET EMAIL=? WHERE SID=?', [EMAIL, req.params.id]);
        res.json({ message: 'Cập nhật email thành công!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE: Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
    try {
        await pool.promise().query('DELETE FROM STUDENT WHERE SID=?', [req.params.id]);
        res.json({ message: 'Xóa sinh viên thành công!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});