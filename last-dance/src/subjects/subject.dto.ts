import {
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'name must contain a non-whitespace character' })
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'icon must contain a non-whitespace character' })
  @MaxLength(50)
  icon?: string;
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'name must contain a non-whitespace character' })
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'icon must contain a non-whitespace character' })
  @MaxLength(50)
  icon?: string;
}
