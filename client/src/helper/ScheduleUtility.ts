import {
    AddScheduleRequiredFields, CyclicalSchedules, Frequency, FrequencyAdministrationRequestDto,
    FrequencySummary, MonthlySchedules, ScheduleTimeControls, TimeSchedules, TimeValidationFields, Day
} from "../models/class/FrequencyAdministration";
import { IAdminSchedule } from "../models/interface/IAdminSchedule";
import { ITimeSchedule } from "../models/interface/ITimeSchedule";
import {
    ChooseCyclicalTypes, Cyclical_Summary_Messages, Frequency_Summary_Messages, Monthly_Summary_Messages, RepeatTypes,
    Weekly_Summary_Messages
} from "../shared/enum/FrequencyAdministration";
import { FrequencyAdministration } from "../shared/enum/FrequencyAdministrationValidationMessages";
import freqData from "./../assets/static-files/Frequency.json";

type ToggledState = boolean | null | undefined;

let duplicateStartTimesIndexes: number[] = [];
let duplicateEndTimesIndexes: number[] = [];

//Added to fix Sonar code smell fix
const convertHour = (hour: any) => {
    if (hour === 0) {
        return 12;
    }
    else {
        return (hour > 12 ? hour - 12 : hour);
    }
}

const fourDigitsCheck = (match: RegExpExecArray | null) => {
    if (match) {
        return true;
    }
    return false;
}

const isChrNum = (c: string) => {
    return Number(c) >= 0 && Number(c) <= 9;
}
// Time minutes occurences single, double or no digits called when hour is double digit
const minsOccurancesDigitsChecksDoubleHour = (matchTwoChMinTwoHrs: RegExpExecArray | null, matchOneChMinTwoHrs: RegExpExecArray | null, hrsPos: number, minsPos: number) => {
    if (matchTwoChMinTwoHrs) {
        minsPos = hrsPos + 2
    } else if (matchOneChMinTwoHrs) {
        minsPos = 999;
    } else {
        minsPos = 0;
    }
    return minsPos;
}

const hrsOccurances = (strTime: string, matchTwoChHrs: boolean) => {
    strTime = strTime.replaceAll(" ", "");
    if (strTime.length >= 2) {
        if (isChrNum(strTime.charAt(0)) && isChrNum(strTime.charAt(1))) {
            matchTwoChHrs = true;
        }
    }
    return matchTwoChHrs;
}

// Time minutes occurences single, double or no digits called when hour is single digit
const minsOccurancesDigitsChecksSingleHour = (matchTwoChMinOneHrs: RegExpExecArray | null, matchOneChMinOneHrs: RegExpExecArray | null, hrsPos: number, minsPos: number) => {
    if (matchTwoChMinOneHrs) {
        minsPos = hrsPos + 2
    } else if (matchOneChMinOneHrs) {
        minsPos = 999;
    } else {
        minsPos = 0;
    }
    return minsPos;
}

const timeHoursMeridiumValidations = (timeValidationFields: TimeValidationFields) => {
    timeValidationFields.meridiumAssumed = "";
    switch (true) {
        case Number(timeValidationFields.hours) >= 24 || Number(timeValidationFields.hours) >= 1 && Number(timeValidationFields.hours) <= 5 || Number(timeValidationFields.hours) === 12:
            // for greater than or equal to 24 hours or 0 hours special case handling 
            timeValidationFields = specialCaseTimeValidations(timeValidationFields);
            break;
        case Number(timeValidationFields.hours) === 0:
            timeValidationFields.hours = "00";
            timeValidationFields.meridiumAssumed = FrequencyAdministration.TimeMeridiumMorning;
            if (timeValidationFields.meridiumMentioned === "PM") {
                timeValidationFields.isValid = false;
            }
            break;
        case Number(timeValidationFields.hours) > 12 && timeValidationFields.meridiumMentioned === FrequencyAdministration.TimeMeridiumMorning:
            return timeValidationFields.originalStrTime + FrequencyAdministration.TimeIsInvalidMessage;
        case Number(timeValidationFields.hours) > 12:
            timeValidationFields.hours = String(Number(timeValidationFields.hours) - 12);
            timeValidationFields.meridiumAssumed = FrequencyAdministration.TimeMeridiumEvening;
            break;
        case Number(timeValidationFields.hours) >= 6 && Number(timeValidationFields.hours) <= 11:
            if (timeValidationFields.hours.length === 1) {
                timeValidationFields.hours = Number(timeValidationFields.hours) <= 9 ? "0" + timeValidationFields.hours : timeValidationFields.hours;
            }
            timeValidationFields.meridiumAssumed = FrequencyAdministration.TimeMeridiumMorning;
            break;
    }
    if (!timeValidationFields.isValid) {
        return timeValidationFields.originalStrTime + FrequencyAdministration.TimeIsInvalidMessage;
    }
    timeValidationFields.meridiumAssumed = timeValidationFields.meridiumMentioned !== "" ? timeValidationFields.meridiumMentioned : timeValidationFields.meridiumAssumed;
    return timeValidationFields.hours + ":" + timeValidationFields.mins + " " + timeValidationFields.meridiumAssumed;
}

const specialCaseTimeValidations = (timeValidationFields: TimeValidationFields) => {
    switch (true) {
        case Number(timeValidationFields.hours) === 24 && !timeValidationFields.matchTwoChMinTwoChHrs:
            timeValidationFields.isValid = false;
            break;
        case Number(timeValidationFields.hours) === 24 && timeValidationFields.matchTwoChMinTwoChHrs:
            timeValidationFields.hours = "00";
            if (timeValidationFields.meridiumMentioned === "PM" || timeValidationFields.mins !== "00") {
                timeValidationFields.isValid = false;
            }
            break;
        case Number(timeValidationFields.hours) > 24:
            timeValidationFields.isValid = false;
            break;
        case Number(timeValidationFields.hours) >= 1 && Number(timeValidationFields.hours) <= 5 && !timeValidationFields.matchTwoChMinTwoChHrs || Number(timeValidationFields.hours) === 12:
            if (timeValidationFields.hours.length === 1) {
                timeValidationFields.hours = Number(timeValidationFields.hours) <= 9 ? "0" + timeValidationFields.hours : timeValidationFields.hours;
            }
            timeValidationFields.meridiumAssumed = FrequencyAdministration.TimeMeridiumEvening;
            break;
        case Number(timeValidationFields.hours) >= 1 && Number(timeValidationFields.hours) <= 5 && timeValidationFields.matchTwoChMinTwoChHrs:
            timeValidationFields.meridiumAssumed = "AM"
            break;
    }
    return timeValidationFields;
}

