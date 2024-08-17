import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentPayloadDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty()
  @Type(() => String)
  @IsDateString()
  @IsNotEmpty()
  date: string;
}

export class UpdateAppointmentPayloadDTO {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsDateString()
  @IsOptional()
  date: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  reason: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  notes: string;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isAble: boolean;
}
