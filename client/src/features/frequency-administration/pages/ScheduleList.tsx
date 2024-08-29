import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  deleteScheduleAdministration,
  getAdministrationScheduleList,
} from "../../../services/FrequencyAdministrationService";
import Paging from "../../../shared/pages/Pagination";
import { IAdministrationScheduleListResponse } from "../../../models/interface/IAdministrationScheduleListResponse";
import { IAdministrationScheduleList } from "../../../models/interface/IAdministrationScheduleList";
import ConfirmDeleteDialog from "../../../shared/pages/ConfirmDeleteDialog";
import {
  SCHEDULE_MESSAGES,
  FrequencyAdministration,
  SORT_COLUMNS,
} from "../../../shared/enum/FrequencyAdministrationValidationMessages";
import { CustomMedicationMessages } from "../../../shared/enum/CustomMedMsgEnums";
import { AppConstant } from "../../../shared/constants/AppConstant";
import { SortDirection } from "../../../shared/enum/SortDirection";
import ExportSchedules from "./ExportSchedules";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { FacilityDefaultValues } from "../../../shared/enum/ApiEndPoints";
import { OrderPlatformConfigurationRouteEnum } from "../../../shared/enum/OrderPlatFormConfigurationEnum";
import LoadSpinner from "../../../shared/common-ui/LoadSpinner";

