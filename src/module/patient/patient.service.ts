import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patients } from 'src/schema/patients.entity';
import { DataSource, Repository } from 'typeorm';
import {
  IContactInfo,
  ICreatePatientPayload,
  IUpdatePatientPayload,
} from './patient.interface';
import { ContactInfos } from 'src/schema/contact_infos.entity';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patients)
    private patientRepository: Repository<Patients>,
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {}

  async detail(id: string): Promise<Patients> {
    try {
      const patient = await this.patientRepository.findOneBy({ id });
      if (!patient)
        throw new HttpException(
          'Patient is not founded.',
          HttpStatus.NOT_FOUND,
        );

      return patient;
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }

  async create(input: ICreatePatientPayload): Promise<Patients> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { contactInfo, ...patientData } = input;
      const patient = await queryRunner.manager.save(
        await queryRunner.manager.create(Patients, patientData),
      );

      if (patient) {
        contactInfo['patientId'] = patient.id;
        const contact = await queryRunner.manager.save(
          await queryRunner.manager.create(ContactInfos, contactInfo),
        );

        patient['contactInfo'] = contact;
      }

      await queryRunner.commitTransaction();
      return patient;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, input: IUpdatePatientPayload) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const patient = await this.patientRepository.findOneBy({ id });
      if (!patient)
        throw new HttpException(
          'Patient is not founded.',
          HttpStatus.NOT_FOUND,
        );

      let patientPayload: IUpdatePatientPayload | null = null;
      let contactPayload: IContactInfo | null = null;

      if (input.contactInfo) {
        input.contactInfo['patientId'] = id;
        contactPayload = input.contactInfo;
      }

      delete input.contactInfo;
      patientPayload = input;

      if (contactPayload)
        await queryRunner.manager.update(
          ContactInfos,
          { patientId: id },
          contactPayload,
        );
      await queryRunner.manager.update(Patients, { id: id }, patientPayload);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const patient = await this.patientRepository.findOne({
        where: { id },
        relations: ['contactInfo'],
      });

      if (!patient)
        throw new HttpException('Patient is not founded', HttpStatus.NOT_FOUND);
      if (patient?.contactInfo) {
        await queryRunner.manager.remove(patient.contactInfo);
      }

      await queryRunner.manager.delete(Patients, id);
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