const timeValidator = (timeValidationFields: TimeValidationFields) => {
    timeValidationFields.strTime = timeValidationFields.strTime.toUpperCase();
    timeValidationFields.hours = timeValidationFields.strTime.slice(0, timeValidationFields.hrsPos);
    timeValidationFields.mins = "";
    if (timeValidationFields.minsPos === 0) {
        timeValidationFields.mins = "00";
    } else {
        timeValidationFields.mins = timeValidationFields.strTime.slice(timeValidationFields.hrsPos, timeValidationFields.minsPos);
        if (timeValidationFields.mins.length === 1) {
            return timeValidationFields.originalStrTime + FrequencyAdministration.TimeIsInvalidMessage;
        }
    }
    if (timeValidationFields.mins === "") {
        timeValidationFields.mins = "00";
    } else if (Number(timeValidationFields.mins) > 59) {
        return timeValidationFields.originalStrTime + FrequencyAdministration.TimeIsInvalidMessage;
    }
    timeValidationFields.meridiumMentioned = "";
    if (timeValidationFields.strTime.includes(FrequencyAdministration.TimeMeridiumMorning) || timeValidationFields.strTime.includes(FrequencyAdministration.TimeMeridiumEvening)) {
        timeValidationFields.meridiumMentioned = timeValidationFields.strTime.includes(FrequencyAdministration.TimeMeridiumMorning) ? FrequencyAdministration.TimeMeridiumMorning : FrequencyAdministration.TimeMeridiumEvening
    } else if (timeValidationFields.strTime.includes(FrequencyAdministration.TimeMeridiumA) || timeValidationFields.strTime.includes(FrequencyAdministration.TimeMeridiumP)) {
        timeValidationFields.meridiumMentioned = timeValidationFields.strTime.includes(FrequencyAdministration.TimeMeridiumA) ? FrequencyAdministration.TimeMeridiumMorning : FrequencyAdministration.TimeMeridiumEvening;
    }
    return timeHoursMeridiumValidations(timeValidationFields);
}

const timeFormater = (strTime: string) => {
    if (strTime) {
        const regEx = new RegExp(/[\d]{1,2}[:;,.-]?[\d]{0,2}[ ]?[aApP]?[mM]?/);
        const match = regEx.exec(strTime);
        let originalStrTime = strTime;
        let minsPos = 0, hrsPos = 0;
        if (match) {
            const regExOneChMin = new RegExp(/[\d]{2}[:;,.-]?[\d]{1}[ ]?[aApP]?[mM]?/);
            const regExTwoChMinTwoChHrs = new RegExp(/[\d]{2}[:;,.-]?[\d]{2}[ ]?[aApP]?[mM]?/);
            const regExTwoChMinOneChHrs = new RegExp(/[\d]{1}[:;,.-]?[\d]{2}[ ]?[aApP]?[mM]?/);
            const regExOneChMinOneChHrs = new RegExp(/[\d]{1}[:;,.-]?[\d]{1}[ ]?[aApP]?[mM]?/);
            const regExInvalidMeridium = new RegExp(/[\d]{1,2}[:;,.-]?[\d]{0,2}[ ]?[mM]{1}/);
            let matchTwoChHrs = false;
            let matchTwoChHrsTwoChMins = false;
            strTime = specialChToColonCh(strTime);
            matchTwoChHrs = hrsOccurances(strTime, matchTwoChHrs);

            const matchTwoChMinOneHrs = regExTwoChMinOneChHrs.exec(originalStrTime);
            const matchTwoChMinTwoHrs = regExTwoChMinTwoChHrs.exec(originalStrTime);
            const matchOneChMinOneHrs = regExOneChMinOneChHrs.exec(originalStrTime);
            const matchInvalidMeridium = regExInvalidMeridium.exec(originalStrTime);
            const matchOneChMinTwoHrs = regExOneChMin.exec(originalStrTime);

            strTime = strTime.replaceAll(" ", "").replace(":", "");
            matchTwoChHrsTwoChMins = fourDigitsCheck(matchTwoChMinTwoHrs);
            if (matchTwoChHrs) {
                hrsPos = 2;
                minsPos = minsOccurancesDigitsChecksDoubleHour(matchTwoChMinTwoHrs, matchOneChMinTwoHrs, hrsPos, minsPos);
            } else {
                hrsPos = 1;
                minsPos = minsOccurancesDigitsChecksSingleHour(matchTwoChMinOneHrs, matchOneChMinOneHrs, hrsPos, minsPos);
            }
            if (minsPos === 999) {
                return originalStrTime + FrequencyAdministration.TimeIsInvalidMessage;
            }
            if (matchInvalidMeridium) {
                return originalStrTime + FrequencyAdministration.TimeIsInvalidMessage;
            }
            let timeValidationFields: TimeValidationFields = {
                originalStrTime: originalStrTime,
                strTime: strTime,
                hrsPos: hrsPos,
                minsPos: minsPos,
                hours: '',
                mins: '',
                meridiumAssumed: '',
                meridiumMentioned: '',
                matchTwoChMinTwoChHrs: matchTwoChHrsTwoChMins,
                isValid: true
            }
            return timeValidator(timeValidationFields);
        }
        return originalStrTime + FrequencyAdministration.TimeIsInvalidMessage;
    } else {
        return strTime + FrequencyAdministration.TimeIsRequiredMessage;
    }
}

// string replace specific special characters occurances to colon character for Date value 
const specialChToColonCh = (string: string) => {
    string = string.replaceAll(".", ":").replaceAll(";", ":").replaceAll("-", ":").replaceAll(",", ":");
    return string;
}

const clearErrors = (formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void) => {
    const ddlDuration = formValues.fieldsToValidate.find(
        (x: AddScheduleRequiredFields) => x.fieldName === "ddlDuration"
    );
    const ddlDurationType = formValues.fieldsToValidate.find(
        (x: AddScheduleRequiredFields) => x.fieldName === "ddlDurationType"
    );
    if (ddlDurationType?.isValid) {
        formValues.durationTypeErrorMessage = "";
    }
    if (ddlDuration?.isValid) {
        formValues.durationErrorMessage = "";
    }
    setFormValues({ ...formValues });
};

