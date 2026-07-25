import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { SubjectService } from './subject.service';

interface AuthenticatedRequest extends Request {
  user: { userId: number };
}

@Controller('subjects')
@UseGuards(AuthGuard('jwt'))
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.subjectService.findAll(request.user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.subjectService.findOne(id, request.user.userId);
  }

  @Post()
  create(@Body() dto: CreateSubjectDto, @Req() request: AuthenticatedRequest) {
    return this.subjectService.create(dto, request.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.subjectService.update(id, dto, request.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.subjectService.remove(id, request.user.userId);
  }
}
