import React, { useCallback, useEffect, useState } from "react";
import { FacilitySetupMsgEnum } from "../../../shared/enum/FacilitySetupMsgEnum";
import { getFormularyList } from "../../../services/FormularyService";
import {
  saveFacilityLibrariesAsync,
  getFacilityConfigurationAsync,
  getCustomMedicationLibraryList,
} from "../../../services/CustomerService";
import {
  getModuleActivationStatus,
  toggleModuleActivation,
} from "../../../services/ModuleActivationService";
import SingleDropDown from "../../../shared/pages/SingleDropDown";
import { useNavigate, useLocation } from "react-router-dom";
import { OptionType } from "../../../shared/type/OptionType";
import ConfirmDialog from "../../../shared/pages/ConfirmDialog";
import LoadSpinner from "../../../shared/common-ui/LoadSpinner";
import { styles } from "../../../helper/UtilStyles";
import { ICustomMedicationLibrary } from "../../../models/interface/ICustomMedicationLibrary";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { AddNewStockMedicationLibrary } from "../../../services/StockMedicationLibraryService";
import {
  StockMedicationLibraryRequestDto,
  StockMedicationLibraryResponseDto,
} from "../../../models/class/StockMedicationLibrary";
import { AddNewAdministrationScheduleList } from "../../../services/AdministrationScheduleListService";
import {
  AdministrationScheduleListRequestDto,
  AdministrationScheduleListResponseDto,
} from "../../../models/class/AdministrationScheduleList";
import { OrderPlatformConfigurationRouteEnum } from "../../../shared/enum/OrderPlatFormConfigurationEnum";
import { IAdminstrationScheduleList } from "../../../models/interface/IAdminstrationScheduleList";
type FacilitySetupType = {
  userFacilityData: IUserFacility;
};
const FacilitySetup = (userFacility: FacilitySetupType) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const baseUrl = hostContext?.baseUrl;
  const basePath = hostContext.basePath;
  const selectedFacility: IUserFacility = userFacility?.userFacilityData;
  const isStandalone = state?.isStandalone;
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingHostContext, setIsLoadingHostContext] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModuleActive, setIsModuleActive] = useState<boolean>(false);
  const [initialModuleActive, setInitialModuleActive] =
    useState<boolean>(false);

  const [customMedicationLibraryList, setCustomMedicationLibraryList] =
    useState<ICustomMedicationLibrary[]>([]);
  const [formularyList, setFormularyList] = useState<IFormulary[]>([]);
  const [facilityData, setFacilityData] =
    useState<IUserFacility>(selectedFacility);
  const [facilityConfiguration, setFacilityConfiguration] =
    useState<IFacilityConfiguration>();
  const [
    selectedCustomMedicationLibraryId,
    setSelectedCustomMedicationLibraryId,
  ] = useState<OptionType>();
  const [selectedFormularyId, setSelectedFormularyId] = useState<OptionType>();
  const [stockMedicationId, setStockMedicationId] = useState<OptionType>();
  const [stockMedicationData, setStockMedicationData] = useState<any>();

  const [administrationScheduleData, setAdministrationScheduleData] = useState<
    IAdminstrationScheduleList[]
  >([]);
  const [administrationScheduleId, setAdministrationScheduleId] =
    useState<OptionType>();
  const [requestResponse, setRequestResponse] = useState({
    textMessage: "",
    alertClassName: "",
  });
  const [showApiResponseMsg, setShowApiResponseMsg] = useState(false);
  const [isChangedFieldNotSaved, setIsChangedFieldNotSaved] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSavedDisabled, setIsSavedDisabled] = useState(true);
  const [isDropdownSaveDisabled, setIsDropdownSaveDisabled] = useState(true);
  const [isModuleStatusSaveDisabled, setIsModuleStatusSaveDisabled] =
    useState(true);
  const [
    stockMedicationListEditPermission,
    setStockMedicationListEditPermission,
  ] = useState(false);
  const [facilitySetupEditPermission, setFacilitySetupEditPermission] =
    useState(false);
  const [isStockLibraryCreated, setIsStockLibraryCreated] = useState<boolean>();
  const [isAdministrationScheduleCreated, setIsAdministrationScheduleCreated] =
    useState<boolean>(false);
  const isCloudOrderWriterEnabled = hostContext?.isCloudOrderWriterEnabled;
  const [
    customMedicationLibraryEditPermission,
    setCustomMedicationLibraryEditPermission,
  ] = useState(false);
  const [
    frequencyAdministrationScheduleListEditPermission,
    setFrequencyAdministrationScheduleListEditPermission,
  ] = useState(false);

  window.setTimeout(() => {
    setIsLoading(isLoadingData || isLoadingHostContext);
  }, 1500);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [
          formularyData,
          moduleStatusResponse,
          customMedLibraryList,
          facilityConfig,
        ] = await Promise.all([
          getFormularyList(),
          getModuleActivationStatus(
            selectedFacility?.facilityId,
            "MULTICARE_ORDER_SRCH",
            baseUrl,
            selectedFacility.ectConfigId
          ),
          getCustomMedicationLibraryList(
            selectedFacility?.corporateId,
            selectedFacility?.ectConfigId
          ),
          selectedFacility?.facilityId
            ? getFacilityConfigurationAsync(
                selectedFacility.corporateId,
                selectedFacility.facilityId
              )
            : Promise.resolve(null),
        ]);

        setFormularyList(formularyData || []);
        setIsModuleActive(moduleStatusResponse.isModuleActive);
        setInitialModuleActive(moduleStatusResponse.isModuleActive);
        setCustomMedicationLibraryList(customMedLibraryList || []);
        setFacilityConfiguration(facilityConfig || null);
        setIsSavedDisabled(facilityConfig !== "");
        setIsStockLibraryCreated(facilityConfig?.isStockLibraryCreated);
        let header = " Stock Medication/Supply List";
        const stockMedicationLibraryList = [
          {
            description: selectedFacility?.facilityName + header,
            id: selectedFacility?.facilityId,
          },
        ];
        setStockMedicationData(stockMedicationLibraryList || []);
        setStockMedicationId({
          value: selectedFacility.facilityId,
          label: "",
        });
        setIsAdministrationScheduleCreated(
          facilityConfig?.isAdministrationScheduleListCreated
        );
        let header2 = " Administration Schedule List";
        const adminstrationScheduleList: IAdminstrationScheduleList[] = [
          {
            description: selectedFacility?.facilityName + header2,
            id: selectedFacility?.facilityId,
          },
        ];
        setAdministrationScheduleData(adminstrationScheduleList || []);
        setAdministrationScheduleId({
          value: selectedFacility.facilityId,
          label: "",
        });
      } catch (e) {
        console.error("An error occurred during initialization:", e);
      } finally {
        setIsLoadingData(false);
      }
    };

    initializeData();
  }, [selectedFacility]);

  useEffect(() => {
    setCustomMedicationLibraryEditPermission(
      hostContext.permission.customMedicationLibraryEdit ?? false
    );
    setFacilitySetupEditPermission(
      hostContext.permission.facilitySetupEdit ?? false
    );
    setStockMedicationListEditPermission(
      hostContext.permission.stockMedicationListEdit ?? false
    );
    setFrequencyAdministrationScheduleListEditPermission(
      hostContext.permission.frequencyAdministrationScheduleListEdit ?? false
    );
    setIsLoadingHostContext(false);
  }, [hostContext]);

  useEffect(() => {
    setSelectedFormularyId({
      value: facilityConfiguration?.formularyId,
      label: "",
    });
    setSelectedCustomMedicationLibraryId({
      value: facilityConfiguration?.customMedicationLibraryId,
      label: "",
    });
  }, [facilityConfiguration]);

  useEffect(() => {
    if (selectedCustomMedicationLibraryId) {
      updateCustomMedicationLibrarySelection();
      setIsLoadingData(false);
    }
  }, [selectedCustomMedicationLibraryId]);

  const updateCustomMedicationLibrarySelection = () => {
    const obj = customMedicationLibraryList.find(
      (x) => x.id === selectedCustomMedicationLibraryId?.value
    );

    let selectedLibraryObj: ICustomMedicationLibrarySelected = {
      Id: obj?.id,
      Description: obj?.description,
      IsActive: obj?.isActive,
      IsAssigned: obj?.isAssigned,
    };
    localStorage.setItem(
      "selectedLibraryDetails",
      JSON.stringify(selectedLibraryObj)
    );
  };

  const handleSaveClick = async () => {
    setIsLoadingData(true);

    if (isModuleActive !== initialModuleActive) {
      try {
        const response = await toggleModuleActivation(
          selectedFacility.facilityId,
          "MULTICARE_ORDER_SRCH",
          isModuleActive,
          baseUrl,
          selectedFacility.ectConfigId
        );
        setInitialModuleActive(response.isActive);
      } catch (error) {
        console.error("Error saving module activation", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    setRequestResponse({ textMessage: "", alertClassName: "" });
    let facilityConfiguration: IFacilityConfiguration = {
      facilityId: facilityData?.facilityId,
      customerId: facilityData?.corporateId,
      customMedicationLibraryId: selectedCustomMedicationLibraryId?.value,
      formularyId: selectedFormularyId?.value,
      ectConfigId: facilityData?.ectConfigId,
    };

    try {
      await saveFacilityLibrariesAsync(facilityConfiguration);
      setFacilityConfiguration((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            ...(selectedFormularyId?.value !== undefined && {
              formularyId: selectedFormularyId.value,
            }),
            ...(selectedCustomMedicationLibraryId?.value !== undefined && {
              customMedicationLibraryId:
                selectedCustomMedicationLibraryId.value,
            }),
          };
        }
      });
      setIsChangedFieldNotSaved(false);

      navigate(
        `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}`,
        {
          state: {
            textMessage: "Facility configuration saved successfully.",
            alertClassName: "alert alert-success floating",
          },
        }
      );
    } catch (_e) {
      navigate(
        `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}`,
        {
          state: {
            textMessage: "Error saving facility configuration.",
            alertClassName: "alert alert-danger",
          },
        }
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  const closeApiResponseMsg = () => {
    setShowApiResponseMsg(false);
  };

  const handleNavigation = () => {
    if (isChangedFieldNotSaved) {
      setShowConfirmModal(true);
    } else {
      navigate(
        `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}`,
        {
          state: {
            isFromFacilitySetup: "true",
          },
        }
      );
    }
  };

  const confirmOk = () => {
    setShowConfirmModal(false);
    navigate(
      `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}`,
      {
        state: {
          isFromFacilitySetup: "true",
        },
      }
    );
  };

  const confirmCancel = () => {
    setShowConfirmModal(false);
  };

  const handleDropDownChange = (
    id: OptionType,
    type: "customMed" | "formulary"
  ) => {
    if (type === "customMed") {
      if (
        ((id === null &&
          facilityConfiguration?.customMedicationLibraryId === null) ||
          facilityConfiguration?.customMedicationLibraryId === id?.value) &&
        ((selectedFormularyId === null &&
          facilityConfiguration?.customMedicationLibraryId === null) ||
          facilityConfiguration?.formularyId === selectedFormularyId?.value)
      ) {
        setIsDropdownSaveDisabled(true);
      } else {
        setIsDropdownSaveDisabled(false);
      }
      setSelectedCustomMedicationLibraryId(id);
    } else if (type === "formulary") {
      if (
        ((id === null && facilityConfiguration?.formularyId === null) ||
          facilityConfiguration?.formularyId === id?.value) &&
        ((selectedCustomMedicationLibraryId === null &&
          facilityConfiguration?.formularyId === null) ||
          facilityConfiguration?.customMedicationLibraryId ===
            selectedCustomMedicationLibraryId?.value)
      ) {
        setIsDropdownSaveDisabled(true);
      } else {
        setIsDropdownSaveDisabled(false);
      }
      setSelectedFormularyId(id);
    }
    if (facilityConfiguration === null && id === null) {
      setIsDropdownSaveDisabled(false);
    }
  };

  const showStockMedicationDropDown = () => {
    let staticStockHeader = " Stock Medication/Supply List";
    const stockMedicationDataList: StockMedicationLibraryRequestDto = {
      Description: selectedFacility?.facilityName + staticStockHeader,
      Id: 0,
      CorporationId: selectedFacility.corporateId,
      EctConfigId: selectedFacility.ectConfigId,
      SnfFacilityId: selectedFacility.facilityId,
    };
    saveStockMedicationLibrary(stockMedicationDataList);
  };

  // Handle the Save Library or Update Library
  const saveStockMedicationLibrary = useCallback(
    async (stockMedicationLibraryRequest: StockMedicationLibraryRequestDto) => {
      await AddNewStockMedicationLibrary(stockMedicationLibraryRequest).then(
        async (response: StockMedicationLibraryResponseDto) => {
          setIsStockLibraryCreated(response.isStockLibraryCreated);
        }
      );
    },
    []
  );

  const showAdministrationScheduleDropDown = () => {
    let staticAdministrationHeader = " Administration Schedule List";
    const administrationScheduleDataList: AdministrationScheduleListRequestDto =
      {
        Description:
          selectedFacility?.facilityName + staticAdministrationHeader,
        Id: 0,
        CorporationId: selectedFacility.corporateId,
        EctConfigId: selectedFacility.ectConfigId,
        SnfFacilityId: selectedFacility.facilityId,
      };
    saveAdministrationScheduleList(administrationScheduleDataList);
  };

  // Handle the Save Library or Update Library
  const saveAdministrationScheduleList = useCallback(
    async (
      AdministrationScheduleListRequest: AdministrationScheduleListRequestDto
    ) => {
      await AddNewAdministrationScheduleList(
        AdministrationScheduleListRequest
      ).then(async (response: AdministrationScheduleListResponseDto) => {
        setIsAdministrationScheduleCreated(
          response.isAdministrationScheduleListCreated
        );
      });
    },
    []
  );

  useEffect(() => {
    let hasChanged = false;
    if (
      selectedCustomMedicationLibraryId?.value !==
        facilityConfiguration?.customMedicationLibraryId ||
      selectedFormularyId?.value !== facilityConfiguration?.formularyId
    ) {
      hasChanged = true;
    }

    setIsChangedFieldNotSaved(hasChanged);
  }, [
    selectedCustomMedicationLibraryId,
    selectedFormularyId,
    facilityConfiguration,
  ]);

  // navigate to Custom Medications List/summary page
  const navigateToCustomMedications = (id: number | undefined | null) => {
    if (id == null) {
      return;
    }
    const obj = customMedicationLibraryList.find((x) => x.id === id);
    let selectedLibraryObj: ICustomMedicationLibrary = {
      id: obj?.id!,
      description: obj?.description!,
      isActive: obj?.isActive!,
      isAssigned: 0,
      corporationId: obj?.corporationId ? obj?.corporationId : 0,
    };
    // Store selected library details in sessionStorage
    sessionStorage.setItem(
      "selectedLibraryDetails",
      JSON.stringify(selectedLibraryObj)
    );

    // Store the navigatedFromFacilitySetup flag in sessionStorage
    sessionStorage.setItem(
      "navigatedFromFacilitySetupToCustomMedications",
      "true"
    );
    sessionStorage.setItem(
      "selectedFacility",
      JSON.stringify(selectedFacility)
    );

    navigate(`${basePath}/custom-medications/${id}`);
  };

  const navigateToCustomMedicationLibraryList = () => {
    sessionStorage.setItem(
      "navigatedFromFacilitySetupToCustomMedicationLibraryList",
      "true"
    );
    sessionStorage.setItem(
      "selectedFacility",
      JSON.stringify(selectedFacility)
    );

    navigate(
      `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationCustomMedLibrary}`,
      {
        state: {
          isredirectToCustomMedLibrary: "true",
        },
      }
    );
  };

  // navigate to Stock Medications List/summary page
  const navigateToStockMedicationSupplyList = (
    id: number | undefined | null
  ) => {
    if (id == null) {
      return;
    }
    sessionStorage.setItem(
      "navigatedFromFacilitySetupToStockMedication",
      "true"
    );
    sessionStorage.setItem(
      "selectedFacilityForStockMed",
      JSON.stringify(selectedFacility)
    );

    navigate(`${basePath}/stock-medications`);
  };

  // navigate to AdministrationScheduleList page
  const navigateToAdministrationScheduleList = (
    id: number | undefined | null
  ) => {
    if (id == null) {
      return;
    }
    sessionStorage.setItem(
      "navigatedFromFacilitySetupToAdministrationScheduleList",
      "true"
    );
    sessionStorage.setItem(
      "selectedFacilityForAdministrationScheduleList",
      JSON.stringify(selectedFacility)
    );

    navigate(`${basePath}/schedule-list`);
  };

  const AdministrationScheduleList = () => {
    if (isCloudOrderWriterEnabled && isAdministrationScheduleCreated) {
      return (
        <SingleDropDown
          id="AdministrationScheduleList"
          dataFieldId="id"
          dataFieldValue="description"
          placeholder="Search query here"
          datafile={administrationScheduleData}
          isSearchable={true}
          icon={null}
          value={administrationScheduleId}
          isDisabled={true}
          selectLabelText="Administration Schedule List"
        />
      );
    } else if (isCloudOrderWriterEnabled) {
      return (
        <div className="form-group">
          <label htmlFor="AdministrationScheduleListHidden">
            Administration Schedule List
          </label>
          <input
            id="AdministrationScheduleListHidden"
            className="visually-hidden"
          />
          {frequencyAdministrationScheduleListEditPermission && (
            <div>
              <button
                type="button"
                data-testid="btnAddNewScheduleList"
                className="btn btn-primary"
                onClick={showAdministrationScheduleDropDown}
              >
                Create New List
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return <></>;
    }
  };

  const handleModuleToggle = () => {
    setIsModuleActive(!isModuleActive);
  };

  useEffect(() => {
    const hasModuleStatusChanged = isModuleActive !== initialModuleActive;
    setIsModuleStatusSaveDisabled(!hasModuleStatusChanged);
  }, [isModuleActive, initialModuleActive]);

  useEffect(() => {
    // Disable the save button only if both dropdown and module status indicate no changes
    setIsSavedDisabled(isDropdownSaveDisabled && isModuleStatusSaveDisabled);
  }, [isDropdownSaveDisabled, isModuleStatusSaveDisabled]);

  useEffect(() => {
    if (selectedCustomMedicationLibraryId?.value == null) {
      setIsModuleActive(false);
    }
  }, [selectedCustomMedicationLibraryId]);

  if (!facilitySetupEditPermission && !isLoading) {
    return (
      <div>
        <h1>MultiCare Platform</h1>
        <div className="alert alert-danger" role="alert">
          <div className="alert-message-container">
            You do not have permission(s)/security token(s) to perform this
            action. If you need to perform this task, please contact your Unit
            Supervisor or System Administrator to grant you the necessary
            permission(s)/security token(s)
            <br />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {showApiResponseMsg &&
        requestResponse.alertClassName &&
        requestResponse.textMessage ? (
          <div
            className={`mb-0 alert alert-success floating alert-position`}
            role="alert"
          >
            <i
              id="btnCloseApiRespMsg"
              data-testid="alert-api-resposne-msg"
              className="alert-close"
              aria-hidden="true"
              onClick={closeApiResponseMsg}
            ></i>
            {requestResponse.textMessage}
          </div>
        ) : (
          <></>
        )}
      </div>
      {isLoading ? (
        <LoadSpinner />
      ) : (
        <>
          <div className="row">
            <div className="col-12 mt-3">
              <h2>
                {" "}
                <b>{facilityData?.facilityName}</b>
              </h2>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                handleSaveClick();
              }}
              data-testid="saveBtn"
              disabled={isSavedDisabled}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => {
                handleNavigation();
              }}
              data-testid="cancelBtn"
            >
              Cancel
            </button>
          </div>
          <hr />

          <div className="row">
            <div className="col-4">{AdministrationScheduleList()}</div>
            {frequencyAdministrationScheduleListEditPermission && (
              <div
                className="col-1 dropdown"
                style={!isStandalone ? styles.marginTop_minus12 : undefined}
              >
                {isAdministrationScheduleCreated && (
                  <button
                    className="btn btn-default dropdown-toggle facility-dropdown-toggle"
                    id="dropdownMenuButtonAdmin"
                    data-testid="dropdownMenuButtonAdmin"
                    type="button"
                    data-toggle="dropdown"
                  >
                    View
                  </button>
                )}
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButtonAdmin"
                >
                  <button
                    data-testid="btnCurrentAdminSelectedList"
                    className="dropdown-item"
                    onClick={() => navigateToAdministrationScheduleList(1)}
                    onKeyDown={() => navigateToAdministrationScheduleList(1)}
                  >
                    Current Selected List
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="row">
            <div className="col-4">
              <SingleDropDown
                id="CustomMedicationLibrary"
                dataFieldId="id"
                dataFieldValue="description"
                datafile={customMedicationLibraryList}
                isSearchable={true}
                placeholder="Search query here"
                isNoneOptionIsRequired={true}
                selectLabelText="Custom Medication Library"
                icon={
                  <i
                    style={{ color: "#1890ff" }}
                    className="fa-regular fa-link ml-1"
                  ></i>
                }
                value={selectedCustomMedicationLibraryId}
                onChange={(id) => handleDropDownChange(id, "customMed")}
              />
              <p className="mb-3">
                {" "}
                <i
                  className="fa-solid fa-circle-info mr-2"
                  style={{ color: "#007bff" }}
                ></i>
                {`Manage medications that are not commercially available, rather
                compounded and provided by your pharmacy.`}
              </p>
            </div>
            <div
              className="col-1 dropdown"
              style={!isStandalone ? styles.marginTop_minus12 : undefined}
            >
              {customMedicationLibraryEditPermission && (
                <button
                  className="btn btn-default dropdown-toggle facility-dropdown-toggle"
                  id="dropdownMenuButton"
                  type="button"
                  data-toggle="dropdown"
                >
                  View
                </button>
              )}
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {selectedCustomMedicationLibraryId?.value && (
                  <button
                    data-testid="btnCurrentSelectedLibrary"
                    className="dropdown-item"
                    onClick={() =>
                      navigateToCustomMedications(
                        selectedCustomMedicationLibraryId?.value
                      )
                    }
                    onKeyDown={() =>
                      navigateToCustomMedications(
                        selectedCustomMedicationLibraryId?.value
                      )
                    }
                  >
                    Current Selected Library
                  </button>
                )}
                <button
                  data-testid="btnCustomMedicationLibraryList"
                  className="dropdown-item"
                  onClick={() => navigateToCustomMedicationLibraryList()}
                  onKeyDown={() => navigateToCustomMedicationLibraryList()}
                >
                  Custom Medication Library List
                </button>
              </div>
            </div>
          </div>
          <div className="row col-md-12 mb-2">
            <div className="col-md-8">
              <div className="form-check">
                <input
                  className="form-check-input"
                  id="enhancedOrderSearchCheckbox"
                  data-testid="enhancedOrderSearchToggle"
                  type="checkbox"
                  checked={isModuleActive}
                  onChange={handleModuleToggle}
                  disabled={selectedCustomMedicationLibraryId?.value == null}
                />
                <label
                  className="form-check-label"
                  id="enhancedOrderSearchlabel"
                  htmlFor="enhancedOrderSearchCheckbox"
                >
                  Enable Enhanced Order Search
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <SingleDropDown
                id="FormularyLibrary"
                dataFieldId="id"
                dataFieldValue="description"
                placeholder="Search query here"
                datafile={formularyList}
                isSearchable={true}
                isNoneOptionIsRequired={true}
                selectLabelText="Formulary Library"
                icon={null}
                value={selectedFormularyId}
                onChange={(id) => handleDropDownChange(id, "formulary")}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              {isStockLibraryCreated ? (
                <SingleDropDown
                  id="StockMedicationList"
                  dataFieldId="id"
                  dataFieldValue="description"
                  placeholder="Search query here"
                  datafile={stockMedicationData}
                  isSearchable={true}
                  icon={null}
                  value={stockMedicationId}
                  isDisabled={true}
                  selectLabelText="Stock Medication/Supply List"
                />
              ) : (
                <div className="form-group">
                  <label htmlFor="StockMedicationListHidden">
                    Stock Medication/Supply List
                  </label>
                  <input
                    id="StockMedicationListHidden"
                    className="visually-hidden"
                  />
                  {stockMedicationListEditPermission && (
                    <div>
                      <button
                        type="button"
                        data-testid="btnAddNewList"
                        className="btn btn-primary"
                        onClick={showStockMedicationDropDown}
                      >
                        Create New List
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {stockMedicationListEditPermission && (
              <div
                className="col-1 dropdown"
                style={!isStandalone ? styles.marginTop_minus12 : undefined}
              >
                {isStockLibraryCreated && (
                  <button
                    className="btn btn-default dropdown-toggle facility-dropdown-toggle"
                    id="dropdownMenuButton"
                    type="button"
                    data-toggle="dropdown"
                  >
                    View
                  </button>
                )}
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <button
                    data-testid="btnCurrentSelectedList"
                    className="dropdown-item"
                    onClick={() => navigateToStockMedicationSupplyList(1)}
                    onKeyDown={() => navigateToStockMedicationSupplyList(1)}
                  >
                    Current Selected List
                  </button>
                </div>
              </div>
            )}
          </div>

          <ConfirmDialog
            data-testid="confirmDialog"
            showConfirmModal={showConfirmModal}
            iconClass={FacilitySetupMsgEnum.FacilitySetupDialogIcon}
            title={FacilitySetupMsgEnum.FacilitySetupDialogTitle}
            messageTitle={
              FacilitySetupMsgEnum.FacilitySetupConfirmDialogMessageTitle
            }
            messageContent={
              FacilitySetupMsgEnum.FacilitySetupConfirmDialogMessageContent
            }
            confirmButtonText={
              FacilitySetupMsgEnum.FacilitySetupConfirmDialogConfirmButtonText
            }
            cancelButtonText={
              FacilitySetupMsgEnum.FacilitySetupConfirmDialogCancelButtonText
            }
            confirmOk={confirmOk}
            confirmCancel={confirmCancel}
          ></ConfirmDialog>
        </>
      )}
    </div>
  );
};

export default FacilitySetup;