const showError = (
    fieldName: string,
    errorMessage: string,
    condition: boolean = true,
    formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void,
    setErrorFields: React.Dispatch<React.SetStateAction<Record<string, AddScheduleRequiredFields[]>>>
): void => {
    switch (fieldName) {
        case "frequency": {
            if (condition) {
                formValues.frequencyErrorMessage = errorMessage;
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "frequency"
                )!.isValid = false;
            } else {
                formValues.frequencyErrorMessage = "";
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "frequency"
                )!.isValid = true;
            }
            setFormValues({ ...formValues });
            break;
        }
        case "timesPerDay": {
            if (condition) {
                formValues.timesPerDayErrorMessage = errorMessage;
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "timesPerDay"
                )!.isValid = false;
            } else {
                formValues.timesPerDayErrorMessage = "";
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "timesPerDay"
                )!.isValid = true;
            }
            setFormValues({ ...formValues });
            break;
        }
        case "specifyMinutes": {
            if (condition) {
                formValues.specifyMinutesErrorMessage = errorMessage;
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "specifyMinutes"
                )!.isValid = false;
            } else {
                formValues.timesPerDayErrorMessage = "";
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "specifyMinutes"
                )!.isValid = true;
            }
            setFormValues({ ...formValues });
            break;
        }
        case "ddlDuration": {
            if (condition) {
                formValues.durationErrorMessage = errorMessage;
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "ddlDuration"
                )!.isValid = false;
                setFormValues({ ...formValues });
            } else {
                formValues.durationErrorMessage = "";
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "ddlDuration"
                )!.isValid = true;
                clearErrors(formValues, setFormValues);
            }
            break;
        }
        case "ddlDurationType": {
            if (condition) {
                formValues.durationTypeErrorMessage = errorMessage;
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "ddlDurationType"
                )!.isValid = false;
                setFormValues({ ...formValues });
            } else {
                formValues.durationTypeErrorMessage = "";
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "ddlDurationType"
                )!.isValid = true;
                clearErrors(formValues, setFormValues);
            }
            break;
        }
    }
    setErrorFields((prevFields) => ({
        ...prevFields,
        daily: formValues.fieldsToValidate,
    }));
};

const setErrorMessageAndValidity = (
    fieldName: string,
    errorMessage: string,
    items: ScheduleTimeControls[],
    indexes: number[],
    formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void
) => {
    formValues.fieldsToValidate.find(
        (x) => x.fieldName === fieldName
    )!.isValid = false;
    formValues.fieldsToValidate.find(
        (x) => x.fieldName === fieldName
    )!.errorMessage = errorMessage;
    if (fieldName === "specificTime") {
        formValues.specificTimeErrorMessage = errorMessage
    } else {
        formValues.timeRangeErrorMessage = errorMessage
    }
    setFormValues({ ...formValues });
    if (items) {
        items.forEach((item, index) => {
            if (indexes[index] < items.length) {
                items[indexes[index]].isValid = false;
            }
        });
    }
};

export const errorMessageSetTimeType = (
    isSpecificTime: boolean,
    timeval: string,
    formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void
) => {
    const fieldName = isSpecificTime ? "specificTime" : "timeRange";
    let errorMessage = "";
    if (timeval.includes("invalid") || timeval.includes("unique")) {
        errorMessage = `${timeval}`;
    } else {
        errorMessage = FrequencyAdministration.TimeIsRequiredMessage.toString();
    }

    formValues.fieldsToValidate.find(
        (x) => x.fieldName === fieldName
    )!.errorMessage = errorMessage;

    if (isSpecificTime) {
        formValues.specificTimeErrorMessage = errorMessage;
    } else {
        formValues.timeRangeErrorMessage = errorMessage;
    }
    setFormValues({ ...formValues });
};

export const convertTime12to24 = (time12h: any) => {
    return timeFormater(time12h);
}

export const convertTo12HourFormat = (time24hr: string) => {
    // Split the time into hours and minutes
    const [hourStr, minuteStr] = time24hr.split(':');

    // Convert hours and minutes to numbers
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Determine AM or PM
    const period = hour >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    const convertedHour = convertHour(hour);

    const paddedHour = convertedHour < 10 ? `0${convertedHour}` : convertedHour;

    // Pad single-digit minutes with a leading zero
    const paddedMinute = minute < 10 ? `0${minute}` : minute;

    // Return the formatted 12-hour time
    return `${paddedHour}:${paddedMinute} ${period}`;
}

export const getNumberPostFix = (num: number, isNumWithPostFix?: boolean): string => {
    let postFix = '';
    if (num >= 1 && num <= 1000) {
        if (num % 10 === 1 && num % 100 !== 11) {
            postFix = 'st';
        } else if (num % 10 === 2 && num % 100 !== 12) {
            postFix = 'nd';
        } else if (num % 10 === 3 && num % 100 !== 13) {
            postFix = 'rd';
        } else {
            postFix = 'th';
        }
    }
    return isNumWithPostFix ? `${num}${postFix}` : postFix;
};

export const formatNumbers = (numArray: string, isLast?: boolean): string => {
    const formattedNumbers = numArray?.split(",").map((num, index, array) => {
        const postfix =
            isLast && Number(num) === 5 ? "Last " : getNumberPostFix(Number(num));
        const result = isLast && Number(num) === 5 ? "Last" : `${num}${postfix}`;
        return index === array.length - 1 ? `${result}` : `${result},`;
    });
    return formattedNumbers?.join("") || "";
};

export const sortTimesInAscending = (timeValues: TimeSchedules[]) => {
    const sortedTimeValues = [...timeValues].sort((a, b) => {
        // Convert times to 24-hour format for comparison
        const convertTo24Hour = (time: string) => {
            const [hours, minutes] = time.split(":");
            let newHours = parseInt(hours);
            const strPM = "PM";
            const isPM = time.toLowerCase().includes(strPM.toLowerCase());
            if (isPM && newHours !== 12) {
                newHours += 12;
            } else if (!isPM && newHours === 12) {
                newHours = 0;
            }
            return newHours * 60 + parseInt(minutes);
        };
        return convertTo24Hour(a.startTime) - convertTo24Hour(b.startTime);
    });
    return sortedTimeValues;
};

export const timeLinkObjMeridiumValidation = (timeVal: string) => {
    let meridiumMentioned = "";
    if (
        timeVal.includes(FrequencyAdministration.TimeMeridiumMorning) ||
        timeVal.includes(FrequencyAdministration.TimeMeridiumEvening)
    ) {
        meridiumMentioned = timeVal.includes(
            FrequencyAdministration.TimeMeridiumMorning
        )
            ? FrequencyAdministration.TimeMeridiumMorning
            : FrequencyAdministration.TimeMeridiumEvening;
    }
    return meridiumMentioned;
};

