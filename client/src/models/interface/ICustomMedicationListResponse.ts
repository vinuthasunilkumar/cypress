import { ICustomMedication } from "./ICustomMedication";

export interface ICustomMedicationListResponse {
    customMedications: ICustomMedication[];
    pagination: IPagination;
  }