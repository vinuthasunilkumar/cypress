interface IMedicationSearchResults {
    id: number;
    description: string;
    genericMedication?: IGenericMedicationInfo;
    representativeNDC?: string;
    alerts?: IPatientSafetySummary[];
    elements?: IMedicationElements;
    formularyStatus?: any;
    deaCode?: string;
    stockMedicationFlag?: string;
    isGeneric?: boolean;
    parentFdbMedId?: number;
    gcnSequenceNumber?: number;
}