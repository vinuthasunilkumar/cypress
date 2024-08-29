import { IValidationErrors } from "./IValidationErrors";

export interface IStockMedicationSaveResponse {
    id: number;
    ids: string;
    responseMessage: string;
    statusCode?: number;
    totalActiveElements?: number;
    validationErrors?: IValidationErrors;
    error?: string;
}