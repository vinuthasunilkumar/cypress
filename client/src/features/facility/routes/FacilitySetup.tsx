import FacilitySetup from "../pages/FacilitySetup";

export const FacilitySetupRoute = (data: IUserFacility) => {
  return <FacilitySetup userFacilityData={data} />;
};
