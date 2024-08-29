export enum StockMedications {
    MedicationRequiredMessage = "Medication/Supply is required.",
    DeleteStockMedConfirmDialogTitle = "Delete Stock Medication/Supply",
    DeleteText = "Delete",
    DeleteStockMedCancelButtonText = "Cancel",
    NoMatchesFound = "No matches found",
    NoMedicationSupplySelectedMessage = "No medications/supplies have been selected.",
    StockMedGenericMessage = "Selected medication/supply will also apply to its generics",
    StockMedMaxSelectionMsg = "You can select a maximum of 15 medications/supplies.",
    LoadingMedicationSupplyMessage = "Loading Medication/Supply...",
    SearchCharactersLimitMessage = "Enter at least 2 characters to search",
    DataLossWarningMessage = "Would you like to save the changes you've made before navigating back?",
    DataLossWarningMessageContent = "If you don't save, your changes will be lost.",
    DialogTitle = "Data Loss Warning",
    DeleteMessage = "Stock Medication/Supply deleted successfully.",
    AddStockMedicationDialogTitle = "Add New Stock Medication/Supply",
    EditStockMedicationDialogTitle = "Edit Stock Medication/Supply",
    ExportDialogOkBtnText = "Export",
    ImportDialogOkBtnText = "Import",
    ExportDialogCancelBtnText = "Cancel",
    FacilityRequiredMessage = "Facility is required.",
    StockMedicationExportIMessage = "Export your medication/supply list to another facility, providing them with a copy of your inventory.",
    StockMedicationImportIMessage = "Select the facility to import your desired medication/supply list and assign it to the units in current facility.",
    StockMedicationDefaultIMessage = "By default, the list will be assigned to all units within the facility."
}


export enum StockMedicationsSupplyConstants {
    MaxMedicationSupplySelectionLimit = 15,
    MaxMedicationSupplyResultsPagesToBeLoaded = 25,
    MaxNoOfMedicationSupplyToBeLoaded = 250,
    MinSearchCharactersLength = 2
}

interface StockMedMessages {
    Delete_Warning_Message: (countOrWord: number | string) => string;
    Export_Message: (exportedCount: number, requestIdsCount: number) => string;
    Export_All: () => string;
    Export_Dialog_Title: (exportCount: number) => string;
    Import_Dialog_Title: (count: number | null) => string;
    Import_Message: (importedCount: number, requestIdsCount: number) => string;
    Import_All: () => string;
    Export_Units_Label:(label:string | undefined) => string;
}

export const STOCK_MED_MESSAGES: StockMedMessages = {
    Delete_Warning_Message: (countOrWord: number | string) => `Are you sure you want to delete ${countOrWord} stock medication/supply?`,
    Export_Message: (exportedCount, requestIdsCount) => `Exported ${exportedCount} of ${requestIdsCount} Medications/Supplies. ${requestIdsCount - exportedCount} duplicate Medications/Supplies already exist in the library.`,
    Export_All: () => 'Stock Medications/Supplies exported successfully.',
    Export_Dialog_Title: (exportCount: number) => `Export ${exportCount} Medication/Supply List`,
    Import_Dialog_Title:(count: number | null) => count === null ? `Import Medication/Supply List` : `Import ${count} Medication/Supply List`,
    Import_Message: (importedCount, requestIdsCount) => `Imported ${importedCount} of ${requestIdsCount} Medications/Supplies. ${requestIdsCount - importedCount} duplicate Medications/Supplies already exist in the library.`,
    Import_All: () => 'Stock Medications/Supplies imported successfully.',
    Export_Units_Label:(label) => `Select ${label ? label:'Facility'} Units`
};

export enum SORT_COLUMNS {
    StockMedicationsSupply = "stockmedication",
    AssignedTo = "assignedto",
}

interface DuplicateStockMedMessages {
    SINGLE: () => string;
    MULTIPLE: (responseIdsCount: number, requestIdsCount: number) => string;
}

export const DUPLICATE_STOCK_MED_MESSAGES: DuplicateStockMedMessages = {
    SINGLE: () => "Stock Medication/Supply saved successfully.",
    MULTIPLE: (responseIdsCount: number, requestIdsCount: number) => `Saved ${responseIdsCount} of ${requestIdsCount} medication/supplies. ${requestIdsCount - responseIdsCount} duplicate medications/supplies already exist in the library.`,
};
