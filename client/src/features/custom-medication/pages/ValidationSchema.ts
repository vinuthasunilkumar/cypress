import React from "react";
import * as Yup from "yup";
import { CustomMedicationMessages } from "../../../shared/enum/CustomMedMsgEnums";
import { CustomMedicationsConstants } from "../../../shared/enum/CustomMedicationsConstants";

export const ValidationSchema = Yup.object().shape({
    customMedicationName: Yup.string()
        .required(CustomMedicationMessages.CustomMedNameRequiredMessage)
        .matches(
            /^[a-zA-Z0-9-()/%.`~!@#$^&*()_+-={}[|\t/;:'"<>,.?/|\],\\pPrint ]+$/,
            CustomMedicationMessages.CustomMedicationAllowedCharacter
        )
        .max(
            CustomMedicationsConstants.customMedicationNameMaxLength,
            CustomMedicationMessages.CustomMedicationMaxLength
        ),
    isControlledSubstance: Yup.boolean().required(
        CustomMedicationMessages.IsControlledSubstanceRequiredMessage
    ),
    deaSchedule: Yup.string()
        .required(CustomMedicationMessages.DeaScheduleRequiredMessage)
        .when("isControlledSubstance", {
            is: true,
            otherwise: (x) => x.notRequired(),
        }),
});