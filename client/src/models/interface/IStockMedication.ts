import { IStockMedicationLocation } from "./IStockMedicationLocations";

export interface IStockMedication {
    id: number;
    fdbMedicationId: number;
    gcnSequenceNumber: number;
    isGeneric: boolean;
    description: string,
    facilityId: string,
    facilityName: string,
    stockMedicationLocation: IStockMedicationLocation[]
}