import { AddScheduleRequiredFields, Day } from "../../models/class/FrequencyAdministration"
import { FrequencyAdministration } from "./FrequencyAdministrationValidationMessages"

export enum RepeatTypes {
    Daily = "Daily",
    Cyclical = "Cyclical",
    Weekly = "Weekly",
    Monthly = "Monthly"
}

export enum ChooseCyclicalTypes {
    Blank = -1,
    CustomDays = 1,
    EveryOtherDay = 2,
    EvenDates = 3,
    OddDates = 4
}

export enum Days {
    Monday = "Mon",
    Tuesday = "Tue",
    Wednesday = "Wed",
    Thursday = "Thu",
    Friday = "Fri",
    Saturday = "Sat",
    Sunday = "Sun",
}

export const listDays: Day[] = [
    {
        id: 1,
        name: "Sun",
        label: "Sun",
        value: "Sun",
        checked: false
    },
    {
        id: 2,
        name: "Mon",
        label: "Mon",
        value: "Mon",
        checked: false
    },
    {
        id: 3,
        name: "Tue",
        label: "Tue",
        value: "Tue",
        checked: false
    },
    {
        id: 4,
        name: "Wed",
        label: "Wed",
        value: "Wed",
        checked: false
    },
    {
        id: 5,
        name: "Thu",
        label: "Thu",
        value: "Thu",
        checked: false
    },
    {
        id: 6,
        name: "Fri",
        label: "Fri",
        value: "Fri",
        checked: false
    },
    {
        id: 7,
        name: "Sat",
        label: "Sat",
        value: "Sat",
        checked: false
    },
]

export const monthDays: Day[] = [
    {
        id: 1,
        name: "01",
        label: "01",
        checked: false
    },
    {
        id: 2,
        name: "02",
        label: "02",
        checked: false
    },
    {
        id: 3,
        name: "03",
        label: "03",
        checked: false
    },
    {
        id: 4,
        name: "04",
        label: "04",
        checked: false
    },
    {
        id: 5,
        name: "05",
        label: "05",
        checked: false
    },
    {
        id: 6,
        name: "06",
        label: "06",
        checked: false
    },
    {
        id: 7,
        name: "07",
        label: "07",
        checked: false
    },
    {
        id: 8,
        name: "08",
        label: "08",
        checked: false
    },
    {
        id: 9,
        name: "09",
        label: "09",
        checked: false
    },
    {
        id: 10,
        name: "10",
        label: "10",
        checked: false
    },
    {
        id: 11,
        name: "11",
        label: "11",
        checked: false
    },
    {
        id: 12,
        name: "12",
        label: "12",
        checked: false
    },
    {
        id: 13,
        name: "13",
        label: "13",
        checked: false
    },
    {
        id: 14,
        name: "14",
        label: "14",
        checked: false
    },
    {
        id: 15,
        name: "15",
        label: "15",
        checked: false
    },
    {
        id: 16,
        name: "16",
        label: "16",
        checked: false
    },
    {
        id: 17,
        name: "17",
        label: "17",
        checked: false
    },
    {
        id: 18,
        name: "18",
        label: "18",
        checked: false
    },
    {
        id: 19,
        name: "19",
        label: "19",
        checked: false
    },
    {
        id: 20,
        name: "20",
        label: "20",
        checked: false
    },
    {
        id: 21,
        name: "21",
        label: "21",
        checked: false
    },
    {
        id: 22,
        name: "22",
        label: "22",
        checked: false
    },
    {
        id: 23,
        name: "23",
        label: "23",
        checked: false
    },
    {
        id: 24,
        name: "24",
        label: "24",
        checked: false
    },
    {
        id: 25,
        name: "25",
        label: "25",
        checked: false
    },
    {
        id: 26,
        name: "26",
        label: "26",
        checked: false
    },
    {
        id: 27,
        name: "27",
        label: "27",
        checked: false
    },
    {
        id: 28,
        name: "28",
        label: "28",
        checked: false
    },
    {
        id: 29,
        name: "29",
        label: "29",
        checked: false
    },
    {
        id: 30,
        name: "30",
        label: "30",
        checked: false
    },
    {
        id: 31,
        name: "31",
        label: "31",
        checked: false
    },
]

export const removeFrequencyOptions = [{
    shortAbbreviation: "STAT"
},
{
    shortAbbreviation: "Now"
},
{
    shortAbbreviation: "X1"
}
]

