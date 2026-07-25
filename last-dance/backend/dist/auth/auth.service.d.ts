import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly config;
    constructor(userRepo: Repository<User>, jwtService: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<User>;
    login(dto: LoginDto): Promise<TokenPair & {
        user: User;
    }>;
    refreshTokens(dto: RefreshTokenDto): Promise<TokenPair>;
    logout(userId: number): Promise<boolean>;
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<User>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<boolean>;
    private generateTokenPair;
    private storeRefreshToken;
    private hashToken;
    private matchesStoredToken;
    private getAccessSecret;
    private getRefreshSecret;
    private findByIdOrFail;
}
