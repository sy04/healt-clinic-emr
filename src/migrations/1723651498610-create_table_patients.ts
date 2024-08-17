import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePatients1723651498610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE patients (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "firstName" VARCHAR NOT NULL,
                "lastName" VARCHAR NOT NULL,
                "dateOfBirth" VARCHAR NOT NULL,
                "gender" VARCHAR NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('patients', true);
  }
}
