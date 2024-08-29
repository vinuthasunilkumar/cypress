import { ExportFrequencyAdministrationRequestDto, FrequencyAdministrationRequestDto } from "../models/class/FrequencyAdministration";
import { IAdministrationSchedule } from "../models/interface/IAdministrationSchedule";
import API, { apiClient } from "./../setup/api";
import { ApiEndPoints } from "./../shared/enum/ApiEndPoints";

export const saveOrUpdateAdministrationSchedule = (request: FrequencyAdministrationRequestDto) => {
  return API.post(`${ApiEndPoints.AdministrationScheduleBaseUrl}`, request).then(
    (response) => {
      return response.data;
    }
  );
};

export const getEditUnitAssignList = () => {
  return API.get(`${ApiEndPoints.GetEditUnitAssign}`).then(
    (response) => {
      return response?.data;
    }
  );
};

export const getAdministrationScheduleList = (
  pageNumber: number,
  query: string,
  pageSize?: number,
  isDescending?: boolean,
  sort?: string,
  facilityId?: string
) => {
  const qry = encodeURIComponent(query);
  return  API.get(`${ApiEndPoints.AdministrationScheduleBaseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}&isDescending=${isDescending}&search=${qry}&sort=${sort}&facilityId=${facilityId}`).then((response) => {
    return response?.data;
  });
};

export const getAdministrationScheduleDetailsById = (administrationScheduleId: number) => {
  return API.get(
    `${ApiEndPoints.AdministrationScheduleBaseUrl}/${administrationScheduleId}`
  ).then((response): IAdministrationSchedule => {
    return response.data;
  });
};

export const deleteScheduleAdministration = (scheduleAdministrationId: string) => {
  return API.delete(
    `${ApiEndPoints.AdministrationScheduleBaseUrl}/${scheduleAdministrationId}`
  ).then((resp) => {
    return resp;
  });
};

export const loadDrugNames = (
  pageNumber: number,
  query: string,
  pageLength?: number
) => {
  const qry = encodeURIComponent(query);
  return API.get(
    `${ApiEndPoints.DrugNamesList
    }?PageNumber=${pageNumber}&PageLength=${pageLength}&SearchText=${qry}`
  ).then((response) => {
    return response?.data?.drugSearchResultsDto;
  });
};

export const getFrequencyScheduleList = (
  isDescending?: boolean,
  frequencyCode?: string,
  administrationScheduleId?: number,
  sortColumn?: string,
  facilityId?: string
) => {
  const qry = encodeURIComponent(frequencyCode!);
  return API.get(`${ApiEndPoints.AdministrationScheduleBaseUrl}/${qry}/${administrationScheduleId}?isDescending=${isDescending}&sort=${sortColumn}&facilityId=${facilityId}`).then((response) => {
    return response?.data;
  });
};

export const loadMedicationGroups = (
  pageNumber: number,
  query: string,
  residentId: any,
  baseUrl: any
) => {
  const qry = encodeURIComponent(query);
  return API.get(
    `${ApiEndPoints.MedicationGroupsList
    }?pageNumber=${pageNumber}&pageLength=${50}&SearchText=${qry}&ResidentId=${residentId}&BaseUrl=${baseUrl}`
  ).then((response) => {
    return response?.data?.medicationGroupSearchResultsDto;
  });
};

export const checkDefaultAdministrationSchedule = (request: FrequencyAdministrationRequestDto) => {
  return API.post(`${ApiEndPoints.AdministrationScheduleBaseUrl}/${request.isDefault}`, request).then(
    (response) => {
      return response.data;
    }
  );
};

export const exportAdministrationSchedule = (targetFacilityId: string, sourceFacilityId: string, request: ExportFrequencyAdministrationRequestDto) => {
  return API.post(`${ApiEndPoints.AdministrationScheduleBaseUrl}/${targetFacilityId}/${sourceFacilityId}`, request).then(
    (response) => {
      return response.data;
    }
  );
};

export const importAdministrationSchedule = (targetFacilityId: string, sourceFacilityId: string, request: ExportFrequencyAdministrationRequestDto) => {
  return API.post(`${ApiEndPoints.AdministrationScheduleBaseUrl}/${targetFacilityId}/${sourceFacilityId}`, request).then(
    (response) => {
      return response.data;
    }
  );
};

export const importCountAdministrationSchedule = (sourceFacilityId: string) => {
  return API.get(`${ApiEndPoints.AdministrationScheduleBaseUrl}/${sourceFacilityId}`).then(
    (response) => {
      return response.data;
    }
  );
};