export const timeMeridiumHoursCheck = (
    strHours: string,
    strMeridiumMentioned: string
) => {
    if (
        (strMeridiumMentioned !== "" &&
            Number(strHours) >= 1 &&
            Number(strHours) <= 5 &&
            strMeridiumMentioned !== FrequencyAdministration.TimeMeridiumMorning) ||
        (Number(strHours) >= 6 &&
            Number(strHours) <= 11 &&
            strMeridiumMentioned === FrequencyAdministration.TimeMeridiumEvening)
    ) {
        strHours = String(Number(strHours) + 12);
    } else if (
        Number(strHours) === 12 &&
        strMeridiumMentioned === FrequencyAdministration.TimeMeridiumMorning
    ) {
        strHours = "00";
    }
    return strHours;
};

export const createMonthylyRepeatString = (monthlyFields: MonthlySchedules) => {
    let monthlyScheduleRepeatStrings = "";
    if (monthlyFields.selectedDaysOfMonth) {
        const numStr = formatNumbers(monthlyFields.selectedDaysOfMonth);
        monthlyScheduleRepeatStrings +=
            Monthly_Summary_Messages.selectedDaysOfMonth(numStr);
    }
    if (monthlyFields.selectedDays) {
        const numStr = formatNumbers(monthlyFields.selectedDays, true);
        monthlyScheduleRepeatStrings +=
            Monthly_Summary_Messages.selectedDays(numStr);
    }
    if (monthlyFields.selectedDaysOfWeek) {
        monthlyScheduleRepeatStrings += Monthly_Summary_Messages.selectedDaysOfWeek(
            monthlyFields.selectedDaysOfWeek
        );
    }
    if (monthlyFields.everyMonth)
        monthlyScheduleRepeatStrings += Monthly_Summary_Messages.everyMonths(
            monthlyFields.everyMonth
        );
    if (monthlyFields.chooseMonth)
        monthlyScheduleRepeatStrings += Monthly_Summary_Messages.chooseMonths(
            monthlyFields.chooseMonth
        );
    return monthlyScheduleRepeatStrings;
};

export const getWeeklySummaryRepeatString = (
    weeks: number,
    weekDays: string
) => {
    let weeklyRepeatString = Weekly_Summary_Messages.preFix();
    if (weekDays) {
        weeklyRepeatString += Weekly_Summary_Messages.selectedDays(weekDays);
    }
    if (weeks) {
        weeklyRepeatString += Weekly_Summary_Messages.everyWeeks(weeks);
    }
    return weeklyRepeatString;
};

export const createCustomDaysString = (cyclicalFields: CyclicalSchedules) => {
    let cyclicalRepeatStrings = "";
    if (cyclicalFields.giveDays) {
        cyclicalRepeatStrings += Cyclical_Summary_Messages.giveDays!(
            cyclicalFields.giveDays
        );
    }
    if (cyclicalFields.skipDays) {
        cyclicalRepeatStrings += `${cyclicalFields.giveDays ? ", " : ""
            }${Cyclical_Summary_Messages.skipDays!(cyclicalFields.skipDays)}`;
    }
    return cyclicalRepeatStrings;
};

export const createCyclicalRepeatString = (
    cyclicalFields: CyclicalSchedules
) => {
    switch (cyclicalFields.cycle) {
        case ChooseCyclicalTypes.CustomDays: {
            return createCustomDaysString(cyclicalFields);
        }
        case ChooseCyclicalTypes.EveryOtherDay: {
            return Cyclical_Summary_Messages.everyOtherDays?.();
        }
        case ChooseCyclicalTypes.EvenDates: {
            return Cyclical_Summary_Messages.evenDates?.();
        }
        case ChooseCyclicalTypes.OddDates: {
            return Cyclical_Summary_Messages.oddDates?.();
        }
        default: {
            return "";
        }
    }
};

export const createTimeObject = (startTime: string, endTime: string | null = null) => ({
    id: 0,
    startTime,
    endTime,
});

export const generateTimeControlsForEveryGroup = (
    time: ScheduleTimeControls[],
    selectedFrequency: Frequency | null,
    isFreqBelongsToEveryGroup: boolean
) => {
    let newTimeArray: TimeSchedules[] = [];
    if (isFreqBelongsToEveryGroup) {
        const timeInterval: number = 24 / selectedFrequency?.noOfSpecificTimes!;
        let defaultStartTime: Date =
            time?.length > 0 ? new Date(time[0].value) : new Date();
        for (
            let timeCount = 0;
            timeCount < selectedFrequency?.noOfSpecificTimes!;
            timeCount++
        ) {
            let value: Date;
            let newTime: number;
            if (timeCount === 0) {
                value = defaultStartTime;
            } else {
                newTime = defaultStartTime.getTime() + timeInterval * 60 * 60 * 1000;
                value = new Date(newTime);
                defaultStartTime = new Date(newTime);
            }
            const hrs: number = value.getHours();
            const mins: number = value.getMinutes();
            const timeIn24HrFormat: string = `${hrs}:${mins}`;
            const convertedTime: string = convertTo12HourFormat(timeIn24HrFormat);
            newTimeArray.push(createTimeObject(convertedTime));
        }
    }
    return newTimeArray;
};

export const getNewDateFromTime = (time: string | null): Date => {
    const newDate = new Date();
    if (time && time.includes(":")) {
        let meridiumMentioned = timeLinkObjMeridiumValidation(time);
        time = time
            ?.replace(" ", "")
            .replace(FrequencyAdministration.TimeMeridiumMorning, "")
            .replace(FrequencyAdministration.TimeMeridiumEvening, "");
        let [hours, minutes] = time.split(":");
        hours = timeMeridiumHoursCheck(hours, meridiumMentioned);
        newDate.setHours(Number(hours));
        newDate.setMinutes(Number(minutes));
        newDate.setSeconds(0);
    }
    return newDate;
};

export const getEdit24TimeValue = (time: string | null): string | null => {
    return time === null || time === undefined
        ? null
        : convertTime12to24(time.toString());
};

