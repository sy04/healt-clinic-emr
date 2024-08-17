import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAppointments1723788593307
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE appointments (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "patientId" UUID NOT NULL,
                "doctorId" UUID NOT NULL,
                "date" VARCHAR NOT NULL,
                "reason" VARCHAR DEFAULT NULL,
                "notes" VARCHAR DEFAULT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_patientId FOREIGN KEY("patientId") REFERENCES patients(id),
                CONSTRAINT fk_doctorId FOREIGN KEY("doctorId") REFERENCES doctors(id)
            );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('appointments', true);
  }
}
