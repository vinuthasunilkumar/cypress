import { apiClient } from "./../setup/api";
import { ApiEndPoints } from "./../shared/enum/ApiEndPoints";

export const getFormularyList = () => {
  return apiClient()
    .get(`${ApiEndPoints.GetAvailableFormularyList}`)
    .then((response) => {
      return response?.data;
    });
};

export const getFormularyInfoByFormularyId = (
  formularyId: number,
  medIds: string
) => {
  return apiClient()
    .get(
      `${ApiEndPoints.GetFormularyListByFormularyId}/${formularyId}?medIds=${medIds}`
    )
    .then((response) => {
      return response?.data;
    });
};
