/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersTable1575433829516 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
            CREATE TABLE users (
              id INT AUTO_INCREMENT,
              username VARCHAR(50) NOT NULL,
              email VARCHAR(50) NOT NULL UNIQUE,
              password VARCHAR(255) NOT NULL,
              createdAt DATETIME NOT NULL,
              PRIMARY KEY(id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('users', true);
  }
}
