import { CustomMedicationLibraryRequestDto } from "../models/class/CustomMedicationLibrary";
import { apiClient } from "./../setup/api";
import { ApiEndPoints } from "./../shared/enum/ApiEndPoints";

export const getCustomMedicationLibraryList = (
  pageNumber: number,
  query: string,
  pageSize?: number,
  corporationId?: number,
  ectConfigId?: number,
  isDescending?: boolean
) => {
  const qry = encodeURIComponent(query);
  return apiClient()
    .get(
      `${ApiEndPoints.GetCustomMedicationLibraryList}?pageNumber=${pageNumber}&pageSize=${pageSize}&isDescending=${isDescending}&corporationId=${corporationId}&ectConfigId=${ectConfigId}&search=${qry}`
    )
    .then((response) => {
      return response?.data;
    });
};

export const AddNewCustomMedicationLibrary = (
  customMedicationLibraryRequest: CustomMedicationLibraryRequestDto
) => {
  return apiClient()
    .post(
      `${ApiEndPoints.AddNewCustomMedicationLibrary}`,
      customMedicationLibraryRequest
    )
    .then((response) => {
      return response.data;
    });
};

export const UpdateCustomMedicationLibrary = (
  customMedicationLibraryRequest: CustomMedicationLibraryRequestDto
) => {
  return apiClient()
    .put(
      `${ApiEndPoints.UpdateCustomMedicationLibrary}`,
      customMedicationLibraryRequest
    )
    .then((response) => {
      return response.data;
    });
};

export const getAssignedFacilitiesByCmlId = async (
  ectConfigId: string | undefined,
  corpId: string | undefined,
  userId: string | undefined,
  customMedicationLibraryId: number
) => {
  const response = await apiClient().get(
    `${ApiEndPoints.GetFacilityListByCmlId}?ectConfigId=${ectConfigId}&corpId=${corpId}&userId=${userId}&customMedicationLibraryId=${customMedicationLibraryId}`
  );
  return response?.data;
};