export const FrequencyOptionsGroupedByEvery = [{
    shortAbbreviation: "QH"
},
{
    shortAbbreviation: "Q2H"
},
{
    shortAbbreviation: "Q3H"
},
{
    shortAbbreviation: "Q4H"
},
{
    shortAbbreviation: "Q6H"
},
{
    shortAbbreviation: "Q8H"
},
{
    shortAbbreviation: "Q12H"
},
{
    shortAbbreviation: "Q24H"
}
]

export const addScheduleFieldsToValidate: AddScheduleRequiredFields[] = [
    {
        fieldName: "frequency",
        fieldId: "ddlFrequency",
        label: "Frequency",
        errorMessage: FrequencyAdministration.FrequencyRequiredMessage,
        isDependent: false,
        isValid: true
    },
    {
        fieldName: "timesPerDay",
        fieldId: "timesPerDay",
        label: "Times per Day",
        errorMessage: FrequencyAdministration.TimesPerDayRequiredMessage,
        isDependent: false,
        isValid: true
    },
    {
        fieldName: "specifyMinutes",
        fieldId: "specifyMinutes",
        label: "Specify Minutes",
        errorMessage: FrequencyAdministration.specifyMinutesRequiredMessage,
        isDependent: false,
        isValid: true
    },
    {
        fieldName: "ddlDuration",
        fieldId: "ddlDuration",
        label: "Duration",
        errorMessage: FrequencyAdministration.DurationRequiredMessage,
        isDependent: true,
        isValid: true,
        isDependentOn: "ddlDurationType"
    },
    {
        fieldName: "ddlDurationType",
        fieldId: "ddlDurationType",
        label: "Duration Type",
        errorMessage: FrequencyAdministration.DurationTypeRequiredMessage,
        isDependent: false,
        isValid: true,
        isDependentOn: "ddlDuration"
    },
    {
        fieldName: "specificTime",
        fieldId: "specificTime",
        label: "Specific Time",
        errorMessage: "",
        isDependent: false,
        isValid: true
    },
    {
        fieldName: "timeRange",
        fieldId: "timeRange",
        label: "Time Range",
        errorMessage: "",
        isDependent: false,
        isValid: true
    },
    {
        fieldName: "weeklyDays",
        fieldId: "weeklyDays",
        label: "Choose Days",
        errorMessage: FrequencyAdministration.DayIsRequiredMessage,
        isDependent: false,
        isValid: true
    }
]

export const monthlyRequiredFields: AddScheduleRequiredFields[] = [
    {
        fieldName: "selectMonths",
        fieldId: "selectMonths",
        label: "Select Months",
        errorMessage: FrequencyAdministration.MonthsIsRequiredMessage,
        isDependent: false,
        isValid: true
    },
    {
        fieldName: "selectDates",
        fieldId: "selectDates",
        label: "Select Dates",
        errorMessage: FrequencyAdministration.DateIsRequiredMessage,
        isDependent: false,
        isValid: true
    },
    {
        fieldName: "weeksOfTheMonth",
        fieldId: "ddlWeeks",
        label: "Weeks of the Month",
        errorMessage: FrequencyAdministration.WeeksOfTheMonthIsRequired,
        isDependent: false,
        isValid: true
    },
    {
        fieldName: "daysOfWeek",
        fieldId: "ddlDays",
        label: "Days",
        errorMessage: FrequencyAdministration.DayIsRequiredMessage,
        isDependent: false,
        isValid: true
    }
]

export const cyclicalRequiredFields: AddScheduleRequiredFields[] = [
    {
        fieldName: "selectCycle",
        fieldId: "selectCycle",
        label: "Select Cycle",
        errorMessage: FrequencyAdministration.SelectCycleIsRequiredMessage,
        isDependent: false,
        isValid: true
    },
    {
        fieldName: "giveDays",
        fieldId: "giveDays",
        label: "Give",
        errorMessage: FrequencyAdministration.GiveDaysIsRequiredMessage,
        isDependent: false,
        isValid: true
    },
    {
        fieldName: "skipDays",
        fieldId: "skipDays",
        label: "Do Not Give",
        errorMessage: FrequencyAdministration.SkipDaysIsRequiredMessage,
        isDependent: false,
        isValid: true
    }
]

interface IOrderTypeMessage {
    orderTypeName: (orderType: string) => string;
    medicationType?: (medicationType: string) => string;
    medicationName?: (medicationName: string) => string;
}

