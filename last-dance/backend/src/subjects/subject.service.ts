import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateSubjectDto, UpdateSubjectDto } from './subject.dto';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  findAll(userId: number): Promise<Subject[]> {
    return this.subjectRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!subject) throw new NotFoundException('Không tìm thấy môn học');
    return subject;
  }

  create(dto: CreateSubjectDto, userId: number): Promise<Subject> {
    const subject = this.subjectRepository.create({
      ...dto,
      name: dto.name.trim(),
      icon: dto.icon?.trim(),
      user: { id: userId } as User,
    });
    return this.save(subject);
  }

  async update(
    id: number,
    dto: UpdateSubjectDto,
    userId: number,
  ): Promise<Subject> {
    const subject = await this.findOne(id, userId);
    this.subjectRepository.merge(subject, {
      ...dto,
      ...(dto.name === undefined ? {} : { name: dto.name.trim() }),
      ...(dto.icon === undefined ? {} : { icon: dto.icon.trim() }),
    });
    return this.save(subject);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.subjectRepository.remove(await this.findOne(id, userId));
  }

  private async save(subject: Subject): Promise<Subject> {
    try {
      return await this.subjectRepository.save(subject);
    } catch (error) {
      const databaseError = error as QueryFailedError & {
        driverError?: { code?: string };
      };
      if (
        error instanceof QueryFailedError &&
        databaseError.driverError?.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Tên môn học đã tồn tại');
      }
      throw error;
    }
  }
}