const ScheduleList = () => {
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const basePath = hostContext.basePath;
  window.history.replaceState("", ""); // used for clearing the location state
  const navigate = useNavigate(); // used for navigation
  const { state } = useLocation(); // used for capturing the save/update message
  const btnAssignScheduleRef = useRef<HTMLButtonElement>(null);
  const btnDeleteScheduleRef = useRef<HTMLButtonElement>(null);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);
  const [isDescending, setIsDescending] = useState<boolean>(false);
  const [isMasterChecked, setIsMasterChecked] = useState<boolean>(false);
  const [administrationScheduleList, setAdministrationScheduleList] = useState<
    IAdministrationScheduleList[]
  >([]); // used for displaying the results on UI in a table
  const [sortDirection, setSortDirection] = useState<string>(
    SortDirection.Ascending
  ); // used for setting the Sorted Direction and Sort Icon
  const [sortColumnName, setSortColumnName] = useState<string>("");
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string>("");
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
      sessionStorage.getItem("scheduleListPageNumber") != null
        ? parseInt(sessionStorage.getItem("scheduleListPageNumber")!)
        : 1,
    totalCount: 0,
    totalPages: 0,
    totalActiveElements: 0,
  });
  const [showApiResponseMsg, setShowApiResponseMsg] = useState<boolean>(false);
  const [isExportSchedulesOpened, setIsExportSchedulesOpened] =
    useState<boolean>(false);
  // used to set the message post save and update schedule or can be used to show any msg on top of the page
  const [requestResponse, setRequestResponse] = useState({
    textMessage: state ?? "",
    alertClassName: state ? "alert alert-success floating" : "",
  });
  const btnMasterSelectRef = useRef<HTMLInputElement>(null);
  const [isRedirectToFacilitySetup, setIsRedirectToFacilitySetup] =
    useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<IUserFacility>();
  const btnImportSchedulesRef = useRef<HTMLButtonElement>(null);
  const [isImport, setIsImport] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [administrationScheduleListName, setAdministrationScheduleListName] = useState<string>("Administration Schedule List");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingHostContext, setIsLoadingHostContext] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [
    frequencyAdministrationScheduleListInactivate,
    setFrequencyAdministrationScheduleListInactivate,
  ] = useState(false);
  const [
    frequencyAdministrationScheduleListCopy,
    setFrequencyAdministrationScheduleListCopy,
  ] = useState(false);

  const [
    frequencyAdministrationScheduleListEditPermission,
    setFrequencyAdministrationScheduleListEditPermission,
  ] = useState(false);

  window.setTimeout(() => {
    setIsLoading(isLoadingData || isLoadingHostContext);
  }, 100);

  useEffect(() => {
    setFrequencyAdministrationScheduleListInactivate(
      hostContext.permission.frequencyAdministrationScheduleListInactivate ??
      false
    );
    setFrequencyAdministrationScheduleListCopy(
      hostContext.permission.frequencyAdministrationScheduleListCopy ?? false
    );
    setFrequencyAdministrationScheduleListEditPermission(
      hostContext.permission.frequencyAdministrationScheduleListEdit ?? false
    );
    setIsLoadingHostContext(false);
  }, [hostContext]);

  // used to navigate to a Add New Schedule
  const btnAddNewScheduleClick = () => {
    if (hostContext.basePath) {
      navigate(`${basePath}/add-schedule`);
    } else {
      navigate("/add-schedule");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("selectedAdministrationScheduleDetails")) {
      const selectedScheduleObj = JSON.parse(
        sessionStorage.getItem("selectedAdministrationScheduleDetails")!
      );
      setAdministrationScheduleListName(selectedScheduleObj.description)
    }
  }, []);

  const btnAssignScheduleClick = () => {
    btnAssignScheduleRef.current?.blur();
  };

  const btnDeleteScheduleClick = () => {
    btnDeleteScheduleRef.current?.blur();
    setShowApiResponseMsg(false);
    setShowConfirmDeleteModal(true);
  };

  const checkKeysAllowedRowsItem = (event: React.KeyboardEvent<HTMLButtonElement>, id: number) => {
    if (event.key !== "Tab" && event.key !== "Shift") {
      navigateToEditSchedule(
        id
      )
    }
  }

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

  const closeApiResponseMsg = () => {
    setShowApiResponseMsg(false);
  };

  useEffect(() => {
    const isFromFacilitySetUp = sessionStorage.getItem(
      "navigatedFromFacilitySetupToAdministrationScheduleList"
    );
    let currentFacility = sessionStorage.getItem(
      "selectedFacilityForAdministrationScheduleList"
    );

    if (isFromFacilitySetUp) {
      setIsRedirectToFacilitySetup(Boolean(isFromFacilitySetUp));
    }
    if (currentFacility) {
      setSelectedFacility(JSON.parse(currentFacility));
    }
    sessionStorage.removeItem(
      "navigatedFromFacilitySetupToAdministrationScheduleList"
    );
    sessionStorage.removeItem("selectedFacilityForAdministrationScheduleList");
    loadScheduleList();
  }, []);

  const loadScheduleList = () => {
    const selectedSortDirection = sessionStorage.getItem(
      "scheduleListSelectedSortDirection"
    );
    let selectedSortColumn = sessionStorage.getItem(
      "scheduleListSelectedSortColumn"
    );
    if (selectedSortColumn) {
      setSortColumnName(selectedSortColumn);
    } else {
      setSortColumnName(SORT_COLUMNS.Frequency);
      selectedSortColumn = SORT_COLUMNS.Frequency;
    }
    if (selectedSortDirection === SortDirection.Ascending) {
      setSortDirection(SortDirection.Ascending);
      setIsDescending(false);
      getScheduleList(pagination.pageNumber, false, selectedSortColumn);
    } else {
      setSortDirection(SortDirection.Descending);
      setIsDescending(true);
      getScheduleList(pagination.pageNumber, true, selectedSortColumn);
    }
  };

  const navigateToEditSchedule = (id: number) => {
    if (hostContext.basePath) {
      navigate(`${basePath}/edit-schedule/${id}`);
    } else {
      navigate(`/edit-schedule/${id}`);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      getScheduleList(
        pagination.pageNumber,
        isDescending,
        sortColumnName,
        true
      );
    } else {
      searchText.search = "";

      search = searchText;
      setSearchText(search);
      pagination.pageNumber =
        value === ""
          ? parseInt(sessionStorage.getItem("scheduleListPageNumber")!)
          : 1;
      newpagination = pagination;
      setPagination(newpagination);
      getScheduleList(
        pagination.pageNumber,
        isDescending,
        sortColumnName,
        true
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
    sessionStorage.setItem("scheduleListPageNumber", page.toString());
    let newPagination = pagination;
    if (isMasterChecked) {
      if (btnMasterSelectRef.current) {
        btnMasterSelectRef.current.indeterminate = true;
      }
    }
    setPagination(newPagination);
    getScheduleList(pagination.pageNumber, isDescending, sortColumnName);
  };

  // used to load the schedule list data
  const getScheduleList = useCallback(
    async (
      pageNumber: number,
      isSortDescending: boolean,
      sortColumn?: string,
      isNewSearched: boolean = false
    ) => {
      const pageNum = pageNumber || 1;
      try {
        const response: IAdministrationScheduleListResponse =
          await getAdministrationScheduleList(
            pageNum,
            searchText.search,
            pagination.countPerPage,
            isSortDescending,
            sortColumn,
            FacilityDefaultValues.facilityId
          );
        setIsMasterChecked(false);
        setIsDeleteEnabled(false);
        const { administrationSchedule, pagination: responsePagination } =
          response || {};

        if (administrationSchedule?.length > 0) {
          const sortedAdministrationSchedule = sortScheduleListRecords(
            administrationSchedule,
            isSortDescending,
            sortColumn
          );
          setSelectedScheduleIds((prevIds) => {
            const idsToCheck =
              prevIds !== ""
                ? prevIds.split(",").map((id) => parseInt(id.trim(), 10))
                : null;
            const updatedSchedule = sortedAdministrationSchedule.map(
              (scheduleItem) => {
                if (
                  idsToCheck?.includes(scheduleItem.administrationScheduleId!)
                ) {
                  return { ...scheduleItem, isChecked: true };
                } else {
                  return { ...scheduleItem, isChecked: false };
                }
              }
            );

            setIsMasterChecked(
              sortedAdministrationSchedule.length ===
              updatedSchedule.filter((x) => x.isChecked === true).length
            );
            if (
              btnMasterSelectRef.current &&
              sortedAdministrationSchedule.length ===
              updatedSchedule.filter((x) => x.isChecked === true).length
            ) {
              btnMasterSelectRef.current.indeterminate = false;
            }
            setAdministrationScheduleList(updatedSchedule);
            const NoOfRecords = prevIds !== "" ? prevIds.split(",").length : 0;
            const msg =
              NoOfRecords === 1
                ? SCHEDULE_MESSAGES.SINGLE()
                : SCHEDULE_MESSAGES.MULTIPLE(NoOfRecords);

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
          setAdministrationScheduleList([]);
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
        console.error("An error occurred during fetching schedule list:", e);
        setIsLoadingData(false);
      } finally {
        setIsLoadingData(false);
      }
    },
    [pagination, searchText, isMasterChecked]
  );

  const getLowerCaseProperty = (
    item: IAdministrationScheduleList,
    propertyName: string
  ) => item[propertyName]?.toLowerCase();

  const sortScheduleListRecords = (
    scheduleLstRecords: IAdministrationScheduleList[],
    isSortDescending?: boolean,
    sortColumnName?: string
  ) => {
    sessionStorage.setItem("scheduleListSelectedSortColumn", sortColumnName!);
    const getSortValue = (
      a: IAdministrationScheduleList,
      b: IAdministrationScheduleList,
      propertyName: string
    ) => {
      const valueA = getLowerCaseProperty(a, propertyName);
      const valueB = getLowerCaseProperty(b, propertyName);
      return isSortDescending
        ? (valueB ?? "").localeCompare(valueA ?? "")
        : (valueA ?? "").localeCompare(valueB ?? "");
    };

    switch (sortColumnName) {
      case "Frequency": {
        return scheduleLstRecords.sort((a, b) =>
          getSortValue(a, b, "frequencyCode")
        );
      }
      case "Administration Schedule": {
        return scheduleLstRecords.sort((a, b) =>
          getSortValue(a, b, "description")
        );
      }
      case "Order Type": {
        return scheduleLstRecords.sort((a, b) =>
          getSortValue(a, b, "orderType")
        );
      }
      case "AssignedTo": {
        return scheduleLstRecords.sort((a, b) =>
          getSortValue(a, b, "assignedTo")
        );
      }
      default:
        return scheduleLstRecords;
    }
  };

  // sort
  const sortAdministrationSchedules = (dir: string, columnName?: string) => {
    setSortColumnName(columnName!);
    sessionStorage.setItem(
      "scheduleListSelectedSortDirection",
      dir === SortDirection.Ascending
        ? SortDirection.Descending
        : SortDirection.Ascending
    );
    sessionStorage.setItem("scheduleListSelectedSortColumn", columnName!);
    if (dir === SortDirection.Ascending) {
      setSortDirection(SortDirection.Descending);
      setIsDescending(true);
      getScheduleList(pagination.pageNumber, true, columnName);
    } else {
      setSortDirection(SortDirection.Ascending);
      setIsDescending(false);
      getScheduleList(pagination.pageNumber, false, columnName);
    }
  };

  const handleMasterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMasterChecked && e?.target.checked) {
      setSelectedScheduleIds("");
    }
    administrationScheduleList.forEach((item) => {
      item.isChecked = e?.target.checked;
    });
    setIsMasterChecked(e?.target.checked);
    setIsDeleteEnabled(e?.target.checked);
    const checkedIds = administrationScheduleList
      .filter((item) => item.isChecked)
      .map((item) => item.administrationScheduleId);
    const resultString: string = checkedIds.join(", ");
    if (!e?.target.checked && resultString === "") {
      setSelectedScheduleIds("");
      setDeleteWarningMessage("");
    } else {
      updateSelectedScheduleIds(resultString);
    }
  };

  const handleScheduleSelect = (
    scheduleItem: IAdministrationScheduleList,
    index: number
  ) => {
    const updatedList = [...administrationScheduleList];
    const isChecked = !scheduleItem.isChecked;
    updatedList[index].isChecked = isChecked;
    setAdministrationScheduleList(updatedList);

    const checkedScheduleIds = updatedList.filter(
      (x: IAdministrationScheduleList) => x.isChecked
    );
    const allChecked = checkedScheduleIds.length === updatedList.length;
    setIsMasterChecked(allChecked);
    setIsDeleteEnabled(checkedScheduleIds.length > 0);

    if (btnMasterSelectRef.current) {
      if (checkedScheduleIds.length === 0) {
        btnMasterSelectRef.current.checked = false;
        btnMasterSelectRef.current.indeterminate = false;
      } else if (checkedScheduleIds.length === updatedList.length) {
        btnMasterSelectRef.current.checked = true;
        btnMasterSelectRef.current.indeterminate = false;
      } else {
        btnMasterSelectRef.current.checked = false;
        btnMasterSelectRef.current.indeterminate = true;
      }
    }

    const checkedIds = checkedScheduleIds.map(
      (item) => item.administrationScheduleId
    );
    const resultString: string = checkedIds.join(", ");
    updateSelectedScheduleIds(resultString);

    const NoOfRecords = checkedIds.length;
    const msg =
      NoOfRecords === 1
        ? SCHEDULE_MESSAGES.SINGLE()
        : SCHEDULE_MESSAGES.MULTIPLE(NoOfRecords);
    setDeleteWarningMessage(msg);
  };

  const updateSelectedScheduleIds = (resultString: string) => {
    setSelectedScheduleIds((prevIds) => {
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
          const sm = administrationScheduleList.find(
            (x) => x.administrationScheduleId!.toString() === item
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
        const msg =
          NoOfRecords === 1
            ? SCHEDULE_MESSAGES.SINGLE()
            : SCHEDULE_MESSAGES.MULTIPLE(NoOfRecords);

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
    if (administrationScheduleList?.length === 0) {
      return (
        <i
          data-testid="sort-administration-schedules"
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
      const onClickHandler = () =>
        sortAdministrationSchedules(direction, columnName);

      return (
        <span
          data-testid="sort-administration-schedules"
          onKeyDown={handleKeyPress}
          onClick={onClickHandler}
          aria-hidden={true}
        >
          <button
            className={`p-0 bg-transparent border-0 tree-check-uncheck-button ${columnName === sortColumnName
              ? arrowIcon
              : AppConstant.InactiveSortIcon
              } ml-1`}
          ></button>
        </span>
      );
    }
  };

  const confirmDeleteOk = async () => {
    setShowConfirmDeleteModal(false);
    setShowApiResponseMsg(false);
    const deleteResponse = await deleteScheduleAdministration(
      selectedScheduleIds
    );
    setShowApiResponseMsg(true);
    if (deleteResponse?.data?.statusCode === 500) {
      setRequestResponse({
        textMessage: deleteResponse?.data?.responseMessage,
        alertClassName: "alert alert-danger floating",
      });
    } else if (deleteResponse?.status === 200) {
      if (btnMasterSelectRef.current) {
        btnMasterSelectRef.current.indeterminate = false;
      }
      setSelectedScheduleIds("");
      setDeleteWarningMessage("");
      setIsDeleteEnabled(false);
      setIsMasterChecked(false);
      getScheduleList(1, isDescending, sortColumnName);
      setRequestResponse({
        textMessage: deleteResponse?.data?.responseMessage,
        alertClassName: "alert alert-success floating",
      });
      setTimeout(() => {
        setShowApiResponseMsg(false);
      }, 5000);
    }
  };

  const confirmDeleteCancel = () => {
    setShowConfirmDeleteModal(false);
    setIsDeleteEnabled(false);
    setIsMasterChecked(false);
    administrationScheduleList.forEach((item) => {
      item.isChecked = false;
    });
    setSelectedScheduleIds("");
    if (btnMasterSelectRef.current) {
      btnMasterSelectRef.current.indeterminate = false;
    }
  };

  const btnExportSelectedClick = () => {
    if (selectedScheduleIds !== "") {
      setIsExportSchedulesOpened(true);
      setDialogTitle(
        SCHEDULE_MESSAGES.Export_Dialog_Title(
          selectedScheduleIds.split(",").length
        )
      );
    }
  };

  const resetFlagsForDeleteAndExportModal = () => {
    setIsDeleteEnabled(false);
    setIsMasterChecked(false);
    setDeleteWarningMessage("");
    administrationScheduleList.forEach((item) => {
      item.isChecked = false;
    });
    setSelectedScheduleIds("");
    if (btnMasterSelectRef.current) {
      btnMasterSelectRef.current.indeterminate = false;
    }
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
    setIsExportSchedulesOpened(false);
    setIsImport(false);
    resetFlagsForDeleteAndExportModal();
    getScheduleList(1, false, sortColumnName);
  };

  const confirmExportCancel = () => {
    setIsExportSchedulesOpened(false);
    setIsImport(false);
    resetFlagsForDeleteAndExportModal();
  };

  const btnExportListClick = () => {
    if (administrationScheduleList.length > 0 && !searchText.search) {
      setIsDeleteEnabled(true);
      setSelectedScheduleIds("all");
      administrationScheduleList.forEach((item) => {
        item.isChecked = true;
      });
      setIsMasterChecked(true);
      if (btnMasterSelectRef.current) {
        btnMasterSelectRef.current.indeterminate = false;
        btnMasterSelectRef.current.checked = true;
      }
      setIsExportSchedulesOpened(true);
      let scheduleListStr: string = "";
      administrationScheduleList.forEach((element) => {
        scheduleListStr =
          scheduleListStr + element.administrationScheduleId + ",";
      });
      scheduleListStr = scheduleListStr.slice(0, -1);
      setSelectedScheduleIds(scheduleListStr);
      setDialogTitle(
        SCHEDULE_MESSAGES.Export_Dialog_Title(scheduleListStr.split(",").length)
      );
    }
  };

  const closeExportPopup = (isSucceed: boolean, message?: string) => {
    if (message && isSucceed) {
      setRequestResponse({
        textMessage: message,
        alertClassName: "alert alert-success floating",
      });
      setShowApiResponseMsg(true);
      setTimeout(() => {
        setShowApiResponseMsg(false);
      }, 5000);
      getScheduleList(1, isDescending, sortColumnName);
    }
    setIsExportSchedulesOpened(false);
    setIsImport(false);
    administrationScheduleList.forEach((item) => {
      item.isChecked = false;
    });
    if (btnMasterSelectRef.current) {
      btnMasterSelectRef.current.indeterminate = false;
    }
    setSelectedScheduleIds("");
    setIsMasterChecked(false);
    setIsDeleteEnabled(false);
  };

  const toggleMasterSelect = (status: boolean) => {
    if (status && btnMasterSelectRef.current) {
      btnMasterSelectRef.current.indeterminate = false;
      btnMasterSelectRef.current.checked = true;
      administrationScheduleList.forEach((item) => {
        item.isChecked = true;
      });
    }
    setIsMasterChecked(status);
  };

  const btnImportScheduleClick = () => {
    btnImportSchedulesRef?.current?.blur();
    setIsImport(true);
    setIsExportSchedulesOpened(true);
    setSelectedScheduleIds("all");
    setIsMasterChecked(false);
    administrationScheduleList.forEach((item) => {
      item.isChecked = false;
    });
    if (btnMasterSelectRef.current) {
      btnMasterSelectRef.current.indeterminate = false;
      btnMasterSelectRef.current.checked = false;
    }
    setDialogTitle(SCHEDULE_MESSAGES.Import_Dialog_Title(null));
  };

  const backToPreviousPage = () => {
    let rediretcUrl = "";
    if (isRedirectToFacilitySetup) {
      rediretcUrl = `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}/${selectedFacility?.facilityId}`;
    } else {
      rediretcUrl = `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationAdministrationScheduleList}`;
    }
    navigate(rediretcUrl, {
      state: {
        isFromAdministrationScheduleList: "true",
        isFromFacilityList: JSON.stringify(selectedFacility),
      },
    });
  };

  if (!frequencyAdministrationScheduleListEditPermission && !isLoading) {
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
      {isLoading ? (
        <LoadSpinner />
      ) : (
        <>
          <div className="row">
            <div className="col-12 mt-3">
              <h1>{administrationScheduleListName}</h1>
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
                data-testid="btnAddNewSchedule"
                className="btn btn-primary"
                onClick={btnAddNewScheduleClick}
                disabled={isDeleteEnabled}
              >
                Add Schedule
              </button>
              {frequencyAdministrationScheduleListCopy && (
                <>
                  <button
                    type="button"
                    ref={btnImportSchedulesRef}
                    onClick={btnImportScheduleClick}
                    className="btn btn-default-neo-primary-3"
                    data-testid="btnImportSchedules"
                  >
                    Import
                  </button>
                  <button
                    data-testid="btnExportSchedules"
                    className="btn btn-default-neo-primary-3 dropdown-toggle Export-dropdown-toggle"
                    id="btnExportSchedules"
                    type="button"
                    disabled={administrationScheduleList.length === 0}
                    data-toggle={
                      administrationScheduleList.length === 0 ? "" : "dropdown"
                    }
                  >
                    Export
                  </button>
                </>
              )}

              {frequencyAdministrationScheduleListInactivate && (
                <button
                  type="button"
                  data-testid="btnDeleteSchedule"
                  disabled={!isDeleteEnabled}
                  ref={btnDeleteScheduleRef}
                  className="btn btn-danger"
                  onClick={btnDeleteScheduleClick}
                >
                  Delete
                </button>
              )}

              {administrationScheduleList.length > 0 && (
                <div
                  className="dropdown-menu"
                  aria-labelledby="btnExportSchedules"
                >
                  <button
                    className={`dropdown-item ${selectedScheduleIds === "" ? "export-disabled-item" : ""
                      }`}
                    onClick={btnExportSelectedClick}
                  >
                    Export Selected
                  </button>
                  <button
                    className={`dropdown-item ${administrationScheduleList.length === 0 ||
                      searchText.search
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
                aria-describedby="search-schedule"
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleSearch(e)
                }
                autoFocus
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className=" col-12">
              <div className="table-responsive table-height-wrapper">
                <table className="table table-sm table-striped schedule-list table-hover dark-border-header">
                  <thead>
                    <tr>
                      <th className="dark-border-header schedule-list master-checkbox w-5">
                        <div
                          id="chkIndeterminate"
                          className={`${!isMasterChecked &&
                            !isImport &&
                            selectedScheduleIds !== ""
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
                            disabled={administrationScheduleList.length === 0}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleMasterSelect(e)}
                          />
                        </div>
                      </th>
                      <th className="dark-border-header schedule-list w-5">
                        Flag
                      </th>
                      <th className="dark-border-header schedule-list w-10">
                        Frequency
                        {renderSortIcon(SORT_COLUMNS.Frequency)}
                      </th>
                      <th className="dark-border-header schedule-list w-30">
                        Administration Schedule
                        {renderSortIcon(SORT_COLUMNS.AdministrationSchedules)}
                      </th>
                      <th className="dark-border-header schedule-list w-20">
                        Order Type
                        {renderSortIcon(SORT_COLUMNS.OrderType)}
                      </th>
                      <th className="dark-border-header schedule-list w-30">
                        Assigned To
                        {renderSortIcon(SORT_COLUMNS.AssignedTo)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {administrationScheduleList?.length === 0 ? (
                      <tr>
                        <td className="no-data" colSpan={6}>
                          <aside>
                            {FrequencyAdministration.NoMatchesFound}
                          </aside>
                        </td>
                      </tr>
                    ) : (
                      administrationScheduleList?.map(
                        (itm: IAdministrationScheduleList, index: number) => (
                          <tr
                            key={
                              itm.administrationScheduleId! +
                              itm.description! +
                              index
                            }
                          >
                            <td className="schedule-checkbox w-5">
                              <label
                                id={`${itm.administrationScheduleId}`}
                                htmlFor={`${itm.administrationScheduleId}`}
                                className="invisible"
                              >
                                0
                              </label>
                              <input
                                id={`${itm.administrationScheduleId}`}
                                data-testid={`${itm.administrationScheduleId}`}
                                type="checkbox"
                                checked={itm.isChecked}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => handleScheduleSelect(itm, index)}
                              />
                            </td>
                            <td className="w-5">
                              {itm.isDefault && (
                                <div>
                                  <i className="fa fa-solid fa-gear"></i>
                                </div>
                              )}
                            </td>
                            <td className="w-10">
                              <button
                                className="anchor-button administration-schedule-name pointer align-btn-left"
                                data-testid="administrationScheduleName"
                                onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => checkKeysAllowedRowsItem(event, itm.administrationScheduleId!)}
                                onClick={() =>
                                  navigateToEditSchedule(
                                    itm.administrationScheduleId!
                                  )
                                }
                              >
                                {itm.frequencyCode}
                              </button>
                            </td>
                            <td className="w-30">{itm.description}</td>
                            <td className="w-20">{itm.orderType}</td>
                            <td className="assignedTo w-30">
                              {itm.assignedTo}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
                {administrationScheduleList?.length > 0 && (
                  <div key={remountComponent}>
                    <Paging
                      tableKeyHeader="Key"
                      tableKeyNoteIcon="fa fa-solid fa-gear"
                      tableKeyNote="Set as Default"
                      pagination={pagination}
                      onPageChange={handlePageClick}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <ConfirmDeleteDialog
        data-testid="btnDelete"
        showConfirmDeleteModal={showConfirmDeleteModal}
        iconClass={
          FrequencyAdministration.AdministrationScheduleConfirmDialogIcon
        }
        title={FrequencyAdministration.DeleteScheduleAdminConfirmDialogTitle}
        messageTitle={deleteWarningMessage}
        messageContent={
          CustomMedicationMessages.DeleteCustomMedConfirmDialogMessageContent
        }
        confirmButtonText={FrequencyAdministration.DeleteText}
        cancelButtonText={
          FrequencyAdministration.DeleteScheduleAdminCancelButtonText
        }
        confirmOk={confirmDeleteOk}
        confirmCancel={confirmDeleteCancel}
      ></ConfirmDeleteDialog>
      {isExportSchedulesOpened && (
        <ExportSchedules
          isImport={isImport}
          confirmButtonText={
            isImport
              ? FrequencyAdministration.ImportDialogOkBtnText
              : FrequencyAdministration.ExportDialogOkBtnText
          }
          cancelButtonText={
            FrequencyAdministration.DeleteScheduleAdminCancelButtonText
          }
          selectedCount={
            selectedScheduleIds === "all"
              ? pagination.totalActiveElements
              : selectedScheduleIds.split(",").length
          }
          title={dialogTitle}
          isExportSchedulesOpened={isExportSchedulesOpened}
          selectedScheduleIds={selectedScheduleIds}
          setIsExportSchedulesOpened={setIsExportSchedulesOpened}
          onCloseExportPopup={closeExportPopup}
          confirmOk={confirmExport}
          confirmCancel={confirmExportCancel}
        />
      )}
    </div>
  );
};
export default ScheduleList;
