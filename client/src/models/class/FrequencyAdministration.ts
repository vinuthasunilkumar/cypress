export class TimeSchedules {
    id!: number;
    startTime!: string;
    endTime!: string | null;
}

export class CyclicalSchedules {
    administrationScheduleId?: number | null;
    cycle!: number;
    giveDays!: number | null;
    skipDays!: number | null;
    isDisabled?: boolean;
}

export class WeeklySchedule {
    administrationScheduleId?: number | null;
    everyWeek!: number | null;
    selectedDays!: string;
}

export class MonthlySchedules {
    administrationScheduleId?: number | null;
    everyMonth!: number | null;
    chooseMonth!: string | null;
    selectedDays!: string | null;
    selectedDaysOfMonth!: string | null;
    selectedDaysOfWeek!: string | null;
}

export class ScheduleLocation {
    roomId!: string;
    unitId!: string;
    facilityId!: string;
    isCompleteFacilitySelected?: boolean;
    isCompleteUnitSelected?: boolean;
    isDefault?: boolean;
}

export class DefaultLocationsResponse {
    roomId?: string;
    unitId?: string;
    name?: string;
    facilityId?: string;
    isCompleteFacilitySelected?: boolean;
    isCompleteUnitSelected?: boolean;
    isDefault?: boolean;
    administrationScheduleId?: number;
}

export class UserSelectedScheduleLocations {
    assignedToText?: string;
    scheduleLocations?: ScheduleLocation[];
    checkedRoomsData?: string[];
}

export const setDefaultUserScheduleData = (): UserSelectedScheduleLocations => ({
    assignedToText: "",
    scheduleLocations: [],
    checkedRoomsData: []
});

export class FrequencyDropdown {
    label!: string;
    value!: string;
}

export class FrequencyAdministrationForm {
    administrationScheduleId?: number;
    Id!: number;
    summary!: string;
    orderTypeSummary!: string;
    assignedToSummary!: string;
    timeSummary!: string;
    frequencyRepeatSummary!: string;
    frequency!: FrequencyDropdown | null;
    frequencyCodeDescription!: string;
    frequencyCode!: string;
    timesPerDay!: number | null;
    specifyMinutes!: number | null;
    durationType!: string | null;
    scheduleType!: string;
    orderType!: number;
    medicationType!: number | null;
    facilityId!: string;
    fdbDrugId!: number;
    fdbMedGroupId!: number;
    duration!: number | null;
    isDefault!: boolean;
    isFreqGroupedByEvery!: boolean;
    isPrn!: boolean;
    timeSchedules!: TimeSchedules[];
    cyclicalSchedules!: CyclicalSchedules | null;
    weeklySchedule!: WeeklySchedule | null;
    monthlySchedule!: MonthlySchedules | null;
    scheduleLocation!: ScheduleLocation[] | null;
    existingAdministrationScheduleId?: number;
    defaultLocation?: DefaultLocationsResponse[];
}
export class FrequencyAdministrationRequestDto {
    administrationScheduleId?: number;
    id!: number;
    summary!: string;
    orderTypeSummary!: string;
    assignedToSummary!: string;
    timeSummary!: string;
    frequencyRepeatSummary!: string;
    frequencyCode!: string;
    timesPerDay?: number | null;
    specifyMinutes?: number | null;
    frequencyCodeDescription!: string;
    durationType!: string;
    scheduleType!: string;
    orderType!: number;
    medicationType!: number | null;
    facilityId!: string;
    fdbDrugId!: number;
    fdbMedGroupId!: number;
    duration!: number;
    isDefault!: boolean;
    isFreqGroupedByEvery!: boolean;
    isPrn!: boolean;
    timeSchedules!: TimeSchedules[];
    cyclicalSchedules!: CyclicalSchedules | null;
    weeklySchedule!: WeeklySchedule | null;
    monthlySchedule!: MonthlySchedules | null;
    scheduleLocation!: ScheduleLocation[] | null;
    existingAdministrationScheduleId?: number;
    defaultLocation?: DefaultLocationsResponse[];
};

export class AddScheduleRequiredFields {
    fieldName!: string;
    fieldId?: string;
    errorMessage!: string;
    isValid!: boolean;
    isDependent?: boolean;
    isDependentOn?: string;
    label?: string;
}

export class DropdownItem {
    id?: string | number;
    label!: string | number;
    value!: string | number;
}

export class OrderTypeFields {
    orderTypeId!: number;
    medicationType!: number | null;
    fdbDrugId!: number;
    fdbDrugName?: string | null;
    fdbMedGroupId!: number;
    fdbMedGroupName?: string | null;
    orderTypeName?: string;
    medicationTypeName?: string;
    orderTypeSummary?: string;
}

export const setDefaultOrderTypeDetails = (): OrderTypeFields => ({
    orderTypeId: 0,
    medicationType: null,
    fdbDrugId: 0,
    fdbDrugName: "",
    fdbMedGroupId: 0,
    fdbMedGroupName: "",
    orderTypeName: "All",
    medicationTypeName: "",
    orderTypeSummary: ""
});

export class Day {
    id!: number;
    name!: string;
    label!: string;
    value?: string;
    checked!: boolean;
}

export class ScheduleTime {
    id!: number;
    startTime!: string;
    endTime!: string;
}

export class ScheduleTimeControls {
    id?: number;
    name!: string;
    label!: string;
    value!: Date | string;
    isValid?: boolean;
    errorMessage?: string;
    strVal?: string;
}

export class TimeValidationFields {
    originalStrTime!: string;
    strTime!: string;
    hrsPos!: number;
    minsPos!: number;
    hours!: string;
    mins!: string;
    meridiumMentioned!: string;
    meridiumAssumed!: string;
    matchTwoChMinTwoChHrs!: boolean;
    isValid!: boolean;
}

export class Frequency {
    shortAbbreviation!: string;
    abbreviation!: string;
    noOfSpecificTimeInstance?: number;
    noOfRangeTimeInstance?: number;
    noOfSpecificTimes?: number;
}

export class FrequencySummary {
    frequencyLongForm?: string;
    repeat?: string;
    summaryTime?: string;
    duration?: string;
    durationType?: string;
    isPrn?: string;
    orderTypeSummary?: string;
    assignToSummary?: string;
    summary?: string; // will hold the value all params except orderTypeSummary & assignToSummary
    frequencyRepeatSummary?: string;
    timeSummary?: string;
    isFreqGroupedByEvery?: boolean;
    timesPerDay?: number | null;
    specifyMinutes?: number | null;
}

export const setDefaultFrequencySummary = (): FrequencySummary => ({
    frequencyLongForm: "",
    repeat: "",
    summaryTime: "",
    duration: "",
    durationType: "",
    isPrn: "",
    orderTypeSummary: "",
    assignToSummary: "",
    summary: "",
    timesPerDay: null,
    specifyMinutes:null
});

export class ExportFrequencyAdministrationRequestDto {
    scheduleLocation!: ScheduleLocation[] | null;
    administrationScheduleIds!: string | null;
    isDefault!:boolean
};