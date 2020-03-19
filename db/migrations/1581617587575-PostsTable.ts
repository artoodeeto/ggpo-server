/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class PostsTable1581617587575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`
    // CREATE TABLE posts (
    //   id INT AUTO_INCREMENT,
    //   title VARCHAR(255) NOT NULL,
    //   body TEXT(65000) NOT NULL,
    //   createdAt DATETIME NOT NULL,
    //   updatedAt DATETIME,
    //   PRIMARY KEY(id),
    //   userId INT NOT NULL,
    //   FOREIGN KEY (userId)
    //           REFERENCES users (id)
    //           ON DELETE CASCADE
    //     );
    // `);

    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'body',
            type: 'text',
            length: '65000',
            isNullable: false
          },
          {
            name: 'createdAt',
            type: 'DATETIME',
            isNullable: true
          },
          {
            name: 'updatedAt',
            type: 'DATETIME',
            isNullable: true
          },
          {
            name: 'deletedAt',
            type: 'DATETIME',
            isNullable: true
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false
          }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('posts', true);
  }
}
