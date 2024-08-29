export enum CustomMedicationLibraryMsgEnum {
    NoMatchesFound = "No matches found",
    SaveLibraryDialogTitle = "New Custom Medication Library",
    EditLibraryDialogTitle = "Edit Custom Medication Library",
    LibraryNameRequiredMessage = "Library name is required.",
    LibraryNameAllowedCharacter = "Error: Only following characters are allowed -\n1. Alpha-Numeric a - z, A - Z, 0 - 9\n2. Special Characters ! @ # $ % ^ & * ( ) _ - + = { } [ ] | \\ : \" ; ' < > , . ? /",
    LibraryNameMaxLengthMessage = "Library name must be at most 70 characters",
    NotifyOnLostStringMessage = "Length of data beyond 70 characters is truncated",
    CustomMedLibraryConfirmButtonText = "Next",
    CustomMedLibraryCancelButtonText = "Cancel",
    CustomMedLibraryDialogIcon = "fa fa-warning neo-warning",
    CustomMedLibraryDialogTitle = "Inactivate Library",
}

export enum CustomMedicationLibraryConstants {
    LibraryNameMaxLength = 70
}
