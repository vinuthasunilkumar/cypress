export interface IFdbIngredients {
    description: string;
    id: number;
    representativeNDC?: string;
    TtlExpiration?: Date;
    isObsolete?: boolean;
    isGeneric?: boolean;
    parentFdbMedId?: number;
    gcnSequenceNumber?: number;
    elements?: {
        gcnSequenceNumber: number;
    }
    genericMedication?: IGenericMedicationInfo;
}