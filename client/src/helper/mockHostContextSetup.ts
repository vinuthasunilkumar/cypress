import { setHostContext } from "../redux/slices/hostContextSlice";
import store from "../redux/store";
import { HostContext } from "../types";

export const setMockHostContextSetup = (dischargeOrderStatus: string = "",
    pendingOrderStatus: string = "", isCloudMedOrderWriterEnabled: boolean = true,
    isCloudOrderWriterEnabled: boolean = true) => {
    const hostContext: HostContext = {
        baseUrl: "https://qa.matrixcare.com",
        ectConfigId: "65165",
        facilityId: "1",
        parentId: "1",
        facilityName: "",
        facilityState: "",
        facilityType: "",
        facilityCareLevel: "",
        remoteMfeUrl: "",
        residentId: "",
        userId: "11375",
        isUserPhysician: "false",
        globalFacilityId: "",
        urlParameters: {
            eventId: "",
            providerId: "",
            isPendingOrder: pendingOrderStatus,
            isDischargeOrder: dischargeOrderStatus,
            prescriberId: ""
        },
        providerName: "",
        isCloudMedOrderWriterEnabled: isCloudMedOrderWriterEnabled,
        isCloudOrderWriterEnabled: isCloudOrderWriterEnabled,
        facilities: [],
        permission: {
            customMedicationLibraryInactivate: true,
            customMedicationLibraryEdit: true,
            customMedicationDelete: true,
            facilitySetupEdit: true,
            stockMedicationListInactivate: true,
            frequencyAdministrationScheduleListCopy: true,
            frequencyAdministrationScheduleListEdit: true,
            frequencyAdministrationScheduleListInactivate: true,
            stockMedicationListCopy: true,
            stockMedicationListEdit: true,
            stockMedicationListCopyPermission: true
        },
        basePath: '',
        bedId: 0,
        roomId: 0,
        unitId: 0,
        globalUnitId: ""
    };

    store.dispatch(
        setHostContext({
            ...hostContext
        })
    );
}


