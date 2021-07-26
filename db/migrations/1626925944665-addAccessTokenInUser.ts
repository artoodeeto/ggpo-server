import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAccessTokenInUser1626925944665 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `   ALTER TABLE users 
            ADD accessToken VARCHAR(255) NULL DEFAULT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "accessToken"`);
  }
}
