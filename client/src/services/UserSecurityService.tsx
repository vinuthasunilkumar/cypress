import { apiClient }  from "./../setup/api";
import { ApiEndPoints } from "./../shared/enum/ApiEndPoints";

export const getUserPermissions = (ectConfigId: number, userId: number) => {
    return apiClient().get(
      `${ApiEndPoints.UserSecurityPermissions}?EctConfigId=${ectConfigId}&UserId=${userId}`
    ).then((response) => {
      return response?.data;
    });
  };