"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subject_entity_1 = require("./entities/subject.entity");
let SubjectService = class SubjectService {
    subjectRepository;
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    findAll(userId) {
        return this.subjectRepository.find({
            where: { user: { id: userId } },
            order: { name: 'ASC' },
        });
    }
    async findOne(id, userId) {
        const subject = await this.subjectRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!subject)
            throw new common_1.NotFoundException('Không tìm thấy môn học');
        return subject;
    }
    create(dto, userId) {
        const subject = this.subjectRepository.create({
            ...dto,
            name: dto.name.trim(),
            icon: dto.icon?.trim(),
            user: { id: userId },
        });
        return this.save(subject);
    }
    async update(id, dto, userId) {
        const subject = await this.findOne(id, userId);
        this.subjectRepository.merge(subject, {
            ...dto,
            ...(dto.name === undefined ? {} : { name: dto.name.trim() }),
            ...(dto.icon === undefined ? {} : { icon: dto.icon.trim() }),
        });
        return this.save(subject);
    }
    async remove(id, userId) {
        await this.subjectRepository.remove(await this.findOne(id, userId));
    }
    async save(subject) {
        try {
            return await this.subjectRepository.save(subject);
        }
        catch (error) {
            const databaseError = error;
            if (error instanceof typeorm_2.QueryFailedError &&
                databaseError.driverError?.code === 'ER_DUP_ENTRY') {
                throw new common_1.ConflictException('Tên môn học đã tồn tại');
            }
            throw error;
        }
    }
};
exports.SubjectService = SubjectService;
exports.SubjectService = SubjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectService);
//# sourceMappingURL=subject.service.js.map