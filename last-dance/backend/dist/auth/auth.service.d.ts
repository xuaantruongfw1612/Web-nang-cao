import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<User>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: User;
    }>;
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<User>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<boolean>;
    private findByIdOrFail;
}
