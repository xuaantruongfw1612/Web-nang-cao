import type { Request } from 'express';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        email: string;
    };
}
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(req: AuthenticatedRequest, createTaskDto: CreateTaskDto): Promise<import("./entities/task.entity").Task>;
    findAll(req: AuthenticatedRequest): Promise<import("./entities/task.entity").Task[]>;
    findOne(req: AuthenticatedRequest, id: string): Promise<import("./entities/task.entity").Task>;
    update(req: AuthenticatedRequest, id: string, updateTaskDto: UpdateTaskDto): Promise<import("./entities/task.entity").Task>;
    remove(req: AuthenticatedRequest, id: string): Promise<void>;
}
export {};
