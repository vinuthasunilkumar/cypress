import React from "react";
import { FieldErrors, FieldValues, FieldName } from "react-hook-form";
import { ErrorMessage, FieldValuesFromFieldErrors } from "@hookform/error-message";
import { CustomMedicationForm } from "../../../models/class/CustomMedicationForm";

type ErrorSummaryProps<T extends FieldValues> = {
    errors: FieldErrors<T>;
    navigateAndSetFocus: (fieldName: keyof CustomMedicationForm) => void;
    onErrorDialogClose: () => void;
};

export const ErrorSummary = <T extends FieldValues>({
    errors,
    navigateAndSetFocus,
    onErrorDialogClose,
}: ErrorSummaryProps<T>) => {
    if (Object.keys(errors).length === 0) {
        return null;
    }
    Object.keys(errors).forEach((fieldName) => {
        if (errors.customMedicationName)
            errors.customMedicationName.message = String(
                document
                    ?.getElementById("lbl-customMedicationName")
                    ?.textContent?.toString()
            );
        if (errors.isControlledSubstance)
            errors.isControlledSubstance.message = "Controlled Substance";
        if (errors.deaSchedule)
            errors.deaSchedule.message = "DEA Schedule"
    });
    return (
        <div className="col-md-6">
            <div className="alert alert-danger">
                <i
                    id="alert-error-close-btn"
                    data-testid="alert-error-close-btn"
                    className="alert-close"
                    aria-hidden="true"
                    onClick={onErrorDialogClose}
                ></i>
                {
                    <h6 id="num-of-errors-found">
                        {Object.keys(errors).length === 1
                            ? `${Object.keys(errors).length} Error Found`
                            : `${Object.keys(errors).length} Errors Found`}
                    </h6>
                }
                <div className="alert-message-container">
                    {Object.keys(errors).map((fieldName) => (
                        <ErrorMessage
                            errors={errors}
                            name={fieldName as FieldName<FieldValuesFromFieldErrors<FieldErrors<T>>>}
                            as="a"
                            data-testid="focusToField"
                            onClick={() => navigateAndSetFocus(fieldName as keyof CustomMedicationForm)}
                            className="error-summary-message"
                            key={fieldName}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};