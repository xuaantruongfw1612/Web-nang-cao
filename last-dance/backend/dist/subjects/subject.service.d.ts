import { Repository } from 'typeorm';
import { CreateSubjectDto, UpdateSubjectDto } from './subject.dto';
import { Subject } from './subject.entity';
export declare class SubjectService {
    private readonly subjectRepository;
    constructor(subjectRepository: Repository<Subject>);
    findAll(userId: number): Promise<Subject[]>;
    findOne(id: number, userId: number): Promise<Subject>;
    create(dto: CreateSubjectDto, userId: number): Promise<Subject>;
    update(id: number, dto: UpdateSubjectDto, userId: number): Promise<Subject>;
    remove(id: number, userId: number): Promise<void>;
    private save;
}
