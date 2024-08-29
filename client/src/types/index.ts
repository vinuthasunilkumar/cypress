export type HostContext = {
    baseUrl: string,
    ectConfigId: string,
    facilityId: string,
    parentId: string,
    facilityName: string,
    facilityState: string,
    facilityType: string,
    facilityCareLevel: string,
    remoteMfeUrl: string,
    residentId: string,
    userId: string,
    isUserPhysician: string,
    globalFacilityId: string, ////TODO: This needs to be removed, when we changed FaciityID from long to Guid of Facility Table
    urlParameters: {
        eventId: string,
        providerId: string,
        isPendingOrder: string
        isDischargeOrder: string
        prescriberId: string
    },
    providerName: string,
    isCloudMedOrderWriterEnabled: boolean,
    isCloudOrderWriterEnabled: boolean,
    facilities?: IFacility[],
    basePath: string,
    permission: IPermission,
    roomId?: number,
    unitId?: number,
    bedId?: number,
    globalUnitId: string | null
}

export * from './medicationTypes';
