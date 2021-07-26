import { MigrationInterface, QueryRunner } from 'typeorm';

export class authProviders1626922902838 implements MigrationInterface {
  name = 'authProviders1626922902838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      ` CREATE TABLE auth_providers(
            id 			INT	NOT NULL AUTO_INCREMENT,
            provider_id VARCHAR(255) NOT NULL,
            platform 	VARCHAR(255) NOT NULL,
            createdAt 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt 	TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deletedAt 	TIMESTAMP NULL,
            userId      INT NOT NULL,
            PRIMARY 	KEY(id),
            FOREIGN KEY(userId) 
                REFERENCES users(id)
                ON DELETE CASCADE
        );  
        `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `auth_providers`');
  }
}
