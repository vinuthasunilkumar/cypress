export enum ImportListMessageEnum {
    ImportFileNeedsToBeValidMessage = "File import needs to be valid and error free.",
    FileSizeLimitExceedMessage = "File size exceeds permissible limit of up to {0} size.",
    IncorrectFileFormatMessage = "Invalid file type. Only .csv files are allowed for import.",
    FileHasErrors = "File upload failed due to the following {0} errors found during validation. Fix the errors and retry.",
    FileHasImportedSuccessMessage = "File has been imported successfully."
}