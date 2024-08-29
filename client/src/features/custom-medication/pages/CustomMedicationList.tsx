import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import LoadSpinner from "../../../shared/common-ui/LoadSpinner";
import { CustomMedicationListMsgEnum } from "../../../shared/enum/CustomMedicationList";
import Paging from "../../../shared/pages/Pagination";
import ConfirmDialog from "../../../shared/pages/ConfirmDialog";
import {
  UpdateCustomMedicationStatus,
  getCustomMedicationsList,
  getDownloadTemplate,
} from "./../../../services/CustomMedicationService";
import Switch from "../../../shared/pages/Switch";
import { scheduleOptions } from "../../../shared/constants/ScheduleOptions";
import CustomMedicationLibrary from "../../custom-medication-library/pages/CustomMedicationLibrary";
import { CustomMedicationLibraryMsgEnum } from "../../../shared/enum/CustomMedicationLibrary";
import CsvDownload from "../../../helper/CsvDownload";
import { usePapaParse } from "react-papaparse";
import { generateFileName } from "../../../helper/Utility";
import ImportList from "../../../shared/pages/ImportList";
import { ImportListMessageEnum } from "../../../shared/enum/ImportListMessageEnums";
import { ICustomMedicationListResponse } from "../../../models/interface/ICustomMedicationListResponse";
import { IMedGroups } from "../../../models/interface/IMedGroups";
import { ICustomMedication } from "../../../models/interface/ICustomMedication";
import { ICustomMedicationLibrary } from "../../../models/interface/ICustomMedicationLibrary";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { AppConstant } from "../../../shared/constants/AppConstant";
import { OrderPlatformConfigurationRouteEnum } from "../../../shared/enum/OrderPlatFormConfigurationEnum";

