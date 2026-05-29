require('dotenv').config();
const express = require('express');
const connection = require('../server/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/dbconnection', (req, res) => {
    const sqlQuery = 'SELECT * FROM STUDENT_ENROLEMENT LIMIT 3;';

    connection.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Lỗi truy vấn database: ' + error.stack);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(200).json({ query: results });
    });
});

app.get('/api/get', (req, res) => {
    res.status(200).json({
        message: "Chào mừng bạn đến với Node.js Server!"
    });
});

app.post('/api/post', (req, res) => {
    const dataFromClient = req.body;

    console.log("Dữ liệu nhận được từ Client:", dataFromClient);

    res.status(200).json({
        success: true,
        message: "Server đã nhận được POST Request thành công!",
        receivedData: dataFromClient
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});