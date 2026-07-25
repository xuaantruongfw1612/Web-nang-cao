"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs_1 = require("fs");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
const task_entity_1 = require("../tasks/entities/task.entity");
const notification_log_entity_1 = require("../notification/entities/notification-log.entity");
function buildSslOption() {
    if (process.env.DB_SSL === 'false')
        return undefined;
    const caPath = process.env.DB_SSL_CA_PATH || './certs/aiven-ca.pem';
    if (!(0, fs_1.existsSync)(caPath)) {
        throw new Error(`Không tìm thấy CA certificate tại "${caPath}". Tải từ Aiven Console và đặt đúng đường dẫn.`);
    }
    return { ca: (0, fs_1.readFileSync)(caPath).toString(), rejectUnauthorized: true };
}
exports.default = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'avnadmin',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'defaultdb',
    ssl: buildSslOption(),
    entities: [user_entity_1.User, subject_entity_1.Subject, task_entity_1.Task, notification_log_entity_1.NotificationLog],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map