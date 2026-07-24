import { TaskStatus } from '../../common/enums/task-status.enum';
import { User } from '../../auth/entities/user.entity';
export declare class Task {
    id: string;
    userId: number;
    user: User;
    subjectId?: number;
    title: string;
    type?: string;
    taskDatetime: Date;
    room?: string;
    notes?: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
}
