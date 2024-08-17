import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableDoctors1723651710466 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE doctors (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" VARCHAR NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('doctors', true);
  }
}
