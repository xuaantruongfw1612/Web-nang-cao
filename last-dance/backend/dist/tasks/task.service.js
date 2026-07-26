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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
let TaskService = class TaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async create(userId, createTaskDto) {
        const existingTask = await this.taskRepository.findOne({
            where: {
                userId,
                title: createTaskDto.title,
            },
        });
        if (existingTask) {
            throw new common_1.ConflictException('Công việc này đã tồn tại trong danh sách của bạn!');
        }
        const newTask = this.taskRepository.create({
            ...createTaskDto,
            userId,
        });
        return await this.taskRepository.save(newTask);
    }
    async findAll(userId) {
        return await this.taskRepository.find({
            where: { userId },
            order: { taskDatetime: 'ASC' },
            relations: { subject: true },
        });
    }
    async findOne(userId, id) {
        const task = await this.taskRepository.findOne({
            where: { id, userId },
            relations: { subject: true },
        });
        if (!task) {
            throw new common_1.NotFoundException('Không tìm thấy công việc này hoặc bạn không có quyền truy cập');
        }
        return task;
    }
    async update(userId, id, updateTaskDto) {
        const task = await this.findOne(userId, id);
        if (updateTaskDto.title) {
            const duplicateTask = await this.taskRepository.findOne({
                where: {
                    userId,
                    title: updateTaskDto.title,
                    id: (0, typeorm_2.Not)(id),
                },
            });
            if (duplicateTask) {
                throw new common_1.ConflictException('Tên công việc này đã bị trùng với một deadline khác!');
            }
        }
        Object.assign(task, updateTaskDto);
        return await this.taskRepository.save(task);
    }
    async remove(userId, id) {
        const task = await this.findOne(userId, id);
        await this.taskRepository.remove(task);
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskService);
//# sourceMappingURL=task.service.js.map