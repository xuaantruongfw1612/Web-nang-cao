import { Subject } from '../../subjects/entities/subject.entity';
import { Task } from '../../tasks/entities/task.entity';
export declare class User {
    id: number;
    studentCode: string;
    fullName: string;
    email: string;
    password: string;
    avatarUrl?: string;
    refreshTokenHash?: string | null;
    subjects: Subject[];
    tasks: Task[];
    createdAt: Date;
    updatedAt: Date;
    toJSON(): Omit<this, "password" | "refreshTokenHash" | "toJSON">;
}
