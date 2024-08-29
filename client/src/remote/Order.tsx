import React, { useEffect, useState } from "react";
import { useDispatch, Provider } from "react-redux";
import store from "../redux/store";
import { useLocation, useRoutes } from "react-router-dom";
import useGainsight from "../hooks/useGainsight";
import MedicationSearch from "../features/medication-search/pages/MedicationSearch";
import CustomMedicationList from "../features/custom-medication/pages/CustomMedicationList";
import CustomMedication from "../features/custom-medication/pages/CustomMedication";
import CustomMedicationLibraryList from "../features/custom-medication-library/pages/CustomMedicationLibraryList";
import { HostContext } from "../types";
import OrderWriter from "../features/order-writer/pages/OrderWriter";
import FacilityList from "../features/facility/pages/FacilityList";
import FacilitySetup from "../features/facility/pages/FacilitySetup";
import AddSchedule from "../features/frequency-administration/pages/AddSchedule";
import ErrorNotFound from "../shared/pages/ErrorNotFound";
import { setHostContext } from "../redux/slices/hostContextSlice";
import { getUserPermissions } from "../services/UserSecurityService";
import LoadSpinner from "../shared/common-ui/LoadSpinner";
import StockMedicationsList from "../features/stock-medications/pages/StockMedicationsList";
import OrderPlatformConfiguration from "../features/facility/pages/OrderPlatformConfiguration";
import {
  resetCustomMedicationLibrarySession,
  resetCustomMedicationSession,
  resetFrequencyAdministrationSession,
  resetStockMedicationsSession,
} from "../helper/Utility";
import ScheduleList from "../features/frequency-administration/pages/ScheduleList";
import StockMedicationLibraryList from "../features/stock-medication-library/pages/StockMedicationLibraryList";
import AdministrationScheduleList from "../features/administration-schedule-list/pages/AdministrationScheduleList";
import { OrderPlatformConfigurationRouteEnum } from "../shared/enum/OrderPlatFormConfigurationEnum";
import { mockUserFacility } from "../helper/mockUserFacility";
import { getGlobalFacilityId, loadUnitsByFacilityId } from "../services/CustomerService";

type OrderProps = {
  hostContext: HostContext;
};

