import React from "react";
import { RemoveSpaces } from "../../../helper/Utility";
import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { CustomMedicationForm, CustomMedicationRequestDto } from "../../../models/class/CustomMedicationForm";
import { ICustomMedicationLibrary } from "../../../models/interface/ICustomMedicationLibrary";

export const mapRequestDto = (mapper:Mapper) => {
    let libraryDetails: ICustomMedicationLibrary;
    if (sessionStorage.getItem("selectedLibraryDetails")) {
        const obj: string | null = sessionStorage.getItem("selectedLibraryDetails");
        libraryDetails = JSON.parse(obj!);
    }
    createMap(
        mapper,
        CustomMedicationForm,
        CustomMedicationRequestDto,
        forMember(
            (d) => d.id,
            mapFrom((s) => (s.Id ? s.Id : 0))
        ),
        forMember(
            (d) => d.description,
            mapFrom((s) => RemoveSpaces(s.customMedicationName))
        ),
        forMember(
            (d) => d.deaclassid,
            mapFrom((s) => (s.deaSchedule ? parseInt(s.deaSchedule) : null))
        ),
        forMember(
            (d) => d.fdbmedications,
            mapFrom((s) => (s.fdbMedications?.length > 0 ? s.fdbMedications : []))
        ),
        forMember(
            (d) => d.fdbmedgroups,
            mapFrom((s) => (s.fdbMedGroups?.length > 0 ? s.fdbMedGroups : []))
        ),
        forMember(
            (d) => d.isactive,
            mapFrom((s) => s.status)
        ),
        forMember(
            (d) => d.customMedicationLibraryId,
            mapFrom((s) =>
                s.customMedicationLibraryId
                    ? s.customMedicationLibraryId
                    : libraryDetails?.id
            )
        )
    );
};