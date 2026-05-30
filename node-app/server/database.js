const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 16021,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, 'ca.pem')),
        rejectUnauthorized: true
    }
});

connection.connect((error) => {
    if (error) {
        console.error('Kết nối MySQL thất bại: ' + error.stack);
        return;
    }
    console.log('Kết nối Aiven MySQL thành công! Connection ID: ' + connection.threadId);

    connection.query('SELECT * FROM sinh_vien', (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn dữ liệu: ', err);
            return;
        }
        console.log('\nTHÔNG TIN TRONG DATABASE');
        console.table(results);
    });
});

module.exports = connection;