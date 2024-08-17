import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { MedicalHistoryEnum } from "../medication.enum";
import { Medications } from "../../../schema/medications.entity";
import { MedicalHistories } from "../../../schema/medical_histories.entity";

@InputType()
class Medication {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  frequency: string;
}

@InputType()
class MedicalHistory {
  @Field()
  @IsString()
  @IsNotEmpty()
  condition: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  diagnosisDate: string;

  @Field()
  @IsEnum(MedicalHistoryEnum)
  @IsString()
  @IsNotEmpty()
  status: string;
}

@InputType()
export class CreateMedicationDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @Field(() => Medication, { nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Medication)
  @IsOptional()
  medication?: Medication;

  @Field(() => MedicalHistory, { nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => MedicalHistory)
  @IsOptional()
  history?: MedicalHistory;
}

@InputType()
export class ParamsMedicalHistoryDTO {
  @Field()
  @IsBoolean()
  @IsNotEmpty()
  pagination: boolean
  
  @Field()
  @IsNumber()
  @IsNotEmpty()
  page: number
  
  @Field()
  @IsNumber()
  @IsNotEmpty()
  limit: number
  
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  keyword?: string
  
  @Field()
  @IsString()
  @IsNotEmpty()
  patientId: string
}

@ObjectType()
export class MedicationResponseDTO {
  @Field(() => Medications)
  medication: Medications;

  @Field(() => MedicalHistories)
  history: MedicalHistories;
}

@ObjectType()
export class Paginator {
  @Field()
  itemCount: number;

  @Field()
  limit: number;

  @Field()
  pageCount: number;

  @Field()
  page: number;

  @Field()
  slNo: number;

  @Field()
  hasPrevPage: boolean;

  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true })
  prevPage?: number | null;

  @Field({ nullable: true })
  nextPage?: number | null;
}

@ObjectType()
export class ListMedicalHistoryResponseDTO {
  @Field(() => [MedicalHistories])
  histories: MedicalHistories[];

  @Field(() => Paginator)
  paginator: Paginator;
}