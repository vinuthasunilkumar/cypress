import React, { useState, useCallback, useEffect } from "react";
import LoadSpinner from "../../../shared/common-ui/LoadSpinner";
import Paging from "../../../shared/pages/Pagination";
import DrugInformation from "./DrugInformation";
import {
  searchMedication,
  getPatientSafetyAlerts,
} from "./../../../services/MedicationService";
import {
  getFacilityConfigurationAsync,
  getCustomMedicationLibraryList,
  loadUnitsByFacilityId,
} from "../../../services/CustomerService";
import { getFormularyInfoByFormularyId } from "../../../services/FormularyService";
import { FormularyStatus } from "../../../shared/enum/FormularyStatus";
import { useNavigate } from "react-router-dom";
import {
  formularyIcon,
  sortDurAlertArray,
  renderDurIcon,
  renderIconCustomMeds,
  createCustomMedicationUrl,
  createPrescriptionOrderUrl,
  createGenericMedicationUrl,
} from "../../../helper/Utils";
import { ICustomMedicationLibrary } from "../../../models/interface/ICustomMedicationLibrary";
import { styles } from "../../../helper/UtilStyles";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { updateBannerZIndex } from "../../../helper/Utility";

const MedicationSearch = () => {
  const navigate = useNavigate();

  const hostContext = useSelector((state: RootState) => state.hostContext);
  const [order, setOrder] = useState({
    search: "",
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showPagination, setShowPagination] = useState(false);
  const [medicationList, setMedicationList] = useState<
    IMedicationSearchResults[]
  >([]);
  const customerId = Number(hostContext?.parentId ?? 0);
  const facilityId = Number(hostContext?.facilityId ?? 0);
  const baseUrl = hostContext?.baseUrl;
  const basePath = hostContext.basePath;
  const residentId = hostContext?.residentId;
  const strippedBaseUrl = baseUrl?.replace(/^https?:\/\//, "");
  const ectConfigId = hostContext?.ectConfigId;
  const providerId = hostContext?.urlParameters?.providerId;
  const eventId = hostContext?.urlParameters?.eventId;
  const isPendingOrder = hostContext?.urlParameters?.isPendingOrder ?? "false";
  const isDischargeOrder =
    hostContext?.urlParameters?.isDischargeOrder ?? "false";
  const prescriberId = hostContext?.urlParameters?.prescriberId ?? "0";
  const [activeMedicationId, setActiveMedicationId] = useState(0);
  const defaultFacilityConfig: IFacilityConfiguration = {
    facilityId: 0,
    customerId: 0,
    formularyId: 0,
    customMedicationLibraryId: null,
    ectConfigId: 0,
  };
  const [facilityConfiguration, setFacilityConfiguration] =
    useState<IFacilityConfiguration>(defaultFacilityConfig);
  const [isMedicationSearchLoading, setIsMedicationSearchLoading] =
    useState(false);
  const [remountComponent, setRemountComponent] = useState(0);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [showObsoleteMedErrorMsg, setShowObsoleteMedErrorMsg] = useState(false);
  const [showCustomMedErrorMsg, setShowCustomMedErrorMsg] = useState(false);
  const isCloudMedOrderWriterEnabled =
    hostContext?.isCloudMedOrderWriterEnabled;
  const [formularyList, setFormularyList] =
    useState<IFormularySearchDataResponseDto>();
  const [customMedLibrary, setCustomMedLibrary] =
    useState<ICustomMedicationLibrary>();

  useEffect(() => {
    updateBannerZIndex();
  }, []);

  const getErrorResponse = (error: any) => {
    if (error.response) {
      if (error.response.status === 404) {
        console.error("Formulary information not found.");
      } else if (error.response.status === 400) {
        console.error("Bad request for formulary information.");
      } else {
        console.error(`Error: ${error.response.statusText}`);
      }
    } else {
      console.error(
        "An error occurred during fetching formulary information",
        error
      );
    }
  };

  useEffect(() => {
    const fetchFacilityData = async () => {
      if (customerId > 0 && facilityId > 0) {
        try {
          const facilityConfiguration = await getFacilityConfigurationAsync(
            customerId,
            facilityId
          );
          if (facilityConfiguration) {
            setFacilityConfiguration(facilityConfiguration);
            fetchFormularyInfo(facilityConfiguration.formularyId);
            fetchCustomMedLibrary(facilityConfiguration.customMedicationLibraryId);
            setIsLoadingData(false);
          }

        } catch (error) {
          console.error("An error occurred during fetching data", error);
        }
      } else {
        setIsLoadingData(false);
      }
    };
    fetchFacilityData();
  }, [customerId, facilityId]);

  const fetchFormularyInfo = async (formularyId: number | undefined) => {
    if (formularyId && formularyId > 0) {
      try {
        const formularyInfo = await getFormularyInfoByFormularyId(formularyId, "");
        setFormularyList(formularyInfo);
      } catch (error: any) {
        getErrorResponse(error);
      }
    }
  };

  const fetchCustomMedLibrary = async (customMedicationLibraryId: number | undefined) => {
    try {
      const customMedLibraryList = await getCustomMedicationLibraryList(
        customerId,
        Number(ectConfigId)
      );
      const configurationCustomMedLibrary = customMedLibraryList.find(
        (library: { id: number }) => library.id === customMedicationLibraryId
      );
      setCustomMedLibrary(configurationCustomMedLibrary);
    } catch (error) {
      console.error("Failed to fetch custom medication library", error);
    }
  };

  const [pagination, setPagination] = useState({
    countPerPage: 20,
    pageNumber: 1,
    totalCount: 0,
    totalPages: 0,
  });

  const medicationModelMapping = async (
    responseJSON: IMedicationSearchResultsDto
  ) => {
    if (responseJSON.items && responseJSON.items.length > 0) {
      const medicationIds = responseJSON.items.map((item) => item.id);
      const durAlerts = await fetchDurAlerts(medicationIds);

      responseJSON.items.forEach((medication) => {
        medication.alerts = durAlerts.filter(
          (alert: IPatientSafetySummary) => alert.target_MedID === medication.id
        );
      });

      setMedicationList(responseJSON.items);
      pagination.countPerPage = responseJSON.pageLength;
      pagination.pageNumber = responseJSON.pageNumber;
      if (
        responseJSON.moreResultsExist &&
        !responseJSON.totalPages &&
        !responseJSON.totalRows
      ) {
        pagination.totalCount = responseJSON.totalRows;
        pagination.totalPages = 2;
      } else {
        pagination.totalCount = responseJSON.totalRows;
        pagination.totalPages = responseJSON.totalPages;
      }
      setPagination(pagination);
      if (responseJSON?.items?.length > 0 && pagination.totalPages > 1) {
        setShowPagination(true);
      }
      if (formularyList) {
        setFormularyListByStatus(responseJSON, formularyList);
      }
    } else {
      setMedicationList([]);
    }
  };
  const findMedication = useCallback(
    async (pageNumber: number) => {
      let pageNum = pageNumber;

      searchMedication(
        pageNum,
        order.search,
        residentId,
        strippedBaseUrl,
        ectConfigId,
        pagination.countPerPage,
        facilityConfiguration?.customMedicationLibraryId,
        true,
        hostContext.globalFacilityId,
        hostContext.globalUnitId
      )
        .then(async (response: IMedicationSearchResultsDto) => {
          const responseJSON = response;
          if (responseJSON !== null)
            medicationModelMapping(responseJSON);
          else
            setMedicationList([]);
        })
        .catch((_e) => {
          setMedicationList([]);
          console.log("An error occurred during fetching medications details");
          setIsMedicationSearchLoading(false);
        })
        .finally(() => {
          setIsMedicationSearchLoading(false);
        });
      setRemountComponent(Math.random());
    },
    [pagination, order.search, isLoadingData]
  );

  const setFormularyListByStatus = (
    responseJSON: IMedicationSearchResultsDto,
    formularyList: IFormularySearchDataResponseDto
  ) => {
    responseJSON.items.forEach((medication: IMedicationSearchResults) => {
      let dur = formularyList.drugs?.filter(
        (drug: IDrugsResponse) => drug.medId === medication.id
      );
      if (dur && dur.length > 0) {
        medication.formularyStatus = FormularyStatus[dur[0].status];
      } else {
        medication.formularyStatus =
          FormularyStatus[formularyList.defaultGenericFormularyStatus];
      }
    });
  };

  const fetchDurAlerts = async (medicationIds: number[]) => {
    const targetMedString = medicationIds.join("_");
    try {
      const durAlerts = await getPatientSafetyAlerts(
        targetMedString,
        strippedBaseUrl,
        ectConfigId,
        residentId
      );
      return durAlerts.patientSafetyAlertsV1Dto?.alerts || [];
    } catch (error) {
      console.log("Error fetching DUR alerts", error);
      return [];
    }
  };

  const handlePageClick = (page: number) => {
    setIsMedicationSearchLoading(true);
    pagination.pageNumber = page;
    setPagination(pagination);
    if (medicationList?.length > 0 && pagination.totalPages > 1) {
      setShowPagination(true);
    }
    findMedication(pagination.pageNumber);
  };

  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceTimer !== null) clearTimeout(debounceTimer);

    const newTimer = window.setTimeout(() => {
      if (event.target.value.length >= 2) {
        setIsMedicationSearchLoading(true);
        const { name, value } = event.target;
        if (name === "search") {
          order.search = value;
        }
        setOrder(order);
        pagination.pageNumber = 1;
        setPagination(pagination);
        findMedication(1);
      } else {
        setIsMedicationSearchLoading(false);
        setMedicationList([]);
      }
    }, 300);
    setDebounceTimer(newTimer);

    setPagination({
      countPerPage: 20,
      pageNumber: 1,
      totalCount: 0,
      totalPages: 0,
    });
    setRemountComponent(Math.random());
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const cancelSearch = () => {
    if (baseUrl) {
      let targetUrl = `${baseUrl}/Zion?zionpagealias=ADHOCORDER`;

      if (isPendingOrder === "true") {
        targetUrl += "&isPendingOrder=true";
      }
      if (isDischargeOrder === "true") {
        targetUrl = `${baseUrl}/OrdersDischargeList.do`;
      }

      window.location.href = targetUrl;
    }
  };

  const hideOverlay = () => {
    setIsMenuActive(!isMenuActive);
    document.body.style.overflow = "visible";
  };

  const handleInfoButtonClick = (medicationId: number, event: any) => {
    if (event.key === "Enter" || event.key === undefined) {
      setActiveMedicationId(medicationId);
      setIsMenuActive(true);
      document.body.style.overflow = "hidden";
    } else {
      return;
    }
  };

  const showObsoleteMedicationErrorMessage = () => {
    setShowObsoleteMedErrorMsg(true);
  };

  const closeObsoleteMedErrorMsg = () => {
    setShowObsoleteMedErrorMsg(false);
  };

  const showCustomMedicationErrorMessage = () => {
    setShowCustomMedErrorMsg(true);
  };

  const closeCustomMedErrorMsg = () => {
    setShowCustomMedErrorMsg(false);
  };


  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let autoCloseTimer: NodeJS.Timeout | null = null;

    const alertElement = document.querySelector(".alert-danger.floating");

    const closeOnOutsideClickOrScroll = (e: Event) => {
      if (alertElement && !alertElement.contains(e.target as Node)) {
        closeObsoleteMedErrorMsg();
        closeCustomMedErrorMsg();
      }
    };

    const fadeAndCloseObsoleteMedErrorMsg = () => {
      if (alertElement && !alertElement.classList.contains("alert-fade-out")) {
        alertElement.classList.add("alert-fade-out");
        setTimeout(() => {
          setShowObsoleteMedErrorMsg(false);
          alertElement.classList.remove("alert-fade-out");
        }, 500);
      }
    };

    const fadeAndCloseCustomMedErrorMsg = () => {
      if (alertElement && !alertElement.classList.contains("alert-fade-out")) {
        alertElement.classList.add("alert-fade-out");
        setTimeout(() => {
          setShowCustomMedErrorMsg(false);
          alertElement.classList.remove("alert-fade-out");
        }, 500);
      }
    };

    const removeEventListeners = () => {
      document.removeEventListener("click", closeOnOutsideClickOrScroll);
      window.removeEventListener("scroll", fadeAndCloseObsoleteMedErrorMsg);
      window.removeEventListener("scroll", fadeAndCloseCustomMedErrorMsg);
    };

    if (showObsoleteMedErrorMsg) {
      timer = setTimeout(() => {
        document.addEventListener("click", closeOnOutsideClickOrScroll);
        window.addEventListener("scroll", fadeAndCloseObsoleteMedErrorMsg);
      }, 50);

      autoCloseTimer = setTimeout(() => {
        fadeAndCloseObsoleteMedErrorMsg();
      }, 5000);
    } else if (showCustomMedErrorMsg) {
      timer = setTimeout(() => {
        document.addEventListener("click", closeOnOutsideClickOrScroll);
        window.addEventListener("scroll", fadeAndCloseCustomMedErrorMsg);
      }, 50);

      autoCloseTimer = setTimeout(() => {
        fadeAndCloseCustomMedErrorMsg();
      }, 5000);
    } else {
      if (autoCloseTimer !== null) clearTimeout(autoCloseTimer);
      removeEventListeners();
    }

    return () => {
      if (timer !== null) clearTimeout(timer);
      if (autoCloseTimer !== null) clearTimeout(autoCloseTimer);
      removeEventListeners();
    };
  }, [showObsoleteMedErrorMsg, showCustomMedErrorMsg]);

  const getOrderWriterInput = (
    val: any,
    sortedAlerts: IPatientSafetySummary[]
  ) => {
    let orderWriterInput: IOrderWriterInput = {
      description: val?.description,
      durIcon: sortedAlerts,
      formularyIcon:
        val.genericMedication?.description === "Custom"
          ? null
          : val?.formularyStatus,
      customIcon:
        val.genericMedication?.description === "Custom"
          ? val.genericMedication?.description
          : null,
      medicationId: val?.id,
      basePath: basePath,
      hostContext: hostContext,
      stockMedicationFlag: val.stockMedicationFlag
    };

    return orderWriterInput;
  };

  const getMedication = (val: any, event: any) => {
    const alerts = val.alerts || [];
    const sortedAlerts = sortDurAlertArray(alerts);
    if (event.key === "Enter" || event.key === undefined) {
      if (val?.elements?.availability !== "Available") {
        closeObsoleteMedErrorMsg();
        setTimeout(() => {
          showObsoleteMedicationErrorMessage();
        }, 50);
      } else if (isDischargeOrder === "true" && val.genericMedication?.description === "Custom") {
        closeCustomMedErrorMsg();
        setTimeout(() => {
          showCustomMedicationErrorMessage();
        }, 50);

      } else if (isCloudMedOrderWriterEnabled) {
        let orderWriterInput = getOrderWriterInput(val, sortedAlerts);
        navigate(`${basePath}/order-writer`, {
          state: {
            orderWriterInput,
          },
        });
        window.scrollTo(0, 0);
      } else if (val.genericMedication?.description === "Custom") {
        window.location.href = createCustomMedicationUrl(
          baseUrl,
          eventId,
          providerId,
          isPendingOrder,
          isDischargeOrder,
          val.description,
          prescriberId,
          val.deaCode
        );
      } else {
        window.location.href = createPrescriptionOrderUrl(
          baseUrl,
          val.id,
          eventId,
          providerId,
          isPendingOrder,
          isDischargeOrder,
          prescriberId
        );
      }
    } else {
      return;
    }
  };

  const getGenericMedication = (val: any, event: any) => {
    if (event.key === "Enter" || event.key === undefined) {
      if (
        val?.elements?.availability !== "Available" &&
        val?.elements?.availability !== "EquivalentsAvailable"
      ) {
        event.preventDefault();
        alert("Obsolete medications are not available for selection");
      }
      if (
        isDischargeOrder === "true" &&
        val.genericMedication?.description === "Custom"
      ) {
        event.preventDefault();
        alert("Custom medications are not available for selection for Discharge Orders.");
      }
      if (isCloudMedOrderWriterEnabled) {
        let orderWriterInput: IOrderWriterInput = {
          description: val?.genericMedication?.description,
          durIcon: null,
          formularyIcon: "",
          customIcon: null,
          medicationId: val?.genericMedication?.id,
          basePath: basePath,
          hostContext: hostContext,
        };
        navigate(`${basePath}/order-writer`, {
          state: {
            orderWriterInput,
          },
        });
        window.scrollTo(0, 0);
      } else {
        window.location.href = createGenericMedicationUrl(
          baseUrl,
          val.genericMedication?.id,
          eventId,
          providerId,
          isPendingOrder,
          isDischargeOrder,
          prescriberId
        );
      }
    } else {
      return;
    }
  };

  return (
    <div className="container-fluid">
      {isLoadingData ? (
        <LoadSpinner />
      ) : (
        <>
          <div className="row">
            {showObsoleteMedErrorMsg ? (
              <div
                className={`mb-0 alert alert-danger floating alert-position`}
                role="alert"
                onClick={(e) => e.stopPropagation()}
                data-testid="obsolete-alert"
                aria-hidden="true"
              >
                <i
                  id="btnCloseApiRespMsg"
                  data-testid="alert-error-close-btn"
                  className="alert-close"
                  aria-hidden="true"
                  onClick={closeObsoleteMedErrorMsg}
                ></i>
                {`Obsolete medications are not available for selection.`}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="row">
            {showCustomMedErrorMsg ? (
              <div
                className={`mb-0 alert alert-danger floating alert-position`}
                role="alert"
                onClick={(e) => e.stopPropagation()}
                data-testid="custom-med-discharge-order-alert"
                aria-hidden="true"
              >
                <i
                  id="btnCloseApiRespMsg"
                  data-testid="alert-error-close-btn"
                  className="alert-close"
                  aria-hidden="true"
                  onClick={closeCustomMedErrorMsg}
                ></i>
                {`Custom medications are not available for selection for Discharge Orders.`}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="row">
            <div className="col-md-12 mt-3 no-padding-left">
              <h1>New Order</h1>
            </div>
          </div>

          <div className="inline">
            <button
              type="button"
              data-testid="cancelBtn"
              className="btn btn-cancel"
              onClick={cancelSearch}
            >
              Back
            </button>

            <div className="search col-md-6">
              <i className="fa-regular fa-magnifying-glass"></i>
              <input
                name="search"
                type="search"
                id="search2"
                className="form-control"
                autoComplete="off"
                placeholder="Search here"
                data-testid="search"
                onChange={handleSearch}
                autoFocus
              />
            </div>
          </div>
          <hr />

          <div className="row ml-1">
            <h2>Results</h2>
            {isMedicationSearchLoading ? (
              <div className="spinner spinner-sm" style={styles.custom_loader}>
                <div className="spinner spinner-sm lspinner"></div>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="row mt-2">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-sm table-striped table-hover">
                  <thead>
                    <tr>
                      <th
                        className={
                          medicationList?.length !== 0 ? "text-center" : ""
                        }
                        tabIndex={0}
                      >
                        Alerts
                      </th>
                      <th tabIndex={0}>Item</th>
                      <th tabIndex={0}>Type</th>
                      <th tabIndex={0}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicationList?.length === 0 ? (
                      <tr>
                        <td data-testid="NoDataFound" colSpan={5}>
                          <aside className="no-data">No Data Found</aside>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {medicationList?.map((val, index) => {
                          const showGenericDescription =
                            val.id !== val.genericMedication?.id &&
                            val.genericMedication?.availability === "Available";
                          const alerts = val.alerts || [];
                          const sortedAlerts = sortDurAlertArray(alerts);
                          return (
                            <tr key={`${val.id}_${index}`}>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div className="icon-container mx-auto">
                                    {val.genericMedication?.description ===
                                      "Custom" && sortedAlerts.length === 0
                                      ? renderIconCustomMeds("Custom", val.id)
                                      : renderDurIcon(sortedAlerts, val.id)}
                                  </div>
                                  <div className="formulary-icon-container mx-auto">
                                    {val.genericMedication?.description ===
                                      "Custom"
                                      ? ""
                                      : formularyIcon(
                                        val?.formularyStatus,
                                        val.id
                                      )}
                                    {val.stockMedicationFlag?.toLowerCase() ===
                                      "stock"
                                      &&
                                      formularyIcon(
                                        "InStock",
                                        val.id
                                      )}
                                  </div>
                                </div>
                              </td>
                              <td data-testid={val.description}>
                                <button
                                  data-testid={`${val.description}-anchor`}
                                  className="anchor-button"
                                  tabIndex={0}
                                  onKeyDown={(event) =>
                                    getMedication(val, event)
                                  }
                                  onClick={(event) => getMedication(val, event)}
                                  style={{
                                    textDecoration: "underline",
                                  }}
                                >
                                  {val?.description}
                                </button>
                                {val?.elements?.availability !==
                                  "Available" && (
                                    <span
                                      style={{
                                        color: "red",
                                        textDecoration: "none",
                                      }}
                                    >
                                      {" "}
                                      (obsolete)
                                    </span>
                                  )}
                                &nbsp;
                                <button
                                  className="anchor-button"
                                  tabIndex={0}
                                  data-testid="btnHandleInfo"
                                  onClick={(event) =>
                                    handleInfoButtonClick(val?.id, event)
                                  }
                                  onKeyDown={(event) =>
                                    handleInfoButtonClick(val?.id, event)
                                  }
                                  style={{
                                    textDecoration: "underline",
                                  }}
                                >
                                  {val.genericMedication?.description ===
                                    "Custom" ? (
                                    <></>
                                  ) : (
                                    <i
                                      className="fa far fa-info-circle mr-2"
                                      style={styles.baseIcon}
                                    ></i>
                                  )}
                                </button>
                                {showGenericDescription && (
                                  <p
                                    style={{
                                      color: "#333333",
                                    }}
                                  >
                                    {val?.genericMedication?.description ===
                                      "Custom"
                                      ? null
                                      : "Generic: "}
                                    <button
                                      className="anchor-button"
                                      tabIndex={0}
                                      onKeyDown={(event) =>
                                        getGenericMedication(val, event)
                                      }
                                      onClick={(event) =>
                                        getGenericMedication(val, event)
                                      }
                                      style={{
                                        textDecoration: "underline",
                                      }}
                                      data-testid={`${val.description}-anchorgeneric`}
                                    >
                                      {val?.genericMedication?.description ===
                                        "Custom"
                                        ? null
                                        : val?.genericMedication?.description}
                                    </button>
                                    {val?.elements?.availability !==
                                      "Available" &&
                                      val?.elements?.availability !==
                                      "EquivalentsAvailable" && (
                                        <span
                                          style={{
                                            color: "red",
                                            textDecoration: "none",
                                          }}
                                        >
                                          {" "}
                                          (obsolete)
                                        </span>
                                      )}
                                  </p>
                                )}
                              </td>
                              <td>Medication</td>
                              <td>
                                {val?.genericMedication?.description !==
                                  "Custom"
                                  ? "Global"
                                  : customMedLibrary?.description}
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {isMenuActive ? (
            <DrugInformation
              isMenuActive={isMenuActive}
              setIsMenuActive={setIsMenuActive}
              onOverLayClick={hideOverlay}
              medicationId={activeMedicationId} // Pass the active medication ID to the DrugInformation component
            />
          ) : (
            <></>
          )}
          {showPagination ? (
            <div key={remountComponent}>
              {pagination && pagination?.totalPages > 1 && (
                <Paging
                  pagination={pagination}
                  onPageChange={handlePageClick}
                />
              )}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );

};

export default MedicationSearch;
