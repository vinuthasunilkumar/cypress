import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SortDirection } from "../../../shared/enum/SortDirection";
import { AppConstant } from "../../../shared/constants/AppConstant";
import { IStockMedicationsListResponse } from "../../../models/interface/IStockMedicationsListResponse";
import { IStockMedicationsList } from "../../../models/interface/IStockMedicationsList";
import {
  deleteStockMedications,
  getStockMedList,
} from "../../../services/StockMedicationsService";
import ConfirmDeleteDialog from "../../../shared/pages/ConfirmDeleteDialog";
import { CustomMedicationMessages } from "../../../shared/enum/CustomMedMsgEnums";
import Paging from "../../../shared/pages/Pagination";
import {
  SORT_COLUMNS,
  STOCK_MED_MESSAGES,
  StockMedications,
} from "../../../shared/enum/StockMedicationsEnum";
import StockMedication from "./StockMedication";
import ExportSMSupplyDialog from "./ExportSMSupplyDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { OrderPlatformConfigurationRouteEnum } from "../../../shared/enum/OrderPlatFormConfigurationEnum";
import LoadSpinner from "../../../shared/common-ui/LoadSpinner";

const StockMedicationsList = () => {
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const basePath = hostContext.basePath;
  const navigate = useNavigate(); // used for navigation
  window.history.replaceState("", ""); // used for clearing the location state
  const { state } = useLocation(); // used for capturing the save/update message
  const btnAddNewStockMedicationsRef = useRef<HTMLButtonElement>(null);
  const btnDeleteStockMedicationsRef = useRef<HTMLButtonElement>(null);
  const btnImportSMSupplyRef = useRef<HTMLButtonElement>(null);
  const btnMasterSelectRef = useRef<HTMLInputElement>(null);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);
  const [isDescending, setIsDescending] = useState<boolean>(false);
  const [isMasterChecked, setIsMasterChecked] = useState<boolean>(false);
  const [isStockMedicationOpened, setIsStockMedicationOpened] =
    useState<boolean>(false);
  const [addNewMode, setAddNewMode] = useState<boolean>(false);
  const [editStockMedId, setEditStockMedId] = useState<number>(0);
  const [stockMedicationsList, setStockMedicationsList] = useState<
    IStockMedicationsList[]
  >([]); // used for displaying the results on UI in a table
  const [sortDirection, setSortDirection] = useState<string>(
    SortDirection.Ascending
  ); // used for setting the Sorted Direction and Sort Icon
  const [sortColumnName, setSortColumnName] = useState<string>("");
  const [selectedStockMedIds, setSelectedStockMedIds] = useState<string>("");
  const [deleteWarningMessage, setDeleteWarningMessage] = useState<string>("");
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);
  const [remountComponent, setRemountComponent] = useState(0);
  const [searchText, setSearchText] = useState({
    search: "",
  }); // used for searching records
  // used for Handling the Pagination
  const [pagination, setPagination] = useState({
    countPerPage: AppConstant.CountPerPage,
    pageNumber:
      sessionStorage.getItem("stockMedicationsListPageNumber") != null
        ? parseInt(sessionStorage.getItem("stockMedicationsListPageNumber")!)
        : 1,
    totalCount: 0,
    totalPages: 0,
    totalActiveElements: 0,
  });
  const [showApiResponseMsg, setShowApiResponseMsg] = useState<boolean>(false);
  const [isRedirectToFacilitySetup, setIsRedirectToFacilitySetup] =
    useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<IUserFacility>();
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isImport, setIsImport] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  // used to set the message after save and update stock medication or can be used to show any msg on top of the page
  const [requestResponse, setRequestResponse] = useState({
    textMessage: state ?? "",
    alertClassName: state ? "alert alert-success floating" : "",
  });
  const [libraryName, setLibraryName] = useState<string>("Stock Medication/Supply Library");
  const [globalFacilityId, setGlobalFacilityId] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingHostContext, setIsLoadingHostContext] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resetFocus,setResetFocus]=useState<boolean>(false);
  const [
    stockMedicationListInactivatePermission,
    setStockMedicationListInactivatePermission,
  ] = useState(false);
  const [
    stockMedicationListCopyPermission,
    setStockMedicationListCopyPermission,
  ] = useState(false);

  const [
    stockMedicationListEditPermission,
    setStockMedicationListEditPermission,
  ] = useState(false);

  window.setTimeout(() => {
    setIsLoading(isLoadingData || isLoadingHostContext);
  }, 100);

  useEffect(() => {
    setStockMedicationListInactivatePermission(
      hostContext.permission.stockMedicationListInactivate ?? false
    );
    setStockMedicationListCopyPermission(
      hostContext.permission.stockMedicationListCopy ?? false
    );
    setStockMedicationListEditPermission(
      hostContext.permission.stockMedicationListEdit ?? false
    );
    setIsLoadingHostContext(false);
  }, [hostContext]);

  useEffect(() => {
    const isFromFacilitySetUp = sessionStorage.getItem(
      "navigatedFromFacilitySetupToStockMedication"
    );
    let currentFacility = sessionStorage.getItem("selectedFacilityForStockMed");
    if (isFromFacilitySetUp) {
      setIsRedirectToFacilitySetup(Boolean(isFromFacilitySetUp));
    }
    if (currentFacility) {
      setSelectedFacility(JSON.parse(currentFacility));
    }
    sessionStorage.removeItem("navigatedFromFacilitySetupToStockMedication");
    sessionStorage.removeItem("selectedFacilityForStockMed");
    if (sessionStorage.getItem("selectedSMSupplyLibraryDetails")) {
      const selectedSMLibraryDetails = JSON.parse(
        sessionStorage.getItem("selectedSMSupplyLibraryDetails")!
      );
      setLibraryName(selectedSMLibraryDetails.description);
      setGlobalFacilityId(selectedSMLibraryDetails.globalFacilityId);
    }
    loadStockMedicationsList();
  }, []);

  const loadStockMedicationsList = () => {
    const selectedSortDirection = sessionStorage.getItem(
      "stockMedicationsSelectedSortDirection"
    );
    let selectedSortColumn = sessionStorage.getItem(
      "stockMedicationsSelectedSortColumn"
    );
    if (selectedSortColumn) {
      setSortColumnName(selectedSortColumn);
    } else {
      setSortColumnName(SORT_COLUMNS.StockMedicationsSupply);
      selectedSortColumn = SORT_COLUMNS.StockMedicationsSupply;
    }
    if (selectedSortDirection === SortDirection.Ascending) {
      setSortDirection(SortDirection.Ascending);
      setIsDescending(false);
      getStockMedicationsList(pagination.pageNumber, false, selectedSortColumn);
    } else {
      setSortDirection(SortDirection.Descending);
      setIsDescending(true);
      getStockMedicationsList(pagination.pageNumber, true, selectedSortColumn);
    }
  };

  // used open slider to Add New Stock Medications
  const btnAddNewClick = () => {
    btnAddNewStockMedicationsRef.current?.blur();
    setIsStockMedicationOpened(true);
    setAddNewMode(true);
    document.body.style.overflow = "hidden";
  };

  const btnDeleteStockMedicationsClick = () => {
    btnDeleteStockMedicationsRef.current?.blur();
    setShowApiResponseMsg(false);
    setShowConfirmDeleteModal(true);
  };

  const btnExportSelectedClick = () => {
    if (selectedStockMedIds) {
      setShowExportModal(true);
      setDialogTitle(
        STOCK_MED_MESSAGES.Export_Dialog_Title(
          selectedStockMedIds.split(",").length
        )
      );
    }
  };

  const btnExportListClick = () => {
    if (stockMedicationsList.length > 0 && !searchText.search) {
      setSelectedStockMedIds("all");
      setDialogTitle(
        STOCK_MED_MESSAGES.Export_Dialog_Title(pagination.totalActiveElements)
      );
      stockMedicationsList.forEach((item) => {
        item.isChecked = true;
      });
      if (btnMasterSelectRef.current) {
        btnMasterSelectRef.current.indeterminate = false;
        btnMasterSelectRef.current.checked = true;
      }
      setIsMasterChecked(true);
      setShowExportModal(true);
      setIsDeleteEnabled(true);
    }
  };

  const hideOverlay = (isModified: boolean) => {
    if (isModified) {
      setIsStockMedicationOpened(false);
      document.body.style.overflow = "visible";
      setEditStockMedId(0);
    }
  };

  const closeStockMedPopup = (isSucceed: boolean, message?: string) => {
    if (isSucceed) {
      setShowApiResponseMsg(true);
      setRequestResponse({
        textMessage: message,
        alertClassName: "alert alert-success floating",
      });
      setTimeout(() => {
        setShowApiResponseMsg(false);
      }, 5000);
      getStockMedicationsList(1, false, sortColumnName);
    }
    setIsStockMedicationOpened(false);
    document.body.style.overflow = "visible";
    setEditStockMedId(0);
  };

  const closeApiResponseMsg = () => {
    setShowApiResponseMsg(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let search, newpagination;
    const value = (e.target as HTMLInputElement).value;
    const name = (e.target as HTMLInputElement).name;
    if (value.length >= 2) {
      if (name === "search") {
        searchText.search = value;
      }
      setIsMasterChecked(false);
      setIsDeleteEnabled(false);
      if (btnMasterSelectRef.current) {
        btnMasterSelectRef.current.indeterminate = false;
        btnMasterSelectRef.current.checked = false;
      }
      getStockMedicationsList(
        pagination.pageNumber,
        isDescending,
        sortColumnName
      );
    } else {
      searchText.search = "";
      search = searchText;
      setSearchText(search);
      pagination.pageNumber =
        value === ""
          ? parseInt(sessionStorage.getItem("stockMedicationsListPageNumber")!)
          : 1;
      newpagination = pagination;
      setPagination(newpagination);
      getStockMedicationsList(
        pagination.pageNumber,
        isDescending,
        sortColumnName
      );
    }
    // Create an array to store random values
    const randomValues = new Uint32Array(1);
    // Use crypto.getRandomValues() to fill the array with cryptographically secure random values
    crypto.getRandomValues(randomValues);
    // Access the random value from the array
    const random = randomValues[0] / (0xffffffff + 1);
    // Use the random value as needed
    setRemountComponent(random);
  };

  // used to handle & load the data into grid based on page number
  const handlePageClick = (page: number) => {
    pagination.pageNumber = page;
    sessionStorage.setItem("stockMedicationsListPageNumber", page.toString());
    let newPagination = pagination;
    if (isMasterChecked) {
      if (btnMasterSelectRef.current) {
        btnMasterSelectRef.current.indeterminate = true;
      }
    }
    setPagination(newPagination);
    getStockMedicationsList(
      pagination.pageNumber,
      isDescending,
      sortColumnName
    );
  };

  // used to load the stock medications list data
  const getStockMedicationsList = useCallback(
    async (
      pageNumber: number,
      isSortDescending: boolean,
      sortColumn?: string
    ) => {
      const pageNum = pageNumber || 1;
      let selectedSMLibraryDetails;
      if (sessionStorage.getItem("selectedSMSupplyLibraryDetails")) {
        selectedSMLibraryDetails = JSON.parse(
          sessionStorage.getItem("selectedSMSupplyLibraryDetails")!
        );  
        setGlobalFacilityId(selectedSMLibraryDetails.globalFacilityId);
      }
      try {
        const response: IStockMedicationsListResponse = await getStockMedList(
          pageNum,
          searchText.search,
          pagination.countPerPage,
          isSortDescending,
          sortColumn,
          selectedSMLibraryDetails?.globalFacilityId
        );
        setIsMasterChecked(false);
        setIsDeleteEnabled(false);
        const { stockMedication, pagination: responsePagination } =
          response || {};

        if (stockMedication !== undefined && stockMedication?.length > 0) {
          const sortedStockMedications = sortStockMedListRecords(
            stockMedication,
            isSortDescending,
            sortColumn
          );
          setSelectedStockMedIds((prevIds) => {
            const idsToCheck =
              prevIds !== ""
                ? prevIds.split(",").map((id) => parseInt(id.trim(), 10))
                : null;
            const updatedStockMeds = sortedStockMedications.map((item) => {
              if (idsToCheck?.includes(item.stockMedicationListId)) {
                return { ...item, isChecked: true };
              } else {
                return { ...item, isChecked: false };
              }
            });
            setIsMasterChecked(
              sortedStockMedications.length ===
              updatedStockMeds.filter((x) => x.isChecked === true).length
            );
            if (
              btnMasterSelectRef.current &&
              sortedStockMedications.length ===
              updatedStockMeds.filter((x) => x.isChecked === true).length
            ) {
              btnMasterSelectRef.current.indeterminate = false;
            }
            setStockMedicationsList(updatedStockMeds);
            const NoOfRecords = prevIds !== "" ? prevIds.split(",").length : 0;
            const msg = STOCK_MED_MESSAGES.Delete_Warning_Message(
              NoOfRecords === 1 ? "this" : NoOfRecords
            );
            setDeleteWarningMessage(msg);
            setIsDeleteEnabled(NoOfRecords > 0);
            return prevIds;
          });
          pagination.countPerPage = responsePagination?.size;
          pagination.pageNumber = responsePagination?.number;
          pagination.totalCount = responsePagination?.totalElements;
          pagination.totalActiveElements =
            responsePagination.totalActiveElements;
          pagination.totalPages =
            responsePagination?.totalPages || (responsePagination ? 2 : 0);
          let newPagination = pagination;
          setPagination(newPagination);
        } else {
          const emptyList: IStockMedicationsList[] = [];
          setStockMedicationsList(emptyList);
          if (btnMasterSelectRef.current) {
            btnMasterSelectRef.current.checked = false;
            btnMasterSelectRef.current.indeterminate = false;
          }
          setIsMasterChecked(false);
          setIsDeleteEnabled(false);
        }
        // Create an array to store random values
        const randomValues = new Uint32Array(1);
        // Use crypto.getRandomValues() to fill the array with cryptographically secure random values
        crypto.getRandomValues(randomValues);
        // Access the random value from the array
        const random = randomValues[0] / (0xffffffff + 1);
        // Use the random value as needed
        setRemountComponent(random);
      } catch (e) {
        console.error(
          "An error occurred during fetching stock medication list:",
          e
        );
        setIsLoadingData(false);
      } finally {
        setIsLoadingData(false);
      }
    },
    [pagination, searchText, isMasterChecked]
  );

  const getLowerCaseProperty = (
    item: IStockMedicationsList,
    propertyName: string
  ) => item[propertyName]?.toLowerCase();

  const sortStockMedListRecords = (
    stockMedListRecords: IStockMedicationsList[],
    isSortDescending?: boolean,
    sortColumnName?: string
  ) => {
    sessionStorage.setItem(
      "stockMedicationsSelectedSortColumn",
      sortColumnName!
    );
    const getSortValue = (
      a: IStockMedicationsList,
      b: IStockMedicationsList,
      propertyName: string
    ) => {
      const valueA = getLowerCaseProperty(a, propertyName);
      const valueB = getLowerCaseProperty(b, propertyName);
      return isSortDescending
        ? (valueB ?? "").localeCompare(valueA ?? "")
        : (valueA ?? "").localeCompare(valueB ?? "");
    };

    switch (sortColumnName) {
      case SORT_COLUMNS.StockMedicationsSupply: {
        return stockMedListRecords.sort((a, b) =>
          getSortValue(a, b, "fdbDescription")
        );
      }
      case SORT_COLUMNS.AssignedTo: {
        return stockMedListRecords.sort((a, b) =>
          getSortValue(a, b, "assignedTo")
        );
      }
      default:
        return stockMedListRecords;
    }
  };

  // sort
  const sortStockMedications = (dir: string, columnName?: string) => {
    setSortColumnName(columnName!);
    sessionStorage.setItem(
      "stockMedicationsSelectedSortDirection",
      dir === SortDirection.Ascending
        ? SortDirection.Descending
        : SortDirection.Ascending
    );
    sessionStorage.setItem("stockMedicationsSelectedSortColumn", columnName!);
    if (dir === SortDirection.Ascending) {
      setSortDirection(SortDirection.Descending);
      setIsDescending(true);
      getStockMedicationsList(pagination.pageNumber, true, columnName);
    } else {
      setSortDirection(SortDirection.Ascending);
      setIsDescending(false);
      getStockMedicationsList(pagination.pageNumber, false, columnName);
    }
  };

  const handleMasterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMasterChecked && e?.target.checked) {
      setSelectedStockMedIds("");
    }
    stockMedicationsList.forEach((item) => {
      item.isChecked = e?.target.checked;
    });
    setIsMasterChecked(e?.target.checked);
    setIsDeleteEnabled(e?.target.checked);
    setAddNewMode(e?.target.checked);
    const checkedIds = stockMedicationsList
      .filter((item) => item.isChecked)
      .map((item) => item.stockMedicationListId);
    const resultString: string = checkedIds.join(", ");
    if (!e?.target.checked && resultString === "") {
      setSelectedStockMedIds("");
      setDeleteWarningMessage("");
    } else {
      updateSelectedStockMedIds(resultString);
    }
  };

  const handleStockMedSelect = (
    stockMedItem: IStockMedicationsList,
    index: number
  ) => {
    const updatedList = [...stockMedicationsList];
    const isChecked = !stockMedItem.isChecked;
    updatedList[index].isChecked = isChecked;
    setStockMedicationsList(updatedList);

    const checkedStockMeds = updatedList.filter(
      (x: IStockMedicationsList) => x.isChecked
    );
    const allChecked = checkedStockMeds.length === updatedList.length;
    setIsMasterChecked(allChecked);
    setIsDeleteEnabled(checkedStockMeds.length > 0);

    if (btnMasterSelectRef.current) {
      if (checkedStockMeds.length === 0) {
        btnMasterSelectRef.current.checked = false;
        btnMasterSelectRef.current.indeterminate = false;
      } else if (checkedStockMeds.length === updatedList.length) {
        btnMasterSelectRef.current.checked = true;
        btnMasterSelectRef.current.indeterminate = false;
      } else {
        btnMasterSelectRef.current.checked = false;
        btnMasterSelectRef.current.indeterminate = true;
      }
    }

    const checkedIds = checkedStockMeds.map(
      (item) => item.stockMedicationListId
    );
    const resultString: string = checkedIds.join(", ");
    updateSelectedStockMedIds(resultString);

    const NoOfRecords = checkedIds.length;
    const msg = STOCK_MED_MESSAGES.Delete_Warning_Message(
      NoOfRecords === 1 ? "this" : NoOfRecords
    );
    setDeleteWarningMessage(msg);
  };

  const updateSelectedStockMedIds = (resultString: string) => {
    setSelectedStockMedIds((prevIds) => {
      const newIds = resultString
        .split(", ")
        .filter((id) => !prevIds.includes(id))
        .join(", ");
      const removeIds = prevIds
        .split(", ")
        .filter((id) => !resultString.split(", ").includes(id))
        .join(", ");
      let tempIds = "";
      let updatedIds = "";
      const removeIdsArray = removeIds.split(", ");
      if (removeIds !== "") {
        removeIdsArray.forEach((item) => {
          const sm = stockMedicationsList.find(
            (x) => x.stockMedicationListId.toString() === item
          );
          if (sm && !sm.isChecked) {
            const updatedIds = prevIds.split(", ").filter((id) => id !== item);
            tempIds = updatedIds.join(", ");
          }
        });
      }
      if (newIds === "" && tempIds !== "") {
        updatedIds = tempIds;
      } else if (prevIds && newIds) {
        updatedIds = newIds ? `${prevIds}, ${newIds}` : prevIds;
      } else if (newIds !== "") {
        updatedIds = newIds;
      }
      if (resultString === "") {
        updatedIds = updatedIds;
        setDeleteWarningMessage("");
      } else {
        const NoOfRecords = updatedIds.split(",").length;
        const msg = STOCK_MED_MESSAGES.Delete_Warning_Message(
          NoOfRecords === 1 ? "this" : NoOfRecords
        );
        setDeleteWarningMessage(msg);
      }
      return updatedIds;
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    // Trigger the click handler if the Enter key or Space bar is pressed
    if (event.key === "Enter" || event.key === "Space") {
      renderSortIcon();
    }
  };

  const renderSortIcon = (columnName?: string) => {
    if (stockMedicationsList?.length === 0) {
      return (
        <i
          data-testid="sort-stock-medications"
          className={`${AppConstant.InactiveSortIcon} ml-1`}
        ></i>
      );
    } else {
      const isSorting = columnName === sortColumnName;
      let direction = "";
      let arrowIcon =
        sortDirection === SortDirection.Ascending
          ? AppConstant.AscendingSortIcon
          : AppConstant.DescendingSortIcon;
      if (!isSorting) {
        arrowIcon = AppConstant.AscendingSortIcon;
        direction = SortDirection.Descending;
      } else {
        direction =
          sortDirection === SortDirection.Ascending
            ? SortDirection.Ascending
            : SortDirection.Descending;
      }
      const onClickHandler = () => sortStockMedications(direction, columnName);

      return (
        <span
          data-testid={`sort-stock-medications-` + columnName}
          onKeyDown={handleKeyPress}
          onClick={onClickHandler}
          aria-hidden={true}
        >
          <button
            className={`p-0 bg-transparent border-0 tree-check-uncheck-button ml-1 ${columnName === sortColumnName
              ? arrowIcon
              : AppConstant.InactiveSortIcon
              } ml-1`}
          ></button>
        </span>
      );
    }
  };

  const checkKeysAllowedRowsItem = (event: React.KeyboardEvent<HTMLButtonElement>, id: number) => {
    if (event.key !== "Tab" && event.key !== "Shift") {
      editStockMedSupply(id);
    }
  }

  const confirmDeleteOk = async () => {
    setShowConfirmDeleteModal(false);
    setShowApiResponseMsg(false);
    const deleteResponse = await deleteStockMedications(selectedStockMedIds);
    setShowApiResponseMsg(true);
    if (deleteResponse?.status !== 200) {
      setRequestResponse({
        textMessage: deleteResponse?.data?.responseMessage,
        alertClassName: "alert alert-danger floating",
      });
    } else if (deleteResponse?.status === 200) {
      if (btnMasterSelectRef.current) {
        btnMasterSelectRef.current.indeterminate = false;
      }
      resetFlagsForDeleteAndExportModal();
      getStockMedicationsList(1, isDescending, sortColumnName);
      setRequestResponse({
        textMessage: StockMedications.DeleteMessage,
        alertClassName: "alert alert-success floating",
      });
      setIsStockMedicationOpened(false);
      document.body.style.overflow = "visible";
      setEditStockMedId(0);
      setTimeout(() => {
        setShowApiResponseMsg(false);
      }, 5000);
    }
  };

  const confirmDeleteCancel = () => {
    setShowConfirmDeleteModal(false);
    resetFlagsForDeleteAndExportModal();
    setResetFocus(true);
  };

  const confirmExport = (isExported: boolean, message: string) => {
    if (message && isExported) {
      setRequestResponse({
        textMessage: message,
        alertClassName: "alert alert-success floating",
      });
      setShowApiResponseMsg(true);
      setTimeout(() => {
        setShowApiResponseMsg(false);
      }, 5000);
    }
    setShowExportModal(false);
    setIsImport(false);
    resetFlagsForDeleteAndExportModal();
    getStockMedicationsList(1, false, sortColumnName);
  };

  const resetFlagsForDeleteAndExportModal = () => {
    setIsDeleteEnabled(false);
    setIsMasterChecked(false);
    setDeleteWarningMessage("");
    stockMedicationsList.forEach((item) => {
      item.isChecked = false;
    });
    setSelectedStockMedIds("");
    if (btnMasterSelectRef.current) {
      btnMasterSelectRef.current.indeterminate = false;
    }
  };

  const confirmExportCancel = () => {
    setShowExportModal(false);
    setIsImport(false);
    resetFlagsForDeleteAndExportModal();
  };

  const editStockMedSupply = (Id: number) => {
    if (Id) {
      setIsStockMedicationOpened(true);
      setAddNewMode(false);
      setEditStockMedId(Id);
      setSelectedStockMedIds("");
      setIsMasterChecked(false);
      setIsDeleteEnabled(false);
      if (btnMasterSelectRef.current) {
        btnMasterSelectRef.current.indeterminate = false;
        btnMasterSelectRef.current.checked = false;
      }
      stockMedicationsList.forEach((item) => {
        item.isChecked = false;
      });
      document.body.style.overflow = "hidden";
    }
  };

  const deleteStockMedication = (Id: number) => {
    if (Id) {
      setShowConfirmDeleteModal(true);
      const msg = STOCK_MED_MESSAGES.Delete_Warning_Message("this");
      setDeleteWarningMessage(msg);
      setSelectedStockMedIds(Id?.toString());
      setResetFocus(false);
    }
  };

  const toggleMasterSelect = (status: boolean) => {
    if (status && btnMasterSelectRef.current) {
      btnMasterSelectRef.current.indeterminate = false;
      btnMasterSelectRef.current.checked = true;
      stockMedicationsList.forEach((item) => {
        item.isChecked = true;
      });
    }
    setIsMasterChecked(status);
  };

  const backToPreviousPage = () => {
    let rediretcUrl = "";
    if (isRedirectToFacilitySetup) {
      rediretcUrl = `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}/${selectedFacility?.facilityId}`;
    } else {
      rediretcUrl = `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationStockMedList}`;
    }
    navigate(rediretcUrl, {
      state: {
        isFromStockMedicationList: "true",
        isFromFacilityList: JSON.stringify(selectedFacility),
      },
    });
  };

  const btnImportSMSupplyClick = () => {
    btnImportSMSupplyRef?.current?.blur();
    setIsImport(true);
    setShowExportModal(true);
    setSelectedStockMedIds("all");
    setIsMasterChecked(false);
    stockMedicationsList.forEach((item) => {
      item.isChecked = false;
    });
    if (btnMasterSelectRef.current) {
      btnMasterSelectRef.current.indeterminate = false;
      btnMasterSelectRef.current.checked = false;
    }
    setDialogTitle(STOCK_MED_MESSAGES.Import_Dialog_Title(null));
  };

  if (!stockMedicationListEditPermission && !isLoading) {
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
          requestResponse.textMessage && (
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
          )}
      </div>
      {isLoading ? (
        <LoadSpinner />
      ) : (
        <>
          <div className="row">
            <div className="col-12 mt-3">
              <h1>{libraryName}</h1>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-8 col-sm-12 mt-1">
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
                id="btnAddNewStockMedications"
                data-testid="btnAddNewStockMedications"
                className="btn btn-primary"
                ref={btnAddNewStockMedicationsRef}
                onClick={btnAddNewClick}
                disabled={isDeleteEnabled}
              >
                Add New
              </button>
              {stockMedicationListCopyPermission && (
                <>
                  <button
                    type="button"
                    data-testid="btnImportSMSupply"
                    ref={btnImportSMSupplyRef}
                    onClick={btnImportSMSupplyClick}
                    className="btn btn-default-neo-primary-3"
                  >
                    Import
                  </button>
                  <button
                    data-testid="btnExportStockMedications"
                    className={`btn btn-default-neo-primary-3 dropdown-toggle Export-dropdown-toggle`}
                    id="btnExportStockMedications"
                    type="button"
                    disabled={stockMedicationsList.length === 0}
                    data-toggle={
                      stockMedicationsList.length === 0 ? "" : "dropdown"
                    }
                  >
                    Export
                  </button>
                </>
              )}

              {stockMedicationListInactivatePermission && (
                <button
                  type="button"
                  data-testid="btnDeleteStockMedications"
                  disabled={!isDeleteEnabled}
                  className="btn btn-danger"
                  ref={btnDeleteStockMedicationsRef}
                  onClick={btnDeleteStockMedicationsClick}
                >
                  Delete
                </button>
              )}

              {stockMedicationsList.length > 0 && (
                <div
                  className="dropdown-menu"
                  aria-labelledby="btnExportStockMedications"
                >
                  <button
                    data-testId="btnExportSelected"
                    className={`dropdown-item ${selectedStockMedIds === "" ? "export-disabled-item" : ""
                      }`}
                    onClick={btnExportSelectedClick}
                  >
                    Export Selected
                  </button>
                  <button
                    data-testId="btnExportList"
                    className={`dropdown-item ${stockMedicationsList.length === 0 || searchText.search
                      ? "export-disabled-item"
                      : ""
                      }`}
                    onClick={btnExportListClick}
                  >
                    Export List
                  </button>
                </div>
              )}
            </div>
            <div className="search col-md-4 col-sm-12">
                <i className="fa-regular fa-magnifying-glass"
                  style={{ left: "17px" }}
                ></i>
              <input
                name="search"
                type="search"
                id="txtSearch"
                className="form-control"
                autoComplete="off"
                placeholder="Search"
                data-testid="txtSearch"
                onChange={handleSearch}
                autoFocus
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12">
              <div className="table-responsive table-height-wrapper">
                <table className="table table-sm table-striped stock-med-list table-hover dark-border-header">
                  <thead>
                    <tr>
                      <th className="dark-border-header stock-med-list master-checkbox w-5">
                        <div
                          id="chkIndeterminate"
                          className={`${!isMasterChecked &&
                            !isImport &&
                            selectedStockMedIds !== ""
                            ? "chk-indeterminate"
                            : "blank-checkbox"
                            }`}
                        >
                          <label
                            data-testId="toggleMasterSelect"
                            onClick={(e) =>
                              toggleMasterSelect(!isMasterChecked)
                            }
                            htmlFor="masterSelect"
                            className={`mb-0`}
                            style={{ color: "transparent" }}
                          >
                            0
                          </label>
                          <input
                            id="masterSelect"
                            data-testid="masterSelect"
                            type="checkbox"
                            value="masterSelect"
                            checked={isMasterChecked}
                            ref={btnMasterSelectRef}
                            disabled={stockMedicationsList.length === 0}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleMasterSelect(e)}
                          />
                        </div>
                      </th>
                      <th className="dark-border-header stock-med-list w-25">
                        Medication/Supply
                        {renderSortIcon(SORT_COLUMNS.StockMedicationsSupply)}
                      </th>
                      <th className="dark-border-header stock-med-list">
                        Assigned To
                        {renderSortIcon(SORT_COLUMNS.AssignedTo)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockMedicationsList?.length === 0 ? (
                      <tr>
                        <td className="no-data" colSpan={3}>
                          <aside>{StockMedications.NoMatchesFound}</aside>
                        </td>
                      </tr>
                    ) : (
                      stockMedicationsList?.map(
                        (itm: IStockMedicationsList, index: number) => (
                          <tr key={itm?.stockMedicationListId}>
                            <td className="text-center w-5">
                              <label
                                id={`${itm.stockMedicationListId}`}
                                htmlFor={`${itm.stockMedicationListId}`}
                                className="invisible"
                              >
                                0
                              </label>
                              <input
                                id={`${itm.stockMedicationListId}`}
                                data-testid={`${itm.stockMedicationListId}`}
                                type="checkbox"
                                checked={itm.isChecked}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => handleStockMedSelect(itm, index)}
                              />
                            </td>

                            <td className="w-25">
                              <button
                                className="anchor-button custom-medication-name align-btn-left"
                                data-testid="stockMedSupplyName"
                                onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => checkKeysAllowedRowsItem(event, itm.stockMedicationListId)}
                                onClick={() =>
                                  editStockMedSupply(itm.stockMedicationListId)
                                }
                              >
                                {itm.fdbDescription}
                              </button>
                            </td>
                            <td className="assignedTo">{itm.assignedTo}</td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
                {stockMedicationsList?.length > 0 && (
                  <div key={remountComponent}>
                    {pagination && pagination?.totalPages > 1 && (
                      <Paging
                        pagination={pagination}
                        onPageChange={handlePageClick}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {isStockMedicationOpened && (
        <StockMedication
          isStockMedicationOpened={isStockMedicationOpened}
          addNewMode={addNewMode}
          editStockMedId={editStockMedId}
          setIsStockMedicationOpened={setIsStockMedicationOpened}
          onOverLayClick={hideOverlay}
          onCloseStockMedication={closeStockMedPopup}
          onDeleteStockMedication={deleteStockMedication}
          onDeleteModalResetFocus={resetFocus}
        />
      )}
      <ConfirmDeleteDialog
        data-testid="btnDelete"
        showConfirmDeleteModal={showConfirmDeleteModal}
        iconClass={AppConstant.ConfirmDialogWarningIcon}
        title={StockMedications.DeleteStockMedConfirmDialogTitle}
        messageTitle={deleteWarningMessage}
        messageContent={
          CustomMedicationMessages.DeleteCustomMedConfirmDialogMessageContent
        }
        confirmButtonText={StockMedications.DeleteText}
        cancelButtonText={StockMedications.DeleteStockMedCancelButtonText}
        confirmOk={confirmDeleteOk}
        confirmCancel={confirmDeleteCancel}
      ></ConfirmDeleteDialog>
      <ExportSMSupplyDialog
        data-testid="ExportModal"
        showConfirmModal={showExportModal}
        iconClass={""}
        title={dialogTitle}
        isImport={isImport}
        confirmButtonText={
          isImport
            ? StockMedications.ImportDialogOkBtnText
            : StockMedications.ExportDialogOkBtnText
        }
        cancelButtonText={StockMedications.ExportDialogCancelBtnText}
        selectedStockMedIds={selectedStockMedIds}
        selectedCount={
          selectedStockMedIds === "all"
            ? pagination.totalActiveElements
            : selectedStockMedIds.split(",").length
        }
        confirmOk={confirmExport}
        confirmCancel={confirmExportCancel}
      ></ExportSMSupplyDialog>
    </div>
  );
};
export default StockMedicationsList;
