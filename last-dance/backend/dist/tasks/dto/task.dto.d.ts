import { TaskStatus } from '../../common/enums/task-status.enum';
export declare class CreateTaskDto {
    title: string;
    type?: string;
    taskDatetime: string;
    room?: string;
    notes?: string;
    status?: TaskStatus;
    subjectId?: number;
}
declare const UpdateTaskDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateTaskDto>>;
export declare class UpdateTaskDto extends UpdateTaskDto_base {
}
export {};
