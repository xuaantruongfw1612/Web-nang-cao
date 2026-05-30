const express = require('express');
const { addNum, multiple } = require('./services/add'); 

const port = 9000;
const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
    const resultAdd = addNum(5, 5); 
    const resultMulti = multiple(4, 2);

    res.json({
        message: "Chào bạn! API hoạt động bình thường.",
        addResult: resultAdd,
        multiResult: resultMulti
    });
});

app.listen(port, () => {
    console.log(`Port is listening on ${port}`);
});