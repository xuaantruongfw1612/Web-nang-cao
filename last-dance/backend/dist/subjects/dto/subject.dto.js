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
exports.UpdateSubjectDto = exports.CreateSubjectDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSubjectDto {
}
exports.CreateSubjectDto = CreateSubjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Phát triển Web nâng cao' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/\S/, { message: 'name must contain a non-whitespace character' }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateSubjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '#3498db' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], CreateSubjectDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'book' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/\S/, { message: 'icon must contain a non-whitespace character' }),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateSubjectDto.prototype, "icon", void 0);
class UpdateSubjectDto {
}
exports.UpdateSubjectDto = UpdateSubjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Phát triển Web nâng cao' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/\S/, { message: 'name must contain a non-whitespace character' }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateSubjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '#3498db' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], UpdateSubjectDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'book' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/\S/, { message: 'icon must contain a non-whitespace character' }),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateSubjectDto.prototype, "icon", void 0);
//# sourceMappingURL=subject.dto.js.map