export const timeCharacterAllowed = (
    val: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    isSpecificTime: boolean
) => {
    const selectionStart = Number(
        val.currentTarget.selectionStart ? val.currentTarget.selectionStart : 0
    );
    const selectionEnd = Number(
        val.currentTarget.selectionEnd ? val.currentTarget.selectionEnd : 0
    );
    let newTimeString = "";
    let preKeyString = val.currentTarget.value;
    if (selectionStart < selectionEnd) {
        const substringToRemove = preKeyString.slice(selectionStart, selectionEnd);
        newTimeString = preKeyString.replace(substringToRemove, val.key);
    } else {
        newTimeString =
            val.currentTarget.value.slice(0, selectionStart) +
            val.key +
            val.currentTarget.value.slice(selectionStart);
    }
    const regEx = new RegExp(/^[\d]{0,2}[:;,.-]?[\d]{0,2}[ ]?[aApP]?[mM]?/);
    const match = regEx.exec(newTimeString);
    if (/[0-9aApPmMDeleteBackspaceTab :;,.-]/.test(val.key)) {
        if (
            val.key !== FrequencyAdministration.DeleteText &&
            val.key !== FrequencyAdministration.BackSpaceKey &&
            newTimeString.length <= 8
        ) {
            if (match && match[0] !== newTimeString) {
                val.preventDefault();
            }
        } else if (
            val.key !== FrequencyAdministration.DeleteText &&
            val.key !== FrequencyAdministration.BackSpaceKey &&
            val.key !== FrequencyAdministration.Tab
        ) {
            val.preventDefault();
        }
    } else {
        val.preventDefault();
    }
};

export const getTimeSummary = (
    isFreqGroupedByEvery: boolean,
    formattedEveryFreqTimeSlots: string,
    isSpecificTime: boolean,
    formattedTimeSlots: string,
    formattedTimeRangeSlots: string
) => {
    if (isFreqGroupedByEvery) {
        return formattedEveryFreqTimeSlots;
    } else if (isSpecificTime) {
        return formattedTimeSlots;
    } else {
        return formattedTimeRangeSlots;
    }
};

export const updateRequestBasedOnRepeatType = (
    request: FrequencyAdministrationRequestDto,
    formValues: IAdminSchedule,
    addNewMode: boolean
) => {
    switch (formValues.selectedRepeatType) {
        case RepeatTypes.Daily:
            request.cyclicalSchedules = null;
            request.weeklySchedule = null;
            request.monthlySchedule = null;
            if (!addNewMode && formValues.editScheduleData) {
                formValues.editScheduleData.cyclicalSchedule = null;
                formValues.editScheduleData.weeklySchedule = null;
                formValues.editScheduleData.monthlySchedule = null;
            }
            break;
        case RepeatTypes.Cyclical:
            request.weeklySchedule = null;
            request.monthlySchedule = null;
            if (!addNewMode && formValues.editScheduleData) {
                formValues.editScheduleData.weeklySchedule = null;
                formValues.editScheduleData.monthlySchedule = null;
            }
            break;
        case RepeatTypes.Weekly:
            request.cyclicalSchedules = null;
            request.monthlySchedule = null;
            if (!addNewMode && formValues.editScheduleData) {
                formValues.editScheduleData.cyclicalSchedule = null;
                formValues.editScheduleData.monthlySchedule = null;
            }
            break;
        case RepeatTypes.Monthly:
            request.weeklySchedule = null;
            request.cyclicalSchedules = null;
            if (!addNewMode && formValues.editScheduleData) {
                formValues.editScheduleData.weeklySchedule = null;
                formValues.editScheduleData.cyclicalSchedule = null;
            }
            break;
    }
};

// Finds the duplicate item based on timeType of time or timeRange
export const findArrayDuplicateTimeItem = (
    timeArray: ScheduleTimeControls[],
    curVal: string,
    index: number,
    timeType: string
) => {
    let duplicates;
    //includes check if for only checking its own type value time or Starttime or EndTime
    duplicates = timeArray.filter(
        (x) =>
            x.isValid &&
            x.name.toLowerCase().includes(timeType) &&
            x.strVal === curVal
    );
    if (
        duplicates?.length > 1 ||
        (duplicates?.length === 1 &&
            index !==
            timeArray.findIndex(
                (x) =>
                    x.name.toLowerCase().includes(timeType) && x.strVal === curVal
            ))
    ) {
        curVal = FrequencyAdministration.TimeShouldBeUniqueMessage;
    }
    return curVal;
};

export const duplicateTimeEntryExists = (
    isSpecificTime: boolean,
    curVal: string,
    timeArray: ScheduleTimeControls[],
    label: string,
    index: number
) => {
    if (timeArray && timeArray.length > 1) {
        if (isSpecificTime) {
            curVal = findArrayDuplicateTimeItem(timeArray, curVal, index, "time");
        } else if (label.includes("Start")) {
            curVal = findArrayDuplicateTimeItem(timeArray, curVal, index, "start");
        } else {
            curVal = findArrayDuplicateTimeItem(timeArray, curVal, index, "end");
        }
    }
    return curVal;
};

export const addErrorMessages = (targetArray: ScheduleTimeControls[]) => {
    if (targetArray) {
        targetArray.forEach((element) => {
            if (
                !element.isValid &&
                (element?.errorMessage === "" || element?.errorMessage === undefined)
            ) {
                element.errorMessage = FrequencyAdministration.TimeIsRequiredMessage;
            }
        });
    }
    return targetArray;
};

export const getUsersLocalTimeZone = () => {
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    return timeZone;
};

export const handleEveryGroup = (
    val: Frequency,
    addNewMode: boolean,
    isToggled: ToggledState,
    usersTimeSchedules: ITimeSchedule[] | undefined,
    tempTimeSpecificArray: ScheduleTimeControls[],
    formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void
) => {
    formValues.time = [];
    formValues.timeRange = [];
    for (
        let timeCount = 1;
        timeCount <= val.noOfSpecificTimeInstance!;
        timeCount++
    ) {
        const editStartTimeValue = getEdit24TimeValue(
            usersTimeSchedules?.[timeCount - 1]?.startTime!
        );
        const newDateStartTimeValue = editStartTimeValue
            ? getNewDateFromTime(editStartTimeValue)
            : "";

        const timeValue = usersTimeSchedules?.length === 0 ? "" : newDateStartTimeValue;
        const newObj: ScheduleTimeControls = {
            name: `Time${timeCount}`,
            label: `Time ${timeCount}`,
            value: isToggled ? "" : timeValue,
            isValid: true,
            strVal: editStartTimeValue!,
        };
        tempTimeSpecificArray.push(newObj);
    }
    setFormValues({ ...formValues });
};

export const handleSpecificTimes = (
    val: Frequency,
    addNewMode: boolean,
    isToggled: ToggledState,
    usersTimeSchedules: ITimeSchedule[] | undefined,
    tempTimeSpecificArray: ScheduleTimeControls[],
    formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void
) => {
    formValues.time = [];
    for (
        let timeCount = 1;
        timeCount <= val.noOfSpecificTimeInstance!;
        timeCount++
    ) {
        const editStartTimeValue = getEdit24TimeValue(
            usersTimeSchedules?.[timeCount - 1]?.startTime?.toString()!
        );
        const newDateStartTimeValue = editStartTimeValue
            ? getNewDateFromTime(editStartTimeValue)
            : "";

        const timeValue =
            usersTimeSchedules?.length === 0 ? "" : newDateStartTimeValue;
        const newObj: ScheduleTimeControls = {
            name: `Time${timeCount}`,
            label: `Time ${timeCount}`,
            value: isToggled ? "" : timeValue,
            isValid: true,
            strVal: editStartTimeValue!,
        };
        tempTimeSpecificArray.push(newObj);
    }
    setFormValues({ ...formValues });
};

