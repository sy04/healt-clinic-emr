import { MedicalHistoryEnum } from "./medication.enum"

export interface IMedication {
  id?: string
  patientId?: string
  name: string
  dosage: string
  frequency: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IMedicalHistory {
  id?: string
  patientId?: string
  condition: string
  diagnosisDate: string
  status: MedicalHistoryEnum | string
  createdAt?: Date
  updatedAt?: Date
}

export interface IMedicationPayload {
  patientId: string
  medication?: IMedication
  history?: IMedicalHistory
}

export interface IMedicationResponse {
  medication: IMedication
  history: IMedicalHistory
}

export interface IMedicalHistoryParams {
  pagination: boolean
  page?: number
  limit?: number
  keyword?: string
  patientId: string
}

export interface IPaginator {
  itemCount: number,
  limit: number,
  pageCount: number,
  page: number,
  slNo: number,
  hasPrevPage: boolean,
  hasNextPage: boolean,
  prevPage?: number | null,
  nextPage?: number | null,
}

export interface IListMedicalHistoryResponse {
  histories: IMedicalHistory[]
  paginator: IPaginator
}