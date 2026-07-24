"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSchema1721800000000 = void 0;
const typeorm_1 = require("typeorm");
class InitSchema1721800000000 {
    name = 'InitSchema1721800000000';
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'student_code', type: 'varchar', length: '50', isUnique: true },
                { name: 'full_name', type: 'varchar', length: '255' },
                { name: 'email', type: 'varchar', length: '255', isUnique: true },
                { name: 'password', type: 'varchar', length: '255' },
                { name: 'avatar_url', type: 'varchar', length: '500', isNullable: true },
                { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'subjects',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'name', type: 'varchar', length: '100' },
                { name: 'color', type: 'varchar', length: '7', default: "'#3498db'" },
                { name: 'icon', type: 'varchar', length: '50', default: "'book'" },
                { name: 'user_id', type: 'int' },
                { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
            ],
        }), true);
        await queryRunner.createForeignKey('subjects', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            name: 'fk_subjects_user',
        }));
        await queryRunner.createIndex('subjects', new typeorm_1.TableIndex({
            name: 'uq_user_subject',
            columnNames: ['name', 'user_id'],
            isUnique: true,
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'tasks',
            columns: [
                { name: 'id', type: 'varchar', length: '36', isPrimary: true },
                { name: 'user_id', type: 'int' },
                { name: 'subject_id', type: 'int', isNullable: true },
                { name: 'title', type: 'varchar', length: '255' },
                { name: 'type', type: 'varchar', length: '50', isNullable: true },
                { name: 'task_datetime', type: 'datetime' },
                { name: 'room', type: 'varchar', length: '100', isNullable: true },
                { name: 'notes', type: 'text', isNullable: true },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED'],
                    default: "'PENDING'",
                },
                { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
            ],
        }), true);
        await queryRunner.createForeignKey('tasks', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            name: 'fk_tasks_user',
        }));
        await queryRunner.createForeignKey('tasks', new typeorm_1.TableForeignKey({
            columnNames: ['subject_id'],
            referencedTableName: 'subjects',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            name: 'fk_tasks_subject',
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'notification_logs',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'task_id', type: 'varchar', length: '36' },
                { name: 'message', type: 'text' },
                { name: 'scheduled_at', type: 'datetime' },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['PENDING', 'SENT', 'FAILED', 'CANCELLED'],
                    default: "'PENDING'",
                },
                { name: 'sent_at', type: 'datetime', isNullable: true },
                { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
            ],
        }), true);
        await queryRunner.createForeignKey('notification_logs', new typeorm_1.TableForeignKey({
            columnNames: ['task_id'],
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            name: 'fk_notification_logs_task',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('notification_logs', true);
        await queryRunner.dropTable('tasks', true);
        await queryRunner.dropTable('subjects', true);
        await queryRunner.dropTable('users', true);
    }
}
exports.InitSchema1721800000000 = InitSchema1721800000000;
//# sourceMappingURL=1721800000000-InitSchema.js.map