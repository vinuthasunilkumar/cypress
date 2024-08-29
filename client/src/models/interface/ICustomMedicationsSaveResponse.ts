import { IValidationErrors } from "./IValidationErrors";

export interface ICustomMedicationsSaveResponse {
    id: number;
    responseMessage: string;
    statusCode: number;
    totalActiveElements: number;
    validationErrors: IValidationErrors;
}