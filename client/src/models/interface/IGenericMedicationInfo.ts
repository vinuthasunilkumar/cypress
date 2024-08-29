interface IGenericMedicationInfo extends IMedicationInfo {
    availability?: string;
    isGeneric?: boolean;
    parentFdbMedId?: number;
}