import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(req: any, createTaskDto: CreateTaskDto): Promise<import("./entities/task.entity").Task>;
    findAll(req: any): Promise<import("./entities/task.entity").Task[]>;
    findOne(req: any, id: string): Promise<import("./entities/task.entity").Task>;
    update(req: any, id: string, updateTaskDto: UpdateTaskDto): Promise<import("./entities/task.entity").Task>;
    remove(req: any, id: string): Promise<void>;
}
