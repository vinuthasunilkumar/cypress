import { IStockMedicationsList } from "./IStockMedicationsList";

export interface IStockMedicationsListResponse {
    stockMedication: IStockMedicationsList[];
    pagination: IPagination;
  }