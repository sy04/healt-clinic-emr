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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { responseError, responseSuccess } from 'src/utils/response';
import { Logger } from 'nestjs-pino';
import { MedicationService } from './medication.service';
import { CreateMedicationDTO, ParamsMedicalHistoryDTO } from './dto/index.dto';

@ApiTags('[Medication]')
@Controller('medic')
export class MedicationController {
  constructor(
    private readonly medicationService: MedicationService,
    private readonly logger: Logger,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create Medication' })
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateMedicationDTO, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.medicationService.create(body);

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

  @Get('/')
  @ApiOperation({ summary: 'List Medical History' })
  @UsePipes(ValidationPipe)
  async listMedicalHistory(@Query() params: ParamsMedicalHistoryDTO, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.medicationService.listMedicalHistory(params);

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

  @Get('/medication/:id')
  @ApiOperation({ summary: 'Detail Medication' })
  @UsePipes(ValidationPipe)
  async detailMedication(@Param('id') id: string, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.medicationService.detailMedication(id);

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

  @Get('/history/:id')
  @ApiOperation({ summary: 'Detail Medical History' })
  @UsePipes(ValidationPipe)
  async detailMedicalHistory(@Param('id') id: string, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.medicationService.detailMedicalHistory(id);

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
}
