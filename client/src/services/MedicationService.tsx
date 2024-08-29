import { apiClient } from "./../setup/api";
import { ApiEndPoints } from "./../shared/enum/ApiEndPoints";

export const searchMedication = (
  pageNumber: number,
  query: string,
  residentId: string,
  baseUrl: string,
  ectConfigId: string,
  pageLength?: number,
  customMedicationLibraryId?: number | null,
  isFromOrderModule?: boolean | null,
  facilityId?: string | null,
  unitId?: string | number | null
) => {
  let assignPageLength = 10;
  if (pageLength) {
    assignPageLength = pageLength;
  }
  const qry = encodeURIComponent(query);
  let Url: string = `${ApiEndPoints.MedicationsList}?pageNumber=${pageNumber}&pageLength=${assignPageLength}&SearchText=${qry}&ResidentId=${residentId}&BaseUrl=${baseUrl}&EctConfigId=${ectConfigId}`
  const customMedLibraryIdParam =
    customMedicationLibraryId != null
      ? `&CustomMedicationLibraryId=${customMedicationLibraryId}`
      : "";
  Url += customMedLibraryIdParam;
  const isFromOrderModuleParam =
    isFromOrderModule != null ?
      `&isOrderModule=${true}&facilityId=${facilityId}` : ""
  Url += isFromOrderModuleParam;
  if (unitId) {
    Url += `&unitId=${unitId}`
  }

  return apiClient()
    .get(Url)
    .then((response) => {
      return response?.data?.medicationSearchResultsDto;
    });
};

export const searchMedicationById = (
  medicationId: number,
  isCommonSig: boolean = false
) => {
  let url = `${ApiEndPoints.MedicationsList}/${medicationId}`;
  if (isCommonSig) {
    url += `?isCommonSig=${isCommonSig}`;
  }
  return apiClient()
    .get(url)
    .then((response) => {
      return response?.data;
    });
};

export const getPatientSafetyAlerts = (
  targetMedString: string,
  baseUrl: string,
  ectConfigId: string,
  residentId: string
) => {
  return apiClient()
    .get<IPatientSafetyAlertsResponse>(
      `${ApiEndPoints.GetPatientSafetyAlerts}?targetMedString=${targetMedString}&baseUrl=${baseUrl}&ectConfigId=${ectConfigId}&residentId=${residentId}`
    )
    .then((response) => {
      return response?.data;
    });
};
