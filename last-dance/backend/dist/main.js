"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET || 'fallback-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600000, httpOnly: true },
    }));
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }
            const ok = /^http:\/\/localhost:\d+$/.test(origin) ||
                /\.app\.github\.dev$/.test(origin);
            callback(ok ? null : new Error('Not allowed by CORS'), ok);
        },
        credentials: true,
    });
    await app.listen(process.env.PORT || 3001);
}
void bootstrap();
//# sourceMappingURL=main.js.map