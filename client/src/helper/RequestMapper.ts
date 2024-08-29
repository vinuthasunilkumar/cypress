import React from "react";
import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { FrequencyAdministrationForm, FrequencyAdministrationRequestDto } from "../models/class/FrequencyAdministration";

export const mapRequestDto = (mapper: Mapper, addNewMode: boolean, administrationScheduleId: number) => {
    createMap(
        mapper,
        FrequencyAdministrationForm,
        FrequencyAdministrationRequestDto,
        forMember(
            (d) => d.id,
            mapFrom((s) => addNewMode ? 0 : administrationScheduleId)
        ),
        forMember(
            (d) => d.frequencyCode,
            mapFrom((s) => s.frequencyCode)
        ),
        forMember(
            (d) => d.timesPerDay,
            mapFrom((s) => s.timesPerDay)
        ),forMember(
            (d) => d.specifyMinutes,
            mapFrom((s) => s.specifyMinutes)
        ),
        forMember(
            (d) => d.summary,
            mapFrom((s) => s.summary)
        ),
        forMember(
            (d) => d.frequencyCodeDescription,
            mapFrom((s) => s.frequencyCodeDescription)
        ),
        forMember(
            (d) => d.isPrn,
            mapFrom((s) => s.isPrn)
        ),
        forMember(
            (d) => d.orderType,
            mapFrom((s) => s.orderType)
        ),
        forMember(
            (d) => d.medicationType,
            mapFrom((s) => s.medicationType)
        ),
        forMember(
            (d) => d.facilityId,
            mapFrom((s) => s.facilityId)
        ),
        forMember(
            (d) => d.fdbDrugId,
            mapFrom((s) => (s.fdbDrugId ? s.fdbDrugId : null))
        ),
        forMember(
            (d) => d.fdbMedGroupId,
            mapFrom((s) => (s.fdbMedGroupId ? s.fdbMedGroupId : null))
        ),
        forMember(
            (d) => d.orderTypeSummary,
            mapFrom((s) => s.orderTypeSummary)
        ),
        forMember(
            (d) => d.scheduleType,
            mapFrom((s) => s.scheduleType)
        ),
        forMember(
            (d) => d.timeSchedules,
            mapFrom((s) => (s.timeSchedules?.length > 0 ? s.timeSchedules : []))
        ),
        forMember(
            (d) => d.durationType,
            mapFrom((s) => s.durationType)
        ),
        forMember(
            (d) => d.cyclicalSchedules?.administrationScheduleId,
            mapFrom((s) => addNewMode ? 0 : s.cyclicalSchedules?.administrationScheduleId)
        ),
        forMember(
            (d) => d.cyclicalSchedules?.cycle,
            mapFrom((s) => s.cyclicalSchedules?.cycle)
        ),
        forMember(
            (d) => d.cyclicalSchedules?.giveDays,
            mapFrom((s) => s.cyclicalSchedules?.cycle === 1 ? s.cyclicalSchedules?.giveDays : 0)
        ),
        forMember(
            (d) => d.cyclicalSchedules?.skipDays,
            mapFrom((s) => s.cyclicalSchedules?.cycle === 1 ? s.cyclicalSchedules?.skipDays : 0)
        ),
        forMember(
            (d) => d.weeklySchedule?.administrationScheduleId,
            mapFrom((s) => addNewMode ? 0 : s.weeklySchedule?.administrationScheduleId)
        ),
        forMember(
            (d) => d.weeklySchedule?.everyWeek,
            mapFrom((s) => s.weeklySchedule?.everyWeek ? Number(s.weeklySchedule?.everyWeek) : null)
        ),
        forMember(
            (d) => d.weeklySchedule?.selectedDays,
            mapFrom((s) => s.weeklySchedule?.selectedDays)
        ),
        forMember(
            (d) => d.monthlySchedule?.administrationScheduleId,
            mapFrom((s) => addNewMode ? 0 : s.monthlySchedule?.administrationScheduleId)
        ),
        forMember(
            (d) => d.monthlySchedule?.everyMonth,
            mapFrom((s) => s.monthlySchedule?.everyMonth ? Number(s.monthlySchedule?.everyMonth) : null)
        ),
        forMember(
            (d) => d.monthlySchedule?.chooseMonth,
            mapFrom((s) => s.monthlySchedule?.chooseMonth)
        ),
        forMember(
            (d) => d.scheduleLocation,
            mapFrom((s) => s.scheduleLocation?.length! > 0 ? s.scheduleLocation : null)
        ),
        forMember(
            (d) => d.assignedToSummary,
            mapFrom((s) => s.assignedToSummary)
        ),
        forMember(
            (d) => d.monthlySchedule?.selectedDays,
            mapFrom((s) => s.monthlySchedule?.selectedDays)
        ),
        forMember(
            (d) => d.monthlySchedule?.selectedDaysOfMonth,
            mapFrom((s) => s.monthlySchedule?.selectedDaysOfMonth)
        ),
        forMember(
            (d) => d.monthlySchedule?.selectedDaysOfWeek,
            mapFrom((s) => s.monthlySchedule?.selectedDaysOfWeek)
        ),
        forMember(
            (d) => d.duration,
            mapFrom((s) => s.duration)
        ),
        forMember(
            (d) => d.isDefault,
            mapFrom((s) => s.isDefault)
        ),
        forMember(
            (d) => d.timeSummary,
            mapFrom((s) => s.timeSummary)
        ),
        forMember(
            (d) => d.frequencyRepeatSummary,
            mapFrom((s) => s.frequencyRepeatSummary)
        ),
        forMember(
            (d) => d.isFreqGroupedByEvery,
            mapFrom((s) => s.isFreqGroupedByEvery)
        ),
        forMember(
            (d) => d.existingAdministrationScheduleId,
            mapFrom((s) => s.existingAdministrationScheduleId)
        ),
        forMember(
            (d) => d.defaultLocation,
            mapFrom((s) => s.defaultLocation)
        ),
    );
}