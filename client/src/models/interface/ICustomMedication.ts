import { IMedGroups } from "./IMedGroups";

export interface ICustomMedication {
        deaClassId: number;
        isActive: boolean;
        isControlledSubstance: boolean;
        customMedicationLibraryId: number;
        createdDateTime: Date;
        createdBy: string;
        modifiedDateTime: Date;
        modifiedBy: string;
        fdbMedGroupLists: IMedGroups[],
        fdbIngredientLists: IMedicationSearchResults[],
        description: string;
        id: number;
}