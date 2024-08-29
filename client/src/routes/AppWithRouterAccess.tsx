import { useLocation, useRoutes } from "react-router-dom";
import { protectedRoutes } from "./ProtectedRoute";
import Home from "../features/medication-search/pages/Home";
import { resetCustomMedicationLibrarySession, resetCustomMedicationSession, resetFrequencyAdministrationSession, resetStockMedicationsSession } from "../helper/Utility";

export const manageSessionStorage = () => {
  const location = useLocation();

  if (location.pathname !== "/stock-medications") {
    resetStockMedicationsSession();
  }

  if (location.pathname !== "/schedule-list" &&
    location.pathname !== "/schedule-list/" &&
    location.pathname !== "/add-schedule" &&
    !location.pathname.startsWith("/edit-schedule/")
  ) {
    resetFrequencyAdministrationSession();
  }

  if (
    location.pathname === "/custom-medication-libraries"
  ) {
    resetCustomMedicationSession();
  }

  if (
    location.pathname !== "/custom-medication-libraries"
  ) {
    resetCustomMedicationLibrarySession();
  }
};

export const AppWithRouterAccess = () => {
  manageSessionStorage();
  const commonRoutes = [{ path: "/", element: <Home /> }];
  const routes = protectedRoutes;
  const element = useRoutes([...routes, ...commonRoutes]);
  return <>{element}</>;
};
