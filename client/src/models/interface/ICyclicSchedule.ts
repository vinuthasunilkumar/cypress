export interface ICyclicSchedule {
    cycle: number | null;
    giveDays: number | null;
    skipDays: number | null;
    isCycleDisabled:boolean;
    isGiveDisabled:boolean;
    isNotGiveDisabled:boolean;
}