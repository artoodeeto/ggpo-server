/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostsTable1581617587575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        CREATE TABLE posts (
          id INT AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          body TEXT(65000) NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME,
          PRIMARY KEY(id),
          userId INT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users (id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('posts', true);
  }
}
