import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DoctorPayloadDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;
}
