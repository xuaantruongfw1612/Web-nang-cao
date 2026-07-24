import { User } from '../auth/entities/user.entity';
export declare class Subject {
    id: number;
    name: string;
    color: string;
    icon: string;
    user: User;
    created_at: Date;
    updated_at: Date;
}
