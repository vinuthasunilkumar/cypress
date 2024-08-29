export enum FrequencyAdministration {
    AdministrationScheduleConfirmDialogTitle = "Cancel Schedule",
    AdministrationScheduleConfirmDialogIcon = "fa fa-warning neo-warning",
    AdministrationScheduleConfirmDialogMessageTitle = "Are you sure you want to cancel this schedule entry?",
    AdministrationScheduleConfirmDialogMessageContent = "All unsaved changes will be lost.",
    AdministrationScheduleConfirmDialogConfirmButtonText = "Yes",
    AdministrationScheduleConfirmDialogCancelButtonText = "No",
    FrequencyRequiredMessage = "Frequency is required.",
    TimesPerDayRequiredMessage = "Times per Day is required.",
    specifyMinutesRequiredMessage = "Minutes are required.",
    TimesPerDayPermissibleRangeMessage = "Permissible range 7-24.",
    specifyMinutesPermissibleRangeMessage = "Permissible range 1-90.",
    MedicationTypeRequiredMessage = "Medication Type is required.",
    DrugNameRequiredMessage = "Drug name is required.",
    MedicationGroupRequiredMessage = "Medication group is required.",
    SelectCycleIsRequiredMessage = "Cycle is required.",
    GiveDaysIsRequiredMessage = "Give is required.",
    SkipDaysIsRequiredMessage = "Do Not Give is required.",
    DurationRequiredMessage = "Duration is required.",
    DurationTypeRequiredMessage = "Duration Type is required.",
    MonthsIsRequiredMessage = "Months is required.",
    DayIsRequiredMessage = "Days is required.",
    DateIsRequiredMessage = "Dates is required.",
    WeeksOfTheMonthIsRequired = "Weeks of the Month is required.",
    TimeIsRequiredMessage = "Time is required.",
    TimeIsInvalidMessage = " is an invalid time.",
    TimeShouldBeUniqueMessage = "Time should be unique.",
    DeleteScheduleAdminConfirmDialogTitle = "Delete Schedule",
    DeleteScheduleAdminConfirmDialogMessageTitle = "Are you sure you want to delete this schedule?",
    DeleteText = "Delete",
    DeleteScheduleAdminCancelButtonText = "Cancel",
    TimeMeridiumMorning = "AM",
    TimeMeridiumEvening = "PM",
    TimeMeridiumA = "A",
    TimeMeridiumP = "P",
    BackSpaceKey = "Backspace",
    Tab = "Tab",
    DefaultOverrideScheduleConfirmDialogTitle = "Update Default Schedules",
    DefaultOverrideScheduleConfirmDialogMessageTitle = "A default Administration Schedule already exists. Do you want to replace it to {0}?",
    DefaultOverrideScheduleConfirmDialogMessageContent = "Administration Schedule will be created as a default.",
    FacilityRequiredMessage = "Facility is required.",
    NoMatchesFound = "No matches found",
    FrequencySavedSuccessfully = "Administration Schedule saved successfully.",
    ImportDialogOkBtnText = "Import",
    ExportDialogOkBtnText = "Export",
    ExportTo = "Export To",
    ImportFrom = "Import From",
    ImportFacilityIMessage = "Select the facility to import your desired administration schedule list and assign it to the units/rooms in your current facility.",
    ExportFacilityIMessage= "Export your administration schedule list to another facility, providing them with a copy of your schedules.",
    OverrideDefaultScheduleImportMessage = "Override the default Administration Schedule during import.",
    OverrideDefaultScheduleExportMessage = "Override the default Administration Schedule during export.",
    AssignImportedList = "Assign Imported List",
    AssignExportedList = "Assign Exported List",
    DefaultIMessageSchedules="By default, the schedule will be assigned to all units within the facility."
}

interface ScheduleMessages {
    SINGLE: () => string;
    MULTIPLE: (count: number) => string;
    Export_All: () => string;
    Export_Message: (exportedCount: number, requestCount: number) => string;
    Export_Dialog_Title: (count: number) => string;
    Import_Dialog_Title: (count: number | null) => string;
    Import_Message: (importedCount: number, requestIdsCount: number) => string;
    Import_All: () => string;
    Export_FacilityName:(facilityLabel:string)=>string;
}

export const SCHEDULE_MESSAGES: ScheduleMessages = {
    SINGLE: () => "Are you sure you want to delete this schedule?",
    MULTIPLE: (count: number) => `Are you sure you want to delete ${count} selected schedules?`,
    Export_All: () => "Administration Schedules exported successfully.",
    Export_Message: (exportedCount, requestCount) => `Exported ${exportedCount} of ${requestCount} Administration Schedules. ${requestCount - exportedCount} duplicate Administration Schedules already exist in the library.`,
    Export_Dialog_Title: (count: number) => `Export ${count} Administration Schedules`,
    Import_Dialog_Title: (count: number | null) => count === null ? `Import Administration Schedule List` : `Import ${count} Administration Schedule List`,
    Import_Message: (importedCount, requestIdsCount) => `Imported ${importedCount} of ${requestIdsCount} Administration Schedules. ${requestIdsCount - importedCount} duplicate Administration Schedules already exist in the library.`,
    Import_All: () => 'Administration Schedules imported successfully.',
    Export_FacilityName:(facilityLabel)=>`Select ${facilityLabel} Units/Rooms`
};

export enum SORT_COLUMNS {
    Frequency = "Frequency",
    AdministrationSchedules = "Administration Schedule",
    OrderType = "Order Type",
    AssignedTo = "AssignedTo",
}
