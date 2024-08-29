import { ExportStockMedicationRequestDto, StockMedicationSupplyRequestDto } from "../models/class/StockMedicationSupply";
import { IStockMedication } from "../models/interface/IStockMedication";
import API, { apiClient } from "./../setup/api";
import { ApiEndPoints } from "./../shared/enum/ApiEndPoints";

export const loadMedicationSupplies = (
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

export const getStockMedList = (
  pageNumber: number,
  query: string,
  pageSize?: number,
  isDescending?: boolean,
  sort?: string,
  facilityId?: string
) => {
  const qry = encodeURIComponent(query);
  return API.get(`${ApiEndPoints.StockMedicationsBaseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}&isDescending=${isDescending}&search=${qry}&sort=${sort}&facilityId=${facilityId}`).then((response) => {
    return response?.data;
  });
};

export const deleteStockMedications = (stockMedIds: string) => {
  return API.delete(
    `${ApiEndPoints.StockMedicationsBaseUrl}/${stockMedIds}`
  ).then((resp) => {
    return resp;
  });
};


export const saveOrUpdateStockMedications = (request: StockMedicationSupplyRequestDto) => {
  return API.post(`${ApiEndPoints.StockMedicationsBaseUrl}`, request).then(
    (response) => {
      return response.data;
    }
  );
};

export const getStockMedicationSupplyDetailsById = (id: number) => {
  return API.get(
    `${ApiEndPoints.StockMedicationsBaseUrl}/${id}`
  ).then((response): IStockMedication => {
    return response.data;
  });
};

export const exportStockMedications = (selectedStockMedIds: string, targetFacilityId: string, sourceFacilityId: string, request: ExportStockMedicationRequestDto) => {
  return API.post(`${ApiEndPoints.StockMedicationsBaseUrl}/${selectedStockMedIds}/${targetFacilityId}/${sourceFacilityId}`, request.stockMedicationLocation).then(
    (response) => {
      return response.data;
    }
  );
};

export const importStockMedications = (selectedStockMedIds: string, targetFacilityId: string, sourceFacilityId: string, request: ExportStockMedicationRequestDto) => {
  return API.post(`${ApiEndPoints.StockMedicationsBaseUrl}/${selectedStockMedIds}/${targetFacilityId}/${sourceFacilityId}`, request.stockMedicationLocation).then(
    (response) => {
      return response.data;
    }
  );
};

export const importCountStockMedication = (sourceFacilityId: string) => {
  return API.get(`${ApiEndPoints.StockMedicationsBaseUrl}/${sourceFacilityId}`).then(
    (response) => {
      return response.data;
    }
  );
};

export const getStockMedicationFacilityList = (
  pageNumber: number,
  query: string,
  pageSize?: number,
  corporationId?: number,
  ectConfigId?: number,
  isDescending?: boolean
) => {
  return apiClient()
    .get(
      `${ApiEndPoints.GetStockMedicationLibraryList}?pageNumber=${pageNumber}&pageSize=${pageSize}&isDescending=${isDescending}&corporationId=${corporationId}&ectConfigId=${ectConfigId}&search=${query}`
    )
    .then((response) => {
      return response?.data;
    });
};