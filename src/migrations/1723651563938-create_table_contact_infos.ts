import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableContactInfos1723651563938
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE contact_infos (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "patientId" UUID NOT NULL,
                "email" VARCHAR NOT NULL,
                "phone" VARCHAR NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_patientId FOREIGN KEY("patientId") REFERENCES patients(id)
            );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('contact_infos', true);
  }
}