export const Order_Type_Messages: IOrderTypeMessage = {
    orderTypeName: (orderType) => `${orderType}`,
    medicationType: (medicationType) => `, ${medicationType === 'All' ? 'All' : medicationType + ':'} `,
    medicationName: (medicationName) => `${medicationName}`,
}

interface ICyclicalSummaryMessage {
    giveDays?: (count: number) => string;
    skipDays?: (count: number) => string;
    everyOtherDays?: () => string;
    evenDates?: () => string;
    oddDates?: () => string;
}

export const Cyclical_Summary_Messages: ICyclicalSummaryMessage = {
    giveDays: (giveDaysCount) => ` give ${giveDaysCount} days`,
    skipDays: (skipDaysCount) => `skip ${skipDaysCount} days`,
    everyOtherDays: () => ` on every other day`,
    evenDates: () => ` on Even Dates`,
    oddDates: () => ` on Odd Dates`
}

interface IWeeklySummaryMessage {
    preFix: (preFix?: string) => string;
    everyWeeks: (count: number) => string;
    selectedDays: (selectedDyas: string) => string;
}

export const Weekly_Summary_Messages: IWeeklySummaryMessage = {
    preFix: (preFix?: string) => `${preFix ?? ' on '}`,
    everyWeeks: (count) => `every ${count} weeks`,
    selectedDays: (selectedDays) => `${selectedDays?.replace(/,/g, ", ")} `,
}

interface IMonthlySummaryMessage {
    preFix: (preFix?: string) => string;
    everyMonths: (count: string | number) => string;
    selectedDaysOfMonth: (daysOfTheMonths: string) => string;
    selectedDays: (daysOfTheWeeks: string) => string;
    chooseMonths: (selectedMonths: string) => string;
    selectedDaysOfWeek: (selectedDaysOfTheWeeks: string) => string;
}

export const Monthly_Summary_Messages: IMonthlySummaryMessage = {
    preFix: (preFix?: string) => `${preFix ?? ' on '}`,
    everyMonths: (count: string | number) => ` every ${count} months`,
    selectedDaysOfMonth: (daysOfTheMonths: string) => ` on ${daysOfTheMonths} of`,
    selectedDays: (selectedDays: string) => ` on ${selectedDays}`,
    chooseMonths: (selectedMonths: string) => ` ${selectedMonths}`,
    selectedDaysOfWeek: (selectedDaysOfWeek: string) => ` ${selectedDaysOfWeek} of`,
}

interface IFrequencySummaryMessage {
    FrequencyLongForm: (freq: string) => string;
    RepeatString: (repeatStr: string | ICyclicalSummaryMessage | IWeeklySummaryMessage | IMonthlySummaryMessage) => string;
    IsFreqBelongsToEveryGroup?: (isFreqBelongsToEveryGroup: boolean) => string;
    SummaryTimeString: (timeStr: string) => string;
    Duration: (count: string) => string;
    DurationType: (type: string) => string;
    IsPRN: (isPrn: string) => string;
    OrderType: (orderDetails: IOrderTypeMessage | string) => string;
    AssignedToInfo: (assignInfo: string) => string;
}

export const Frequency_Summary_Messages: IFrequencySummaryMessage = {
    FrequencyLongForm: (freq: string) => `${freq} `,
    RepeatString: (repeatStr: string | ICyclicalSummaryMessage | IWeeklySummaryMessage | IMonthlySummaryMessage) => `${repeatStr} `,
    SummaryTimeString: (timeStr: string) => `${'at ' + timeStr}`,
    Duration: (count) => ` for ${count}`,
    DurationType: (durationType) => ` ${durationType}`,
    IsPRN: (isPrn: string) => ` ${isPrn}`,
    OrderType: (orderDetails: IOrderTypeMessage | string) => `Order Type: ${orderDetails}`,
    AssignedToInfo: (assignInfo: string) => `Assign To: ${assignInfo}`
}

export const exportSchedulesFieldsToValidate: AddScheduleRequiredFields[] = [
    {
        fieldName: "facility",
        fieldId: "facility",
        label: "Facility",
        errorMessage: FrequencyAdministration.FacilityRequiredMessage,
        isDependent: false,
        isValid: true
    }
]

export const twoColumns: IColumnType<ITwoColumn>[] = [
    {
        key: "shortAbbreviation",
        width: 40,
    },
    {
        key: "abbreviation",
        width: 58,
    },
];