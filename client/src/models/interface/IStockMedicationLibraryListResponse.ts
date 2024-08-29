import { IStockMedicationLibrary } from "./IStockMedicationLibrary";

export interface IStockMedicationLibraryListResponse {
    stockMedicationLibraries: IStockMedicationLibrary[];
    pagination: IPagination;
  }