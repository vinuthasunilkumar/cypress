interface IFacility {
    id: number,
    name: string,
    facilityType: string,
    city: string,
    state: string,
    status: string,
    customerId: number
}

interface IUserFacility {
    corporateId: number,
    facilityId: number,
    facilityName: string,
    ectConfigId: number,
    userId: number,
    showFacilitySetup:boolean
}
