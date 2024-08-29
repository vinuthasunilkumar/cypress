import { ICyclicalSchedule } from "./ICyclicalSchedule";
import { IMonthlySchedule } from "./IMonthlySchedule";
import { IScheduleLocation } from "./IScheduleLocation";
import { ITimeSchedule } from "./ITimeSchedule";
import { IWeeklySchedule } from "./IWeeklySchedule";

export interface IAdministrationSchedule {
    id?: number;
    frequencyCode: string;
    frequencyCodeDescription: string;
    summary: string;
    orderTypeSummary?: string;
    assignedToSummary?: string;
    timeSummary?: string;
    frequencyRepeatSummary?: string;
    orderType: number;
    medicationType: number;
    fdbMedGroupId: number | null;
    fdbMedGroupName?: string | null;
    gcnSeqNo: any;
    isDefault: boolean;
    isPrn: boolean;
    scheduleType: string;
    duration: number;
    durationType: string;
    fdbDrugId: number | null;
    fdbDrugName?: string | null;
    timeSchedule: ITimeSchedule[];
    cyclicalSchedule: ICyclicalSchedule | null;
    weeklySchedule: IWeeklySchedule | null;
    monthlySchedule: IMonthlySchedule | null;
    scheduleLocation: IScheduleLocation[];
    assignedTo: string | null;
    timesPerDay?: number | null;
    specifyMinutes?: number | null;
}