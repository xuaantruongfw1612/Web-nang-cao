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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskDto = exports.CreateTaskDto = void 0;
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const task_status_enum_1 = require("../../common/enums/task-status.enum");
class CreateTaskDto {
    title;
    type;
    taskDatetime;
    room;
    notes;
    status;
    subjectId;
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Tên công việc phải là chuỗi' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên công việc không được để trống' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Tên công việc không được quá 100 ký tự' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Loại công việc phải là chuỗi' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Loại công việc không được quá 20 ký tự' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Thời hạn công việc phải là định dạng ngày giờ hợp lệ' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Thời hạn công việc không được để trống' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "taskDatetime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Phòng học/Địa điểm phải là chuỗi' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Tên phòng học không được quá 50 ký tự' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "room", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Ghi chú phải là chuỗi' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_status_enum_1.TaskStatus, { message: 'Trạng thái công việc không hợp lệ' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'subjectId phải là số nguyên' }),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "subjectId", void 0);
class UpdateTaskDto extends (0, mapped_types_1.PartialType)(CreateTaskDto) {
}
exports.UpdateTaskDto = UpdateTaskDto;
//# sourceMappingURL=task.dto.js.map