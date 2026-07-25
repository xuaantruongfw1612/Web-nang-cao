import type { Request } from 'express';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { SubjectService } from './subject.service';
interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
    };
}
export declare class SubjectController {
    private readonly subjectService;
    constructor(subjectService: SubjectService);
    findAll(request: AuthenticatedRequest): Promise<import("./entities/subject.entity").Subject[]>;
    findOne(id: number, request: AuthenticatedRequest): Promise<import("./entities/subject.entity").Subject>;
    create(dto: CreateSubjectDto, request: AuthenticatedRequest): Promise<import("./entities/subject.entity").Subject>;
    update(id: number, dto: UpdateSubjectDto, request: AuthenticatedRequest): Promise<import("./entities/subject.entity").Subject>;
    remove(id: number, request: AuthenticatedRequest): Promise<void>;
}
export {};
