export interface IScheduleLocation {
    roomId: string;
    unitId: string;
    facilityId: string;
    isCompleteFacilitySelected?: boolean;
    isCompleteUnitSelected?: boolean;
    isDefault?: boolean;
}