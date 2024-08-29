export class StockMedicationLibraryRequestDto {
    Id!: number;
    Description!: string;
    CorporationId!: number;
    EctConfigId!: number;
    SnfFacilityId!: number;
}

export class StockMedicationLibraryResponseDto {
    id!: number;
    description!: string;
    isStockLibraryCreated!: boolean;
}