import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRefreshTokenHash1721900000000 implements MigrationInterface {
  name = 'AddRefreshTokenHash1721900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'refresh_token_hash',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'refresh_token_hash');
  }
}
