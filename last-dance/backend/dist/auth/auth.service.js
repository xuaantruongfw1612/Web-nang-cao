"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const SALT_ROUNDS = 10;
let AuthService = class AuthService {
    constructor(userRepo, jwtService, config) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.config = config;
    }
    async register(dto) {
        const existed = await this.userRepo.findOne({
            where: [{ email: dto.email }, { studentCode: dto.studentCode }],
        });
        if (existed) {
            throw new common_1.ConflictException('Email hoặc mã sinh viên đã được đăng ký');
        }
        const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = this.userRepo.create({
            ...dto,
            password: hashed,
        });
        return this.userRepo.save(user);
    }
    async login(dto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        const tokens = await this.generateTokenPair(user);
        await this.storeRefreshToken(user, tokens.refreshToken);
        return { ...tokens, user };
    }
    async refreshTokens(dto) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(dto.refreshToken, {
                secret: this.getRefreshSecret(),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }
        const user = await this.userRepo.findOne({ where: { id: payload.sub } });
        if (!user || !user.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Phiên đăng nhập không tồn tại, vui lòng đăng nhập lại');
        }
        if (!this.matchesStoredToken(dto.refreshToken, user.refreshTokenHash)) {
            user.refreshTokenHash = null;
            await this.userRepo.save(user);
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ, vui lòng đăng nhập lại');
        }
        const tokens = await this.generateTokenPair(user);
        await this.storeRefreshToken(user, tokens.refreshToken);
        return tokens;
    }
    async logout(userId) {
        const user = await this.findByIdOrFail(userId);
        user.refreshTokenHash = null;
        await this.userRepo.save(user);
        return true;
    }
    async updateProfile(userId, dto) {
        const user = await this.findByIdOrFail(userId);
        Object.assign(user, dto);
        return this.userRepo.save(user);
    }
    async changePassword(userId, dto) {
        const user = await this.findByIdOrFail(userId);
        const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Mật khẩu hiện tại không đúng');
        }
        user.password = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
        user.refreshTokenHash = null;
        await this.userRepo.save(user);
        return true;
    }
    async generateTokenPair(user) {
        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.getAccessSecret(),
            expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m'),
        });
        const refreshToken = await this.jwtService.signAsync({ ...payload, jti: (0, crypto_1.randomUUID)() }, {
            secret: this.getRefreshSecret(),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRES', '7d'),
        });
        return { accessToken, refreshToken };
    }
    async storeRefreshToken(user, refreshToken) {
        user.refreshTokenHash = this.hashToken(refreshToken);
        await this.userRepo.save(user);
    }
    hashToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
    matchesStoredToken(incomingToken, storedHash) {
        const incoming = Buffer.from(this.hashToken(incomingToken), 'hex');
        const stored = Buffer.from(storedHash, 'hex');
        return incoming.length === stored.length && (0, crypto_1.timingSafeEqual)(incoming, stored);
    }
    getAccessSecret() {
        return this.config.get('JWT_ACCESS_SECRET', 'dev-access-secret-change-me');
    }
    getRefreshSecret() {
        return this.config.get('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me');
    }
    async findByIdOrFail(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map