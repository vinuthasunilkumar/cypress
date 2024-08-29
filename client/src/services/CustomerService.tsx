import API, { apiClient } from "./../setup/api";
import { ApiEndPoints } from "./../shared/enum/ApiEndPoints";

export const getFacilityList = (
  ectConfigId: string | undefined,
  corpId: string | undefined,
  userId: string | undefined
) => {
  return apiClient().get(
    `${ApiEndPoints.GetFacilityList}?ectConfigId=${ectConfigId}&corpId=${corpId}&userId=${userId}`
  ).then((response) => {
    return response?.data;
  });
};

export const saveFacilityLibrariesAsync = (
  facilityConfiguration: IFacilityConfiguration
) => {
  return apiClient().post(
    `${ApiEndPoints.SaveFacilityLibrariesAsync}`,
    facilityConfiguration
  ).then((response) => {
    return response?.data;
  });
};

export const getFacilityConfigurationAsync = (
  customerId: number | null,
  facilityId: number | null
) => {
  return apiClient().get(
    `${ApiEndPoints.GetFacilityLibrariesAsync}/${customerId}/facilities/libraries?facilityId=${facilityId}`
  ).then((response) => {
    return response?.data;
  });
};

export const getCustomMedicationLibraryList = (
  parentId: number,
  ectConfigId: number
) => {
  return apiClient().get(
    `${ApiEndPoints.GetFacilityListData}/${parentId}/custom-medication-libraries?ectConfigId=${ectConfigId}`
  ).then((response) => {
    return response?.data;
  });
};

export const loadFacilities = () => {
  return API.get(`${ApiEndPoints.GetFacilitiesUrl}`)
  .then((response) => {
      return response?.data;
    }
  );
}

export const loadUnitsByFacilities = (customerId: string, facilityId: string) => {
  return API.get(`${ApiEndPoints.CustomersBaseUrl}/${customerId}/facilities/${facilityId}/units`)
  .then((response) => {
      return response?.data;
    }
  );
}

export const loadUnitsByFacilityId = (facilityId: string) => {
  return API.get(`${ApiEndPoints.CustomersBaseUrl}/facilities/${facilityId}/units`)
  .then((response) => {
      return response?.data;
    }
  );
}

export const getGlobalFacilityId = (facilityId: number, ectConfigId: number) => {
  return API.get(`${ApiEndPoints.CustomersBaseUrl}/facilities/${facilityId}/${ectConfigId}`)
  .then((response) => {
      return response?.data;
    }
  );
}