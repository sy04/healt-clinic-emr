import {
  Controller,
  UsePipes,
  ValidationPipe,
  Body,
  Post,
  Res,
  HttpStatus,
  Param,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { responseError, responseSuccess } from 'src/utils/response';
import { CreatePatientDTO, UpdatePatientDTO } from './dto/index.dto';
import { Logger } from 'nestjs-pino';
import { PatientService } from './patient.service';

@ApiTags('[Patient]')
@Controller('patient')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly logger: Logger,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create Patient' })
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreatePatientDTO, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.patientService.create(body);

      if (!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', process);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error);
      res.status(statusCode).json(response);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Patient Detail' })
  @UsePipes(ValidationPipe)
  async detail(@Param('id') id: string, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.patientService.detail(id);

      if (!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', process);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error);
      res.status(statusCode).json(response);
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update Patient' })
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePatientDTO,
    @Res() res,
  ) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.patientService.update(id, body);

      if (!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', null);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error);
      res.status(statusCode).json(response);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Update Patient' })
  @UsePipes(ValidationPipe)
  async delete(@Param('id') id: string, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.patientService.delete(id);

      if (!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', null);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error);
      res.status(statusCode).json(response);
    }
  }
}
