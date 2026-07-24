import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
export declare class TaskService {
    private readonly taskRepository;
    constructor(taskRepository: Repository<Task>);
    create(userId: number, createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(userId: number): Promise<Task[]>;
    findOne(userId: number, id: string): Promise<Task>;
    update(userId: number, id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    remove(userId: number, id: string): Promise<void>;
}
