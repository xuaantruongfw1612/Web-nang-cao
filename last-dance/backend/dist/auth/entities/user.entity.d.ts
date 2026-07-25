import { Subject } from '../../subjects/entities/subject.entity';
export declare class User {
    id: number;
    studentCode: string;
    fullName: string;
    email: string;
    password: string;
    avatarUrl?: string;
    subjects: Subject[];
    createdAt: Date;
    updatedAt: Date;
    toJSON(): Omit<this, "password" | "toJSON">;
}
