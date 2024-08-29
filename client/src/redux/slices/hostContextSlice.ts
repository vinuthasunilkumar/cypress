import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HostContext } from "../../types";

const initialState: HostContext = {
  baseUrl: "",
  ectConfigId: "",
  facilityId: "",
  parentId: "",
  remoteMfeUrl: "",
  facilityName: "",
  facilityState: "",
  facilityType: "",
  facilityCareLevel: "",
  residentId: "",
  userId: "",
  globalFacilityId: "",
  isUserPhysician: "false",
  urlParameters: {
    eventId: "",
    providerId: "",
    isPendingOrder: "",
    isDischargeOrder: "",
    prescriberId: ""
  },
  providerName: "",
  isCloudMedOrderWriterEnabled: false,
  isCloudOrderWriterEnabled: false,
  facilities: [],
  permission: {
    customMedicationLibraryInactivate: false,
    customMedicationLibraryEdit: false,
    customMedicationDelete: false,
    facilitySetupEdit: false,
    stockMedicationListInactivate: false,
    frequencyAdministrationScheduleListCopy: false,
    frequencyAdministrationScheduleListEdit: false,
    frequencyAdministrationScheduleListInactivate: false,
    stockMedicationListCopy: false,
    stockMedicationListEdit: false
  },
  basePath: '',
  bedId: 0,
  roomId: 0,
  unitId: 0,
  globalUnitId: ""
};

export const hostContextSlice = createSlice({
  name: 'hostContext',
  initialState,
  reducers: {
    setHostContext: (state, action: PayloadAction<HostContext>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setHostContext } = hostContextSlice.actions;

export default hostContextSlice.reducer;