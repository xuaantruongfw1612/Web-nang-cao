const data = {
    maSinhVien: "2410xxxx",
    tenSinhVien: "Vũ Xuân Trường",
    baiTap: "NodeJS-TypeScript-Postman",
    diaChi: "Hung Yen"
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