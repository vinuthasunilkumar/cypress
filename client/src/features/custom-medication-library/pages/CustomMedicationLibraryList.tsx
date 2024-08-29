import React, { useCallback, useEffect, useRef, useState } from "react";
import LoadSpinner from "../../../shared/common-ui/LoadSpinner";
import { CustomMedicationLibraryMsgEnum } from "./../../../shared/enum/CustomMedicationLibrary";
import CustomMedicationLibrary from "./CustomMedicationLibrary";
import { useNavigate } from "react-router-dom";
import Paging from "../../../shared/pages/Pagination";
import { getCustomMedicationLibraryList } from "../../../services/CustomMedicationLibraryService";
import { ICustomMedicationLibraryListResponse } from "../../../models/interface/ICustomMedicationLibraryListResponse";
import { ICustomMedicationLibrary } from "../../../models/interface/ICustomMedicationLibrary";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { AppConstant } from "../../../shared/constants/AppConstant";

type CustomMedicationLibraryListType = {
  currentTab: string;
};

const CustomMedicationLibraryList = (
  props: CustomMedicationLibraryListType
) => {
  const navigate = useNavigate();
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const basePath = hostContext.basePath;

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingHostContext, setIsLoadingHostContext] = useState(true);
  const isLoading = isLoadingData || isLoadingHostContext;
  const [customMedLibraryList, setCustomMedLibraryList] = useState<
    ICustomMedicationLibrary[]
  >([]);
  const [sortDirection, setSortDirection] = useState("ASC"); // used for setting the Sorted Direction and Sort Icon
  const [showConfirmModal, setShowConfirmModal] = useState(false); // used for displaying the popup on Adding/Editing Library
  const btnAddNewLibraryRef = useRef<HTMLButtonElement>(null);
  const [libraryName, setLibraryName] = useState({
    search: "",
  }); // used for searching a library

  const corporationId = Number(hostContext?.parentId);
  const ectConfigId = Number(hostContext?.ectConfigId);
  // used for Handling the Pagination
  const [pagination, setPagination] = useState({
    countPerPage: 20,
    pageNumber:
      sessionStorage.getItem("libraryPageNumber") != null
        ? JSON.parse(sessionStorage.getItem("libraryPageNumber")!)
        : 1,
    totalCount: 0,
    totalPages: 0,
  });
  const [showPagination, setShowPagination] = useState(false);
  const [remountComponent, setRemountComponent] = useState(0);

  // Open the create new library Popup
  const createNewLibrary = () => {
    btnAddNewLibraryRef?.current?.blur();
    setShowConfirmModal(true);
  };

  const [
    customMedicationLibraryEditPermission,
    setCustomMedicationLibraryEditPermission,
  ] = useState(false);

  useEffect(() => {
    setCustomMedicationLibraryEditPermission(
      hostContext.permission.customMedicationLibraryEdit ?? false
    );
    setIsLoadingHostContext(false);
  }, [hostContext]);

  const searchElementFocus = () => {
    let searchElement = document.getElementById("txtCustomSearch");
    setTimeout(() => {
      searchElement?.focus();
    }, 50);
  };
  useEffect(() => {
    if (props?.currentTab === "verticalTab1") {
      searchElementFocus();
    }
  }, [props?.currentTab === "verticalTab1"]);

  useEffect(() => {
    setIsLoadingData(true);
    const selectedSortDirection = sessionStorage.getItem(
      "librariesSelectedSort"
    );
    if (selectedSortDirection == "DESC") {
      setSortDirection("DESC");
      getCustomMedicationLibraries(
        pagination.pageNumber,
        corporationId,
        ectConfigId,
        true
      );
    } else {
      setSortDirection("ASC");
      getCustomMedicationLibraries(
        pagination.pageNumber,
        corporationId,
        ectConfigId,
        false
      );
    }
  }, []);
  // used to handle the search medication & load the data into grid
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    const name = (e.target as HTMLInputElement).name;
    if (value.length >= 2) {
      if (name === "search") {
        libraryName.search = value;
      }
      let newLibraryName = libraryName;
      setLibraryName(newLibraryName);
      pagination.pageNumber = 1;
      let newPagination = pagination;
      setPagination(newPagination);
      getCustomMedicationLibraries(
        pagination.pageNumber,
        corporationId,
        ectConfigId,
        false
      );
    } else {
      let newLibraryName = libraryName;
      libraryName.search = "";
      setLibraryName(newLibraryName);
      pagination.pageNumber = parseInt(
        sessionStorage.getItem("customMedicationLibraryPageNumber")!
      );
      let newPagination = pagination;
      setPagination(newPagination);
      getCustomMedicationLibraries(
        pagination.pageNumber,
        corporationId,
        ectConfigId,
        false
      );
    }
    setPagination({
      countPerPage: 20,
      pageNumber: parseInt(
        sessionStorage.getItem("customMedicationLibraryPageNumber")!
      ),
      totalCount: 0,
      totalPages: 0,
    });
    // Create an array to store random values
    const randomValues = new Uint32Array(1);
    // Use crypto.getRandomValues() to fill the array with cryptographically secure random values
    crypto.getRandomValues(randomValues);
    // Access the random value from the array
    const random = randomValues[0] / (0xffffffff + 1);
    // Use the random value as needed
    setRemountComponent(random);
  };

  // used to load the custom medication libraries data
  const getCustomMedicationLibraries = useCallback(
    async (
      pageNumber: number,
      corporationId: number,
      ectConfigId: number,
      isSortDescending?: boolean
    ) => {
      const pageNum = pageNumber || 1;
      const response: ICustomMedicationLibraryListResponse =
        await getCustomMedicationLibraryList(
          pageNum,
          libraryName.search,
          pagination.countPerPage,
          corporationId,
          ectConfigId,
          isSortDescending
        );
      const { customMedicationLibraries, pagination: responsePagination } =
        response || {};

      if (customMedicationLibraries !== undefined) {
        const sortedLibraries = sortMedicationLibraries(
          customMedicationLibraries,
          isSortDescending
        );
        setCustomMedLibraryList(sortedLibraries);
        pagination.countPerPage = responsePagination?.size;
        pagination.pageNumber = responsePagination?.number;
        pagination.totalCount = responsePagination?.totalElements;
        pagination.totalPages =
          responsePagination?.totalPages || (responsePagination ? 2 : 0);
        setPagination(pagination);
        if (pagination.totalPages > 1) {
          setShowPagination(true);
        }
      } else {
        setCustomMedLibraryList([]);
      }
      // Create an array to store random values
      const randomValues = new Uint32Array(1);
      // Use crypto.getRandomValues() to fill the array with cryptographically secure random values
      crypto.getRandomValues(randomValues);
      // Access the random value from the array
      const random = randomValues[0] / (0xffffffff + 1);
      // Use the random value as needed
      setRemountComponent(random);
      setIsLoadingData(false);
    },
    [pagination]
  );

  const sortMedicationLibraries = (
    customMedicationLibraries: ICustomMedicationLibrary[],
    isSortDescending?: boolean
  ) => {
    return customMedicationLibraries.sort(
      (a: ICustomMedicationLibrary, b: ICustomMedicationLibrary) => {
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

  // used to handle & load the data into grid based on page number
  const handlePageClick = (page: number) => {
    sessionStorage.setItem("libraryPageNumber", page.toString());
    pagination.pageNumber = page;
    setPagination(pagination);
    const selectedSortDirection = sessionStorage.getItem(
      "librariesSelectedSort"
    );
    getCustomMedicationLibraries(
      pagination.pageNumber,
      corporationId,
      ectConfigId,
      selectedSortDirection === "ASC" ? false : true
    );
  };

  // sort a library name column in grid
  const sortLibraryName = (dir: string) => {
    sessionStorage.setItem(
      "librariesSelectedSort",
      dir == "ASC" ? "DESC" : "ASC"
    );
    if (dir === "ASC") {
      setSortDirection("DESC");
      getCustomMedicationLibraries(
        pagination.pageNumber,
        corporationId,
        ectConfigId,
        true
      );
    } else {
      setSortDirection("ASC");
      getCustomMedicationLibraries(
        pagination.pageNumber,
        corporationId,
        ectConfigId,
        false
      );
    }
  };

  if (props?.currentTab === "tab1" && pagination.pageNumber !== 1) {
    sessionStorage.setItem("librariesSelectedSort", "ASC");
    setSortDirection("ASC");
    handlePageClick(1);
  }
  // close a Create New Library Popup
  const cancelSaveNewLibrary = () => {
    setShowConfirmModal(false);
  };

  // navigate to Custom Medications List/summary page
  const navigateToCustomMedications = (id: number) => {
    sessionStorage.removeItem("navigatedFromFacilitySetupToCustomMedications");

    const obj = customMedLibraryList.find((x) => x.id === id);
    let selectedLibraryObj: ICustomMedicationLibrary = {
      id: obj?.id!,
      description: obj?.description!,
      isActive: obj?.isActive!,
      isAssigned: 0,
      corporationId: obj?.corporationId ? obj?.corporationId : 0,
    };
    sessionStorage.setItem(
      "selectedLibraryDetails",
      JSON.stringify(selectedLibraryObj)
    );
    navigate(`${basePath}/custom-medications/${id}`);
  };

  const sortingDirection = () => {
    return (
      <>
        {sortDirection === "ASC" ? (
          <span
            data-testid="sort-library-name"
            onClick={() => sortLibraryName("ASC")}
            onKeyDown={() => sortLibraryName("ASC")}
          >
            <i className={`${AppConstant.AscendingSortIcon} ml-1`}></i>
          </span>
        ) : (
          <span
            data-testid="sort-library-name"
            onClick={() => sortLibraryName("DESC")}
            onKeyDown={() => sortLibraryName("DESC")}
          >
            <i className={`${AppConstant.DescendingSortIcon} ml-1`}></i>
          </span>
        )}
      </>
    );
  };

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
            <div className="col-12 mt-3">
              <h3 style={{ marginTop: -20 }}>Custom Medication Library</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 col-sm-12 mt-1">
              <button
                type="button"
                data-testid="btnAddNewLibrary"
                ref={btnAddNewLibraryRef}
                className="btn btn-primary"
                onClick={createNewLibrary}
              >
                Create New Library
              </button>
            </div>
            <div className="search col-md-4 col-sm-12">
              <i
                className="fa-regular fa-magnifying-glass"
                style={{ left: "17px" }}
              ></i>
              <input
                name="search"
                type="search"
                id="txtCustomSearch"
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
            <div className="col-12">
              <div className="table-height-wrapper">
                <table className="table table-sm table-striped dark-border-header table-hover">
                  <thead>
                    <tr>
                      <th className="dark-border-header w-10">Status</th>
                      <th className="dark-border-header">
                        Library Name
                        {customMedLibraryList?.length === 0 ? (
                          <i
                            data-testid="sort-library-name"
                            className={`${AppConstant.InactiveSortIcon} ml-1`}
                          ></i>
                        ) : (
                          sortingDirection()
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customMedLibraryList?.length === 0 ? (
                      <tr>
                        <td className="no-data" colSpan={2}>
                          <aside>
                            {CustomMedicationLibraryMsgEnum.NoMatchesFound}
                          </aside>
                        </td>
                      </tr>
                    ) : (
                      customMedLibraryList?.map(
                        (itm: ICustomMedicationLibrary, index) => (
                          <tr key={itm.id + itm.description + index}>
                            <td className="w-10">
                              <span>
                                {itm.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td>
                              <button
                                data-testid="libraryName"
                                className="anchor-button"
                                onClick={() =>
                                  navigateToCustomMedications(itm?.id)
                                }
                              >
                                {itm.description}
                              </button>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {customMedLibraryList?.length > 0 && showPagination ? (
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
          <CustomMedicationLibrary
            showConfirmModal={showConfirmModal}
            addNewMode={true}
            title={CustomMedicationLibraryMsgEnum.SaveLibraryDialogTitle}
            confirmButtonText={
              CustomMedicationLibraryMsgEnum.CustomMedLibraryConfirmButtonText
            }
            cancelButtonText={
              CustomMedicationLibraryMsgEnum.CustomMedLibraryCancelButtonText
            }
            confirmCancel={cancelSaveNewLibrary}
          ></CustomMedicationLibrary>
        </>
      )}
    </div>
  );
};
export default CustomMedicationLibraryList;
