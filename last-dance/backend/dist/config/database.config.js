"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const fs_1 = require("fs");
const notification_log_entity_1 = require("../notification/entities/notification-log.entity");
const task_entity_1 = require("../tasks/entities/task.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
function buildSslOption(config) {
    const caPath = config.get('DB_SSL_CA_PATH', './certs/aiven-ca.pem');
    if (!(0, fs_1.existsSync)(caPath)) {
        throw new Error(`Không tìm thấy CA certificate tại "${caPath}". Tải file CA certificate từ ` +
            `Aiven Console (trang service MySQL > Overview > "CA certificate") và đặt đúng đường dẫn.`);
    }
    return { ca: (0, fs_1.readFileSync)(caPath).toString(), rejectUnauthorized: true };
}
const getDatabaseConfig = (config) => ({
    type: 'mysql',
    host: config.get('DB_HOST', 'localhost'),
    port: config.get('DB_PORT', 3306),
    username: config.get('DB_USERNAME', 'avnadmin'),
    password: config.get('DB_PASSWORD', ''),
    database: config.get('DB_NAME', 'defaultdb'),
    ssl: config.get('DB_SSL', 'true') === 'true' ? buildSslOption(config) : undefined,
    entities: [user_entity_1.User, subject_entity_1.Subject, task_entity_1.Task, notification_log_entity_1.NotificationLog],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
    logging: config.get('NODE_ENV', 'development') === 'development',
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map