import { AdministrationScheduleListRequestDto } from "../models/class/AdministrationScheduleList";
import { apiClient } from "../setup/api";
import { ApiEndPoints } from "../shared/enum/ApiEndPoints";

export const getAdministrationScheduleListAsync = (
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
      `${ApiEndPoints.GetAdministrationScheduleList}?pageNumber=${pageNumber}&pageSize=${pageSize}&isDescending=${isDescending}&corporationId=${corporationId}&ectConfigId=${ectConfigId}&search=${qry}`
    )
    .then((response) => {
      return response?.data;
    });
};

export const AddNewAdministrationScheduleList = (
    administrationScheduleListRequest: AdministrationScheduleListRequestDto
) => {
  return apiClient()
    .post(
      `${ApiEndPoints.AddAdministrationScheduleList}`,
      administrationScheduleListRequest
    )
    .then((response) => {
      return response.data;
    });
};
