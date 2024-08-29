export interface IMonthlySchedule {
    administrationScheduleId?: number | null;
    everyMonth: number | null;
    chooseMonth: string | null;
    selectedDays: string | null;
    selectedDaysOfMonth: string | null;
    selectedDaysOfWeek: string | null;
}