const CustomMedicationList = () => {
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const basePath = hostContext.basePath;

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingHostContext, setIsLoadingHostContext] = useState(true);
  const isLoading = isLoadingData || isLoadingHostContext;
  const { libraryId } = useParams();
  window.history.replaceState("", ""); // used for clearing the location state
  const navigate = useNavigate(); // used for navigation
  const [medicationName, setMedicationName] = useState({
    search: "",
  }); // used for searching a medication
  const [customMedList, setCustomMedList] = useState<ICustomMedication[]>([]); // used for displaying the results on UI in a table
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false); // used for displaying the popup on Activating/Deactivating
  const [dialogTitle, setDialogTitle] = useState<string>(""); // used for setting and displaying the dyanamic title for Popup
  const [sortDirection, setSortDirection] = useState<string>("ASC"); // used for setting the Sorted Direction and Sort Icon
  const [id, setId] = useState(0); // used to hold the custom medication id so that we can pass it to a API
  const [isActive, setIsActive] = useState<boolean | null>(null); // used to hold the status so that we can pass it to a API
  const { state } = useLocation(); // used for capturing the save/update message
  const [showApiResponseMsg, setShowApiResponseMsg] = useState<boolean>(false);
  const [remountComponent, setRemountComponent] = useState(0);
  const [libraryDetails, setLibraryDetails] =
    useState<ICustomMedicationLibrary>();
  const [showEditLibraryModal, setShowEditLibraryModal] =
    useState<boolean>(false);
  const btnEditLibraryRef = useRef<HTMLButtonElement>(null);
  const btnExportLibraryRef = useRef<HTMLButtonElement>(null);
  const [isExportEnabled, setIsExportEnabled] = useState<boolean>(false);
  const btnImportListRef = useRef<HTMLButtonElement>(null);
  const [isImportListEnabled, setIsImportListEnabled] =
    useState<boolean>(false);
  const [isDescending, setIsDescending] = useState<boolean>(false);
  const { jsonToCSV } = usePapaParse();
  const [isRedirectToFacilitySetup, setIsRedirectToFacilitySetup] =
    useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<IUserFacility>();
  // used for Handling the Pagination
  const [pagination, setPagination] = useState({
    countPerPage: 20,
    pageNumber:
      sessionStorage.getItem("customMedicationPageNumber") != null
        ? parseInt(sessionStorage.getItem("customMedicationPageNumber")!)
        : 1,
    totalCount: 0,
    totalPages: 0,
  });

  // used to set the message post save and update medication or can be used to show any msg on top of the page
  const [requestResponse, setRequestResponse] = useState({
    textMessage: state || "",
    alertClassName: state ? "alert alert-success floating" : "",
  });

  const [
    customMedicationLibraryInactivatePermission,
    setCustomMedicationLibraryInactivatePermission,
  ] = useState(false);
  const [
    customMedicationLibraryEditPermission,
    setCustomMedicationLibraryEditPermission,
  ] = useState(false);

  useEffect(() => {
    setCustomMedicationLibraryInactivatePermission(
      hostContext.permission.customMedicationLibraryInactivate ?? false
    );
    setCustomMedicationLibraryEditPermission(
      hostContext.permission.customMedicationLibraryEdit ?? false
    );
    setIsLoadingHostContext(false);
  }, [hostContext]);

  // used to navigate to a Add New Medication Form
  const AddNewMedication = () => {
    navigate(`${basePath}/add-custom-medication`);
  };

  useEffect(() => {
    const isFromFacilitySetUp = sessionStorage.getItem(
      "navigatedFromFacilitySetupToCustomMedications"
    );
    let currentFacility = sessionStorage.getItem("selectedFacility");
    if (isFromFacilitySetUp) {
      setIsRedirectToFacilitySetup(Boolean(isFromFacilitySetUp));
    }
    if (currentFacility) {
      setSelectedFacility(JSON.parse(currentFacility));
    }
    sessionStorage.removeItem("navigatedFromFacilitySetupToStockMedication");
    sessionStorage.removeItem("selectedFacilityForStockMed");

    setIsLoadingData(true);
    loadCustomMedications();
  }, []);

  const loadCustomMedications = () => {
    if (sessionStorage.getItem("selectedLibraryDetails")) {
      const selectedSortDirection = sessionStorage.getItem(
        "customMedicationsSelectedSort"
      );
      const selectedLibraryDetails: ICustomMedicationLibrary = JSON.parse(
        sessionStorage.getItem("selectedLibraryDetails")!
      );
      setLibraryDetails(selectedLibraryDetails);
      if (selectedSortDirection == "ASC") {
        setSortDirection("ASC");
        setIsDescending(false);
        getCustomMedicationList(
          pagination.pageNumber,
          selectedLibraryDetails?.id,
          false
        );
      } else {
        setSortDirection("DESC");
        setIsDescending(true);
        getCustomMedicationList(
          pagination.pageNumber,
          selectedLibraryDetails?.id,
          true
        );
      }
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    if (state) {
      setShowApiResponseMsg(true);
      setTimeout(() => {
        setShowApiResponseMsg(false);
      }, 5000);
    } else {
      setShowApiResponseMsg(false);
    }
  }, [state]);

  // based on Schedule Id get the Schedule Name and display it in a table
  const getScheduledName = (id: number) => {
    switch (id) {
      case 2:
        return scheduleOptions[0].text;
      case 3:
        return scheduleOptions[1].text;
      case 4:
        return scheduleOptions[2].text;
      case 5:
        return scheduleOptions[3].text;
      default:
        return "Not Controlled";
    }
  };

  // used to handle the toggle value and store it in a states and pass it to a API
  const toggleState = (state: boolean, label: string, Id: number) => {
    setId(Id);
    setIsActive(state);
    setDialogTitle(`Status set to ${state ? "Active" : "Inactive"}`);
    setShowConfirmModal(true);
  };

  // on Confirmation a state update API will be called
  const handleUpdateCustomMedicationStatus = async () => {
    setShowApiResponseMsg(false);
    setShowConfirmModal(false);
    const response = await UpdateCustomMedicationStatus(id);
    setId(0);
    setIsActive(null);
    if (response?.data?.statusCode === 500) {
      setRequestResponse({
        textMessage: response?.data?.responseMessage,
        alertClassName: "alert alert-danger floating",
      });
      setShowApiResponseMsg(true);
    } else if (response?.status === 200) {
      setIsExportEnabled(response?.data?.totalActiveElements > 0);
      const index = customMedList?.findIndex((x) => x.id === id);
      if (index != -1) {
        customMedList[index].isActive = isActive!;
      }
    }
  };

  const closeApiResponseMsg = () => {
    setShowApiResponseMsg(false);
  };

  // on Cancelling the state of Medication will not udate and retain as it is
  const cancelUpdateStatus = () => {
    setId(0);
    setIsActive(null);
    setShowConfirmModal(false);
  };

  // sort a custom medication name column
  const sortCustomMedications = (dir: string) => {
    sessionStorage.setItem(
      "customMedicationsSelectedSort",
      dir == "ASC" ? "DESC" : "ASC"
    );
    if (dir == "ASC") {
      setSortDirection("DESC");
      setIsDescending(true);
      getCustomMedicationList(pagination.pageNumber, libraryDetails?.id, true);
    } else {
      setSortDirection("ASC");
      setIsDescending(false);
      getCustomMedicationList(pagination.pageNumber, libraryDetails?.id, false);
    }
  };

  // used to handle & load the data into grid based on page number
  const handlePageClick = (page: number) => {
    pagination.pageNumber = page;
    sessionStorage.setItem("customMedicationPageNumber", page.toString());
    setPagination(pagination);
    getCustomMedicationList(
      pagination.pageNumber,
      libraryDetails?.id,
      isDescending
    );
  };

  // used to load the custom medication data
  const getCustomMedicationList = useCallback(
    async (
      pageNumber: number,
      libraryId?: number,
      isSortDescending?: boolean
    ) => {
      const pageNum = pageNumber || 1;
      const response: ICustomMedicationListResponse =
        await getCustomMedicationsList(
          pageNum,
          medicationName.search,
          pagination.countPerPage,
          libraryId,
          false,
          isSortDescending
        );
      const { customMedications, pagination: responsePagination } =
        response || {};

      if (customMedications !== undefined) {
        const sortedCustomMedications = sortCustomMedicationRecords(
          customMedications,
          isSortDescending
        );
        setCustomMedList(sortedCustomMedications);
        setIsExportEnabled(response.pagination.totalActiveElements > 0);
        pagination.countPerPage = responsePagination?.size;
        pagination.pageNumber = responsePagination?.number;
        pagination.totalCount = responsePagination?.totalElements;
        pagination.totalPages =
          responsePagination?.totalPages || (responsePagination ? 2 : 0);
        setPagination(pagination);
      } else {
        setCustomMedList([]);
      }
      setRemountComponent(Math.random());
    },
    [pagination, medicationName]
  );

  const sortCustomMedicationRecords = (
    customMedications: ICustomMedication[],
    isSortDescending?: boolean
  ) => {
    return customMedications.sort(
      (a: ICustomMedication, b: ICustomMedication) => {
        const descriptionA = a.description?.toLowerCase();
        const descriptionB = b.description?.toLowerCase();
        if (isSortDescending) {
          return descriptionB > descriptionA ? 1 : -1;
        } else {
          return descriptionA > descriptionB ? 1 : -1;
        }
      }
    );
  };

  // used to handle the search medication & load the data into grid
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    const name = (e.target as HTMLInputElement).name;
    if (value.length >= 2) {
      if (name === "search") {
        medicationName.search = value;
      }
      setMedicationName(medicationName);
      pagination.pageNumber = 1;
      setPagination(pagination);
      getCustomMedicationList(1, libraryDetails?.id, isDescending);
    } else {
      medicationName.search = "";
      setMedicationName(medicationName);
      pagination.pageNumber = parseInt(
        sessionStorage.getItem("customMedicationPageNumber")!
      );
      setPagination(pagination);
      getCustomMedicationList(
        pagination.pageNumber,
        libraryDetails?.id,
        isDescending
      );
    }
    setPagination({
      countPerPage: 20,
      pageNumber: parseInt(
        sessionStorage.getItem("customMedicationPageNumber")!
      ),
      totalCount: 0,
      totalPages: 0,
    });
    setRemountComponent(Math.random());
  };

  const navigateToEdit = (id: number) => {
    navigate(`${basePath}/edit-custom-medication/${id}`);
  };

  const backToPreviousPage = () => {
    let rediretcUrl = "";
    if (isRedirectToFacilitySetup) {
      rediretcUrl = `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}/${selectedFacility?.facilityId}`;
    } else {
      rediretcUrl = `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationCustomMedLibrary}`;
    }
    navigate(rediretcUrl, {
      state: {
        isFromCustomMedicationList: "true",
        isFromFacilityList: JSON.stringify(selectedFacility),
      },
    });
  };

  const editCustomMedicationLibrary = () => {
    btnEditLibraryRef?.current?.blur();
    setShowEditLibraryModal(true);
  };

  const updateCustomMedLibrary = (msg: string) => {
    setShowEditLibraryModal(false);
    setRequestResponse({
      textMessage: msg,
      alertClassName: "alert alert-success floating",
    });
    setShowApiResponseMsg(true);
    setTimeout(() => {
      setShowApiResponseMsg(false);
    }, 5000);

    if (sessionStorage.getItem("selectedLibraryDetails")) {
      const obj: string | null = sessionStorage.getItem(
        "selectedLibraryDetails"
      );
      if (obj !== null) {
        setLibraryDetails(JSON.parse(obj));
      }
    }
  };

  const cancelUpdateCustomMedLibrary = () => {
    setShowEditLibraryModal(false);
  };

  const handleExportCustomMedications = () => {
    btnExportLibraryRef?.current?.blur();
    let jsonCustomMedicationsStr: any = [];
    let pageNumber = 1;
    getCustomMedicationsList(
      pageNumber,
      medicationName.search,
      pagination.countPerPage,
      Number(libraryId),
      true,
      false
    ).then((response: ICustomMedicationListResponse) => {
      const responseJSON = response;
      if (responseJSON?.customMedications?.length > 0) {
        responseJSON?.customMedications?.sort(
          (a: ICustomMedication, b: ICustomMedication) =>
            a.description?.toLowerCase() > b.description?.toLowerCase() ? 1 : -1
        );
        responseJSON?.customMedications.forEach(
          (itm: ICustomMedication, index: number) => {
            if (itm) {
              let customMedicationObj = {
                CustomMedicationName: itm.description,
                DeaClassId: getScheduledName(itm.deaClassId),
                MedicationGroups: bindMedGroupsList(itm.fdbMedGroupLists),
                Ingredient1: itm.fdbIngredientLists[0]?.description,
                Ingredient1Ndc: itm.fdbIngredientLists[0]?.representativeNDC,
                Ingredient2: itm.fdbIngredientLists[1]?.description,
                Ingredient2Ndc: itm.fdbIngredientLists[1]?.representativeNDC,
                Ingredient3: itm.fdbIngredientLists[2]?.description,
                Ingredient3Ndc: itm.fdbIngredientLists[2]?.representativeNDC,
                Ingredient4: itm.fdbIngredientLists[3]?.description,
                Ingredient4Ndc: itm.fdbIngredientLists[3]?.representativeNDC,
                Ingredient5: itm.fdbIngredientLists[4]?.description,
                Ingredient5Ndc: itm.fdbIngredientLists[4]?.representativeNDC,
                Ingredient6: itm.fdbIngredientLists[5]?.description,
                Ingredient6Ndc: itm.fdbIngredientLists[5]?.representativeNDC,
                Ingredient7: itm.fdbIngredientLists[6]?.description,
                Ingredient7Ndc: itm.fdbIngredientLists[6]?.representativeNDC,
                Ingredient8: itm.fdbIngredientLists[7]?.description,
                Ingredient8Ndc: itm.fdbIngredientLists[7]?.representativeNDC,
                Ingredient9: itm.fdbIngredientLists[8]?.description,
                Ingredient9Ndc: itm.fdbIngredientLists[8]?.representativeNDC,
                Ingredient10: itm.fdbIngredientLists[9]?.description,
                Ingredient10Ndc: itm.fdbIngredientLists[9]?.representativeNDC,
                Ingredient11: itm.fdbIngredientLists[10]?.description,
                Ingredient11Ndc: itm.fdbIngredientLists[10]?.representativeNDC,
                Ingredient12: itm.fdbIngredientLists[11]?.description,
                Ingredient12Ndc: itm.fdbIngredientLists[11]?.representativeNDC,
                Ingredient13: itm.fdbIngredientLists[12]?.description,
                Ingredient13Ndc: itm.fdbIngredientLists[12]?.representativeNDC,
                Ingredient14: itm.fdbIngredientLists[13]?.description,
                Ingredient14Ndc: itm.fdbIngredientLists[13]?.representativeNDC,
                Ingredient15: itm.fdbIngredientLists[14]?.description,
                Ingredient15Ndc: itm.fdbIngredientLists[14]?.representativeNDC,
              };
              jsonCustomMedicationsStr.push(customMedicationObj);
            }
          }
        );
        const csvData = [
          [
            "Custom Medication Name",
            "DEA Schedule",
            "Medication Groups",
            "Ingredient 1",
            "Ingredient 1 NDC",
            "Ingredient 2",
            "Ingredient 2 NDC",
            "Ingredient 3",
            "Ingredient 3 NDC",
            "Ingredient 4",
            "Ingredient 4 NDC",
            "Ingredient 5",
            "Ingredient 5 NDC",
            "Ingredient 6",
            "Ingredient 6 NDC",
            "Ingredient 7",
            "Ingredient 7 NDC",
            "Ingredient 8",
            "Ingredient 8 NDC",
            "Ingredient 9",
            "Ingredient 9 NDC",
            "Ingredient 10",
            "Ingredient 10 NDC",
            "Ingredient 11",
            "Ingredient 11 NDC",
            "Ingredient 12",
            "Ingredient 12 NDC",
            "Ingredient 13",
            "Ingredient 13 NDC",
            "Ingredient 14",
            "Ingredient 14 NDC",
            "Ingredient 15",
            "Ingredient 15 NDC",
          ],
          ...jsonCustomMedicationsStr.map(
            ({
              CustomMedicationName,
              DeaClassId,
              MedicationGroups,
              Ingredient1,
              Ingredient1Ndc,
              Ingredient2,
              Ingredient2Ndc,
              Ingredient3,
              Ingredient3Ndc,
              Ingredient4,
              Ingredient4Ndc,
              Ingredient5,
              Ingredient5Ndc,
              Ingredient6,
              Ingredient6Ndc,
              Ingredient7,
              Ingredient7Ndc,
              Ingredient8,
              Ingredient8Ndc,
              Ingredient9,
              Ingredient9Ndc,
              Ingredient10,
              Ingredient10Ndc,
              Ingredient11,
              Ingredient11Ndc,
              Ingredient12,
              Ingredient12Ndc,
              Ingredient13,
              Ingredient13Ndc,
              Ingredient14,
              Ingredient14Ndc,
              Ingredient15,
              Ingredient15Ndc,
            }: any) => [
                CustomMedicationName,
                DeaClassId,
                MedicationGroups,
                Ingredient1,
                Ingredient1Ndc,
                Ingredient2,
                Ingredient2Ndc,
                Ingredient3,
                Ingredient3Ndc,
                Ingredient4,
                Ingredient4Ndc,
                Ingredient5,
                Ingredient5Ndc,
                Ingredient6,
                Ingredient6Ndc,
                Ingredient7,
                Ingredient7Ndc,
                Ingredient8,
                Ingredient8Ndc,
                Ingredient9,
                Ingredient9Ndc,
                Ingredient10,
                Ingredient10Ndc,
                Ingredient11,
                Ingredient11Ndc,
                Ingredient12,
                Ingredient12Ndc,
                Ingredient13,
                Ingredient13Ndc,
                Ingredient14,
                Ingredient14Ndc,
                Ingredient15,
                Ingredient15Ndc,
              ]
          ),
        ];
        const csvResults = jsonToCSV(csvData);
        CsvDownload(
          csvResults,
          generateFileName(libraryDetails?.description!, ".csv")
        );
      }
    });
  };

  const bindMedGroupsList = (medGrpList: IMedGroups[]) => {
    if (medGrpList?.length > 0) {
      let medicationGroupsStr = "";
      medGrpList.forEach((element: IMedGroups, index: number) => {
        medicationGroupsStr += element.description;
        medicationGroupsStr += index < medGrpList?.length - 1 ? "; " : "";
      });
      return medicationGroupsStr;
    }
  };

  const onCloseImportList = (isSucceed: boolean) => {
    if (isSucceed) {
      loadCustomMedications();
      setShowApiResponseMsg(true);
      setRequestResponse({
        textMessage: ImportListMessageEnum.FileHasImportedSuccessMessage,
        alertClassName: "alert alert-success floating",
      });
      setTimeout(() => {
        setShowApiResponseMsg(false);
      }, 5000);
    }
    setIsImportListEnabled(false);
    document.body.style.overflow = "visible";
  };

  const importCustomMedicationsList = () => {
    btnImportListRef?.current?.blur();
    setIsImportListEnabled(true);
    document.body.style.overflow = "hidden";
  };

  const btnDownloadTemplateClick = () => {
    setShowApiResponseMsg(false);
    getDownloadTemplate().then((response: any) => {
      const headerType = response.headers.get("content-type");
      if (headerType == "application/zip") {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/zip" })
        );
        const link = window.document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          CustomMedicationListMsgEnum.DownloadTemplateFileName
        );
        window.document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setRequestResponse({
          textMessage:
            CustomMedicationListMsgEnum.FolderOrFileNotFoundToDownload,
          alertClassName: "alert alert-danger floating",
        });
        setShowApiResponseMsg(true);
      }
    });
  };

  const sortingDirection = () => {
    return (
      <>
        {sortDirection === "ASC" ? (
          <span
            data-testid="sort-custom-medications"
            onClick={() => sortCustomMedications("ASC")}
            onKeyUp={(event: React.KeyboardEvent<HTMLButtonElement>) => checkKeysAllowedSortBtn(event, "DESC")}
          >
            <button className={`${AppConstant.AscendingSortIcon} p-0 bg-transparent border-0 tree-check-uncheck-button ml-1`}></button>
          </span>
        ) : (
          <span
            data-testid="sort-custom-medications"
            onClick={() => sortCustomMedications("DESC")}
            onKeyUp={(event: React.KeyboardEvent<HTMLButtonElement>) => checkKeysAllowedSortBtn(event, "ASC")}
          >
            <button className={`${AppConstant.DescendingSortIcon} p-0 bg-transparent border-0 tree-check-uncheck-button ml-1`}></button>
          </span>
        )}
      </>
    );
  };

  const checkKeysAllowedRowsItem = (event: React.KeyboardEvent<HTMLButtonElement>, id: number) => {
    if (event.key !== "Tab" && event.key !== "Shift") {
      navigateToEdit(id);
    }
  }

  const checkKeysAllowedSortBtn = (event: React.KeyboardEvent<HTMLButtonElement>, orderBy: string) => {
    if (event.key !== "Tab" && event.key !== "Shift") {
      sortCustomMedications(orderBy);
    }
  }

  if (!customMedicationLibraryEditPermission && !isLoading) {
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
      {isLoading ? (
        <LoadSpinner />
      ) : (
        <>
          <div className="row">
            {showApiResponseMsg &&
              requestResponse.alertClassName &&
              requestResponse.textMessage ? (
              <div
                className={`mb-0 ${requestResponse.alertClassName}`}
                role="alert"
              >
                <i
                  id="btnCloseApiRespMsg"
                  data-testid="alert-error-close-btn"
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
          <div className="row">
            <div className="col-12 mt-3">
              <h1>
                {libraryDetails?.description ? (
                  <>
                    {libraryDetails?.description}
                    <button
                      className="ml-2 btn btn-default btn-sm btn-edit-library"
                      data-testid="btnEditLibrary"
                      title="Edit"
                      ref={btnEditLibraryRef}
                      onClick={editCustomMedicationLibrary}
                    >
                      <i className="fa fa-pen fa-lg"></i>
                    </button>
                  </>
                ) : (
                  "Custom Medications"
                )}
              </h1>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-7">
              <button
                type="button"
                data-testid="btnBack"
                className="btn btn-cancel"
                onClick={backToPreviousPage}
              >
                Back
              </button>
              <button
                type="button"
                data-testid="btnAddNew"
                className="btn btn-primary"
                onClick={AddNewMedication}
              >
                Create New
              </button>
              <button
                type="button"
                data-testid="btnImport"
                ref={btnImportListRef}
                onClick={importCustomMedicationsList}
                className="btn btn-default-neo-primary-3"
              >
                <i className="fa-regular fa-file-import mr-1"></i>
                {`Import List`}
              </button>
              <button
                type="button"
                data-testid="btnExport"
                disabled={!isExportEnabled}
                ref={btnExportLibraryRef}
                className="btn btn-default-neo-primary-3"
                onClick={handleExportCustomMedications}
              >
                <i className="fa-regular fa-file-export mr-1"></i>Export List
              </button>
              <button
                type="button"
                data-testid="btnDownloadTemplate"
                className="btn btn-default-neo-primary-3"
              >
                <span
                  className="anchor-button download-template"
                  onClick={btnDownloadTemplateClick}
                  onKeyDown={btnDownloadTemplateClick}
                >
                  <i className="fa-regular fa-cloud-download mr-1"></i>
                  {`Download
                  Template`}
                </span>
              </button>
            </div>
            <div className="search col-5 mt-n1">
              <i
                className="fa-regular fa-magnifying-glass"
                style={{ left: "17px" }}
              ></i>
              <input
                name="search"
                type="search"
                id="txtSearch"
                className="form-control"
                autoComplete="off"
                placeholder="Search here"
                onChange={handleSearch}
                data-testid="txtSearch"
                aria-label="Search"
                autoFocus
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className=" col-12">
              <div className="table-responsive table-height-wrapper">
                <table className="table table-sm table-striped custom-medication-list table-hover">
                  <thead>
                    <tr>
                      <th className="custom-medication-list w-10">Status</th>
                      <th className="custom-medication-list w-45">
                        Custom Medication Name
                        {customMedList?.length === 0 ? (
                          <i
                            data-testid="sort-custom-medications-inactive"
                            className={`${AppConstant.InactiveSortIcon} ml-1`}
                          ></i>
                        ) : (
                          sortingDirection()
                        )}
                      </th>
                      <th className="custom-medication-list w-15">
                        Controlled Substance
                      </th>
                      <th className="custom-medication-list w-30">
                        Medication Group
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customMedList?.length === 0 ? (
                      <tr>
                        <td className="no-data" colSpan={4}>
                          <aside>
                            {CustomMedicationListMsgEnum.NotMatchesFound}
                          </aside>
                        </td>
                      </tr>
                    ) : (
                      customMedList?.map((itm: ICustomMedication, index) => (
                        <tr key={itm.id + itm.description + index}>
                          <td className="pl-20px w-10">
                            {customMedicationLibraryInactivatePermission ? (
                              <Switch
                                customMedicationId={itm.id}
                                controlName={`status-${itm.id}`}
                                isToggled={itm.isActive}
                                label={itm.isActive ? "Active" : "Inactive"}
                                onClick={toggleState}
                              ></Switch>
                            ) : (
                              <span>
                                {itm.isActive ? "Active" : "Inactive"}
                              </span>
                            )}
                          </td>
                          <td className="w-45">
                            <button
                              data-testid="customMedicationName"
                              className="anchor-button custom-medication-name"
                              onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => checkKeysAllowedRowsItem(event, itm.id)}
                              onClick={() => navigateToEdit(itm.id)}
                            >
                              {itm.description}
                            </button>
                          </td>
                          <td className="w-15">
                            <span>
                              {itm.deaClassId === null ? (
                                <span>Not Controlled</span>
                              ) : (
                                getScheduledName(itm.deaClassId)
                              )}
                            </span>
                          </td>
                          <td className="fbdMedGroups w-30">
                            <span>
                              {itm?.fdbMedGroupLists
                                ?.slice(0)
                                .sort((a: IMedGroups, b: IMedGroups) =>
                                  a.description?.toLowerCase() >
                                    b.description?.toLowerCase()
                                    ? 1
                                    : -1
                                )
                                .map((it: IMedGroups, index: number) => (
                                  <span key={it.id! + it.description + index}>
                                    {it.description}
                                    {index < itm?.fdbMedGroupLists?.length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {customMedList?.length > 0 ? (
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
              </div>
            </div>
          </div>
          <ConfirmDialog
            showConfirmModal={showConfirmModal}
            iconClass={
              CustomMedicationListMsgEnum.CustomMedConfirmDialogIconClass
            }
            title={dialogTitle}
            messageTitle={
              isActive
                ? CustomMedicationListMsgEnum.ConfirmOnActivatingMessageTitle
                : CustomMedicationListMsgEnum.ConfirmOnDeactivatingMessageTitle
            }
            messageContent={
              CustomMedicationListMsgEnum.CustomMedConfirmDialogMessageContent
            }
            confirmButtonText={
              CustomMedicationListMsgEnum.CustomMedConfirmDialogConfirmButtonText
            }
            cancelButtonText={
              CustomMedicationListMsgEnum.CustomMedConfirmDialogCancelButtonText
            }
            confirmOk={handleUpdateCustomMedicationStatus}
            confirmCancel={cancelUpdateStatus}
          ></ConfirmDialog>
          <CustomMedicationLibrary
            showConfirmModal={showEditLibraryModal}
            addNewMode={false}
            editLibraryObject={libraryDetails}
            title={CustomMedicationLibraryMsgEnum.EditLibraryDialogTitle}
            confirmButtonText="Update"
            cancelButtonText={
              CustomMedicationLibraryMsgEnum.CustomMedLibraryCancelButtonText
            }
            confirmOk={updateCustomMedLibrary}
            confirmCancel={cancelUpdateCustomMedLibrary}
          ></CustomMedicationLibrary>
          {isImportListEnabled === true ? (
            <ImportList
              isImportEnabled={isImportListEnabled}
              setIsImportEnabled={setIsImportListEnabled}
              onCloseImportList={onCloseImportList}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};
export default CustomMedicationList;
