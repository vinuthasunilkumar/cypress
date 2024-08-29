export interface ICyclicalSchedule {
    administrationScheduleId?: number | null;
    cycle: number | null;
    giveDays: number | null;
    skipDays: number | null;
    isDisabled?: boolean;
}