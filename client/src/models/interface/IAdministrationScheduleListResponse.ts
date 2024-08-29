import { IAdministrationScheduleDetailList, IAdministrationScheduleList } from "./IAdministrationScheduleList";

export interface IAdministrationScheduleListResponse {
    administrationSchedule: IAdministrationScheduleList[];
    pagination: IPagination;
  }

  export interface IAdministrationScheduleDetailListResponse {
    administrationScheduleList: IAdministrationScheduleDetailList[];
    pagination: IPagination;
  }