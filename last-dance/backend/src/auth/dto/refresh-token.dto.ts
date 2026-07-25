import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'refreshToken nhận được từ /login hoặc lần /refresh trước đó' })
  @IsString()
  @IsNotEmpty({ message: 'refreshToken không được để trống' })
  refreshToken: string;
}
