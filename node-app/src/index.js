require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: false }
});

// 1. READ (GET): Lấy danh sách & tự động phân loại trạng thái lịch thông minh
app.get('/api/deadlines', async (req, res) => {
    try {
        const sqlQuery = `
            SELECT 
                t.Task_Id, 
                s.Subject_Name,
                t.Title, 
                t.Description,
                t.Due_Date,
                t.Status AS Completion_Status,
                DATEDIFF(t.Due_Date, NOW()) AS Days_Left,
                CASE 
                    WHEN t.Status = 'Đã hoàn thành' THEN '✅ Hoàn thành'
                    WHEN DATEDIFF(t.Due_Date, NOW()) < 0 THEN '❌ Đã quá hạn'
                    WHEN DATEDIFF(t.Due_Date, NOW()) <= 2 THEN '🚨 Gấp (Dưới 2 ngày)'
                    WHEN DATEDIFF(t.Due_Date, NOW()) <= 7 THEN '⚠️ Chú ý (Trong tuần)'
                    WHEN DATEDIFF(t.Due_Date, NOW()) >= 21 THEN '🟢 Thong thả (Trên 3 tuần)'
                    ELSE '🔵 Bình thường'
                END AS Urgency_Status
            FROM TASKS t
            LEFT JOIN SUBJECTS s ON t.Subject_Id = s.Subject_Id
            ORDER BY t.Due_Date ASC;
        `;
        const [rows] = await pool.promise().query(sqlQuery);
        res.json(rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// 2. CREATE (POST): Thêm một deadline mới
app.post('/api/deadlines', async (req, res) => {
    const { Subject_Id, Title, Description, Due_Date } = req.body;
    try {
        const sqlQuery = 'INSERT INTO TASKS (Subject_Id, Title, Description, Due_Date) VALUES (?, ?, ?, ?)';
        const [result] = await pool.promise().query(sqlQuery, [Subject_Id, Title, Description, Due_Date]);
        res.status(201).json({ message: "Thêm deadline mới thành công!", Task_Id: result.insertId });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// 3. UPDATE (PUT): Cập nhật trạng thái tiến độ
app.put('/api/deadlines/:id', async (req, res) => {
    const { Status } = req.body; 
    try {
        const sqlQuery = 'UPDATE TASKS SET Status = ? WHERE Task_Id = ?';
        await pool.promise().query(sqlQuery, [Status, req.params.id]);
        res.json({ message: "Cập nhật trạng thái thành công!" });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// 4. DELETE (DELETE): Xóa một deadline
app.delete('/api/deadlines/:id', async (req, res) => {
    try {
        const sqlQuery = 'DELETE FROM TASKS WHERE Task_Id = ?';
        await pool.promise().query(sqlQuery, [req.params.id]);
        res.json({ message: "Xóa deadline thành công!" });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

app.listen(PORT, () => {
    console.log(`Server Quản lý Deadline đang chạy tại port ${PORT}`);
});