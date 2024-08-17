import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { Doctors } from 'src/schema/doctors.entity';
import { IDoctorPayload } from './doctor.interface';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctors)
    private doctorRepository: Repository<Doctors>,
    private readonly logger: Logger,
  ) {}

  async create(input: IDoctorPayload): Promise<Doctors> {
    try {
      return await this.doctorRepository.save(
        await this.doctorRepository.create(input),
      );
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }

  async update(id: string, input: IDoctorPayload) {
    try {
      const doctor = await this.doctorRepository.findOneBy({ id });
      if (!doctor)
        throw new HttpException('Doctor is not founded.', HttpStatus.NOT_FOUND);

      return await this.doctorRepository.update(id, input);
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }

  async detail(id: string) {
    try {
      const doctor = await this.doctorRepository.findOneBy({ id });
      if (!doctor)
        throw new HttpException('Doctor is not founded.', HttpStatus.NOT_FOUND);

      return doctor;
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const doctor = await this.doctorRepository.findOneBy({ id });
      if (!doctor)
        throw new HttpException('Doctor is not founded.', HttpStatus.NOT_FOUND);

      return await this.doctorRepository.delete(id);
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }
}
