import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableMedicalHistories1723651650730
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE medical_histories (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "patientId" UUID NOT NULL,
                "condition" VARCHAR NOT NULL,
                "diagnosisDate" VARCHAR NOT NULL,
                "status" VARCHAR NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_patientId FOREIGN KEY("patientId") REFERENCES patients(id)
            );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('medical_histories', true);
  }
}