// This component is the root component of the MFE remote.
// All child-level navigation needed by the remote should be regigistered here.
const Order = ({ hostContext }: OrderProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isPermissionApiCalled, setIsPermissionApiCalled] = useState(false);
  const HostContextDispatcher = () => {
    useGainsight(hostContext);
    const dispatch = useDispatch();

    const setBasePathAndDispatchHostContext = (permissions: IPermission) => {
      const isStandalone = !!(!hostContext || hostContext.remoteMfeUrl === "");
      const basePath = isStandalone ? "" : "/cloud-orders";
      hostContext.permission = permissions;
      setIsPermissionApiCalled(true);
      dispatch(
        setHostContext({
          ...hostContext,
          basePath,
        })
      );
    };

    const fetchAndSetPermissions = async () => {
      const numericEctConfigId = Number(hostContext.ectConfigId);
      const numericUserId = Number(hostContext.userId);
      let userPermissions: IPermission = {
        customMedicationLibraryEdit: false,
        customMedicationLibraryInactivate: false,
        customMedicationDelete: false,
        facilitySetupEdit: false,
        stockMedicationListEdit: false,
        stockMedicationListCopy: false,
        stockMedicationListInactivate: false,
        frequencyAdministrationScheduleListEdit: false,
        frequencyAdministrationScheduleListCopy: false,
        frequencyAdministrationScheduleListInactivate: false,
      };
      if (
        !isPermissionApiCalled &&
        !isNaN(numericEctConfigId) &&
        !isNaN(numericUserId)
      ) {
        try {
          userPermissions = await getUserPermissions(
            numericEctConfigId,
            numericUserId
          );
          localStorage.setItem(
            "customMedicationLibraryAccess",
            JSON.stringify(userPermissions.customMedicationLibraryEdit)
          );
          setBasePathAndDispatchHostContext(userPermissions);
        } catch (error) {
          setBasePathAndDispatchHostContext(userPermissions);
        }
      }
    };

    // TO DO - Will remove comments & console.log after Testing this code on QA61
    const getAndSetGlobalFacilityId = (facilityId: number, ectConfigId: number) => {
      console.log("facilityId", facilityId);
      console.log("ectConfigId", ectConfigId);
      console.log("hostContext", hostContext);
      try {
        const isStandalone = !!(!hostContext || hostContext.remoteMfeUrl === "");
        const basePath = isStandalone ? "" : "/cloud-orders";
        const globalFacilityId = getGlobalFacilityId(facilityId, ectConfigId);
        console.log("getGlobalFacilityId Response", globalFacilityId);
        globalFacilityId.then((item) => {
          hostContext.globalFacilityId = item;
          dispatch(
            setHostContext({
              ...hostContext,
              basePath,
            })
          );
          getAndSetUnitId(item);
        });
      } catch (error) {
        console.log("getAndSetGlobalFacilityId error", error);
      }
    }

    // TO DO - Will remove comments & console.log after Testing this code on QA61
    const getAndSetUnitId = async (id: string) => {
      console.log("getAndSetUnitId Id", id);
      if (id) {
        try {
          const unitResponse = await loadUnitsByFacilityId(id);
          const unitInfo = unitResponse.find((x: any) => x.sourceUnitId === hostContext.unitId);
          console.log("getAndSetUnitId unitInfo", unitInfo);
          if (unitInfo) {
            hostContext.globalUnitId = unitInfo.id;
          } else {
            hostContext.globalUnitId = null;
          }
          dispatch(
            setHostContext({
              ...hostContext,
            })
          );
        } catch (error) {
          console.error("An error occurred during fetching Units data", error);
        }
      }
      console.log("getAndSetUnitId hostContext", hostContext);
    }

    useEffect(() => {
      getAndSetGlobalFacilityId(parseInt(hostContext.facilityId), parseInt(hostContext.ectConfigId));
      fetchAndSetPermissions().finally(() => {
        setIsLoading(false);
      });
    }, [hostContext]);

    return null;
  };

  // TODO: (BH) Check if lazy imports are needed. If so wrap in Suspense component.
  // TODO: (BH) Review code splitting and barrel imports.
  const routesElement = useRoutes([
    {
      index: true,
      element: <MedicationSearch />,
    },
    {
      path: "medication-search",
      element: <MedicationSearch />,
    },
    {
      path: "order-writer",
      element: <OrderWriter />,
    },
    {
      path: "custom-medications/:libraryId",
      element: <CustomMedicationList />,
    },
    {
      path: "/custom-medication-libraries",
      element: <CustomMedicationLibraryList currentTab="" />,
    },
    { path: "/add-custom-medication", element: <CustomMedication /> },
    {
      path: "/edit-custom-medication/:customMedicationId",
      element: <CustomMedication />,
    },
    {
      path: "facility-setup/:facilityId",
      element: <FacilitySetup userFacilityData={mockUserFacility} />,
    },
    {
      path: "facility-setup",
      element: <FacilityList currentTab="" />,
    },
    {
      path: "stock-medications",
      element: <StockMedicationsList />,
    },
    {
      path: "order-platform-configuration",
      element: <OrderPlatformConfiguration />,
      children: [
        {
          path: OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList,
          element: <FacilityList currentTab="" />,
        },
        {
          path: OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilitySetup,
          element: <FacilitySetup userFacilityData={mockUserFacility} />,
        },
        {
          path: OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationStockMedList,
          element: <StockMedicationLibraryList currentTab="" />,
        },
        {
          path: OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationCustomMedLibrary,
          element: <CustomMedicationLibraryList currentTab="" />,
        },
        {
          path: OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationAdministrationScheduleList,
          element: <AdministrationScheduleList />,
        },
      ],
    },
    { path: "/add-schedule", element: <AddSchedule /> },
    {
      path: "/edit-schedule/:administrationScheduleId",
      element: <AddSchedule />,
    },
    { path: "/schedule-list", element: <ScheduleList /> },
    { path: "*", element: <ErrorNotFound /> },
  ]);

  if (location.pathname !== "/cloud-orders/stock-medications") {
    resetStockMedicationsSession();
  }

  if (
    location.pathname !== "/cloud-orders/schedule-list" &&
    location.pathname !== "/cloud-orders/schedule-list/" &&
    location.pathname !== "/cloud-orders/add-schedule" &&
    !location.pathname.startsWith("/cloud-orders/edit-schedule/")
  ) {
    resetFrequencyAdministrationSession();
  }

  if (location.pathname === "/cloud-orders/custom-medication-libraries") {
    resetCustomMedicationSession();
  }

  if (location.pathname !== "/cloud-orders/custom-medication-libraries") {
    resetCustomMedicationLibrarySession();
  }

  return (
    <Provider store={store}>
      <HostContextDispatcher />
      {isLoading ? <LoadSpinner /> : routesElement}
    </Provider>
  );
};

export default Order;
