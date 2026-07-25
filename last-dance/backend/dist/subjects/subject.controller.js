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
exports.SubjectController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const subject_dto_1 = require("./dto/subject.dto");
const subject_service_1 = require("./subject.service");
let SubjectController = class SubjectController {
    constructor(subjectService) {
        this.subjectService = subjectService;
    }
    findAll(request) {
        return this.subjectService.findAll(request.user.userId);
    }
    findOne(id, request) {
        return this.subjectService.findOne(id, request.user.userId);
    }
    create(dto, request) {
        return this.subjectService.create(dto, request.user.userId);
    }
    update(id, dto, request) {
        return this.subjectService.update(id, dto, request.user.userId);
    }
    remove(id, request) {
        return this.subjectService.remove(id, request.user.userId);
    }
};
exports.SubjectController = SubjectController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubjectController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SubjectController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subject_dto_1.CreateSubjectDto, Object]),
    __metadata("design:returntype", void 0)
], SubjectController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, subject_dto_1.UpdateSubjectDto, Object]),
    __metadata("design:returntype", void 0)
], SubjectController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SubjectController.prototype, "remove", null);
exports.SubjectController = SubjectController = __decorate([
    (0, swagger_1.ApiTags)('Subjects'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('subjects'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [subject_service_1.SubjectService])
], SubjectController);
//# sourceMappingURL=subject.controller.js.map