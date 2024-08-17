import { Resolver, Query, Mutation, Args, ObjectType } from '@nestjs/graphql';
import {
  ResponseFormat,
  responseError,
  responseSuccess,
} from 'src/utils/response';
import { HttpStatus } from '@nestjs/common';
import { Doctors } from 'src/schema/doctors.entity';
import { DoctorService } from './doctor.service';
import { DoctorPayloadDTO } from './dto/resolver.dto';
import 'reflect-metadata';

@ObjectType()
export class DoctorResponse extends ResponseFormat(Doctors) {}

@Resolver()
@ObjectType()
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Query(() => DoctorResponse)
  async getDoctor(@Args('id') id: string): Promise<DoctorResponse> {
    try {
      const process = await this.doctorService.detail(id);

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

  @Mutation(() => DoctorResponse)
  async createDoctor(
    @Args('input') input: DoctorPayloadDTO,
  ): Promise<DoctorResponse> {
    try {
      const process = await this.doctorService.create(input);

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

  @Mutation(() => DoctorResponse)
  async updateDoctor(
    @Args('id') id: string,
    @Args('input') input: DoctorPayloadDTO,
  ): Promise<DoctorResponse> {
    try {
      const process = await this.doctorService.update(id, input);

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

  @Mutation(() => DoctorResponse)
  async deleteDoctor(@Args('id') id: string): Promise<DoctorResponse> {
    try {
      const process = await this.doctorService.delete(id);

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
