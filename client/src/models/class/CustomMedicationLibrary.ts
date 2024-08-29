export class CustomMedicationLibraryForm {
    Id!: number;
    libraryName!: string;
    status!: any;
    corporationId!: number;
    ectConfigId!: number;
};

export class CustomMedicationLibraryRequestDto {
    Id!: number;
    Description!: string;
    IsActive!: any;
    CorporationId!: number;
    EctConfigId!: number;
}