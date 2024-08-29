import React, { useEffect, useState } from "react";
import FacilityList from "./FacilityList";
import CustomMedicationLibraryList from "../../custom-medication-library/pages/CustomMedicationLibraryList";
import { Link, useLocation } from "react-router-dom";
import StockMedicationLibraryList from "../../stock-medication-library/pages/StockMedicationLibraryList";
import AdministrationScheduleList from "../../administration-schedule-list/pages/AdministrationScheduleList";
import { OrderPlatformConfigurationRouteEnum } from "../../../shared/enum/OrderPlatFormConfigurationEnum";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import FacilitySetup from "./FacilitySetup";

const OrderPlatformConfiguration = () => {
  const { state } = useLocation();
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const [showApiResponseMsg, setShowApiResponseMsg] = useState(false);
  const [isShowFacilityList, setIsShowFacilityList] = useState(true);
  const [userFacility, setUserFacility] = useState<IUserFacility>();
  const [horizontalActiveTab, setHorizontalActiveTab] =
    useState("horizontalTab1");
  const [verticalActiveTab, setVerticalActiveTab] = useState("verticalTab1");
  const [customMedAccess, setCustomMedAccess] = useState("true");
  const [isCustomMed, setIsCustomMed] = useState(false);
  const [isAdminSchedule, setIsAdminSchedule] = useState(false);
  const [isStockMed, setIsStockMed] = useState(false);

  const isCloudOrderWriterEnabled = hostContext?.isCloudOrderWriterEnabled;
  const handleHorizontalTab = (selectedTab: number) => {
    const administrationScheduleListCreated = sessionStorage.getItem(
      "AdministrationScheduleListCreated"
    );

    switch (selectedTab) {
      case 1:
        setHorizontalActiveTab("horizontalTab1");
        setIsAdminSchedule(false);
        break;
      case 2:
        setHorizontalActiveTab("horizontalTab2");
        setIsShowFacilityList(true);
        if (isCloudOrderWriterEnabled) {
          handleVerticalTab(1);
        } else {
          handleVerticalTab(2);
        }
        break;
    }
  };

  const AccessBasedRouting = () => {
    if (isCloudOrderWriterEnabled) {
      return OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationAdministrationScheduleList;
    } else {
      return OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationCustomMedLibrary;
    }
  };

  const handleVerticalTab = (selectedTab: number) => {
    switch (selectedTab) {
      case 1:
        setVerticalActiveTab("verticalTab1");
        setIsCustomMed(false);
        setIsAdminSchedule(true);
        setIsStockMed(false);
        break;

      case 2:
        setVerticalActiveTab("verticalTab2");
        setIsAdminSchedule(false);
        setIsCustomMed(true);
        setIsStockMed(false);
        break;

      case 3:
        setVerticalActiveTab("verticalTab3");
        setIsStockMed(true);
        setIsCustomMed(false);
        setIsAdminSchedule(false);
        break;
    }
  };

  useEffect(() => {
    if (state?.textMessage) {
      setIsShowFacilityList(true);
      setShowApiResponseMsg(true);
      setTimeout(() => {
        setShowApiResponseMsg(false);
      }, 5000);
    }
    if (state?.isFromFacilitySetup) {
      setIsShowFacilityList(true);
    }
    if (state?.isFromCustomMedicationList) {
      handleHorizontalTab(2);
    }
    if (state?.isFromCustomMedicationLibrary) {
      const facility = JSON.parse(state?.isFromCustomMedicationLibrary);
      setUserFacility(facility);
      setIsShowFacilityList(false);
    }
    if (state?.isFromFacilityList) {
      const facility = JSON.parse(state?.isFromFacilityList);
      setUserFacility(facility);
      setIsShowFacilityList(false);
    }
    if (state?.isFromStockMedicationList) {
      setCustomMedAccess("false");
      handleVerticalTab(2);
    }
    if (state?.isredirectToCustomMedLibrary) {
      setCustomMedAccess("true");
      handleHorizontalTab(2);
      handleVerticalTab(2);
    }
    if (state?.isFromAdministrationScheduleList) {
      setCustomMedAccess("false");
      handleVerticalTab(1);
    } else {
      setShowApiResponseMsg(false);
    }
  }, [state]);

  useEffect(() => {
    const customMedicationLibraryAccess = localStorage?.getItem(
      "customMedicationLibraryAccess"
    );
    if (customMedicationLibraryAccess) {
      setCustomMedAccess(customMedicationLibraryAccess);
    }
    let currentPath = window?.location?.href;
    if (currentPath?.includes("order-platform-setup")) {
      handleHorizontalTab(2);
    }
    if (currentPath?.includes("custom-medication-library")) {
      handleVerticalTab(2);
    }
    if (currentPath?.includes("stock-medication-list")) {
      handleVerticalTab(3);
    }
    if (currentPath?.includes("administration-schedule-list")) {
      handleVerticalTab(1);
    }
    if (currentPath?.includes("facility-setup")) {
      handleHorizontalTab(1);
    }
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 mt-3">
          <h1>Order Platform Configuration</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="nav-tabs-wrapper nav-tabs-bordered">
            <ul className="nav nav-tabs" id="myTabs" data-testid="myTabs">
              <li className="nav-item">
                {isShowFacilityList ? (
                  <Link
                    to={`/cloud-orders${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}`}
                    className={
                      horizontalActiveTab === "horizontalTab1"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    onClick={() => handleHorizontalTab(1)}
                    id="horizontalTab1"
                    data-testid="horizontalTab1"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="tab1content"
                    aria-selected="true"
                  >
                    Facility Setup
                  </Link>
                ) : (
                  <Link
                    to={`/cloud-orders${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}/${userFacility?.facilityId}`}
                    className={
                      horizontalActiveTab === "horizontalTab1"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    onClick={() => handleHorizontalTab(1)}
                    id="horizontalTab1"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="tab1content"
                    aria-selected="true"
                  >
                    Facility Setup
                  </Link>
                )}
              </li>
              <li className="nav-item">
                <Link
                  to={`/cloud-orders${AccessBasedRouting()}`}
                  className={
                    horizontalActiveTab === "horizontalTab2"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  onClick={() => handleHorizontalTab(2)}
                  id="horizontalTab2"
                  data-testid="horizontalTab2"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="tab2content"
                  aria-selected="false"
                >
                  Order Platform Setup
                </Link>
              </li>
            </ul>
            <div className="tab-content" id="navTabContent">
              <div
                className={
                  horizontalActiveTab === "horizontalTab1"
                    ? "tab-pane fade show active"
                    : "tab-pane fade"
                }
                id="tab1content"
                role="tabpanel"
                aria-labelledby="horizontalTab1"
              >
                {isShowFacilityList ? (
                  <FacilityList
                    //sendToParent={getChildDataFacility}
                    currentTab={horizontalActiveTab}
                  />
                ) : (
                  <FacilitySetup
                    userFacilityData={userFacility!}
                    //sendToParent={getChildDataFacility}
                  />
                )}
              </div>
              <div
                className={
                  horizontalActiveTab === "horizontalTab2"
                    ? "tab-pane fade show active"
                    : "tab-pane fade"
                }
                id="tab2content"
                role="tabpanel"
                aria-labelledby="horizontalTab2"
              >
                <div className="row">
                  <div className="col-12 mt-3">
                    <h2>Order Platform Setup</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="nav-tabs-bordered">
                      <div className="row">
                        <div className="col-md-2 col-sm-12">
                          <div className="nav-tabs-wrapper">
                            <ul className="nav nav-tabs tabs-left">
                              {isCloudOrderWriterEnabled ? (
                                <li className="nav-item">
                                  <Link
                                    to={`/cloud-orders${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationAdministrationScheduleList}`}
                                    className={
                                      verticalActiveTab === "verticalTab1"
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                    onClick={() => handleVerticalTab(1)}
                                    id="verticalTab1"
                                    data-testid="administrationScheduleListTab"
                                    data-toggle="tab"
                                    role="tab"
                                    aria-controls="lefttab1content"
                                    aria-selected="true"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Administration Schedule List
                                  </Link>
                                </li>
                              ) : (
                                <></>
                              )}
                              <li className="nav-item">
                                <Link
                                  to={`/cloud-orders${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationCustomMedLibrary}`}
                                  className={
                                    verticalActiveTab === "verticalTab2"
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                  onClick={() => handleVerticalTab(2)}
                                  id="verticalTab2"
                                  data-testid="customMedicationLibraryTab"
                                  data-toggle="tab"
                                  role="tab"
                                  aria-controls="lefttab2content"
                                  aria-selected="true"
                                  style={{ fontWeight: "bold" }}
                                >
                                  Custom Medication Library
                                </Link>
                              </li>

                              <li className="nav-item">
                                <Link
                                  to={`/cloud-orders${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationStockMedList}`}
                                  className={
                                    verticalActiveTab === "verticalTab3"
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                  onClick={() => handleVerticalTab(3)}
                                  id="verticalTab3"
                                  data-testid="stockMedicationListTab"
                                  data-toggle="tab"
                                  role="tab"
                                  aria-controls="lefttab3content"
                                  aria-selected="true"
                                  style={{ fontWeight: "bold" }}
                                >
                                  Stock Medication List
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-10  col-sm-12 left-tab-content-wrapper">
                          <div className="tab-content">
                            {isAdminSchedule ? (
                              <div
                                className={
                                  verticalActiveTab === "verticalTab1"
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                                id="verticalTab1"
                                role="tabpanel"
                                aria-labelledby="verticalTab1"
                              >
                                <AdministrationScheduleList />
                              </div>
                            ) : (
                              <></>
                            )}
                            {isCustomMed && !isAdminSchedule ? (
                              <div
                                className={
                                  verticalActiveTab === "verticalTab2"
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                                id="verticalTab2"
                                role="tabpanel"
                                aria-labelledby="verticalTab2"
                              >
                                <CustomMedicationLibraryList
                                  currentTab={verticalActiveTab}
                                />
                              </div>
                            ) : (
                              <></>
                            )}
                            {isStockMed ? (
                              <div
                                className={
                                  verticalActiveTab === "verticalTab3"
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                                id="verticalTab3"
                                role="tabpanel"
                                aria-labelledby="verticalTab3"
                              >
                                <StockMedicationLibraryList
                                  currentTab={verticalActiveTab}
                                />
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlatformConfiguration;
