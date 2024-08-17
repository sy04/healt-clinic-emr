import { MigrationInterface, QueryRunner } from 'typeorm';

export class Alter_tableIsAble1723799221494 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE appointments ADD COLUMN "isAble" BOOLEAN DEFAULT TRUE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE appointments DROP COLUMN "isAble";`);
  }
}
