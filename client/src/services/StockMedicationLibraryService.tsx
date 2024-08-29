import { StockMedicationLibraryRequestDto } from "../models/class/StockMedicationLibrary";
import { apiClient } from "../setup/api";
import { ApiEndPoints } from "../shared/enum/ApiEndPoints";

export const getStockMedicationLibraryList = (
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
      `${ApiEndPoints.GetStockMedicationLibraryList}?pageNumber=${pageNumber}&pageSize=${pageSize}&isDescending=${isDescending}&corporationId=${corporationId}&ectConfigId=${ectConfigId}&search=${qry}`
    )
    .then((response) => {
      return response?.data;
    });
};

export const AddNewStockMedicationLibrary = (
  stockMedicationLibraryRequest: StockMedicationLibraryRequestDto
) => {
  return apiClient()
    .post(
      `${ApiEndPoints.AddNewStockMedicationLibrary}`,
      stockMedicationLibraryRequest
    )
    .then((response) => {
      return response.data;
    });
};

