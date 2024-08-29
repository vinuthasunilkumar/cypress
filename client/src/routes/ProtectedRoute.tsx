import { Outlet } from "react-router-dom";
import { lazyImport } from "../utils/lazyImport";
import React, { Suspense } from "react";
import Header from "../shared/pages/Header";
import Footer from "../shared/pages/Footer";
import ErrorNotFound from "../shared/pages/ErrorNotFound";
import { mockUserFacility } from "../helper/mockUserFacility";

const { MedicationSearchRoute } = lazyImport(
  () => import("../features/medication-search"),
  "MedicationSearchRoute"
);
const { HomeRoute } = lazyImport(
  () => import("../features/medication-search"),
  "HomeRoute"
);
const { CustomMedicationRoute } = lazyImport(
  () => import("../features/custom-medication"),
  "CustomMedicationRoute"
);
const { CustomMedicationListRoute } = lazyImport(
  () => import("../features/custom-medication"),
  "CustomMedicationListRoute"
);
const { FacilitySetupRoute } = lazyImport(
  () => import("../features/facility"),
  "FacilitySetupRoute"
);
const { FacilityListRoute } = lazyImport(
  () => import("../features/facility"),
  "FacilityListRoute"
);
const { CustomMedicationLibraryListRoute } = lazyImport(
  () => import("../features/custom-medication-library"),
  "CustomMedicationLibraryListRoute"
);

const { OrderWriterRoute } = lazyImport(
  () => import("../features/order-writer"),
  "OrderWriterRoute"
);

const { FrequencyAdministrationRoute } = lazyImport(
  () => import("../features/frequency-administration"),
  "FrequencyAdministrationRoute"
);

const { FrequencyAdministrationScheduleListRoute } = lazyImport(
  () => import("../features/frequency-administration"),
  "FrequencyAdministrationScheduleListRoute"
);

const { StockMedicationsListRoute } = lazyImport(
  () => import("../features/stock-medications"),
  "StockMedicationsListRoute"
);

const App = () => {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
};

export const protectedRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/medication-search", element: <MedicationSearchRoute /> },
      {
        path: "/custom-medications/:libraryId",
        element: <CustomMedicationListRoute />,
      },
      {
        path: "/custom-medication-libraries",
        element: <CustomMedicationLibraryListRoute />,
      },
      { path: "/add-custom-medication", element: <CustomMedicationRoute /> },
      { path: "/facility-setup", element: <FacilityListRoute /> },
      {
        path: "/facility-setup/:facilityId",
        element: (
          <FacilitySetupRoute
            corporateId={mockUserFacility.corporateId}
            ectConfigId={mockUserFacility.ectConfigId}
            facilityId={mockUserFacility.facilityId}
            facilityName={mockUserFacility.facilityName}
            showFacilitySetup={mockUserFacility.showFacilitySetup}
            userId={mockUserFacility.userId}
          />
        ),
      },
      {
        path: "/edit-custom-medication/:customMedicationId",
        element: <CustomMedicationRoute />,
      },
      { path: "/add-schedule", element: <FrequencyAdministrationRoute /> },
      {
        path: "/schedule-list",
        element: <FrequencyAdministrationScheduleListRoute />,
      },
      {
        path: "/edit-schedule/:administrationScheduleId",
        element: <FrequencyAdministrationRoute />,
      },
      { path: "/order-writer", element: <OrderWriterRoute /> },
      {
        path: "/stock-medications",
        element: <StockMedicationsListRoute />,
      },
      { path: "*", element: <ErrorNotFound /> },
    ],
  },
];
