export const enum FacilityDefaultValues {
    corporationId = "00000001-0000-0000-0000-000000000000",
    facilityId = "00000001-0001-0000-0000-000000000000",
    facilityLabel = "MatrixCare Center"
}

export enum ApiEndPoints {
    MedicationsList = "/api/medications",
    MedicationGroupsList = "/api/medication-groups",
    AddNewCustomMedication = "api/custom-medications",
    GetCustomMedicationsList = "api/custom-medications",
    UpdateCustomMedicationStatus = "api/custom-medications",
    GetCustomMedicationById = "api/custom-medications",
    UpdateCustomMedication = "api/custom-medications",
    UploadCustomMedication = "api/custom-medications",
    DeleteCustomMedicationById = "/api/custom-medications",
    GetDownloadTemplate = "/api/custom-medications/download-template",
    GetFacilityList = "/api/user-security/facilities",
    GetAvailableFormularyList = "/api/formularies/available",
    GetFormularyListByFormularyId = "/api/formularies",
    GetFacilityLibrariesAsync = "/api/customers",
    SaveFacilityLibrariesAsync = "/api/customers/facilities/libraries",
    GetFacilityConfiguration = "/api/customers",
    GetCustomMedicationLibraryList = "api/custom-medication-library",
    AddNewCustomMedicationLibrary = "api/custom-medication-library",
    UpdateCustomMedicationLibrary = "api/custom-medication-library",
    GetFacilityListData = "/api/corporations",
    GetPatientSafetyAlerts = "/api/medication/patientSafetyAlerts",
    GetDiagnoses = "/api/diagnoses",
    GetDiagnosesForAciveResidents = "/api/diagnoses/activeForResidents",
    ////Note: As of now customerId and facilityId are hardcoded as we are using the mock application
    ////This will get changed in future and hardcoded values will be removed.
    GetEditUnitAssign = `/api/customers/${FacilityDefaultValues.corporationId}/facilities/${FacilityDefaultValues.facilityId}/units`,
    GetFacilitiesUrl = `/api/customers/${FacilityDefaultValues.corporationId}`,
    CustomersBaseUrl = "/api/customers",
    AdministrationScheduleBaseUrl = "api/administration-schedule",
    DrugNamesList = "/api/drug",
    UserSecurityPermissions = "/api/user-security/permissions",    
    GetFacilityListByCmlId = "/api/custom-medication-library/facilities",
    StockMedicationsBaseUrl = "api/stock-medication",
    GetStockMedicationLibraryList = "api/stock-medication-library",
    AddNewStockMedicationLibrary = "api/stock-medication-library",
    GetAdministrationScheduleList = "api/administration-schedule-list",
    AddAdministrationScheduleList = "api/administration-schedule-list",
    GetOrderByUsers = "/api/order-writer/ordered-by-users",
    GetModuleActivationStatus = "/api/module/activation-status",
    ToggleModuleActivation = "/api/module/toggle-activation",
}