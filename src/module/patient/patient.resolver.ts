import { Resolver, Query, Mutation, Args, ObjectType } from '@nestjs/graphql';
import { PatientService } from './patient.service';
import { Patients } from 'src/schema/patients.entity';
import { CreatePatientDTO, UpdatePatientDTO } from './dto/resolver.dto';
import {
  ResponseFormat,
  responseError,
  responseSuccess,
} from 'src/utils/response';
import { HttpStatus } from '@nestjs/common';
import 'reflect-metadata';

@ObjectType()
export class PatientResponse extends ResponseFormat(Patients) {}

@Resolver()
@ObjectType()
export class PatientResolver {
  constructor(private readonly patientService: PatientService) {}

  @Query(() => PatientResponse)
  async getPatient(@Args('id') id: string): Promise<PatientResponse> {
    try {
      const process = await this.patientService.detail(id);

      if (!process) {
        return responseError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      } else {
        return responseSuccess(HttpStatus.OK, 'Success', process);
      }
    } catch (error) {
      if (error.getStatus() === 500) {
        return responseError(HttpStatus.INTERNAL_SERVER_ERROR, error);
      } else {
        return responseError(error.getStatus(), error.getResponse());
      }
    }
  }

  @Mutation(() => PatientResponse)
  async createPatient(
    @Args('input') input: CreatePatientDTO,
  ): Promise<PatientResponse> {
    try {
      const process = await this.patientService.create(input);

      if (!process) {
        return responseError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      } else {
        return responseSuccess(HttpStatus.OK, 'Success', process);
      }
    } catch (error) {
      if (error.getStatus() === 500) {
        return responseError(HttpStatus.INTERNAL_SERVER_ERROR, error);
      } else {
        return responseError(error.getStatus(), error.getResponse());
      }
    }
  }

  @Mutation(() => PatientResponse)
  async updatePatient(
    @Args('id') id: string,
    @Args('input') input: UpdatePatientDTO,
  ): Promise<PatientResponse> {
    try {
      const process = await this.patientService.update(id, input);

      if (!process) {
        return responseError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      } else {
        return responseSuccess(HttpStatus.OK, 'Success', null);
      }
    } catch (error) {
      if (error.getStatus() === 500) {
        return responseError(HttpStatus.INTERNAL_SERVER_ERROR, error);
      } else {
        return responseError(error.getStatus(), error.getResponse());
      }
    }
  }

  @Mutation(() => PatientResponse)
  async deletePatient(@Args('id') id: string): Promise<PatientResponse> {
    try {
      const process = await this.patientService.delete(id);

      if (!process) {
        return responseError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      } else {
        return responseSuccess(HttpStatus.OK, 'Success', null);
      }
    } catch (error) {
      if (error.getStatus() === 500) {
        return responseError(HttpStatus.INTERNAL_SERVER_ERROR, error);
      } else {
        return responseError(error.getStatus(), error.getResponse());
      }
    }
  }
}
