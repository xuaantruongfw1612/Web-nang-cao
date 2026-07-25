import { ApiProperty } from '@nestjs/swagger';
import {
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Phát triển Web nâng cao' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'name must contain a non-whitespace character' })
  @MaxLength(100)
  name: string;

  @ApiProperty({ required: false, example: '#3498db' })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({ required: false, example: 'book' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'icon must contain a non-whitespace character' })
  @MaxLength(50)
  icon?: string;
}

export class UpdateSubjectDto {
  @ApiProperty({ required: false, example: 'Phát triển Web nâng cao' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'name must contain a non-whitespace character' })
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false, example: '#3498db' })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({ required: false, example: 'book' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'icon must contain a non-whitespace character' })
  @MaxLength(50)
  icon?: string;
}
