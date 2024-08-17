export interface ICreateAppointmentPayload {
  patientId: string;
  doctorId: string;
  date: string;
}

export interface IUpdateAppointmentPayload {
  date?: string;
  reason?: string;
  notes?: string;
  isAble?: boolean;
}
