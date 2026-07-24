import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("./entities/user.entity").User>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: import("./entities/user.entity").User;
    }>;
    getProfile(req: any): any;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<import("./entities/user.entity").User>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<boolean>;
}
