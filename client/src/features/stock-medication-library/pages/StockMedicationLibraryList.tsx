import React, { useCallback, useEffect, useRef, useState } from "react";
import LoadSpinner from "../../../shared/common-ui/LoadSpinner";
import { useNavigate } from "react-router-dom";
import Paging from "../../../shared/pages/Pagination";
import { getStockMedicationLibraryList } from "../../../services/StockMedicationLibraryService";
import { IStockMedicationLibraryListResponse } from "../../../models/interface/IStockMedicationLibraryListResponse";
import { IStockMedicationLibrary } from "../../../models/interface/IStockMedicationLibrary";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { AppConstant } from "../../../shared/constants/AppConstant";

type StockMedicationLibraryListType = {
  currentTab: string;
};

const StockMedicationLibraryList = (props: StockMedicationLibraryListType) => {
  const navigate = useNavigate();
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const basePath = hostContext.basePath;

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingHostContext, setIsLoadingHostContext] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [stockMedLibraryList, setStockMedLibraryList] = useState<
    IStockMedicationLibrary[]
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

  const [
    stockMedicationListEditPermission,
    setStockMedicationListEditPermission,
  ] = useState(false);

  window.setTimeout(() => {
    setIsLoading(isLoadingData || isLoadingHostContext);
  }, 500);

  // For AutoFocus
  const searchElementFocus = () => {
    let searchElement = document.getElementById("txtStockSearch");
    setTimeout(() => {
      searchElement?.focus();
    }, 50);
  };

  useEffect(() => {
    if (props?.currentTab === "tab2") {
      searchElementFocus();
    }
  }, [props?.currentTab === "tab2"]);

  useEffect(() => {
    setStockMedicationListEditPermission(
      hostContext.permission.stockMedicationListEdit ?? false
    );
    setIsLoadingHostContext(false);
  }, [hostContext]);

  useEffect(() => {
    setIsLoadingData(true);
    const selectedSortDirection = sessionStorage.getItem(
      "librariesSelectedSort"
    );
    if (selectedSortDirection == "DESC") {
      setSortDirection("DESC");
      getStockMedicationLibraries(
        pagination.pageNumber,
        corporationId,
        ectConfigId,
        true
      );
    } else {
      setSortDirection("ASC");
      getStockMedicationLibraries(
        pagination.pageNumber,
        corporationId,
        ectConfigId,
        false
      );
      setIsLoadingData(false);
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
      getStockMedicationLibraries(
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
        sessionStorage.getItem("stockMedicationLibraryPageNumber")!
      );
      let newPagination = pagination;
      setPagination(newPagination);
      getStockMedicationLibraries(
        pagination.pageNumber,
        corporationId,
        ectConfigId,
        false
      );
    }
    setPagination({
      countPerPage: 20,
      pageNumber: parseInt(
        sessionStorage.getItem("stockMedicationLibraryPageNumber")!
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
  const getStockMedicationLibraries = useCallback(
    async (
      pageNumber: number,
      corporationId: number,
      ectConfigId: number,
      isSortDescending?: boolean
    ) => {
      const pageNum = pageNumber || 1;
      const response: IStockMedicationLibraryListResponse =
        await getStockMedicationLibraryList(
          pageNum,
          libraryName.search,
          pagination.countPerPage,
          corporationId,
          ectConfigId,
          isSortDescending
        );
      const { stockMedicationLibraries, pagination: responsePagination } =
        response || {};

      if (stockMedicationLibraries !== undefined) {
        const sortedLibraries = sortMedicationLibraries(
          stockMedicationLibraries,
          isSortDescending
        );
        setStockMedLibraryList(sortedLibraries);
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
        setStockMedLibraryList([]);
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
    stockMedicationLibraries: IStockMedicationLibrary[],
    isSortDescending?: boolean
  ) => {
    return stockMedicationLibraries.sort(
      (a: IStockMedicationLibrary, b: IStockMedicationLibrary) => {
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
    getStockMedicationLibraries(
      pagination.pageNumber,
      corporationId,
      ectConfigId,
      selectedSortDirection !== "ASC"
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
      getStockMedicationLibraries(
        pagination.pageNumber,
        corporationId,
        ectConfigId,
        true
      );
    } else {
      setSortDirection("ASC");
      getStockMedicationLibraries(
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

  // navigate to stock Medications List/summary page
  const navigateToStockMedications = (id: number) => {
    const libraryObj = stockMedLibraryList.find(x => x.id === id);
    const selectedLibraryObj = {
      id: libraryObj?.id,
      description: libraryObj?.description,
      corporationId: libraryObj?.corporationId,
      globalFacilityId: libraryObj?.globalFacilityId,
      totalCount: pagination.totalCount
    }
    sessionStorage.setItem(
      "selectedSMSupplyLibraryDetails",
      JSON.stringify(selectedLibraryObj)
    );
    navigate(`${basePath}/stock-medications`);
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
      {isLoading ? (
        <LoadSpinner />
      ) : (
        <>
          <div className="row" style={{marginTop : "-21px"}}>
            <div className="col-8">
              <h3>Stock Medication List</h3>
            </div>
            <div className="search col-md-4 col-sm-12 mt-3">
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
                data-testid="txtCustomSearch"
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
                      <th className="dark-border-header">
                        List Name
                        {stockMedLibraryList?.length === 0 ? (
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
                    {stockMedLibraryList?.length === 0 ? (
                      <tr>
                        <td className="no-data" colSpan={2}>
                          <aside>{"No matches found"}</aside>
                        </td>
                      </tr>
                    ) : (
                      stockMedLibraryList?.map(
                        (itm: IStockMedicationLibrary, index) => (
                          <tr key={itm.id + itm.description + index}>
                            <td>
                              <button
                                data-testid="libraryName"
                                className="anchor-button"
                                onClick={() =>
                                  navigateToStockMedications(itm?.id)
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

              {stockMedLibraryList?.length > 0 && showPagination ? (
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
        </>
      )}
    </div>
  );
};
export default StockMedicationLibraryList;
