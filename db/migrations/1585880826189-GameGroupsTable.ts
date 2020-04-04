import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class GameGroupsTable1585880826189 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'game_groups',
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
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('game_groups', true);
  }
}
