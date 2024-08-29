import { DefaultLocationsResponse } from "../class/FrequencyAdministration";
import { IValidationErrors } from "./IValidationErrors";

export interface IAdministrationScheduleSaveResponse {
    id: number;
    existingAdministrationScheduleId?: number;
    defaultLocationsResponse?: DefaultLocationsResponse[]
    defaultTimesResponse?: any;
    responseMessage: string;
    statusCode?: number;
    totalActiveElements?: number;
    validationErrors?: IValidationErrors;
    isCompleteFacilitySelected: boolean;
    errorMessage: string | null;
    message: string | null;
}