import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { TaskStatus } from '../../common/enums/task-status.enum';

export class CreateTaskDto {
  @IsString({ message: 'Tên công việc phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên công việc không được để trống' })
  @MaxLength(100, { message: 'Tên công việc không được quá 100 ký tự' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Loại công việc phải là chuỗi' })
  @MaxLength(20, { message: 'Loại công việc không được quá 20 ký tự' })
  type?: string;

  @IsDateString({}, { message: 'Thời hạn công việc phải là định dạng ngày giờ hợp lệ' })
  @IsNotEmpty({ message: 'Thời hạn công việc không được để trống' })
  taskDatetime: string;

  @IsOptional()
  @IsString({ message: 'Phòng học/Địa điểm phải là chuỗi' })
  @MaxLength(50, { message: 'Tên phòng học không được quá 50 ký tự' })
  room?: string;

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  notes?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Trạng thái công việc không hợp lệ' })
  status?: TaskStatus;

  @IsOptional()
  @IsInt({ message: 'subjectId phải là số nguyên' })
  subjectId?: number;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}