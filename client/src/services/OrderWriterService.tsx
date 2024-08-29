import { apiClient } from "./../setup/api";
import { ApiEndPoints } from "./../shared/enum/ApiEndPoints";

export const loadActiveDiagnoses = (
  residentId: string,
  baseUrl: string,
  ectConfigId: string
) => {
  return apiClient()
    .get(
      `${ApiEndPoints.GetDiagnosesForAciveResidents}?baseUrl=${baseUrl}&ectConfigId=${ectConfigId}&residentId=${residentId}`
    )
    .then((response) => {
      return response?.data;
    });
};

export const loadAllDiagnoses = (
  pageNumber: number,
  query: string,
  pageLength?: number
) => {
  return apiClient()
    .get(
      `${ApiEndPoints.GetDiagnoses}?pageNumber=${pageNumber}&pageLength=${pageLength}&SearchText=${query}`
    )
    .then((response) => {
      return response?.data;
    });
};

export const loadOrderByUsers = (
  facilityId: number,
  residentId: string,
  baseUrl: string,
  ectConfigId: string
) => {
  return apiClient()
    .get(
      `${ApiEndPoints.GetOrderByUsers}?facilityId=${facilityId}&residentId=${residentId}&baseUrl=${baseUrl}&ectConfigId=${ectConfigId}`
    )
    .then((response) => {
      return response?.data;
    });
};