export const handleRangeTimes = (
    val: Frequency,
    addNewMode: boolean,
    isToggled: ToggledState,
    usersTimeSchedules: ITimeSchedule[] | undefined,
    tempTimeRangeArray: ScheduleTimeControls[],
    formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void
) => {
    formValues.timeRange = [];
    for (
        let timeCount = 1;
        timeCount <= val.noOfRangeTimeInstance!;
        timeCount++
    ) {
        const edit24StartTimeValue = getEdit24TimeValue(
            usersTimeSchedules?.[timeCount - 1]?.startTime!
        );
        const edit24EndTimeValue = getEdit24TimeValue(
            usersTimeSchedules?.[timeCount - 1]?.endTime!
        );
        const newDateStartTimeValue = edit24StartTimeValue
            ? getNewDateFromTime(edit24StartTimeValue)
            : "";
        const newDateEndTimeValue = edit24EndTimeValue
            ? getNewDateFromTime(edit24EndTimeValue)
            : "";

        const startTimeValue =
            usersTimeSchedules?.length && edit24StartTimeValue !== null
                ? newDateStartTimeValue
                : "";

        const startTimeObject: ScheduleTimeControls = {
            name: `StartTime${timeCount}`,
            label: `Start Time ${timeCount}`,
            value: isToggled ? "" : startTimeValue,
            isValid: true,
            strVal: edit24StartTimeValue!,
        };

        const endTimeValue =
            usersTimeSchedules?.length && edit24EndTimeValue !== null
                ? newDateEndTimeValue
                : "";

        const endTimeObject: ScheduleTimeControls = {
            name: `EndTime${timeCount}`,
            label: `End Time ${timeCount}`,
            value: isToggled ? "" : endTimeValue,
            isValid: true,
            strVal: edit24EndTimeValue!,
        };

        tempTimeRangeArray.push(startTimeObject);
        tempTimeRangeArray.push(endTimeObject);
    }
    setFormValues({ ...formValues });
};

export const validateAndDisplayMessage = (
    fieldName: string,
    value: any,
    formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void,
    setErrorFields: React.Dispatch<React.SetStateAction<Record<string, AddScheduleRequiredFields[]>>>,
    isDependent?: boolean,
    isDependentOn?: string,
) => {
    switch (fieldName) {
        case "frequency":
            showError(
                "frequency",
                FrequencyAdministration.FrequencyRequiredMessage,
                value === null || value === undefined || value === "",
                formValues,
                setFormValues,
                setErrorFields
            );
            break;
        case "timesPerDay":
            if (isDependent) {
                showError(
                    "timesPerDay",
                    FrequencyAdministration.TimesPerDayRequiredMessage,
                    !value &&
                    (formValues.selectedFrequency?.shortAbbreviation === "_XD"),
                    formValues,
                    setFormValues,
                    setErrorFields
                );
            } else if (value === null && formValues.selectedFrequency?.shortAbbreviation !== "_XD") {
                formValues.timesPerDayErrorMessage = "";
                setFormValues({ ...formValues });
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "timesPerDay"
                )!.isValid = true;
            }
            break;
        case "specifyMinutes":
            if (isDependent) {
                showError(
                    "specifyMinutes",
                    FrequencyAdministration.specifyMinutesRequiredMessage,
                    !value &&
                    (formValues.selectedFrequency?.shortAbbreviation === "Q_min"),
                    formValues,
                    setFormValues,
                    setErrorFields
                );
            } else if (value === null && formValues.selectedFrequency?.shortAbbreviation !== "Q_min") {
                formValues.specifyMinutesErrorMessage = "";
                setFormValues({ ...formValues });
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "specifyMinutes"
                )!.isValid = true;
            }
            break;
        case "ddlDuration":
            if (isDependent) {
                showError(
                    "ddlDuration",
                    FrequencyAdministration.DurationRequiredMessage,
                    value === null || value === "" ||
                    (value === undefined && formValues.selectedDurationType !== null),
                    formValues,
                    setFormValues,
                    setErrorFields
                );
            } else if (value === null) {
                formValues.durationErrorMessage = "";
                formValues.durationTypeErrorMessage = "";
                setFormValues({ ...formValues });
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "ddlDuration"
                )!.isValid = true;
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "ddlDurationType"
                )!.isValid = true;
            }
            break;
        case "ddlDurationType":
            if (isDependent) {
                showError(
                    "ddlDurationType",
                    FrequencyAdministration.DurationTypeRequiredMessage,
                    value === null ||
                    (value === undefined && formValues.selectedDuration !== null),
                    formValues,
                    setFormValues,
                    setErrorFields
                );
            } else if (value === null) {
                formValues.durationErrorMessage = "";
                formValues.durationTypeErrorMessage = "";
                setFormValues({ ...formValues });
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "ddlDuration"
                )!.isValid = true;
                formValues.fieldsToValidate.find(
                    (x: AddScheduleRequiredFields) => x.fieldName === "ddlDurationType"
                )!.isValid = true;
            }
            break;
    }
};

export const resetErrorSummary = (type: RepeatTypes, setErrorFields: React.Dispatch<React.SetStateAction<Record<string, AddScheduleRequiredFields[]>>>) => {
    switch (type) {
        case RepeatTypes.Daily:
        case RepeatTypes.Weekly: {
            setErrorFields((prevFields) => ({ ...prevFields, monthly: [] }));
            setErrorFields((prevFields) => ({ ...prevFields, cyclical: [] }));
            break;
        }
        case RepeatTypes.Monthly: {
            setErrorFields((prevFields) => ({ ...prevFields, cyclical: [] }));
            break;
        }
        case RepeatTypes.Cyclical: {
            setErrorFields((prevFields) => ({ ...prevFields, monthly: [] }));
            break;
        }
    }
};

