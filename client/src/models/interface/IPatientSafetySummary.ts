interface IPatientSafetySummary {
    target_MedID: number;
    type: string;
    severity: string;
    summaryText: string;
    trigger_MedID: number | null;
    allergenGroupID: number;
    allergicTo_DrugID: number | null;
    drugDrugMonographID: number | null;
    iCD10Code: string | null;
}