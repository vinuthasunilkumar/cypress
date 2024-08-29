export class AdministrationScheduleListRequestDto {
    Id!: number;
    Description!: string;
    CorporationId!: number;
    EctConfigId!: number;
    SnfFacilityId!: number;
}

export class AdministrationScheduleListResponseDto {
    id!: number;
    description!: string;
    isAdministrationScheduleListCreated!: boolean;
}