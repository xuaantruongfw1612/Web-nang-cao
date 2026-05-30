require('dotenv').config();
const express = require('express');
const connection = require('../server/database'); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Read all tutors
app.get('/api/tutors', (req, res) => {
    const sql = 'select * from TUTOR';
    
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: results });
    });
});

// Create tutors
app.post('/api/tutors', (req, res) => {
    const { Tut_Id, TName, DoB, HOURS } = req.body; 
    const sql = 'insert into TUTOR (Tut_Id, TName, DoB, HOURS) values (?, ?, ?, ?)';

    connection.query(sql, [Tut_Id, TName, DoB, HOURS], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.status(201).json({
            success: true,
            message: 'Them giang vien thanh cong',
            data: { Tut_Id, TName, DoB, HOURS }
        });
    });
});

// Update tutors
app.put('/api/tutors/:id', (req, res) => {
    const { id } = req.params;
    const { TName, DoB, HOURS } = req.body;
    
    const sql = 'update TUTOR set TName = ?, DoB = ?, HOURS = ? where Tut_Id = ?';

    connection.query(sql, [TName, DoB, HOURS, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: `Cap nhat giang vien ${id} thanh cong` });
    });
});

// Delete tutors
app.delete('/api/tutors/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'delete from TUTOR where Tut_Id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: `Xoa giang vien ${id} thanh cong` });
    });
});

// Read all student
app.get('/api/students', (req, res) => {
    const sql = `select s.SID, s.SNAME, s.EMAIL, t.TName AS Tutor_Name from STUDENT s left join TUTOR t on s.Tutor_Id = t.Tut_Id`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: results });
    });
});

// Create student
app.post('/api/students', (req, res) => {
    const { SID, SNAME, EMAIL, Tutor_Id } = req.body;
    const sql = 'insert into STUDENT (SID, SNAME, EMAIL, Tutor_Id) values (?, ?, ?, ?)';

    db.query(sql, [SID, SNAME, EMAIL, Tutor_Id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.status(201).json({
            success: true,
            message: 'Them sinh vien thanh cong',
            data: { SID, SNAME, EMAIL, Tutor_Id }
        });
    });
});

// Read student
app.get('/api/students/:id/modules', (req, res) => {
    const { id } = req.params;
    const sql = `select m.MID, m.MNAME, m.LEVEL, se.ACAD_YEAR from STUDENT_ENROLEMENT se join MODULES m on se.MID = m.MID where se.SID = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, student_id: id, enrolled_modules: results });
    });
});

app.listen(PORT, () => {
    console.log(`\nServer is listening on port ${PORT}`);
    
    connection.query('select MID, MNAME from MODULES', (err, results) => {
        if (!err && results && results.length > 0) {
            console.log('\nDemo Data MODULES');
            console.table(results);
        }
    });
});