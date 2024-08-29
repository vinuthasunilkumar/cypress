import { StockMedications } from "../../shared/enum/StockMedicationsEnum";

export class StockMedicationLocation {
    id!: number;
    stockMedicationId!: number;
    unitId!: string;
}

export class StockMedicationSupplyForm {
    id!: number;
    Ids?: string;
    fdbMedications!: IMedicationSearchResults[];
    facilityId?: string;
    stockMedicationLocation?: StockMedicationLocation[];
};

export class StockMedicationSupplyRequestDto {
    id!: number;
    Ids?: string;
    fdbMedications!: IMedicationSearchResults[];
    facilityId?: string;
    stockMedicationLocation!: StockMedicationLocation[];
};

export class StockMedicationSupplyRequiredFields {
    fieldName!: string;
    fieldId!: string;
    errorMessage!: string;
    isValid!: boolean;
    isDependent?: boolean;
    isDependentOn?: string;
    label?: string;
}

export const stockMedicationFieldsToValidate: StockMedicationSupplyRequiredFields[] = [
    {
        fieldName: "medicationSupplyName",
        fieldId: "txtMedicationSupplyName",
        label: "Medication/Supply",
        errorMessage: StockMedications.MedicationRequiredMessage,
        isDependent: false,
        isValid: true
    }
]

export const exportSMSupplyFieldsToValidate: StockMedicationSupplyRequiredFields[] = [
    {
        fieldName: "facility",
        fieldId: "facility",
        label: "Facility",
        errorMessage: StockMedications.FacilityRequiredMessage,
        isDependent: false,
        isValid: true
    }
]

export class ExportStockMedicationRequestDto {
    stockMedicationLocation!: StockMedicationLocation[]
}