import React, {
  useEffect,
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import SingleDropDown from "../../../shared/pages/SingleDropDown";
import WeekOptions from "../../../assets/static-files/WeekOptions.json";
import MonthOptionsData from "../../../assets/static-files/MonthOptions.json";
import WeeksOfMonthsData from "../../../assets/static-files/WeeksOfMonths.json";
import WeekDaysOptions from "../../../assets/static-files/DaysOfWeek.json";
import {
  monthDays,
  monthlyRequiredFields,
} from "../../../shared/enum/FrequencyAdministration";
import { FrequencyAdministration } from "../../../shared/enum/FrequencyAdministrationValidationMessages";
import {
  AddScheduleRequiredFields,
  Day,
  DropdownItem,
  MonthlySchedules,
} from "../../../models/class/FrequencyAdministration";
import { IMonthlySchedule } from "../../../models/interface/IMonthlySchedule";
import SingleColumnMultiSelectDD from "../../../shared/pages/SingleColumnMultiSelectDD";

const MonthlySchedule = forwardRef((props: any, ref) => {
  const defaultEveryMonth: DropdownItem = { value: "1", label: "1" };
  const [selectedEveryMonths, setSelectedEveryMonths] =
    useState<DropdownItem>(defaultEveryMonth);
  const [selectedMonths, setSelectedMonths] = useState<DropdownItem[] | null>(
    null
  );
  const [selectedWeeksOfTheMonths, setSelectedWeeksOfTheMonths] = useState<
    DropdownItem[] | null
  >(null);
  const [selectedDaysOfWeeks, setSelectedDaysOfWeeks] = useState<
    DropdownItem[] | null
  >(null);
  const [monthDaysList, setMonthDaysList] = useState<Day[]>(monthDays);
  const [isEveryMonthsTabSelected, setIsEveryMonthsTabSelected] =
    useState<boolean>(true);
  const [isDaysOfTheMonthSelected, setIsDaysOfTheMonthSelected] =
    useState<boolean>(true);
  const [isMonthDaysSelected, setIsMonthDaysSelected] = useState<
    boolean | null
  >(null);
  const [fieldsToValidate, setFieldsToValidate] = useState<
    AddScheduleRequiredFields[]
  >(monthlyRequiredFields);
  const [monthlySchedulesObj, setMonthlySchedulesObj] =
    useState<MonthlySchedules>(new MonthlySchedules());
  const [weekOfMonthsErrorMessage, setWeekOfMonthsErrorMessage] = useState<
    string | null
  >("");
  const [daysOfWeeksErrorMessage, setDaysOfWeeksErrorMessage] = useState<
    string | null
  >("");
  const [selectMonthsErrorMessage, setSelectMonthsErrorMessage] = useState<
    string | null
  >("");
  const [prevSelectedTabName, setPrevSelectedTabName] =
    useState<string>("everyMonthsTab");

  useEffect(() => {
    resetMonthlySchedule();
  }, [
    props.addNewMode,
    props.resetMonthlyScheduleData,
    props.isMaxSelectionRequired,
  ]);

  useEffect(() => {
    if (props.editMonthlySchedule) {
      setMonthlyScheduleData(props.editMonthlySchedule);
    }
  }, [
    props.addNewMode,
    props.editMonthlySchedule,
    props.resetMonthlyScheduleData,
  ]);

  const setMonthlyScheduleData = (monthlySchedule: IMonthlySchedule) => {
    if (monthlySchedule) {
      if (monthlySchedule.everyMonth) {
        setIsEveryMonthsTabSelected(true);
        setPrevSelectedTabName("everyMonthsTab");
        monthlySchedulesObj.chooseMonth = null;
        monthlySchedulesObj.everyMonth = monthlySchedule.everyMonth;
        const monthDataItem = WeekOptions.find(
          (x) => x.id === monthlySchedule.everyMonth?.toString()
        );
        let usersSelectedMonthData: DropdownItem = {
          id: monthDataItem?.id,
          value: monthDataItem?.value!,
          label: monthDataItem?.value!,
        };
        setSelectedEveryMonths(usersSelectedMonthData);
      } else {
        setIsEveryMonthsTabSelected(false);
        setPrevSelectedTabName("selectMonthsTab");
        monthlySchedulesObj.everyMonth = null;
        monthlySchedulesObj.chooseMonth = monthlySchedule.chooseMonth;
        const selectedMonthsArray = monthlySchedule.chooseMonth?.split(", ");
        const userSelectMonths = MonthOptionsData.filter((option) =>
          selectedMonthsArray?.includes(option.value)
        );
        setSelectedMonths(userSelectMonths);
      }
      if (monthlySchedule.selectedDaysOfMonth) {
        monthDays.forEach((itm: Day) => {
          itm.checked = false;
        });
        monthDaysList.forEach((itm: Day) => {
          itm.checked = false;
        });
        setIsDaysOfTheMonthSelected(true);
        monthlySchedulesObj.selectedDaysOfMonth =
          monthlySchedule.selectedDaysOfMonth;
        const usersSelectedDaysOfMonth =
          monthlySchedule.selectedDaysOfMonth?.split(",");
        usersSelectedDaysOfMonth?.forEach((item: string) => {
          monthDays.find((x) => x.label === item.trim())!.checked = true;
          monthDaysList.find((x) => x.label === item.trim())!.checked = true;
        });
        setMonthDaysList([...monthDaysList]);
      } else {
        setIsDaysOfTheMonthSelected(false);

        monthlySchedulesObj.selectedDays = monthlySchedule.selectedDays;
        const selectedWeeksArray = monthlySchedule.selectedDays
          ?.split(", ")
          .map(Number);
        const userSelectWeeks = WeeksOfMonthsData.filter((option) =>
          selectedWeeksArray?.includes(option.id)
        );
        setSelectedWeeksOfTheMonths(userSelectWeeks);

        monthlySchedulesObj.selectedDaysOfWeek =
          monthlySchedule.selectedDaysOfWeek;
        const selectedDaysOfWeekArray =
          monthlySchedule.selectedDaysOfWeek?.split(", ");
        const userSelectDays = WeekDaysOptions.filter((option) =>
          selectedDaysOfWeekArray?.includes(option.value)
        );
        setSelectedDaysOfWeeks(userSelectDays);
      }
      let userMonthlyScheduleData = monthlySchedulesObj;
      setMonthlySchedulesObj(userMonthlyScheduleData);
      props.handleMonthlyScheduleFields(userMonthlyScheduleData, false);
      props.handleMonthlyScheduleFlag(false);
    }
  };

  useImperativeHandle(ref, () => ({
    validateMonthlyScheduleControls() {
      return isValidData();
    },
  }));

  const isValidData = () => {
    if (!isEveryMonthsTabSelected) {
      validateSelectMonthsTab();
      validateSeletcDatesOfTheMonth();
    }
    if (isDaysOfTheMonthSelected) {
      validateSeletcDatesOfTheMonth();
    } else {
      validateDaysAndWeekOfMonthsSelections(
        "",
        selectedWeeksOfTheMonths as DropdownItem[],
        selectedDaysOfWeeks as DropdownItem[]
      );
    }
    const invalidFields = fieldsToValidate.filter(
      (x: AddScheduleRequiredFields) => x.isValid === false
    );
    return invalidFields.length === 0;
  };

  // Validating the Select Months control in a Select Months Tab
  const validateSelectMonthsTab = () => {
    const checkedMonths = selectedMonths === null ? 0 : selectedMonths?.length;
    if (checkedMonths > 0) {
      setSelectMonthsErrorMessage("");
    } else {
      setSelectMonthsErrorMessage(
        FrequencyAdministration.MonthsIsRequiredMessage
      );
    }
    fieldsToValidate.find(
      (x: AddScheduleRequiredFields) => x.fieldName === "selectMonths"
    )!.isValid = checkedMonths > 0;
    setFieldsToValidate([...fieldsToValidate]);
    props.validatedMonthlyFields(fieldsToValidate);
  };

  // Validating the Calendar control i.e. Select Dates
  const validateSeletcDatesOfTheMonth = () => {
    const checkedMonthDays = monthDaysList.filter((x: Day) => x.checked);
    if (isEveryMonthsTabSelected) {
      setIsMonthDaysSelected(checkedMonthDays.length > 0);
      fieldsToValidate.find(
        (x: AddScheduleRequiredFields) => x.fieldName === "selectDates"
      )!.isValid = checkedMonthDays.length > 0;
    } else {
      if (isDaysOfTheMonthSelected) {
        setIsMonthDaysSelected(checkedMonthDays.length > 0);
        fieldsToValidate.find(
          (x: AddScheduleRequiredFields) => x.fieldName === "selectDates"
        )!.isValid = checkedMonthDays.length > 0;
      }
    }
    setFieldsToValidate([...fieldsToValidate]);
    props.validatedMonthlyFields(fieldsToValidate);
  };

  // validating the Weeks Of Months and Days dropdown in Day(s) of the week block
  const validateDaysAndWeekOfMonthsSelections = (
    ddlType?: string,
    userSelectedWeeks?: DropdownItem[],
    userSelectedDays?: DropdownItem[]
  ) => {
    const usersSelectedWeeksOfMonths =
      userSelectedWeeks === null
        ? (selectedWeeksOfTheMonths as DropdownItem[])
        : userSelectedWeeks;
    const usersSelectedDays =
      userSelectedDays === null
        ? (selectedDaysOfWeeks as DropdownItem[])
        : userSelectedDays;
    const checkedDays = usersSelectedDays!?.length;
    const checkedWeeksOfMonths = usersSelectedWeeksOfMonths!?.length;
    switch (ddlType) {
      case "Days": {
        if (checkedDays > 0) {
          setDaysOfWeeksErrorMessage("");
        } else {
          setDaysOfWeeksErrorMessage(
            FrequencyAdministration.DayIsRequiredMessage
          );
        }
        fieldsToValidate.find(
          (x: AddScheduleRequiredFields) => x.fieldName === "daysOfWeek"
        )!.isValid = checkedDays > 0;
        break;
      }
      case "WeekOfMonths": {
        if (checkedWeeksOfMonths > 0) {
          setWeekOfMonthsErrorMessage("");
        } else {
          setWeekOfMonthsErrorMessage(
            FrequencyAdministration.WeeksOfTheMonthIsRequired
          );
        }
        fieldsToValidate.find(
          (x: AddScheduleRequiredFields) => x.fieldName === "weeksOfTheMonth"
        )!.isValid = checkedWeeksOfMonths > 0;
        break;
      }
      default: {
        if (checkedDays > 0) {
          setDaysOfWeeksErrorMessage("");
        } else {
          setDaysOfWeeksErrorMessage(
            FrequencyAdministration.DayIsRequiredMessage
          );
        }
        if (checkedWeeksOfMonths > 0) {
          setWeekOfMonthsErrorMessage("");
        } else {
          setWeekOfMonthsErrorMessage(
            FrequencyAdministration.WeeksOfTheMonthIsRequired
          );
        }
        fieldsToValidate.find(
          (x: AddScheduleRequiredFields) => x.fieldName === "daysOfWeek"
        )!.isValid = checkedDays > 0;
        fieldsToValidate.find(
          (x: AddScheduleRequiredFields) => x.fieldName === "weeksOfTheMonth"
        )!.isValid = checkedWeeksOfMonths > 0;
        break;
      }
    }
    setFieldsToValidate([...fieldsToValidate]);
    props.validatedMonthlyFields(fieldsToValidate);
  };

  const resetMonthlySchedule = () => {
    monthlyRequiredFields.forEach((item) => {
      item.isValid = true;
    });
    setFieldsToValidate(monthlyRequiredFields);
    setMonthDaysList([]);
    monthDays.forEach((itm: Day) => {
      itm.checked = false;
    });
    setMonthDaysList(monthDays);
    resetMonthlySchedulesFields();
    resetTabsData();
    monthlySchedulesObj.everyMonth = Number(defaultEveryMonth.value.toString());
    let newMonthlySchedulesObj = monthlySchedulesObj;
    setMonthlySchedulesObj(newMonthlySchedulesObj);
    props.handleMonthlyScheduleFields(newMonthlySchedulesObj, false);
  };

  const resetMonthlySchedulesFields = () => {
    monthlySchedulesObj.chooseMonth = null;
    monthlySchedulesObj.everyMonth = null;
    monthlySchedulesObj.selectedDays = null;
    monthlySchedulesObj.selectedDaysOfMonth = null;
    monthlySchedulesObj.selectedDaysOfWeek = null;
    let newMonthlySchedulesObj = monthlySchedulesObj;
    setMonthlySchedulesObj(newMonthlySchedulesObj);
    setSelectedEveryMonths({ value: "1", label: "1" });
    setIsEveryMonthsTabSelected(true);
  };

  const resetTabsData = () => {
    resetMonthDays();
    setIsMonthDaysSelected(null);
    resetMonthlyScheduleValidations();
    setIsDaysOfTheMonthSelected(true);
    setSelectMonthsErrorMessage("");
    setSelectedWeeksOfTheMonths(null);
    setSelectedDaysOfWeeks(null);
    setDaysOfWeeksErrorMessage("");
    setWeekOfMonthsErrorMessage("");
    setSelectedMonths([]);
    monthDays.forEach((itm: Day) => {
      itm.checked = false;
    });
    setMonthDaysList(monthDays);
  };

  const everyMonthsTabHandler = (status: boolean, tabName: string) => {
    let isReset = false;
    //reset the months selection
    setPrevSelectedTabName(tabName);
    if (tabName === "everyMonthsTab") {
      monthlySchedulesObj.chooseMonth = null;
      monthlySchedulesObj.selectedDaysOfMonth = null;
      monthlySchedulesObj.selectedDays = null;
      monthlySchedulesObj.selectedDaysOfWeek = null;
      monthlySchedulesObj.everyMonth = Number(selectedEveryMonths.value);
    }
    if (
      tabName === "everyMonthsTab" &&
      prevSelectedTabName === "selectMonthsTab"
    ) {
      resetTabsData();
      isReset = true;
    }
    if (
      tabName === "selectMonthsTab" &&
      prevSelectedTabName === "everyMonthsTab"
    ) {
      resetTabsData();
      isReset = true;
    }
    if (tabName === "selectMonthsTab" && !status) {
      setSelectedEveryMonths({ value: "1", label: "1" });
      monthlySchedulesObj.everyMonth = null;
      monthlySchedulesObj.selectedDaysOfMonth = null;
      monthlySchedulesObj.selectedDays = null;
      monthlySchedulesObj.selectedDaysOfWeek = null;
    }
    setIsEveryMonthsTabSelected(status);
    setFieldsToValidate([...fieldsToValidate]);
    props.validatedMonthlyFields(fieldsToValidate);
    let newMonthlySchedulesObj = monthlySchedulesObj;
    setMonthlySchedulesObj(newMonthlySchedulesObj);
    props.handleMonthlyScheduleFields(newMonthlySchedulesObj, true, isReset);
  };

  const chooseDaysOfMonthsAndWeeksHandler = (
    status: boolean,
    btnName?: string
  ) => {
    let isReset = false;
    monthlySchedulesObj.everyMonth = isEveryMonthsTabSelected
      ? Number(selectedEveryMonths.value)
      : null;
    if (btnName === "btnChooseDaysOfTheWeeks" && !status) return;
    if (btnName === "btnChooseDaysOfTheWeeks") {
      isReset = true;
      setSelectMonthsErrorMessage("");
      setMonthDaysList([]);
      monthDays.forEach((itm) => {
        itm.checked = false;
      });
      setMonthDaysList(monthDays);
      setIsMonthDaysSelected(null);
      monthlySchedulesObj.selectedDaysOfMonth = null;
      resetMonthlyScheduleValidations();
    }
    if (btnName === "btnChooseDaysOfTheMonths" && status) return;
    if (btnName === "btnChooseDaysOfTheMonths") {
      isReset = true;
      setSelectMonthsErrorMessage("");
      setSelectedDaysOfWeeks(null);
      setSelectedWeeksOfTheMonths(null);
      setDaysOfWeeksErrorMessage("");
      setWeekOfMonthsErrorMessage("");
      resetMonthlyScheduleValidations();
      monthlySchedulesObj.selectedDaysOfWeek = null;
      monthlySchedulesObj.selectedDays = null;
    }
    setIsDaysOfTheMonthSelected(!status);
    setFieldsToValidate([...fieldsToValidate]);
    props.validatedMonthlyFields(fieldsToValidate);
    let newMonthlySchedulesObj = monthlySchedulesObj;
    setMonthlySchedulesObj(newMonthlySchedulesObj);
    props.handleMonthlyScheduleFields(newMonthlySchedulesObj, true, isReset);
  };

  const handleDropDownChange = (
    item: DropdownItem | DropdownItem[],
    type: string
  ) => {
    switch (type) {
      case "ddlEveryMonths": {
        if (Array.isArray(item)) {
          setSelectedEveryMonths(item[0]);
          monthlySchedulesObj.everyMonth = Number(item[0]?.value);
        } else {
          setSelectedEveryMonths(item);
          monthlySchedulesObj.everyMonth = Number(item?.value);
        }
        break;
      }
      case "ddlWeeksOfTheMonths": {
        const usersSelectedWeeksOfMonths = item as DropdownItem[];
        if (usersSelectedWeeksOfMonths.length > 0) {
          setWeekOfMonthsErrorMessage("");
        } else {
          setWeekOfMonthsErrorMessage(
            FrequencyAdministration.WeeksOfTheMonthIsRequired
          );
        }
        fieldsToValidate.find(
          (x: AddScheduleRequiredFields) => x.fieldName === "weeksOfTheMonth"
        )!.isValid = usersSelectedWeeksOfMonths.length > 0;
        const sortedSelectedWeeksOfMonths = usersSelectedWeeksOfMonths
          .slice()
          .sort((a, b) => Number(a.id) - Number(b.id));
        const selectedWeeks = sortedSelectedWeeksOfMonths
          ?.map((x) => x.id)
          .join(", ");
        monthlySchedulesObj.selectedDays = selectedWeeks;
        monthlySchedulesObj.everyMonth = isEveryMonthsTabSelected
          ? Number(selectedEveryMonths.value)
          : null;
        setSelectedWeeksOfTheMonths(item as DropdownItem[]);
        break;
      }
      case "ddlWeekDays": {
        let usersSelectedWeekDays = item as DropdownItem[];
        usersSelectedWeekDays = usersSelectedWeekDays
          .slice()
          .sort(
            (a: DropdownItem, b: DropdownItem) => Number(a.id) - Number(b.id)
          );
        monthlySchedulesObj.selectedDaysOfWeek = usersSelectedWeekDays
          .map((x: DropdownItem) => x.label)
          .join(", ");
        if (usersSelectedWeekDays.length > 0) {
          setDaysOfWeeksErrorMessage("");
        } else {
          setDaysOfWeeksErrorMessage(
            FrequencyAdministration.DayIsRequiredMessage
          );
        }
        setSelectedDaysOfWeeks(item as DropdownItem[]);
        fieldsToValidate.find(
          (x: AddScheduleRequiredFields) => x.fieldName === "daysOfWeek"
        )!.isValid = usersSelectedWeekDays.length > 0;
        break;
      }
      case "ddlSelectMonths": {
        let usersSelectedMonths = item as DropdownItem[];
        usersSelectedMonths = usersSelectedMonths
          .slice()
          .sort(
            (a: DropdownItem, b: DropdownItem) => Number(a.id) - Number(b.id)
          );
        monthlySchedulesObj.everyMonth = null;
        monthlySchedulesObj.chooseMonth = usersSelectedMonths
          .map((x: DropdownItem) => x.label)
          .join(", ");
        setSelectedMonths(item as DropdownItem[]);
        if (usersSelectedMonths.length > 0) {
          setSelectMonthsErrorMessage("");
        } else {
          setSelectMonthsErrorMessage(
            FrequencyAdministration.MonthsIsRequiredMessage
          );
        }
        fieldsToValidate.find(
          (x: AddScheduleRequiredFields) => x.fieldName === "selectMonths"
        )!.isValid = usersSelectedMonths.length > 0;
        break;
      }
    }
    let newMonthlySchedulesObj = monthlySchedulesObj;
    setMonthlySchedulesObj(newMonthlySchedulesObj);
    props.handleMonthlyScheduleFields(newMonthlySchedulesObj, true);
    setFieldsToValidate([...fieldsToValidate]);
    props.validatedMonthlyFields(fieldsToValidate);
  };

  const resetMonthDays = () => {
    monthDays.forEach((itm: Day) => {
      itm.checked = false;
    });
    setMonthDaysList(monthDays);
  };

  const handleMonthDayChange = (e: Day, index: number) => {
    monthDaysList[index].checked = !e.checked;
    setMonthDaysList([...monthDaysList]);
    let selectedDaysOfMonth = monthDaysList
      .filter((x: Day) => x.checked)
      .map((x: Day) => x.label)
      .join(", ");
    monthlySchedulesObj.selectedDaysOfMonth = selectedDaysOfMonth;
    monthlySchedulesObj.everyMonth = isEveryMonthsTabSelected
      ? Number(selectedEveryMonths.value)
      : null;
    let newMonthlySchedulesObj = monthlySchedulesObj;
    setMonthlySchedulesObj(newMonthlySchedulesObj);
    props.handleMonthlyScheduleFields(newMonthlySchedulesObj, true);
    validateSeletcDatesOfTheMonth();
  };

  const daysOfTheMonthsAndWeeks = () => {
    return (
      <div className="row">
        <div className="form-group col-md-12 mb-3">
          <div className="form-check form-check-inline">
            <input
              className={`form-check-input`}
              id="btnChooseDaysOfTheMonths"
              value="true"
              checked={isDaysOfTheMonthSelected === true}
              data-testid="btnChooseDaysOfTheMonths"
              onClick={(e) =>
                chooseDaysOfMonthsAndWeeksHandler(
                  isDaysOfTheMonthSelected,
                  "btnChooseDaysOfTheMonths"
                )
              }
              onChange={(e) =>
                chooseDaysOfMonthsAndWeeksHandler(
                  isDaysOfTheMonthSelected,
                  "btnChooseDaysOfTheMonths"
                )
              }
              type="radio"
            />
            <label
              className={`form-check-label`}
              htmlFor="btnChooseDaysOfTheMonths"
            >
              Days of the Month
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className={`form-check-input`}
              id="btnChooseDaysOfTheWeeks"
              value="false"
              checked={isDaysOfTheMonthSelected === false}
              data-testid="btnChooseDaysOfTheWeeks"
              onClick={(e) =>
                chooseDaysOfMonthsAndWeeksHandler(
                  isDaysOfTheMonthSelected,
                  "btnChooseDaysOfTheWeeks"
                )
              }
              onChange={(e) =>
                chooseDaysOfMonthsAndWeeksHandler(
                  isDaysOfTheMonthSelected,
                  "btnChooseDaysOfTheWeeks"
                )
              }
              type="radio"
            />
            <label
              className={`form-check-label`}
              htmlFor="btnChooseDaysOfTheWeeks"
            >
              Days of the Week
            </label>
          </div>
        </div>
      </div>
    );
  };

  const daysOfTheWeeks = () => {
    return (
      <div className="row">
        <div className={`col-md-6 ${isEveryMonthsTabSelected ? "" : "px-3"}`} id="ddlWeeks">
          <SingleColumnMultiSelectDD
            id="ddlWeeksOfTheMonths"
            dataFieldId="value"
            dataFieldValue="label"
            datafile={WeeksOfMonthsData}
            isSearchable={true}
            icon={null}
            placeholder="Select..."
            value={selectedWeeksOfTheMonths}
            isSearchIconNotRequired={true}
            isBlankOptionNotRequired={true}
            selectLabelText="Weeks of the Month"
            isClearableNotRequired={true}
            errorMessage={weekOfMonthsErrorMessage}
            maxSelection={props.maxSelections}
            isMaxSelectionRequired={props.isMaxSelectionRequired}
            onChange={(id) => handleDropDownChange(id, "ddlWeeksOfTheMonths")}
          />
        </div>
        <div className="col-md-6" id="ddlDays">
          <SingleColumnMultiSelectDD
            id="ddlWeekDays"
            dataFieldId="value"
            dataFieldValue="label"
            datafile={WeekDaysOptions}
            isSearchable={true}
            icon={null}
            placeholder="Select..."
            value={selectedDaysOfWeeks}
            isSearchIconNotRequired={true}
            isBlankOptionNotRequired={true}
            selectLabelText="Days"
            isClearableNotRequired={true}
            errorMessage={daysOfWeeksErrorMessage}
            maxSelection={props.maxSelections}
            isMaxSelectionRequired={props.isMaxSelectionRequired}
            onChange={(id) => handleDropDownChange(id, "ddlWeekDays")}
          />
        </div>
      </div>
    );
  };

  const resetMonthlyScheduleValidations = () => {
    fieldsToValidate.find(
      (x: AddScheduleRequiredFields) => x.fieldName === "selectMonths"
    )!.isValid = true;
    fieldsToValidate.find(
      (x: AddScheduleRequiredFields) => x.fieldName === "selectDates"
    )!.isValid = true;
    fieldsToValidate.find(
      (x: AddScheduleRequiredFields) => x.fieldName === "daysOfWeek"
    )!.isValid = true;
    fieldsToValidate.find(
      (x: AddScheduleRequiredFields) => x.fieldName === "weeksOfTheMonth"
    )!.isValid = true;
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="row mb-2">
      <div className="col-12">
        <div className="nav-tabs-bordered">
          <div className="row">
            <div className="col-lg-3 col-sm-12 p-0">
              <div className="nav-tabs-wrapper">
                <ul
                  className={`nav nav-tabs ${isMobile ? "" : " tabs-left"}`}
                  id="tabs-left"
                >
                  <li className="nav-item">
                    <a
                      href="#everyMonthsTabContent"
                      className={`nav-link ${isEveryMonthsTabSelected ? "active" : ""
                        }`}
                      data-testid="everyMonthsTab"
                      id="everyMonthsTab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="everyMonthsTabContent"
                      aria-selected={isEveryMonthsTabSelected}
                      onClick={(e) =>
                        everyMonthsTabHandler(true, "everyMonthsTab")
                      }
                    >
                      <span
                        className={`${isEveryMonthsTabSelected ? "selected-tab-label" : ""
                          }`}
                      >
                        Every Months
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="#selectMonthsTabContent"
                      className={`nav-link ${!isEveryMonthsTabSelected ? "active" : ""
                        }`}
                      data-testid="selectMonthsTab"
                      id="selectMonthsTab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="selectMonthsTabContent"
                      aria-selected={!isEveryMonthsTabSelected}
                      onClick={(e) =>
                        everyMonthsTabHandler(false, "selectMonthsTab")
                      }
                    >
                      <span
                        className={`${!isEveryMonthsTabSelected ? "selected-tab-label" : ""
                          }`}
                      >
                        Select Months
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9 col-sm-12 left-tab-content-wrapper">
              <div className={`tab-content ${isMobile ? " m-0" : ""}`}>
                <div
                  className={`tab-pane pl-3 fade ${isEveryMonthsTabSelected ? "show active" : ""
                    }`}
                  id="everyMonthsTabContent"
                  role="tabpanel"
                  aria-labelledby="everyMonthsTab"
                >
                  {isEveryMonthsTabSelected && daysOfTheMonthsAndWeeks()}
                  {props.isOrderWriter ?
                    <>
                      <div className="row">
                        <div
                          className={`col-5 every-month ${isMobile ? " w-50" : ""
                            }`}
                        >
                          <SingleDropDown
                            id="ddlEveryMonths"
                            dataFieldId="id"
                            dataFieldValue="value"
                            datafile={WeekOptions}
                            isSearchable={true}
                            icon={null}
                            placeholder="Select..."
                            value={selectedEveryMonths}
                            isSearchIconNotRequired={true}
                            isBlankOptionNotRequired={true}
                            dropDownIndicatorText="Months"
                            selectLabelText="Every"
                            isClearableNotRequired={true}
                            isSortByDataFieldId={true}
                            onChange={(id) =>
                              handleDropDownChange(id, "ddlEveryMonths")
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        {isDaysOfTheMonthSelected && isEveryMonthsTabSelected && (
                          <div className="col-lg-8 col-sm-12" id="selectDates">
                            <div className="form-group mb-0">
                              <span
                                className={`span-highlight-label p-0 ${!isMonthDaysSelected &&
                                    isMonthDaysSelected != null
                                    ? "has-error-label"
                                    : ""
                                  }`}
                              >
                                Select Dates
                              </span>
                            </div>
                            <div
                              id="selectDates"
                              className={`calendar ${!isMonthDaysSelected &&
                                  isMonthDaysSelected != null
                                  ? "is-invalid-calendar"
                                  : "is-valid-calendar"
                                }`}
                            >
                              {monthDaysList.map((item: Day, index: number) => (
                                <button
                                  type="button"
                                  key={item.id}
                                  data-testid={item.id}
                                  disabled={
                                    props.maxSelections ===
                                    monthDaysList.filter(
                                      (x: Day) => x.checked === true
                                    ).length &&
                                    !item.checked &&
                                    props.isMaxSelectionRequired
                                  }
                                  onClick={(e) =>
                                    handleMonthDayChange(item, index)
                                  }
                                  className={`day ${item.id === 29 ||
                                      item.id === 30 ||
                                      item.id === 31
                                      ? "holiday"
                                      : ""
                                    } ${item.checked ? "selected-day" : ""} ${(item.id === 29 && item.checked) ||
                                      (item.id === 30 && item.checked) ||
                                      (item.id === 31 && item.checked)
                                      ? "selected-holiday"
                                      : ""
                                    }`}
                                >
                                  {item.id}
                                </button>
                              ))}
                            </div>
                            {!isMonthDaysSelected &&
                              isMonthDaysSelected != null && (
                                <div id="days-of-the-month-required">
                                  <span className="invalid-feedback-message">
                                    {
                                      FrequencyAdministration.DateIsRequiredMessage
                                    }
                                  </span>
                                </div>
                              )}
                            <div className="inline-message im-warning ">
                              <span className="ml-5px">
                                The <span className="text-holiday">29</span>,{" "}
                                <span className="text-holiday">30</span> or{" "}
                                <span className="text-holiday">31</span> will not
                                schedule for administration in the months that do
                                not contain these dates, ex. February.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                    :
                    <div className="row">
                      <div
                        className={`col-md-4 every-month ${isMobile ? " w-50" : ""
                          }`}
                      >
                        <SingleDropDown
                          id="ddlEveryMonths"
                          dataFieldId="id"
                          dataFieldValue="value"
                          datafile={WeekOptions}
                          isSearchable={true}
                          icon={null}
                          placeholder="SelectJS@2..."
                          value={selectedEveryMonths}
                          isSearchIconNotRequired={true}
                          isBlankOptionNotRequired={true}
                          dropDownIndicatorText="Months"
                          selectLabelText="Every"
                          isClearableNotRequired={true}
                          isSortByDataFieldId={true}
                          onChange={(id) =>
                            handleDropDownChange(id, "ddlEveryMonths")
                          }
                        />
                      </div>
                      {isDaysOfTheMonthSelected && isEveryMonthsTabSelected && (
                        <div className="col-lg-8 col-sm-12" id="selectDates">
                          <div className="form-group mb-0">
                            <span
                              className={`span-highlight-label p-0 ${!isMonthDaysSelected &&
                                  isMonthDaysSelected != null
                                  ? "has-error-label"
                                  : ""
                                }`}
                            >
                              Select Dates
                            </span>
                          </div>
                          <div
                            id="selectDates"
                            className={`calendar ${!isMonthDaysSelected &&
                                isMonthDaysSelected != null
                                ? "is-invalid-calendar"
                                : "is-valid-calendar"
                              }`}
                          >
                            {monthDaysList.map((item: Day, index: number) => (
                              <button
                                type="button"
                                key={item.id}
                                data-testid={item.id}
                                disabled={
                                  props.maxSelections ===
                                  monthDaysList.filter(
                                    (x: Day) => x.checked === true
                                  ).length &&
                                  !item.checked &&
                                  props.isMaxSelectionRequired
                                }
                                onClick={(e) =>
                                  handleMonthDayChange(item, index)
                                }
                                className={`day ${item.id === 29 ||
                                    item.id === 30 ||
                                    item.id === 31
                                    ? "holiday"
                                    : ""
                                  } ${item.checked ? "selected-day" : ""} ${(item.id === 29 && item.checked) ||
                                    (item.id === 30 && item.checked) ||
                                    (item.id === 31 && item.checked)
                                    ? "selected-holiday"
                                    : ""
                                  }`}
                              >
                                {item.id}
                              </button>
                            ))}
                          </div>
                          {!isMonthDaysSelected &&
                            isMonthDaysSelected != null && (
                              <div id="days-of-the-month-required">
                                <span className="invalid-feedback-message">
                                  {
                                    FrequencyAdministration.DateIsRequiredMessage
                                  }
                                </span>
                              </div>
                            )}
                          <div className="inline-message im-warning">
                            <span className="ml-5px">
                              The <span className="text-holiday">29</span>,{" "}
                              <span className="text-holiday">30</span> or{" "}
                              <span className="text-holiday">31</span> will not
                              schedule for administration in the months that do
                              not contain these dates, ex. February.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  }
                  {isEveryMonthsTabSelected &&
                    !isDaysOfTheMonthSelected &&
                    daysOfTheWeeks()}
                </div>
                <div
                  className={`tab-pane fade ${!isEveryMonthsTabSelected ? "show active" : ""
                    }`}
                  id="selectMonthsTabContent"
                  role="tabpanel"
                  aria-labelledby="selectMonthsTab"
                >
                  {!isEveryMonthsTabSelected && daysOfTheMonthsAndWeeks()}
                  {props.isOrderWriter ? (
                    <>
                      <div className="row" id="selectMonths">
                        <div className="col-md-5 px-3">
                          <SingleColumnMultiSelectDD
                            id="ddlSelectMonths"
                            dataFieldId="value"
                            dataFieldValue="value"
                            datafile={MonthOptionsData}
                            isSearchable={true}
                            icon={null}
                            placeholder="Select..."
                            value={selectedMonths}
                            isSearchIconNotRequired={true}
                            isBlankOptionNotRequired={true}
                            selectLabelText="Select Months"
                            isClearableNotRequired={true}
                            errorMessage={selectMonthsErrorMessage}
                            onChange={(id) =>
                              handleDropDownChange(id, "ddlSelectMonths")
                            }
                          />
                        </div>
                      </div>
                      <div className="row" id="selectMonths">
                        {isDaysOfTheMonthSelected &&
                          !isEveryMonthsTabSelected && (
                            <div className="col-md-8 pl-3" id="selectDates">
                              <div className="form-group mb-0">
                                <span
                                  className={`span-highlight-label p-0 ${!isMonthDaysSelected &&
                                      isMonthDaysSelected != null
                                      ? "has-error-label"
                                      : ""
                                    }`}
                                >
                                  Select Dates
                                </span>
                              </div>
                              <div
                                id="selectDates"
                                className={`calendar ${!isMonthDaysSelected &&
                                    isMonthDaysSelected != null
                                    ? "is-invalid-calendar"
                                    : "is-valid-calendar"
                                  }`}
                              >
                                {monthDaysList.map(
                                  (item: Day, index: number) => (
                                    <button
                                      type="button"
                                      key={item.id}
                                      data-testid={item.id}
                                      disabled={
                                        props.maxSelections ===
                                        monthDaysList.filter(
                                          (x: Day) => x.checked === true
                                        ).length &&
                                        !item.checked &&
                                        props.isMaxSelectionRequired
                                      }
                                      onClick={(e) =>
                                        handleMonthDayChange(item, index)
                                      }
                                      className={`day ${item.id === 29 ||
                                          item.id === 30 ||
                                          item.id === 31
                                          ? "holiday"
                                          : ""
                                        } ${item.checked ? "selected-day" : ""} ${(item.id === 29 && item.checked) ||
                                          (item.id === 30 && item.checked) ||
                                          (item.id === 31 && item.checked)
                                          ? "selected-holiday"
                                          : ""
                                        }`}
                                    >
                                      {item.id}
                                    </button>
                                  )
                                )}
                              </div>
                              {!isMonthDaysSelected &&
                                isMonthDaysSelected != null && (
                                  <div id="days-of-the-month-required">
                                    <span className="invalid-feedback-message">
                                      {
                                        FrequencyAdministration.DateIsRequiredMessage
                                      }
                                    </span>
                                  </div>
                                )}
                              <div className="inline-message im-warning">
                                <span className="ml-5px">
                                  The <span className="text-holiday">29</span>,{" "}
                                  <span className="text-holiday">30</span> or{" "}
                                  <span className="text-holiday">31</span> will
                                  not schedule for administration in the months
                                  that do not contain these dates, ex. February.
                                </span>
                              </div>
                            </div>
                          )}
                      </div>
                    </>
                  ) : (
                    <div className="row" id="selectMonths">
                      <div className="col-md-4 px-3">
                        <SingleColumnMultiSelectDD
                          id="ddlSelectMonths"
                          dataFieldId="value"
                          dataFieldValue="value"
                          datafile={MonthOptionsData}
                          isSearchable={true}
                          icon={null}
                          placeholder="Select..."
                          value={selectedMonths}
                          isSearchIconNotRequired={true}
                          isBlankOptionNotRequired={true}
                          selectLabelText="Select Months"
                          isClearableNotRequired={true}
                          errorMessage={selectMonthsErrorMessage}
                          onChange={(id) =>
                            handleDropDownChange(id, "ddlSelectMonths")
                          }
                        />
                      </div>
                      {isDaysOfTheMonthSelected &&
                        !isEveryMonthsTabSelected && (
                          <div className="col-md-8" id="selectDates">
                            <div className="form-group mb-0">
                              <span
                                className={`span-highlight-label p-0 ${!isMonthDaysSelected &&
                                    isMonthDaysSelected != null
                                    ? "has-error-label"
                                    : ""
                                  }`}
                              >
                                Select Dates
                              </span>
                            </div>
                            <div
                              id="selectDates"
                              className={`calendar ${!isMonthDaysSelected &&
                                  isMonthDaysSelected != null
                                  ? "is-invalid-calendar"
                                  : "is-valid-calendar"
                                }`}
                            >
                              {monthDaysList.map((item: Day, index: number) => (
                                <button
                                  type="button"
                                  key={item.id}
                                  data-testid={item.id}
                                  disabled={
                                    props.maxSelections ===
                                    monthDaysList.filter(
                                      (x: Day) => x.checked === true
                                    ).length &&
                                    !item.checked &&
                                    props.isMaxSelectionRequired
                                  }
                                  onClick={(e) =>
                                    handleMonthDayChange(item, index)
                                  }
                                  className={`day ${item.id === 29 ||
                                      item.id === 30 ||
                                      item.id === 31
                                      ? "holiday"
                                      : ""
                                    } ${item.checked ? "selected-day" : ""} ${(item.id === 29 && item.checked) ||
                                      (item.id === 30 && item.checked) ||
                                      (item.id === 31 && item.checked)
                                      ? "selected-holiday"
                                      : ""
                                    }`}
                                >
                                  {item.id}
                                </button>
                              ))}
                            </div>
                            {!isMonthDaysSelected &&
                              isMonthDaysSelected != null && (
                                <div id="days-of-the-month-required">
                                  <span className="invalid-feedback-message">
                                    {
                                      FrequencyAdministration.DateIsRequiredMessage
                                    }
                                  </span>
                                </div>
                              )}
                            <div className="inline-message im-warning ">
                              <span className="ml-5px">
                                The <span className="text-holiday">29</span>,{" "}
                                <span className="text-holiday">30</span> or{" "}
                                <span className="text-holiday">31</span> will
                                not schedule for administration in the months
                                that do not contain these dates, ex. February.
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                  {!isEveryMonthsTabSelected &&
                    !isDaysOfTheMonthSelected &&
                    daysOfTheWeeks()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default MonthlySchedule;
