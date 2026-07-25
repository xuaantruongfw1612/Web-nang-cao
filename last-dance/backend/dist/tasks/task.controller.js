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
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const task_service_1 = require("./task.service");
const task_dto_1 = require("./dto/task.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    create(req, createTaskDto) {
        return this.taskService.create(req.user.userId, createTaskDto);
    }
    findAll(req) {
        return this.taskService.findAll(req.user.userId);
    }
    findOne(req, id) {
        return this.taskService.findOne(req.user.userId, id);
    }
    update(req, id, updateTaskDto) {
        return this.taskService.update(req.user.userId, id, updateTaskDto);
    }
    remove(req, id) {
        return this.taskService.remove(req.user.userId, id);
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Tạo công việc/deadline mới' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách công việc của người dùng' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết 1 công việc' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật công việc' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Xoá công việc' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "remove", null);
exports.TaskController = TaskController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
//# sourceMappingURL=task.controller.js.map