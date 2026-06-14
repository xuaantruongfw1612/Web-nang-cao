import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // CREATE
  async create(dto: CreateUserDto): Promise<User> {
    const newUser = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password_hash: dto.password // tạm thời password thô
    });
    return this.userRepo.save(newUser);
  }

  // READ
  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy user');
    return user;
  }

  // UPDATE
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.userRepo.update(id, dto);
    return this.findOne(id);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}