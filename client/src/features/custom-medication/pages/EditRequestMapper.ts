import React from "react";
import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { CustomMedicationForm, EditCustomMedicationResponseDto } from "../../../models/class/CustomMedicationForm";

export const mapEditDto = (mapper: Mapper) => {
    createMap(
        mapper,
        EditCustomMedicationResponseDto,
        CustomMedicationForm,
        forMember(
            (d) => d.Id,
            mapFrom((s) => (s.id ? s.id : 0))
        ),
        forMember(
            (d) => d.customMedicationName,
            mapFrom((s) => s.description)
        ),
        forMember(
            (d) => d.deaSchedule,
            mapFrom((s) => (s.deaClassId ? s.deaClassId?.toString() : null))
        ),
        forMember(
            (d) => d.fdbMedications,
            mapFrom((s) =>
                s.fdbIngredientLists?.length > 0 ? s.fdbIngredientLists : []
            )
        ),
        forMember(
            (d) => d.fdbMedGroups,
            mapFrom((s) =>
                s.fdbMedGroupLists?.length > 0 ? s.fdbMedGroupLists : []
            )
        ),
        forMember(
            (d) => d.status,
            mapFrom((s) => s.isActive)
        ),
        forMember(
            (d) => d.isControlledSubstance,
            mapFrom((s) => s.isControlledSubstance)
        ),
        forMember(
            (d) => d.customMedicationLibraryId,
            mapFrom((s) => s.customMedicationLibraryId)
        )
    );
};