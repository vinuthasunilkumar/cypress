import React from "react";
import * as Yup from "yup";
import { StockMedications } from "../../../shared/enum/StockMedicationsEnum";

export const ValidationSchema = Yup.object().shape({
    fdbMedications: Yup.array().min(1).required(StockMedications.MedicationRequiredMessage)
});