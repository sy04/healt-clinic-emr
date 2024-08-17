import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { Medications } from 'src/schema/medications.entity';
import { MedicalHistories } from 'src/schema/medical_histories.entity';
import { IListMedicalHistoryResponse, IMedicalHistory, IMedicalHistoryParams, IMedication, IMedicationPayload, IMedicationResponse } from './medication.interface';
import { PatientService } from '../patient/patient.service';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medications)
    private medicationRepository: Repository<Medications>,
    @InjectRepository(MedicalHistories)
    private medicalHistoryRepository: Repository<MedicalHistories>,
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
    private readonly patientService: PatientService
  ) {}

  async create(input: IMedicationPayload): Promise<IMedicationResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { patientId, medication: medicationData, history: historyData } = input;

      const patient = await this.patientService.detail(patientId)
      if (!patient) throw new HttpException('Patient is not founded.', HttpStatus.NOT_FOUND)

      if (medicationData) medicationData['patientId'] = patientId
      if (historyData) historyData['patientId'] = patientId

      const medication: IMedication = await queryRunner.manager.save(
        await queryRunner.manager.create(Medications, medicationData),
      );

      const history: IMedicalHistory = await queryRunner.manager.save(
        await queryRunner.manager.create(MedicalHistories, historyData)
      )

      await queryRunner.commitTransaction();
      return { medication, history };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async detailMedication(id: string): Promise<Medications> {
    try {
      const medication = await this.medicationRepository.findOneBy({ id });
      if (!medication)
        throw new HttpException(
          'Medication is not founded.',
          HttpStatus.NOT_FOUND,
        );

      return medication;
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }

  async detailMedicalHistory(id: string): Promise<MedicalHistories> {
    try {
      const history = await this.medicalHistoryRepository.findOneBy({ id });
      if (!history)
        throw new HttpException(
          'Medical History is not founded.',
          HttpStatus.NOT_FOUND,
        );

      return history;
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }

  async listMedicalHistory(params: IMedicalHistoryParams): Promise<IListMedicalHistoryResponse> {
    try {
      let page = params.page ?? 1;
      let limit = params.limit ?? 10;

      const query = await this.medicalHistoryRepository
        .createQueryBuilder('history')
        .where('history.patientId = :patientId', {patientId: params.patientId})

      if (params.keyword && params.keyword.length > 2) {
        query.andWhere('history.condition ilike :keyword', {keyword: `%${params.keyword}%`})
      }

      let count = await query.getCount();
      let pageCount = Math.ceil(count / limit);

      if (page > pageCount) {
        page = page == 1 ? page : pageCount
      }

      const offset = page == 1 ? 0 : (page - 1) * limit;
      const slNo = page == 1 ? 0 : (page - 1) * limit - 1;

      let report = await query
        .take(limit)
        .skip(offset)
        .getMany();

      let paginator = {
        itemCount: count,
        limit: limit,
        pageCount: pageCount,
        page: page,
        slNo: slNo + 1,
        hasPrevPage: page > 1 ? true : false,
        hasNextPage: page < pageCount ? true : false,
        prevPage: page > 1 && page != 1 ? page - 1 : null,
        nextPage: page < pageCount ? page + 1 : null,
      };

      return {
        histories: count > 0 ? report : [],
        paginator: paginator,
      };
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }
}
