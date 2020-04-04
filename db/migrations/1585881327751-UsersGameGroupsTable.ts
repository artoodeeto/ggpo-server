import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class UsersGameGroupsTable1585881327751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'users_game_groups',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'createdAt',
            type: 'TIMESTAMP',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'TIMESTAMP',
            isNullable: true
          },
          {
            name: 'deletedAt',
            type: 'TIMESTAMP',
            isNullable: true
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false
          },
          {
            name: 'gameGroupId',
            type: 'int',
            isNullable: false
          }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      'users_game_groups',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users'
      })
    );

    await queryRunner.createForeignKey(
      'users_game_groups',
      new TableForeignKey({
        columnNames: ['gameGroupId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'game_groups'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('users_game_groups', true);
  }
}
