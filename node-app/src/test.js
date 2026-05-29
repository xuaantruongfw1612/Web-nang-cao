// This file is for database testing because my computer is out of space and I can't test locally, hihi

const data = {
    maSinhVien: "2410xxxx",
    tenSinhVien: "Vũ Xuân Trường",
    baiTap: "NodeJS-TypeScript-Postman",
    diaChi: "Việt Nam"
};

fetch('http://localhost:3001/api/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
.then(response => response.json())
.then(result => {
    console.log('Kết quả từ Server');
    console.log(result);
})
.catch(error => {
    console.error('Lỗi khi gửi request:', error);
});