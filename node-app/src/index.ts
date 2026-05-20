import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/get", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Chào mừng bạn đến với Node.js + TypeScript Server!"
    });
});

app.post("/api/post", (req: Request, res: Response) => {
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