import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableMedications1723651683000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE medications (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "patientId" UUID NOT NULL,
                "name" VARCHAR NOT NULL,
                "dosage" VARCHAR NOT NULL,
                "frequency" VARCHAR NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_patientId FOREIGN KEY("patientId") REFERENCES patients(id)
            );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('medications', true);
  }
}
