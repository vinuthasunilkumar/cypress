import { ICustomMedicationLibrary } from "./ICustomMedicationLibrary";

export interface ICustomMedicationLibraryListResponse {
    customMedicationLibraries: ICustomMedicationLibrary[];
    pagination: IPagination;
  }