// isTimesPerDay tells if its times Per Day or Specify Time
export const getFrequencyLongForm = (selectedFrequency: Frequency | null, isTimesPerDay?: number | null) => {
    let freq = "";
    if (selectedFrequency && selectedFrequency.abbreviation !== null) {
        if (selectedFrequency.shortAbbreviation === "_XD" && isTimesPerDay) {
            freq = selectedFrequency.abbreviation.replace("_XD_", isTimesPerDay + " ");
        } else if (selectedFrequency.shortAbbreviation === "Q_min" && isTimesPerDay) {
            freq = selectedFrequency.abbreviation.replace("_minutes", " " + isTimesPerDay + " minutes");
        }
        else {
            freq = selectedFrequency.abbreviation;
        }
    }
    return freq;
}

export const frequencySummaryPlaceholders = (frequencyParams: FrequencySummary, frequencySummary: FrequencySummary,
    setFrequencySummary: React.Dispatch<React.SetStateAction<FrequencySummary>>) => {
    let tempString = "";
    let formattedSummryString = "";
    let frequencyRepeatString = "";
    if (frequencyParams.frequencyLongForm) {
        tempString += Frequency_Summary_Messages.FrequencyLongForm(
            frequencyParams.frequencyLongForm
        );
        formattedSummryString += Frequency_Summary_Messages.FrequencyLongForm(
            frequencyParams.frequencyLongForm
        );
        frequencyRepeatString += Frequency_Summary_Messages.FrequencyLongForm(
            frequencyParams.frequencyLongForm
        );
    }
    if (frequencyParams.repeat) {
        tempString = tempString.trim();
        formattedSummryString = formattedSummryString.trim();
        frequencyRepeatString = frequencyRepeatString.trim();
        tempString += Frequency_Summary_Messages.RepeatString(
            frequencyParams.repeat.trimEnd()
        );
        formattedSummryString += Frequency_Summary_Messages.RepeatString(
            frequencyParams.repeat.trimEnd()
        );
        frequencyRepeatString += Frequency_Summary_Messages.RepeatString(
            frequencyParams.repeat.trimEnd()
        );
    }
    if (frequencyParams.summaryTime) {
        tempString += Frequency_Summary_Messages.SummaryTimeString(
            frequencyParams.summaryTime
        );
        formattedSummryString += Frequency_Summary_Messages.SummaryTimeString(
            frequencyParams.summaryTime
        );
        frequencyRepeatString += Frequency_Summary_Messages.SummaryTimeString(
            ""
        ).trimEnd();
    }
    if (frequencyParams.duration) {
        tempString += Frequency_Summary_Messages.Duration(
            frequencyParams.duration
        );
        formattedSummryString += Frequency_Summary_Messages.Duration(
            frequencyParams.duration
        );
        frequencyRepeatString += Frequency_Summary_Messages.Duration(
            frequencyParams.duration
        );
    }
    if (frequencyParams.durationType) {
        tempString += Frequency_Summary_Messages.DurationType(
            frequencyParams.durationType
        );
        formattedSummryString += Frequency_Summary_Messages.DurationType(
            frequencyParams.durationType
        );
        frequencyRepeatString += Frequency_Summary_Messages.DurationType(
            frequencyParams.durationType
        );
    }
    if (frequencyParams.isPrn) {
        tempString += Frequency_Summary_Messages.IsPRN(frequencyParams.isPrn);
        formattedSummryString += Frequency_Summary_Messages.IsPRN(
            frequencyParams.isPrn
        );
        frequencyRepeatString += Frequency_Summary_Messages.IsPRN(
            frequencyParams.isPrn
        );
    }
    if (frequencyParams.orderTypeSummary) {
        if (!tempString.startsWith("Order Type") && tempString != "") {
            tempString = tempString.trim();
            tempString += "; ";
        }
        tempString += Frequency_Summary_Messages.OrderType(
            frequencyParams.orderTypeSummary
        );
    }
    if (frequencyParams.assignToSummary) {
        if (!tempString.startsWith("Assign To") && tempString != "") {
            tempString += "; ";
        }
        tempString += Frequency_Summary_Messages.AssignedToInfo(
            frequencyParams.assignToSummary
        );
    }
    frequencySummary.summary = formattedSummryString;
    frequencySummary.frequencyRepeatSummary = frequencyRepeatString;
    frequencySummary.timeSummary = frequencyParams.timeSummary;
    let newFreqSummaryObj = frequencySummary;
    setFrequencySummary(newFreqSummaryObj);
    // Remove trailing spaces
    return tempString.trim();
};

export const validateWeeklyDays = (formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void) => {
    const checkedDays = formValues.days.filter((x: Day) => x.checked === true);
    formValues.isDaySelectedForWeeklyBlock = checkedDays.length > 0;
    setFormValues({ ...formValues });
    formValues.fieldsToValidate.find(
        (x: AddScheduleRequiredFields) => x.fieldName === "weeklyDays"
    )!.isValid = checkedDays.length > 0;
};

export const resetValidityAndErrorMessage = (
    fieldName: string,
    items: ScheduleTimeControls[],
    formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void
) => {
    const foundItem = formValues.fieldsToValidate.find(
        (x) => x.fieldName === fieldName
    );
    if (foundItem) {
        formValues.fieldsToValidate.find(
            (x) => x.fieldName === fieldName
        )!.isValid = true;
        formValues.fieldsToValidate.find(
            (x) => x.fieldName === fieldName
        )!.errorMessage = "";
        if (fieldName === "specificTime") {
            formValues.specificTimeErrorMessage = ""
        } else {
            formValues.timeRangeErrorMessage = ""
        }
        setFormValues({ ...formValues });
        if (items) {
            items.forEach((item) => {
                item.isValid = true;
            });
        }
    }
};

export const findDuplicateTimeRangeSchedules = (entries: ScheduleTimeControls[]
) => {
    const getIndexMap = (prefix: string) => {
        const indexMap: Record<string, number[]> = {};
        const duplicateIndexes: number[] = [];
        entries.forEach((entry, index) => {
            if (entry.name.startsWith(prefix)) {
                const { value } = entry;
                const key = `${value}`;
                if (indexMap[key]) {
                    indexMap[key].push(index);
                } else {
                    indexMap[key] = [index];
                }
            }
        });
        Object.values(indexMap).forEach((indexList) => {
            if (indexList.length > 1) {
                duplicateIndexes.push(...indexList);
            }
        });
        return duplicateIndexes;
    };
    duplicateStartTimesIndexes = getIndexMap("StartTime");
    duplicateEndTimesIndexes = getIndexMap("EndTime");
};

