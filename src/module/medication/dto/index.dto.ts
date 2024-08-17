import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { MedicalHistoryEnum } from "../medication.enum";

class Medication {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  frequency: string;
}

class MedicalHistory {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  diagnosisDate: string;

  @ApiProperty()
  @Type(() => String)
  @IsEnum(MedicalHistoryEnum)
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class CreateMedicationDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiPropertyOptional()
  @Type(() => Medication)
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  medication: Medication;

  @ApiPropertyOptional()
  @Type(() => MedicalHistory)
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  history: MedicalHistory;
}

export class ParamsMedicalHistoryDTO {
  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  pagination: boolean
  
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  page: number
  
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  limit: number
  
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  keyword: string
  
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  patientId: string
}