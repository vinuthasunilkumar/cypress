import { apiClient } from "./../setup/api";
import { ApiEndPoints } from "./../shared/enum/ApiEndPoints";

export const getModuleActivationStatus = (
  facilityId: number,
  moduleCode: string,
  baseUrl: string,
  ectConfigId: number
) => {
  return apiClient()
    .get(
      `${ApiEndPoints.GetModuleActivationStatus}?facilityId=${facilityId}&moduleCode=${moduleCode}&baseUrl=${baseUrl}&ectConfigId=${ectConfigId.toString()}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching module activation status", error);
      throw error;
    });
};

export const toggleModuleActivation = (
  facilityId: number,
  moduleCode: string,
  activate: boolean,
  baseUrl: string,
  ectConfigId: number
) => {
  return apiClient()
    .post(
      `${ApiEndPoints.ToggleModuleActivation}?facilityId=${facilityId}&moduleCode=${moduleCode}&activate=${activate}&baseUrl=${baseUrl}&ectConfigId=${ectConfigId.toString()}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error toggling module activation", error);
      throw error;
    });
};
