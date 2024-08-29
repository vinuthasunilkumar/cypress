interface IMedicationInfo {
    id: number;
    description: string;
    drugInfo?: IDrugInfo[];
    therapeuticClass?: IDescribedEntity;
    genericmedication?: IDescribedEntity;
    patientMonograph?: string;
}