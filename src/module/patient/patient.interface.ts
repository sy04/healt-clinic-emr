import { GenderEnum } from './patient.enum';

export interface IContactInfo {
  patientId?: string;
  email?: string;
  phone?: string;
}

export interface ICreatePatientPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: GenderEnum | string;
  contactInfo: IContactInfo;
}

export interface IUpdatePatientPayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: GenderEnum | string;
  contactInfo?: IContactInfo;
}