export const findDuplicateSpecificTimeSchedules = (
    entries: ScheduleTimeControls[]
) => {
    const startIndexMap: Record<string, number[]> = {};
    duplicateStartTimesIndexes = [];
    entries.forEach((entry, index) => {
        const { value } = entry;
        const key = `${value}`;
        if (startIndexMap[key]) {
            startIndexMap[key].push(index);
        } else {
            startIndexMap[key] = [index];
        }
    });
    Object.values(startIndexMap).forEach((indexList) => {
        if (indexList.length > 1) {
            duplicateStartTimesIndexes.push(...indexList);
        }
    });
};

export const validateTimeControls = (formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void) => {
    if (formValues.isBtnSpecificTimeChecked) {
        findDuplicateSpecificTimeSchedules(formValues.time);
        if (duplicateStartTimesIndexes.length > 0) {
            resetValidityAndErrorMessage(
                "specificTime",
                formValues.time,
                formValues,
                setFormValues
            );
            setErrorMessageAndValidity(
                "specificTime",
                FrequencyAdministration.TimeShouldBeUniqueMessage,
                formValues.time,
                duplicateStartTimesIndexes,
                formValues,
                setFormValues
            );
        } else {
            resetValidityAndErrorMessage(
                "specificTime",
                formValues.time,
                formValues,
                setFormValues
            );
        }
    } else {
        findDuplicateTimeRangeSchedules(
            formValues.timeRange
        );
        if (
            duplicateStartTimesIndexes.length > 0 ||
            duplicateEndTimesIndexes?.length > 0
        ) {
            resetValidityAndErrorMessage(
                "timeRange",
                formValues.timeRange,
                formValues,
                setFormValues
            );
            setErrorMessageAndValidity(
                "timeRange",
                FrequencyAdministration.TimeShouldBeUniqueMessage,
                formValues.timeRange,
                [...duplicateStartTimesIndexes, ...(duplicateEndTimesIndexes || [])],
                formValues,
                setFormValues
            );
        } else {
            resetValidityAndErrorMessage(
                "timeRange",
                formValues.timeRange,
                formValues,
                setFormValues
            );
        }
    }
    formValues.showErrorSummary = formValues.fieldsToValidate.some(
        (x) => !x.isValid
    );
    setFormValues({ ...formValues });
    return formValues.fieldsToValidate.every(
        (x: AddScheduleRequiredFields) => x.isValid
    );
};

export const checkTimeValidations = (isSpecificTime: boolean, formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void) => {
    const fieldName = isSpecificTime ? "specificTime" : "timeRange";
    let targetArray = isSpecificTime ? formValues.time : formValues.timeRange;
    targetArray = addErrorMessages(targetArray);
    const invalidItems = targetArray.filter((x) => x.isValid === false);
    const blankItems = targetArray.filter((x) => x.value === "");

    formValues.fieldsToValidate.find(
        (x) => x.fieldName === fieldName
    )!.isValid = invalidItems.length === 0;
    if (blankItems.length > 0 && invalidItems.length > 0) {
        formValues.fieldsToValidate.find(
            (x) => x.fieldName === fieldName
        )!.errorMessage = FrequencyAdministration.TimeIsRequiredMessage;
        if (isSpecificTime) {
            formValues.specificTimeErrorMessage =
                FrequencyAdministration.TimeIsRequiredMessage
        } else {
            formValues.timeRangeErrorMessage =
                FrequencyAdministration.TimeIsRequiredMessage
        }
    } else if (blankItems.length === 0 && invalidItems.length > 0) {
        validateTimeControls(formValues, setFormValues);
    } else if (
        (blankItems.length === 0 && invalidItems.length === 0) ||
        invalidItems.length === 0
    ) {
        if (isSpecificTime) {
            formValues.specificTimeErrorMessage = "";
        } else {
            formValues.timeRangeErrorMessage = "";
        }
    }
    setFormValues({ ...formValues });
};

export const checkFrequency = (val: Frequency,
    formValues: IAdminSchedule,
    setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void
) => {
    if (!val) return;

    const freqFoundObj = freqData.find(x => x.shortAbbreviation === val.shortAbbreviation);
    if (!freqFoundObj) return;
    const { shortAbbreviation } = freqFoundObj;
    switch (shortAbbreviation) {
        case "QW":
        case "BIW":
        case "TIW":
            formValues.selectedRepeatType = RepeatTypes.Weekly;
            formValues.selectedRepeatOption = RepeatTypes.Weekly;
            formValues.isRepeatTypesDisabled = true;
            formValues.maxDaysSelection = (shortAbbreviation === "QW" ? 1 : shortAbbreviation === "BIW" ? 2 : 3);
            break;
        case "QMonth":
            formValues.selectedRepeatType = RepeatTypes.Monthly;
            formValues.selectedRepeatOption = RepeatTypes.Monthly;
            formValues.isRepeatTypesDisabled = true;
            formValues.maxDaysSelection = 1;
            break;
        case "QOD":
            formValues.selectedRepeatType = RepeatTypes.Cyclical;
            formValues.selectedRepeatOption = RepeatTypes.Cyclical;
            formValues.isRepeatTypesDisabled = true;
            formValues.selectedCyclicalSchedule = {
                cycle: 2,
                giveDays: 0,
                skipDays: 0,
                isDisabled: true
            }
            break;
        case "Q3D":
            formValues.selectedRepeatType = RepeatTypes.Cyclical;
            formValues.selectedRepeatOption = RepeatTypes.Cyclical;
            formValues.isRepeatTypesDisabled = true;
            formValues.selectedCyclicalSchedule = {
                cycle: 1,
                giveDays: 1,
                skipDays: 2,
                isDisabled: true
            }
            break;
        case "4XW":
            formValues.selectedRepeatType = RepeatTypes.Weekly;
            formValues.selectedRepeatOption = RepeatTypes.Weekly;
            formValues.isRepeatTypesDisabled = true;
            formValues.maxDaysSelection = 4;
            break;
        case "5XW":
            formValues.selectedRepeatType = RepeatTypes.Weekly;
            formValues.selectedRepeatOption = RepeatTypes.Weekly;
            formValues.isRepeatTypesDisabled = true;
            formValues.maxDaysSelection = 5;
            break;
        case "6XW":
            formValues.selectedRepeatType = RepeatTypes.Weekly;
            formValues.selectedRepeatOption = RepeatTypes.Weekly;
            formValues.isRepeatTypesDisabled = true;
            formValues.maxDaysSelection = 6;
            break;
        default:
            formValues.selectedRepeatType = RepeatTypes.Daily;
            formValues.selectedRepeatOption = RepeatTypes.Daily;
            formValues.isRepeatTypesDisabled = false;
            formValues.maxDaysSelection = null;
            break;
    }
    setFormValues({ ...formValues });
}