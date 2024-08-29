interface IPatientSafetyAlertsV1Dto {
    target_MedID: number;
    type: string;
    severity: string;
    summaryText: string;
    trigger_MedID: number;
    allergenGroupID: number;
    allergicTo_DrugID: number;
    drugDrugMonographID: number;
    iCD10Code: string;
}