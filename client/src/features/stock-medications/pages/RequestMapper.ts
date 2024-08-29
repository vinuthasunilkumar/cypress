import React from "react";
import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { StockMedicationSupplyForm, StockMedicationSupplyRequestDto } from "../../../models/class/StockMedicationSupply";


export const mapRequestDto = (mapper: Mapper, addNewMode: boolean, stockMedicationId: number) => {
    createMap(
        mapper,
        StockMedicationSupplyForm,
        StockMedicationSupplyRequestDto,
        forMember(
            (d) => d.id,
            mapFrom((s) => addNewMode ? 0 : stockMedicationId)
        ),
        forMember(
            (d) => d.fdbMedications,
            mapFrom((s) => s.fdbMedications)
        ),
        forMember(
            (d) => d.stockMedicationLocation,
            mapFrom((s) => s.stockMedicationLocation?.length! > 0 ? s.stockMedicationLocation : [])
        ),
        forMember(
            (d) => d.facilityId,
            mapFrom((s) => s.facilityId)
        ),
        forMember(
            (d) => d.Ids,
            mapFrom((s) => s.Ids)
        ),
    );
}