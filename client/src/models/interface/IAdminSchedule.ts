import { RepeatTypes } from "../../shared/enum/FrequencyAdministration";
import { DropdownItem, ScheduleLocation, ScheduleTimeControls, Day, AddScheduleRequiredFields, Frequency, TimeSchedules } from "../class/FrequencyAdministration";
import { IAdministrationSchedule } from "./IAdministrationSchedule";
import { IAdministrationScheduleList } from "./IAdministrationScheduleList";
import { IAdministrationScheduleSaveResponse } from "./IAdministrationScheduleSaveResponse";
import { ICyclicalSchedule } from "./ICyclicalSchedule";

export interface IAdminSchedule {
    durationErrorMessage: string,
    durationTypeErrorMessage: string,
    specificTimeErrorMessage: string,
    timeRangeErrorMessage: string,
    isDaySelectedForWeeklyBlock: boolean | null,
    userOrderTypeSummary: string | null,
    selectedWeek: DropdownItem,
    isTimeRangeDisabled: boolean,
    checkedData: string[],
    isBtnSpecificTimeChecked: boolean,
    frequencyErrorMessage: string,
    timesPerDayErrorMessage?: string,
    specifyMinutesErrorMessage?: string,
    isFreqBelongsToEveryGroup: boolean,
    scheduleLocation: ScheduleLocation[],
    assignToText: string,
    timeRange: ScheduleTimeControls[],
    selectedRepeatType: string,
    time: ScheduleTimeControls[],
    days: Day[],
    isPrnChecked: boolean,
    showErrorSummary: boolean,
    resetScheduleData: boolean,
    summaryTimeString: string,
    summary: string,
    repeatStrings: string,
    isAssignedToOpened: boolean,
    showApiResponseMsg: boolean,
    editScheduleData: IAdministrationSchedule | null,
    presetAdministrationScheduleId: number,
    showDefaultOverrideModal: boolean,
    defaultOverrideMessage: string,
    administrationScheduleList: IAdministrationScheduleList[],
    selectedAdministrationScheduleId: number,
    fieldsToValidate: AddScheduleRequiredFields[],
    frequencyData: Frequency[],
    selectedOrderType: number | null,
    selectedFrequency: Frequency | null,
    selectedDurationType: DropdownItem | null,
    selectedDuration: number | null,
    defaultCheckResponse: IAdministrationScheduleSaveResponse,
    everyGroupTimes: TimeSchedules[],
    isCustomTabSelected: boolean,
    isRepeatTypesDisabled: boolean,
    maxDaysSelection: number | null,
    selectedRepeatOption: RepeatTypes;
    selectedCyclicalSchedule: ICyclicalSchedule | null;
    timesPerDay?: number | null;
    specifyMinutes?: number | null;
    startDate?: Date | null;
    endDate?: Date | null;
    isEndDateOpenEnded?: boolean | null;
}