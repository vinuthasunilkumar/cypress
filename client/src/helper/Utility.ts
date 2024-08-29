import moment from "moment-timezone";
import { SORT_COLUMNS } from "../shared/enum/StockMedicationsEnum";
import { SortDirection } from "../shared/enum/SortDirection";

export const RemoveSpaces = (inputStr: string) => {
  return inputStr?.trim().replace(/\s+/g, " ").replace(/\t/g, " ");
};
// This will return the user's/client's local time zone name
const getUsersLocalTimeZone = () => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  return timeZone;
};

export const generateFileName = (
  libraryName: string,
  extension: string,
  timeZone?: string
) => {
  let zone = moment.tz.guess();
  let abbrivation = moment.tz(zone).format("z");
  const date = new Date().toLocaleString("en-US", {
    timeZone: timeZone ?? getUsersLocalTimeZone(),
    hour12: false,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dtString = date.split(" ");
  let fileName = `${libraryName} ${dtString[0].replaceAll(
    ",",
    ""
  )}${dtString[1].replaceAll(",", "")}${dtString[2].replaceAll(
    ",",
    ""
  )} ${dtString[3].replaceAll(":", "")}`;
  return fileName + " " + abbrivation + extension;
};

export const getBoxShadow = (isFocused: boolean, isValid: boolean) => {
  let boxShadow: string = null!;
  if (isFocused) {
    if (isValid) {
      boxShadow = "0 0 0 1px #007bff";
    } else {
      boxShadow = "0 0 0 1px #DC3545";
    }
  }
  return boxShadow;
};

export const setActiveClass = (condition: boolean) => {
  if (condition) {
    return " active";
  } else return "";
};

export const randomFloat = () => {
  const int = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return int / 2 ** 32;
};

export const getDivHeight = (eleCtrl: string, type: string) => {
  let divHeight = 0;
  switch (type) {
    case "id": {
      let element = document.getElementById(eleCtrl) ;
      divHeight = element?.offsetHeight ?? 0;
      break;
    }
    case "class": {
      let element = document.getElementsByClassName(
        eleCtrl
      ) as HTMLCollectionOf<HTMLElement>;
      divHeight = element[0]?.offsetHeight ?? 0;
      break;
    }
  }
  return divHeight;
};

export const updateBannerZIndex = () => {
  const snfHeader = document.querySelectorAll<HTMLElement>(".pb");
  if (snfHeader !== null && snfHeader.length > 0) {
    snfHeader[0].style.zIndex = "10";
  }
};

export const resetCustomMedicationLibrarySession = () => {
  sessionStorage.setItem("libraryPageNumber", "1");
  sessionStorage.setItem("librariesSelectedSort", SortDirection.Ascending);
  sessionStorage.setItem(
    "customMedicationsSelectedSort",
    SortDirection.Ascending
  );
};

export const resetCustomMedicationSession = () => {
  sessionStorage.setItem(
    "customMedicationsSelectedSort",
    SortDirection.Ascending
  );
  sessionStorage.setItem("customMedicationPageNumber", "1");
  sessionStorage.removeItem("selectedLibraryDetails");
};

export const resetFrequencyAdministrationSession = () => {
  sessionStorage.setItem("scheduleListPageNumber", "1");
  sessionStorage.setItem(
    "scheduleListSelectedSortDirection",
    SortDirection.Ascending
  );
  sessionStorage.setItem("scheduleListSelectedSortColumn", "Frequency");
  sessionStorage.removeItem("selectedAdministrationScheduleDetails");
};

export const resetStockMedicationsSession = () => {
  sessionStorage.setItem("stockMedicationsListPageNumber", "1");
  sessionStorage.setItem(
    "stockMedicationsSelectedSortDirection",
    SortDirection.Ascending
  );
  sessionStorage.setItem(
    "stockMedicationsSelectedSortColumn",
    SORT_COLUMNS.StockMedicationsSupply
  );
  sessionStorage.removeItem("selectedSMSupplyLibraryDetails");
};

export const preparePhysicianName = (orderByUser: IOrderByUser) => {
  let primaryPhysician = "";
  if (orderByUser.prefix) {
    primaryPhysician += orderByUser.prefix;
  }
  if (orderByUser.firstName) {
    primaryPhysician += orderByUser.firstName;
  }
  if (orderByUser.middleName) {
    primaryPhysician += orderByUser.middleName;
  }
  if (orderByUser.lastName) {
    primaryPhysician += orderByUser.lastName;
  }
  if (orderByUser.suffix) {
    primaryPhysician += orderByUser.suffix;
  }

  return primaryPhysician;
};

export const getPrimaryPhysician = () => {
  let primaryPhysician = "";
  let banerResults = document.getElementsByClassName(
    "pbdatasection pbdataprovider"
  );
  if (banerResults !== null && banerResults.length > 0) {
    let bannerElement = banerResults[0] as HTMLElement;
    let arrayfields = bannerElement.innerText.split("\n");
    let physicianIndex = arrayfields.indexOf("Primary Physician:");
    primaryPhysician = arrayfields[physicianIndex + 1].replace(/\s/g, "");
  }
  return primaryPhysician;
};

export const physicianList = (
  orderByUsers: IOrderByUser[],
  prescriberId: number,
  currentUserId: number
) => {
  let physicianData: IOrderByUser[] = [];
  if (prescriberId > 0) {
    physicianData = orderByUsers.filter((x) => x.userId === prescriberId);
  } else {
    physicianData = orderByUsers.filter((x) => x.userId === currentUserId);
  }
  return physicianData;
};

export const groupBy = <T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K
) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

export const getWindowScrollPercentage = () => {
  let documentElement = document.documentElement;
  let body = document.body;
  return (
    ((documentElement.scrollTop || body.scrollTop) /
      ((documentElement.scrollHeight || body.scrollHeight) -
        documentElement.clientHeight)) *
    100
  );
};
