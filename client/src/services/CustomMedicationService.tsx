import { CustomMedicationRequestDto } from "../models/class/CustomMedicationForm";
import { apiClient } from "./../setup/api";
import { ApiEndPoints } from "./../shared/enum/ApiEndPoints";

const multipartConfig = { headers: { "content-type": "multipart/form-data" } };

export const loadIngredients = (
  pageNumber: number,
  query: string,
  residentId: any,
  baseUrl: any,
  pageLength?: number
) => {
  const qry = encodeURIComponent(query);
  return apiClient().get(
    `${ApiEndPoints.MedicationsList
    }?pageNumber=${pageNumber}&pageLength=${pageLength}&SearchText=${qry}&ResidentId=${residentId}&BaseUrl=${baseUrl}&MedicationAvailability=${0}`
  ).then((response) => {
    return response?.data?.medicationSearchResultsDto;
  });
};

export const loadMedicationGroups = (
  pageNumber: number,
  query: string,
  residentId: any,
  baseUrl: any
) => {
  const qry = encodeURIComponent(query);
  return apiClient().get(
    `${ApiEndPoints.MedicationGroupsList
    }?pageNumber=${pageNumber}&pageLength=${50}&SearchText=${qry}&ResidentId=${residentId}&BaseUrl=${baseUrl}`
  ).then((response) => {
    return response?.data?.medicationGroupSearchResultsDto;
  });
};

export const getCustomMedicationsList = (
  pageNumber: number,
  query: string,
  pageSize?: number,
  libraryId?: number,
  isCustomMedicationListExport?: boolean,
  isDescending?: boolean
) => {
  const qry = encodeURIComponent(query);
  return apiClient().get(
    `${ApiEndPoints.GetCustomMedicationsList}?pageNumber=${pageNumber}&pageSize=${pageSize}&customMedicationLibraryId=${libraryId}&isCustomMedicationListExport=${isCustomMedicationListExport}&isDescending=${isDescending}&search=${qry}`
  ).then((response) => {
    return response?.data;
  });
};

export const UpdateCustomMedicationStatus = (customMedicationId: number) => {
  return apiClient().put(
    `${ApiEndPoints.UpdateCustomMedicationStatus}/${customMedicationId}`
  ).then((resp) => {
    return resp;
  });
};

export const DeleteCustomMedication = (customMedicationId: number) => {
  return apiClient().delete(
    `${ApiEndPoints.DeleteCustomMedicationById}/${customMedicationId}`
  ).then((resp) => {
    return resp;
  });
};

export const GetCustomMedicationById = (customMedicationId: number) => {
  return apiClient().get(
    `${ApiEndPoints.GetCustomMedicationById}/${customMedicationId}`
  ).then((response) => {
    if (response?.data?.customMedications?.length > 0)
      return response.data.customMedications[0];
  });
};

export const AddNewCustomMedication = (customMedicationRequest: CustomMedicationRequestDto) => {
  return apiClient().post(
    `${ApiEndPoints.AddNewCustomMedication}`,
    customMedicationRequest
  ).then((response) => {
    return response.data;
  });
};

export const UpdateCustomMedication = (customMedicationRequest: CustomMedicationRequestDto) => {
  return apiClient().put(
    `${ApiEndPoints.UpdateCustomMedication}`,
    customMedicationRequest
  ).then((response) => {
    return response.data;
  });
};

export const UploadCustomMedications = (
  customMedicationLibraryId?: number,
  customMedicationRequest?: any
) => {
  return apiClient().post(
    `${ApiEndPoints.UploadCustomMedication}/${customMedicationLibraryId}`,
    customMedicationRequest,
    multipartConfig
  ).then((response) => {
    return response;
  });
};

export const getDownloadTemplate = (
) => {
  return apiClient().get(
    `${ApiEndPoints.GetDownloadTemplate}`, { responseType: "arraybuffer" }
  ).then((response) => {
    return response;
  });
};