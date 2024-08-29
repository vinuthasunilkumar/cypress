import { IMedGroups } from "../interface/IMedGroups";

export class CustomMedicationForm {
    Id!: number;
    customMedicationName!: string;
    isControlledSubstance!: any;
    deaSchedule!: string;
    ingridents!: string;
    medicationGroup!: string;
    status!: any;
    fdbMedications!: IMedicationSearchResults[];
    fdbMedGroups!: IMedGroups[];
    customMedicationLibraryId!: any;
};

export class CustomMedicationRequestDto {
    id!: number;
    description!: string;
    deaclassid!: number;
    fdbmedications!: IMedicationSearchResults[];
    fdbmedgroups!: IMedGroups[];
    isactive!: boolean;
    customMedicationLibraryId!: any;
};

export class EditCustomMedicationResponseDto {
    id!: number;
    description!: string;
    deaClassId!: number;
    fdbIngredientLists!: IMedicationSearchResults[];
    fdbMedGroupLists!: IMedGroups[];
    isActive!: boolean;
    isControlledSubstance!: boolean;
    customMedicationLibraryId!: any;
}