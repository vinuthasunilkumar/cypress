import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFacilityList } from "../../../services/CustomerService";
import LoadSpinner from "../../../shared/common-ui/LoadSpinner";
import { styles } from "../../../helper/UtilStyles";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Paging from "../../../shared/pages/Pagination";
import { randomFloat } from "../../../helper/Utility";
import { OrderPlatformConfigurationRouteEnum } from "../../../shared/enum/OrderPlatFormConfigurationEnum";
type FacilityListType = {
  currentTab: string;
};
const FacilityList = (props: FacilityListType) => {
  const navigate = useNavigate();
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const basePath = hostContext.basePath;
  const [facilityData, setFacilityData] = useState<IUserFacility[]>([]);
  const [tempFacilityData, setTempFacilityData] = useState<IUserFacility[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [showApiResponseMsg, setShowApiResponseMsg] = useState(false);
  const { state } = useLocation();
  const [remountComponent, setRemountComponent] = useState(0);
  const [sortedFacilities, setSortedFacilities] = useState<IUserFacility[]>([]);

  const customerId = hostContext?.parentId;
  const userId = hostContext?.userId;
  const ectConfigId = hostContext?.ectConfigId;

  const [pagination, setPagination] = useState<IPageItem>({
    countPerPage: 20,
    pageNumber: 1,
    totalCount: 0,
    totalPages: 0,
  });

  const searchElementFocus = () => {
    let searchElement = document.getElementById("txtSearch");
    searchElement?.focus();
  };
  useEffect(() => {
    if (props?.currentTab === "horizontalTab1") {
      searchElementFocus();
    }
  }, [props?.currentTab === "horizontalTab1"]);

  useEffect(() => {
    const bannerElement = document.querySelectorAll<HTMLElement>(".pb");
    if (bannerElement !== null && bannerElement.length > 0) {
      bannerElement[0].style.display = "none";
    }
    if (
      Number(customerId ?? 0) > 0 &&
      Number(userId ?? 0) > 0 &&
      Number(ectConfigId ?? 0) > 0
    ) {
      getFacilityListAsyn(pagination.pageNumber);
    }
  }, [Number(customerId), Number(userId), Number(ectConfigId)]);

  const getFacilityListAsyn = async (pageNumber: number) => {
    let userFacilityResult: IUserFacility[] = await getFacilityList(
      ectConfigId,
      customerId,
      userId
    );

    const pageNum = pageNumber || 1;
    if (userFacilityResult !== undefined) {
      setFacilityData(userFacilityResult);
      if (sortOrder === "asc") {
        const sortedData = [...userFacilityResult].sort((a, b) => {
          return sortOrder === "asc"
            ? a.facilityName.localeCompare(b.facilityName)
            : b.facilityName.localeCompare(a.facilityName);
        });
        setSortedFacilities(sortedData.slice(0, pagination.countPerPage));
        setTempFacilityData(sortedData);
      } else {
        const sortedData = [...userFacilityResult].sort((a, b) => {
          return sortOrder === "desc"
            ? a.facilityName.localeCompare(a.facilityName)
            : b.facilityName.localeCompare(b.facilityName);
        });
        setSortedFacilities(sortedData.slice(0, pagination.countPerPage));
        setTempFacilityData(sortedData);
      }

      let responsePagination: IPageItem = {
        countPerPage: pagination.countPerPage,
        pageNumber: pageNum,
        totalCount: userFacilityResult.length,
        totalPages: Math.ceil(
          userFacilityResult.length / pagination.countPerPage
        ),
      };

      setPagination(responsePagination);
    } else {
      setFacilityData([]);
    }
    setRemountComponent(randomFloat());
    setIsLoading(false);
  };

  useEffect(() => {
    setShowApiResponseMsg(true);

    const fadeAndRemoveAlert = () => {
      const alertElement = document.querySelector(".alert.floating");
      if (alertElement) {
        alertElement.classList.add("alert-fade-out");
      }
      setTimeout(() => {
        setShowApiResponseMsg(false);
        if (alertElement) {
          alertElement.classList.remove("alert-fade-out");
        }
      }, 500);
    };

    const timerId = setTimeout(fadeAndRemoveAlert, 5000);

    return () => clearTimeout(timerId);
  }, [state?.textMessage, state?.alertClassName]);

  const handleSortClick = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    if (sortOrder === "asc") {
      const sortedData = [...tempFacilityData].sort((a, b) => {
        return sortOrder === "asc"
          ? b.facilityName.localeCompare(a.facilityName)
          : a.facilityName.localeCompare(b.facilityName);
      });
      setSortedFacilities(
        pagination.pageNumber === 1
          ? sortedData.slice(0, pagination.countPerPage)
          : sortedData.slice(
              pagination.countPerPage * (pagination.pageNumber - 1),
              pagination.countPerPage * (pagination.pageNumber - 1) +
                pagination.countPerPage
            )
      );
      setTempFacilityData(sortedData);
    } else {
      const sortedData = [...tempFacilityData].sort((a, b) => {
        return sortOrder === "desc"
          ? a.facilityName.localeCompare(b.facilityName)
          : b.facilityName.localeCompare(a.facilityName);
      });
      setSortedFacilities(
        pagination.pageNumber === 1
          ? sortedData.slice(0, pagination.countPerPage)
          : sortedData.slice(
              pagination.countPerPage * (pagination.pageNumber - 1),
              pagination.countPerPage * (pagination.pageNumber - 1) +
                pagination.countPerPage
            )
      );
      setTempFacilityData(sortedData);
    }
  };

  const navigateToFacilitySetup = (id: number) => {
    const obj = facilityData.find((x) => x.facilityId === id);
    if (obj) {
      let selectedFacility: IUserFacility = {
        facilityId: obj.facilityId,
        facilityName: obj.facilityName,
        corporateId: obj.corporateId,
        userId: obj.userId,
        ectConfigId: Number(hostContext?.ectConfigId),
        showFacilitySetup: false,
      };

      navigate(
        `${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}/${id}`,
        {
          state: {
            isFromFacilityList: JSON.stringify(selectedFacility),
          },
        }
      );
    }
  };

  const closeApiResponseMsg = () => {
    setShowApiResponseMsg(false);
  };

  const searchFacility = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.length >= 2) {
      const result = facilityData.filter((x) =>
        x.facilityName.toLowerCase().includes(value.toLowerCase())
      );
      setSortedFacilities(result.slice(0, pagination.countPerPage));
      setTempFacilityData(result);
      let responsePagination: IPageItem = {
        countPerPage: pagination.countPerPage,
        pageNumber: 1,
        totalCount: result.length,
        totalPages: Math.ceil(result.length / pagination.countPerPage),
      };
      setPagination(responsePagination);
    } else {
      if (sortOrder === "asc") {
        const sortedData = [...facilityData].sort((a, b) => {
          return sortOrder === "asc"
            ? a.facilityName.localeCompare(b.facilityName)
            : b.facilityName.localeCompare(a.facilityName);
        });
        setSortedFacilities(sortedData.slice(0, pagination.countPerPage));
        setTempFacilityData(sortedData);
      } else {
        const sortedData = [...facilityData].sort((a, b) => {
          return sortOrder === "desc"
            ? a.facilityName.localeCompare(a.facilityName)
            : b.facilityName.localeCompare(b.facilityName);
        });
        setSortedFacilities(sortedData.slice(0, pagination.countPerPage));
        setTempFacilityData(sortedData);
      }
      let responsePagination: IPageItem = {
        countPerPage: pagination.countPerPage,
        pageNumber: 1,
        totalCount: facilityData.length,
        totalPages: Math.ceil(facilityData.length / pagination.countPerPage),
      };

      setPagination(responsePagination);
    }
  };

  const handlePageClick = (page: any) => {
    pagination.pageNumber = page;

    let responsePagination: IPageItem = {
      countPerPage: pagination.countPerPage,
      pageNumber: page,
      totalCount: pagination.totalCount,
      totalPages: Math.ceil(pagination.totalCount / pagination.countPerPage),
    };
    if (sortOrder === "asc") {
      const sortedData = [...tempFacilityData].sort((a, b) => {
        return sortOrder === "asc"
          ? a.facilityName.localeCompare(b.facilityName)
          : b.facilityName.localeCompare(a.facilityName);
      });
      setSortedFacilities(
        page === 1
          ? sortedData.slice(0, pagination.countPerPage)
          : sortedData.slice(
              pagination.countPerPage * (page - 1),
              pagination.countPerPage * (page - 1) + pagination.countPerPage
            )
      );
    } else {
      const sortedData = [...tempFacilityData].sort((a, b) => {
        return sortOrder === "desc"
          ? a.facilityName.localeCompare(a.facilityName)
          : b.facilityName.localeCompare(b.facilityName);
      });
      setSortedFacilities(
        page === 1
          ? sortedData.slice(0, pagination.countPerPage)
          : sortedData.slice(
              pagination.countPerPage * (page - 1),
              pagination.countPerPage * (page - 1) + pagination.countPerPage
            )
      );
    }
    setPagination(responsePagination);
  };
  if (props?.currentTab === "tab2" && pagination.pageNumber !== 1) {
    handlePageClick(1);
    searchElementFocus();
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {showApiResponseMsg && state?.alertClassName && state?.textMessage ? (
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
            {state?.textMessage}
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
            <div className="col-md-9 col-sm-12 mt-2">
              <h2>Facility Setup</h2>
            </div>
            <div className="search col-md-3 col-sm-12 mt-1">
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
                onChange={searchFacility}
                data-testid="txtSearch"
                aria-label="Search"
                autoFocus
              />
            </div>
          </div>
          <hr />
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th
                    onClick={handleSortClick}
                    style={styles.table_head}
                    tabIndex={0}
                  >
                    <span data-testid="sort-facility">
                      {"Facility"} &nbsp;
                      <i
                        className={`fa fa-arrow-${
                          sortOrder === "asc" ? "down" : "up"
                        }`}
                        aria-hidden="true"
                      ></i>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedFacilities.length <= 0 ? (
                  <tr>
                    <td data-testid="NoDataFound">
                      <aside className="no-data">No Data Found</aside>
                    </td>
                  </tr>
                ) : (
                  <>
                    {sortedFacilities.map((val, key) => {
                      return (
                        <tr key={`${val.facilityId} + '-'+ ${key}`}>
                          <td>
                            <button
                              data-testid={val.facilityName}
                              className="anchor-button"
                              tabIndex={0}
                              onClick={() =>
                                navigateToFacilitySetup(val?.facilityId)
                              }
                              style={{
                                textDecoration: "underline",
                              }}
                            >
                              {val.facilityName ? val.facilityName : ""}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {facilityData?.length > 0 ? (
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

export default FacilityList;
