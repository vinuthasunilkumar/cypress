import React, { useState, useRef, useCallback, useEffect } from "react";
import classnames from "classnames";
import AdministrationSchedule from "../../../shared/pages/AdministrationSchedule";
import { initialAdminSchedule } from "../../../shared/constants/InitialAdminSchedule";
import { createMapper } from "@automapper/core";
import { classes } from "@automapper/classes";
import { FacilityDefaultValues } from "../../../shared/enum/ApiEndPoints";
import {
  AddScheduleRequiredFields,
  Frequency,
  FrequencyAdministrationForm,
  FrequencySummary,
  setDefaultFrequencySummary,
  Day,
  ScheduleTimeControls,
  TimeSchedules,
  DropdownItem,
  MonthlySchedules,
  CyclicalSchedules,
  FrequencyAdministrationRequestDto,
} from "../../../models/class/FrequencyAdministration";
import { useForm } from "react-hook-form";
import MultiColumnSingleDD from "../../../shared/pages/MultiColumnSingleDD";
import {
  FrequencyOptionsGroupedByEvery,
  Frequency_Summary_Messages,
  RepeatTypes,
  twoColumns,
} from "../../../shared/enum/FrequencyAdministration";
import {
  checkFrequency,
  checkTimeValidations,
  convertTime12to24,
  convertTo12HourFormat,
  createCyclicalRepeatString,
  createMonthylyRepeatString,
  createTimeObject,
  duplicateTimeEntryExists,
  errorMessageSetTimeType,
  frequencySummaryPlaceholders,
  generateTimeControlsForEveryGroup,
  getFrequencyLongForm,
  getTimeSummary,
  getUsersLocalTimeZone,
  getWeeklySummaryRepeatString,
  handleEveryGroup,
  handleRangeTimes,
  handleSpecificTimes,
  resetErrorSummary,
  resetValidityAndErrorMessage,
  sortTimesInAscending,
  timeLinkObjMeridiumValidation,
  timeMeridiumHoursCheck,
  updateRequestBasedOnRepeatType,
  validateAndDisplayMessage,
  validateTimeControls,
  validateWeeklyDays,
} from "../../../helper/ScheduleUtility";
import { ITimeSchedule } from "../../../models/interface/ITimeSchedule";
import { IAdministrationScheduleListResponse } from "../../../models/interface/IAdministrationScheduleListResponse";
import {
  getAdministrationScheduleDetailsById,
  getFrequencyScheduleList,
} from "../../../services/FrequencyAdministrationService";
import { FrequencyAdministration } from "../../../shared/enum/FrequencyAdministrationValidationMessages";
import { mapRequestDto } from "../../../helper/RequestMapper";
import { getDivHeight } from "../../../helper/Utility";
import { RootState } from "../../../redux/store";
import { Medication } from "../../../types/medicationTypes";
import { useDispatch, useSelector } from "react-redux";
import { defaultMedication } from "../../../shared/constants/DefaultMedication";
import ConfirmDialog from "../../../shared/pages/ConfirmDialog";
import { IAdministrationSchedule } from "../../../models/interface/IAdministrationSchedule";
import freqData from "../../../assets/static-files/Frequency.json";
import WeekOptions from "../../../assets/static-files/WeekOptions.json";
import FrequencyDurationType from "../../../assets/static-files/FrequencyDurationType.json";
import { IAdminSchedule } from "../../../models/interface/IAdminSchedule";
import { getCommonInstruction } from "../../../helper/Utils";
import {
  setFrequencySchedule as reduxSetFrequencySchedule,
  setSelectedFrequency as reduxSetSelectedFrequency,
  setInstruction as reduxSetInstruction,
  setEndDateOpenEnded as reduxSetEndDateOpenEnded,
  setFormattedEndDate as reduxSetFormattedEndDate,
  setFormattedStartDate as reduxSetFormattedStartDate,
  setPRN as reduxSetPRN,
  setDefaultSig as reduxSetDefaultSig,
} from "../../../redux/slices/orderWriterSlice";

export type CustomizeSchedulingType = {
  isCustomizeScheduleActive: boolean;
  onOverLayCustomizeScheduleClick: () => void;
  medicationId: number;
};

const CustomizeScheduleing = ({
  isCustomizeScheduleActive,
  onOverLayCustomizeScheduleClick,
  medicationId,
}: CustomizeSchedulingType) => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] =
    useState<IAdminSchedule>(initialAdminSchedule);
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const cyclicalScheduleComponentRef = useRef<any>();
  const monthlyScheduleComponentRef = useRef<any>();
  const btnDailyRef = useRef<HTMLButtonElement>(null);
  const btnCyclicalRef = useRef<HTMLButtonElement>(null);
  const btnWeeklyRef = useRef<HTMLButtonElement>(null);
  const btnMonthlyRef = useRef<HTMLButtonElement>(null);
  const [showConfirmCancelModal, setShowConfirmCancelModal] =
    useState<boolean>(false);

  const medication: Medication =
    (useSelector((state: RootState) =>
      state.orderWriter.medications.find((med: any) => med.id === medicationId)
    ) as Medication) || defaultMedication;

  const administrationScheduleId =
    medication?.instructions?.frequencySchedule
      ?.existingAdministrationScheduleId!;
  const addNewMode =
    administrationScheduleId === 0 ||
    administrationScheduleId === null ||
    administrationScheduleId === undefined;

  useEffect(() => {
    if (!addNewMode) {
      formValues.editScheduleData = {
        id: medication.instructions.frequencySchedule.id,
        isPrn: medication.instructions.frequencySchedule.isPrn,
        frequencyCode: medication.instructions.frequencySchedule.frequencyCode,
        frequencyCodeDescription:
          medication.instructions.frequencySchedule.frequencyCodeDescription,
        summary: medication.instructions.frequencySchedule.summary,
        orderTypeSummary:
          medication.instructions.frequencySchedule.orderTypeSummary,
        assignedToSummary:
          medication.instructions.frequencySchedule.assignedToSummary,
        timeSummary: medication.instructions.frequencySchedule.timeSummary,
        frequencyRepeatSummary:
          medication.instructions.frequencySchedule.frequencyRepeatSummary,
        orderType: medication.instructions.frequencySchedule.orderType,
        medicationType:
          medication.instructions.frequencySchedule.medicationType!,
        fdbMedGroupId: medication.instructions.frequencySchedule.fdbMedGroupId,
        gcnSeqNo: 0,
        isDefault: false,
        scheduleType: medication.instructions.frequencySchedule.scheduleType,
        duration: medication.instructions.frequencySchedule.duration,
        durationType: medication.instructions.frequencySchedule.durationType,
        fdbDrugId: medication.instructions.frequencySchedule.fdbDrugId,
        timeSchedule: medication.instructions.frequencySchedule.timeSchedules,
        cyclicalSchedule:
          medication.instructions.frequencySchedule.cyclicalSchedules!,
        weeklySchedule:
          medication.instructions.frequencySchedule.weeklySchedule!,
        monthlySchedule:
          medication.instructions.frequencySchedule.monthlySchedule!,
        scheduleLocation:
          medication.instructions.frequencySchedule.scheduleLocation!,
        assignedTo: "",
        timesPerDay: medication.instructions.frequencySchedule.timesPerDay,
        specifyMinutes:
          medication.instructions.frequencySchedule.specifyMinutes,
      };

      populateEditScheduleData(formValues.editScheduleData);
    }
    setTimeout(() => {
      let btnElement = document.getElementById("btnCancel");
      btnElement?.focus();
    }, 10);
  }, []);

  useEffect(() => {
      formValues.startDate = new Date(
        medication?.instructions?.formattedStartDate
      );
    
    if (medication.instructions.checkedPRN) {
      formValues.isPrnChecked = medication.instructions.checkedPRN;
    }
    if (medication.instructions.selectedFrequency) {
      let frequency = medication.instructions.selectedFrequency as Frequency;
      frequencyChange(frequency);
    } else {
      formValues.selectedDuration = null;
      formValues.selectedDurationType = null;
      formValues.selectedFrequency = null;
      formValues.time = [];
      formValues.timeRange = [];
      formValues.summary = "";
      formValues.summaryTimeString = "";
    }

    setFormValues({ ...formValues });
  }, []);

  const [errorFields, setErrorFields] = useState<
    Record<string, AddScheduleRequiredFields[]>
  >({
    daily: [],
    order: [],
    cyclical: [],
    monthly: [],
  });

  const [requestResponse, setRequestResponse] = useState({
    textMessage: "",
    alertClassName: "",
  });
  const [frequencySummary, setFrequencySummary] = useState<FrequencySummary>(
    setDefaultFrequencySummary()
  );
  const sortColumn = "Frequency";

  let isFormValid = true;
  const [bodyHeight, setBodyHeight] = useState("0vh");
  const [modalWidth, setModalWidth] = useState(0);

  const resizeWindow = () => {
    let headerHeight = getDivHeight("schedule_header", "id");
    let footerHeight = getDivHeight("schedule_footer", "id");

    let calculateBodyHeight =
      window.innerHeight - headerHeight - footerHeight - 33 + "px";
    setBodyHeight(calculateBodyHeight);
    setModalWidth(window.innerWidth);
  };
  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  useEffect(() => {
    if (formValues.selectedFrequency?.shortAbbreviation) {
      loadScheduleList();
    } else {
      formValues.administrationScheduleList = [];
      setFormValues({ ...formValues });
    }
  }, [
    formValues.selectedFrequency?.shortAbbreviation,
    formValues.selectedAdministrationScheduleId,
  ]);

  const loadScheduleList = () => {
    getScheduleList(
      true,
      formValues.selectedFrequency?.shortAbbreviation!,
      formValues.selectedAdministrationScheduleId,
      sortColumn
    );
  };

  const sideMenuClasses = classnames("side-menu", {
    "side-menu-active": isCustomizeScheduleActive,
  });

  const sideMenuContentClasses = classnames("side-menu_content", {
    "side-menu_content-active": isCustomizeScheduleActive,
    "overflow-auto": !isCustomizeScheduleActive,
  });

  const btnCloseFocus = () => {
    let btnElement = document.getElementById("btnCancel");
    btnElement?.focus();
  };

  const getScheduleList = useCallback(
    async (
      isSortDescending: boolean,
      frequencyCode: string,
      administrationId: number,
      sortColumn: string
    ) => {
      administrationId = isNaN(administrationId) ? 0 : administrationId;
      const response: IAdministrationScheduleListResponse =
        await getFrequencyScheduleList(
          isSortDescending,
          frequencyCode,
          administrationId,
          sortColumn,
          FacilityDefaultValues.facilityId
        );
      const { administrationSchedule } = response || {};

      if (administrationSchedule !== undefined) {
        setFormValues((prevState) => ({
          ...prevState,
          administrationScheduleList: administrationSchedule,
        }));
      } else {
        setFormValues((prevState) => ({
          ...prevState,
          administrationScheduleList: [],
        }));
      }
    },
    []
  );

  const generateTimeControls = (
    val: Frequency | null,
    isToggled?: boolean | null,
    usersTimeSchedules?: ITimeSchedule[]
  ) => {
    let tempTimeSpecificArray: ScheduleTimeControls[] = [];
    let tempTimeRangeArray: ScheduleTimeControls[] = [];

    if (val) {
      const isInEveryGroup = FrequencyOptionsGroupedByEvery.some(
        (freq) => freq.shortAbbreviation === val?.shortAbbreviation
      );
      formValues.isFreqBelongsToEveryGroup = isInEveryGroup;
      if (isInEveryGroup) {
        setValue("isFreqGroupedByEvery", true);
        handleEveryGroup(
          val,
          addNewMode,
          isToggled,
          usersTimeSchedules,
          tempTimeSpecificArray,
          formValues,
          setFormValues
        );
      } else {
        setValue("isFreqGroupedByEvery", false);
        handleSpecificTimes(
          val,
          addNewMode,
          isToggled,
          usersTimeSchedules,
          tempTimeSpecificArray,
          formValues,
          setFormValues
        );
        handleRangeTimes(
          val,
          addNewMode,
          isToggled,
          usersTimeSchedules,
          tempTimeRangeArray,
          formValues,
          setFormValues
        );
      }
      formValues.isTimeRangeDisabled =
        val.noOfRangeTimeInstance === 0 && val.shortAbbreviation !== "_XD";
      formValues.time = [...tempTimeSpecificArray];
      formValues.timeRange = [...tempTimeRangeArray];
    } else {
      formValues.time = [];
      formValues.timeRange = [];
    }
    setFormValues({ ...formValues });
  };

  const {
    setValue,
    getValues,
    handleSubmit,
    reset,
    register,
    formState: { isDirty },
  } = useForm<FrequencyAdministrationForm>({
    defaultValues: {
      duration: null,
      durationType: null,
      isDefault: false,
      isPrn: false,
      scheduleType: initialAdminSchedule.selectedRepeatType,
      orderType: 0,
      scheduleLocation: null,
      timeSchedules: [],
      assignedToSummary: "",
    },
  });

  const closeApiResponseMsg = () => {
    formValues.showApiResponseMsg = false;
    setFormValues({ ...formValues });
  };

  const getErrorsCountMessage = () => {
    let errorFieldCount =
      errorFields.daily.filter((x) => !x.isValid).length +
      errorFields.order.filter((x) => !x.isValid).length +
      errorFields.cyclical.filter((x) => !x.isValid).length +
      errorFields.monthly.filter((x) => !x.isValid).length;
    if (errorFieldCount === 0) {
      formValues.showApiResponseMsg = false;
      formValues.showErrorSummary = false;
      setFormValues({ ...formValues });
    }
    return errorFieldCount === 1
      ? `${errorFieldCount} Error found`
      : `${errorFieldCount} Errors found`;
  };

  const frequencyChange = (val: Frequency) => {
    formValues.specificTimeErrorMessage = "";
    formValues.timeRangeErrorMessage = "";
    setValue("frequencyCode", val?.shortAbbreviation, { shouldDirty: true });
    setValue("frequencyCodeDescription", val?.abbreviation, {
      shouldDirty: true,
    });
    if (
      formValues.selectedFrequency !== null &&
      formValues.selectedFrequency?.shortAbbreviation !== val?.shortAbbreviation
    ) {
      repeatsClearForm();
      if (val !== null) {
        getScheduleList(
          false,
          val?.shortAbbreviation,
          addNewMode ? 0 : Number(administrationScheduleId),
          sortColumn
        );
      } else {
        formValues.administrationScheduleList = [];
      }
      formValues.isBtnSpecificTimeChecked = true;
      formValues.isFreqBelongsToEveryGroup = false;
      formValues.isTimeRangeDisabled = false;
      formValues.selectedRepeatType = RepeatTypes.Daily;
      formValues.summaryTimeString = "";
      formValues.repeatStrings = "";
      if (
        val.shortAbbreviation !== "_XD" &&
        val.shortAbbreviation !== "Q_min"
      ) {
        generateTimeControls(val, null, []);
        resetTimesPerDayValidations();
        resetSpecifyMinutesValidations();
        setValue("timesPerDay", null, { shouldDirty: false });
        setValue("specifyMinutes", null, { shouldDirty: false });
      } else {
        resetTimesPerDayValidations();
        setValue("timesPerDay", null, { shouldDirty: false });
        resetSpecifyMinutesValidations();
        setValue("specifyMinutes", null, { shouldDirty: false });
        generateTimeControls(null, null, []);
      }
      setValue("scheduleType", RepeatTypes.Daily, { shouldDirty: true });
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: val?.abbreviation === null ? "" : val?.abbreviation,
        repeat: "",
        summaryTime: "",
        duration: "",
        durationType: "",
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        assignToSummary: formValues.assignToText,
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
    } else if (
      val !== null &&
      formValues.selectedFrequency?.shortAbbreviation !== val?.shortAbbreviation
    ) {
      repeatsClearForm();
      checkFrequency(val, formValues, setFormValues);
      if (formValues.isRepeatTypesDisabled) {
        chooseRepeatType(formValues.selectedRepeatOption, true);
      }
      getScheduleList(
        false,
        val?.shortAbbreviation,
        addNewMode ? 0 : Number(administrationScheduleId),
        sortColumn
      );
      formValues.isBtnSpecificTimeChecked = true;
      if (
        val.shortAbbreviation !== "_XD" &&
        val.shortAbbreviation !== "Q_min"
      ) {
        generateTimeControls(val, null, []);
        resetTimesPerDayValidations();
        resetSpecifyMinutesValidations();
        setValue("timesPerDay", null, { shouldDirty: false });
        setValue("specifyMinutes", null, { shouldDirty: false });
      } else {
        resetTimesPerDayValidations();
        setValue("timesPerDay", null, { shouldDirty: false });
        resetSpecifyMinutesValidations();
        setValue("specifyMinutes", null, { shouldDirty: false });
        generateTimeControls(null, null, []);
      }
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: val?.abbreviation,
        repeat: formValues.repeatStrings,
        summaryTime: formValues.summaryTimeString,
        duration: formValues.selectedDuration?.toString(),
        durationType: formValues.selectedDurationType?.label.toString(),
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        isFreqGroupedByEvery: formValues.isFreqBelongsToEveryGroup,
        assignToSummary: formValues.assignToText,
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
    }
    formValues.selectedFrequency = val;

    if (val === null) {
      formValues.administrationScheduleList = [];
      formValues.isBtnSpecificTimeChecked = true;
      formValues.isTimeRangeDisabled = false;
      formValues.isFreqBelongsToEveryGroup = false;
      formValues.selectedRepeatType = RepeatTypes.Daily;
      formValues.summaryTimeString = "";
      formValues.repeatStrings = "";

      setValue("scheduleType", RepeatTypes.Daily, { shouldDirty: true });

      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: "",
        repeat: "",
        summaryTime: "",
        duration: "",
        durationType: "",
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        assignToSummary: formValues.assignToText,
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
      resetTimesPerDayValidations();
      resetSpecifyMinutesValidations();
    }
    validateAndDisplayMessage(
      "frequency",
      val,
      formValues,
      setFormValues,
      setErrorFields
    );
    setFormValues({ ...formValues });
  };

  const updateSummary = (newFormattedString: string) => {
    formValues.summary = newFormattedString;
    setFormValues({ ...formValues });
  };

  const setSummaryValue = (frequencyParams: FrequencySummary) => {
    const formattedString = frequencySummaryPlaceholders(
      frequencyParams,
      frequencySummary,
      setFrequencySummary
    );
    updateSummary(formattedString);
  };

  const setValueAndSelected = (
    type: string,
    id: DropdownItem,
    fieldName: keyof FrequencyAdministrationForm,
    value: string | number | null
  ) => {
    setValue(fieldName, value, { shouldDirty: true });
    switch (type) {
      case "ddlDurationType":
        formValues.selectedDurationType = id;
        setFormValues({ ...formValues });
        break;
      case "ddlEveryWeeks":
        formValues.selectedWeek = id;
        setFormValues({ ...formValues });
        break;
    }
  };

  const handleDropDownChange = (id: DropdownItem, type: string) => {
    let weeklyRepeatString = "";
    switch (type) {
      case "ddlDurationType":
        setValueAndSelected(
          type,
          id,
          "durationType" as keyof FrequencyAdministrationForm,
          id !== null ? id.label.toString() : null
        );
        validateAndDisplayMessage(
          "ddlDurationType",
          id,
          formValues,
          setFormValues,
          setErrorFields,
          getValues("duration") !== null && getValues("duration") !== undefined,
          "ddlDuration"
        );
        break;
      case "ddlDuration":
      case "ddlEveryWeeks": {
        setValueAndSelected(
          type,
          id,
          "weeklySchedule.everyWeek" as keyof FrequencyAdministrationForm,
          id !== null ? Number(id.label) : null
        );
        let selectedDays = formValues.days
          .filter((x: Day) => x.checked)
          .map((x: Day) => x.value)
          .join(",");
        weeklyRepeatString = getWeeklySummaryRepeatString(
          id !== null ? Number(id.label) : 0,
          selectedDays
        );
        formValues.repeatStrings = weeklyRepeatString;
        setFormValues({ ...formValues });
        break;
      }
    }
    let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
    const updatedFrequencySummary = {
      ...frequencySummary,
      frequencyLongForm: getFrequencyLongForm(
        formValues.selectedFrequency,
        isTimesPerDay
      ),
      repeat:
        type === "ddlEveryWeeks"
          ? weeklyRepeatString
          : formValues.repeatStrings,
      summaryTime: formValues.summaryTimeString,
      duration: getValues("duration")?.toString()!,
      durationType: getValues("durationType")?.toString()!,
      isPrn: formValues.isPrnChecked ? "as needed" : "",
      orderTypeSummary: getValues("orderTypeSummary"),
      isFreqGroupedByEvery: formValues.isFreqBelongsToEveryGroup,
      assignToSummary: formValues.assignToText,
    };
    setFrequencySummary(updatedFrequencySummary);
    setSummaryValue(updatedFrequencySummary);
  };

  const handleOnDurationChanges = (value: string) => {
    formValues.selectedDuration = value ? Number(value) : null;
    setFormValues({ ...formValues });
    setValue("duration", value ? Number(value) : null, { shouldDirty: true });
    validateAndDisplayMessage(
      "ddlDuration",
      value,
      formValues,
      setFormValues,
      setErrorFields,
      getValues("durationType") !== null &&
        getValues("durationType") !== undefined,
      "ddlDurationType"
    );
    let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
    const updatedFrequencySummary = {
      ...frequencySummary,
      frequencyLongForm: getFrequencyLongForm(
        formValues.selectedFrequency,
        isTimesPerDay
      ),
      repeat: formValues.repeatStrings,
      summaryTime: formValues.summaryTimeString,
      duration: value,
      durationType: getValues("durationType")?.toString()!,
      isPrn: formValues.isPrnChecked ? "as needed" : "",
      orderTypeSummary: getValues("orderTypeSummary"),
      isFreqGroupedByEvery: formValues.isFreqBelongsToEveryGroup,
      assignToSummary: formValues.assignToText,
    };
    setFrequencySummary(updatedFrequencySummary);
    setSummaryValue(updatedFrequencySummary);
  };

  const onTimeChange = (
    val: ScheduleTimeControls,
    index: number,
    isSpecificTime: boolean,
    performValidations: boolean
  ) => {
    let newTimeArray: TimeSchedules[] = [];
    const targetArray: ScheduleTimeControls[] = isSpecificTime
      ? formValues.time
      : formValues.timeRange;
    // Create a new array with the updated value
    const updatedArray = targetArray.map((item, i) =>
      i === index ? { ...item, value: val.value } : item
    );
    // Update the state based on the condition
    if (isSpecificTime) {
      formValues.time = updatedArray;
    } else {
      formValues.timeRange = updatedArray;
    }
    const updatedTimeArray = updatedArray.map((linkObj, i) =>
      updateLinkObj(
        linkObj,
        i,
        linkObj?.value,
        isSpecificTime,
        index,
        performValidations
      )
    );

    if (formValues.isFreqBelongsToEveryGroup && val.value !== "") {
      formValues.time[0].value = updatedTimeArray[0].value;
      const newEveryGroupTimeArray = generateTimeControlsForEveryGroup(
        formValues.time,
        formValues.selectedFrequency,
        formValues.isFreqBelongsToEveryGroup
      );
      formValues.everyGroupTimes = newEveryGroupTimeArray;
      setValue("timeSchedules", newEveryGroupTimeArray, {
        shouldDirty: true,
      });
      const newSummaryArray: TimeSchedules[] = [newEveryGroupTimeArray[0]];
      setTimeSummaryValue(
        newSummaryArray,
        isSpecificTime,
        formValues.isFreqBelongsToEveryGroup
      );
    } else {
      if (isSpecificTime) {
        formValues.time = updatedTimeArray;
      } else {
        formValues.timeRange = updatedTimeArray;
      }
      updatedTimeArray?.forEach((itm: any) => {
        processTimeItem(itm, newTimeArray, isSpecificTime, performValidations);
      });
      setValue("timeSchedules", newTimeArray, { shouldDirty: true });
      setTimeSummaryValue(
        newTimeArray,
        isSpecificTime,
        formValues.isFreqBelongsToEveryGroup
      );
    }
    setFormValues({ ...formValues });
  };

  const updateLinkObj = (
    linkObj: ScheduleTimeControls,
    i: number,
    timeVal: string | Date,
    isSpecificTime: boolean,
    index: number,
    performValidations: boolean
  ) => {
    if (i !== index) return linkObj;
    if (typeof timeVal === "string") {
      if (timeVal.includes(":") && !timeVal.includes("invalid")) {
        const dtObj = new Date();
        let meridiumMentioned = "";
        meridiumMentioned = timeLinkObjMeridiumValidation(timeVal);
        timeVal = timeVal
          .replace(" ", "")
          .replace(FrequencyAdministration.TimeMeridiumMorning, "")
          .replace(FrequencyAdministration.TimeMeridiumEvening, "");
        let [hours, minutes] = timeVal.split(":");
        hours = timeMeridiumHoursCheck(hours, meridiumMentioned);
        dtObj.setHours(Number(hours));
        dtObj.setMinutes(Number(minutes));
        dtObj.setSeconds(0);

        linkObj.value = dtObj;
        linkObj.isValid = true;
        if (performValidations) {
          checkTimeValidations(isSpecificTime, formValues, setFormValues);
        }
      } else {
        linkObj.value = "";
        linkObj.isValid = false;
        errorMessageSetTimeType(
          isSpecificTime,
          timeVal,
          formValues,
          setFormValues
        );
      }
    } else if (timeVal !== null) {
      const timeValue = timeVal?.toLocaleString("en-US", {
        timeZone: getUsersLocalTimeZone(),
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      const [hours, minutes] = timeValue?.split(":");
      timeVal.setHours(Number(hours));
      timeVal.setMinutes(Number(minutes));
      timeVal.setSeconds(0);

      linkObj.value = timeVal;
      linkObj.isValid = true;
      if (performValidations) {
        checkTimeValidations(isSpecificTime, formValues, setFormValues);
      }
    } else {
      linkObj.value = timeVal;
      linkObj.isValid = true;
      if (performValidations) {
        checkTimeValidations(isSpecificTime, formValues, setFormValues);
      }
    }
    return linkObj;
  };

  const setTimeSummaryValue = (
    newTimeArray: TimeSchedules[],
    isSpecificTime: boolean,
    isFreqGroupedByEvery: boolean
  ) => {
    let formattedEveryFreqTimeSlots = "";
    if (isFreqGroupedByEvery) {
      const timeValues = getValues("timeSchedules");
      const sortedTimeValues = sortTimesInAscending(timeValues);
      formattedEveryFreqTimeSlots = sortedTimeValues
        .map((timeSlot) => {
          const formattedStartTime = timeSlot.startTime ?? "";
          return formattedStartTime;
        })
        .join(", ");
    }
    const formattedTimeSlots = newTimeArray
      .map((timeSlot) => {
        const formattedStartTime = timeSlot.startTime ?? "";
        return formattedStartTime;
      })
      .join(", ");
    const formattedTimeRangeSlots = newTimeArray
      .map((timeSlot) => {
        const formattedStartTime = timeSlot.startTime ?? "";
        const formattedEndTime = timeSlot.endTime ?? "";
        return `${formattedStartTime} - ${formattedEndTime}`;
      })
      .join(", ");
    formValues.summaryTimeString = isSpecificTime
      ? formattedTimeSlots
      : formattedTimeRangeSlots;

    let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
    const updatedFrequencySummary = {
      ...frequencySummary,
      frequencyLongForm: getFrequencyLongForm(
        formValues.selectedFrequency,
        isTimesPerDay
      ),
      repeat: formValues.repeatStrings,
      summaryTime: isSpecificTime
        ? formattedTimeSlots
        : formattedTimeRangeSlots,
      duration: getValues("duration")?.toString()!,
      durationType: getValues("durationType")?.toString()!,
      isPrn: formValues.isPrnChecked ? "as needed" : "",
      orderTypeSummary: getValues("orderTypeSummary"),
      assignToSummary: formValues.assignToText,
      isFreqGroupedByEvery: isFreqGroupedByEvery,
      timeSummary: getTimeSummary(
        isFreqGroupedByEvery,
        formattedEveryFreqTimeSlots,
        isSpecificTime,
        formattedTimeSlots,
        formattedTimeRangeSlots
      ),
    };
    setFrequencySummary(updatedFrequencySummary);
    setSummaryValue(updatedFrequencySummary);
    setFormValues({ ...formValues });
  };

  const processTimeItem = (
    itm: ScheduleTimeControls,
    newTimeArray: TimeSchedules[],
    isSpecificTime: boolean,
    performValidations: boolean
  ) => {
    const targetArray = isSpecificTime ? formValues.time : formValues.timeRange;
    const timeType = isSpecificTime ? "specificTime" : "timeRange";
    if (itm.value !== "") {
      itm.value = new Date(itm.value);
      targetArray.find((x) => x.label === itm.label)!.isValid = true;
      if (performValidations) {
        checkTimeValidations(isSpecificTime, formValues, setFormValues);
      }
      const [hrs, mins] = [itm.value.getHours(), itm.value.getMinutes()];
      const timeIn24HrFormat = `${hrs}:${mins}`;
      const convertedTime = convertTo12HourFormat(timeIn24HrFormat);
      const obj = createTimeObject(convertedTime);

      if (isSpecificTime || itm.name.startsWith("StartTime")) {
        newTimeArray.push(obj);
      } else if (itm.name.startsWith("EndTime") && newTimeArray.length > 0) {
        newTimeArray[newTimeArray.length - 1].endTime = convertedTime;
      }
      const isInvalidTimesFound = targetArray.filter(
        (x) => x.isValid === false
      );
      if (isInvalidTimesFound.length === 0) {
        resetValidityAndErrorMessage(
          timeType,
          targetArray,
          formValues,
          setFormValues
        );
      }
    } else if ((performValidations && itm.value === "") || itm.value === null) {
      targetArray.find((x) => x.label === itm.label)!.isValid = false;
      checkTimeValidations(isSpecificTime, formValues, setFormValues);
    }
  };

  const formatSummary = (str: string) => {
    return str.replace(/ at/g, "\nat").replace(/ for/g, "\nfor");
  };

  const onblurEvent = (
    val: React.FocusEvent<HTMLInputElement>,
    index: number,
    isSpecificTime: boolean,
    performValidations: boolean,
    label: string
  ) => {
    let newTimeArray: TimeSchedules[] = [];
    const timeArray: ScheduleTimeControls[] = isSpecificTime
      ? formValues.time
      : formValues.timeRange;
    const timeValue = val.target.value;
    let timeVal: string = convertTime12to24(timeValue);
    timeVal = duplicateTimeEntryExists(
      isSpecificTime,
      timeVal,
      timeArray,
      label,
      index
    );

    const updatedTimeArray = timeArray.map((linkObj, i) =>
      updateLinkObj(
        linkObj,
        i,
        timeVal,
        isSpecificTime,
        index,
        performValidations
      )
    );

    if (
      formValues.isFreqBelongsToEveryGroup &&
      timeValue !== "" &&
      !timeVal.includes("invalid")
    ) {
      const newEveryGroupTimeArray = generateTimeControlsForEveryGroup(
        formValues.time,
        formValues.selectedFrequency,
        formValues.isFreqBelongsToEveryGroup
      );
      const newSummaryArray: TimeSchedules[] = [newEveryGroupTimeArray[0]];
      formValues.everyGroupTimes = newEveryGroupTimeArray;
      setValue("timeSchedules", newEveryGroupTimeArray, {
        shouldDirty: true,
      });
      setTimeSummaryValue(
        newSummaryArray,
        isSpecificTime,
        formValues.isFreqBelongsToEveryGroup
      );
    } else {
      if (updatedTimeArray && !updatedTimeArray[index].isValid) {
        updatedTimeArray[index].errorMessage = timeVal;
      }
      if (!timeVal.includes("invalid") && !timeVal.includes("Time")) {
        timeArray[index].strVal = timeVal;
      } else {
        timeArray[index].strVal = "";
      }
      if (isSpecificTime) {
        formValues.time = updatedTimeArray;
      } else {
        formValues.timeRange = updatedTimeArray;
      }
      updatedTimeArray?.forEach((itm: any) => {
        processTimeItem(itm, newTimeArray, isSpecificTime, performValidations);
      });
      setValue("timeSchedules", newTimeArray, { shouldDirty: true });
      setTimeSummaryValue(
        newTimeArray,
        isSpecificTime,
        formValues.isFreqBelongsToEveryGroup
      );
    }
    setFormValues({ ...formValues });
  };

  const getScheduleRecordById = async (id: number, isPreset: boolean) => {
    if (isPreset) {
      formValues.presetAdministrationScheduleId = id;
    }
    const response = await getAdministrationScheduleDetailsById(id);
    if (response) {
      formValues.isCustomTabSelected = true;
      formValues.editScheduleData = response;
    }
    setFormValues({ ...formValues });
  };

  const chooseTimeHandler = (status: boolean, clikedButtonId?: string) => {
    if (formValues.isBtnSpecificTimeChecked !== status) {
      if (!addNewMode) {
        setValue("timeSchedules", [], { shouldDirty: true });
      }
      resetDurationFields();
      formValues.summaryTimeString = "";
      let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: getFrequencyLongForm(
          formValues.selectedFrequency,
          isTimesPerDay
        ),
        repeat: formValues.repeatStrings,
        summaryTime: "",
        duration: "",
        durationType: "",
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        assignToSummary: formValues.assignToText,
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
    }
    if (formValues.isBtnSpecificTimeChecked && status) return;
    if (!formValues.isBtnSpecificTimeChecked && !status) return;
    if (clikedButtonId === "btnSpecificTime") {
      formValues.timeRangeErrorMessage = "";
      formValues.fieldsToValidate.find(
        (x) => x.fieldName === "timeRange"
      )!.isValid = true;
    }
    if (clikedButtonId === "btnTimeRange") {
      formValues.fieldsToValidate.find(
        (x) => x.fieldName === "specificTime"
      )!.isValid = true;
      formValues.specificTimeErrorMessage = "";
    }
    setErrorFields((prevFields) => ({
      ...prevFields,
      daily: formValues.fieldsToValidate,
    }));
    formValues.isBtnSpecificTimeChecked = clikedButtonId === "btnSpecificTime";
    generateTimeControls(formValues.selectedFrequency as Frequency, true, []);
    setFormValues({ ...formValues });
  };

  const handleCyclicalScheduleFields = (
    cyclicalFields: CyclicalSchedules,
    isModified: boolean
  ) => {
    let cyclicalRepeatStrings = createCyclicalRepeatString(cyclicalFields);
    const eixstingValue = getValues("cyclicalSchedules.cycle");
    if (eixstingValue !== cyclicalFields.cycle) {
      resetTimeControls();
      resetDurationFields();
    }
    formValues.resetScheduleData = false;
    formValues.repeatStrings = cyclicalRepeatStrings!;
    setFormValues({ ...formValues });
    let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
    const updatedFrequencySummary = {
      ...frequencySummary,
      frequencyLongForm: getFrequencyLongForm(
        formValues.selectedFrequency,
        isTimesPerDay
      ),
      repeat: Frequency_Summary_Messages.RepeatString(
        cyclicalRepeatStrings as string
      ),
      summaryTime:
        eixstingValue !== cyclicalFields.cycle
          ? ""
          : formValues.summaryTimeString,
      duration:
        eixstingValue !== cyclicalFields.cycle
          ? ""
          : getValues("duration")?.toString()!,
      durationType:
        eixstingValue !== cyclicalFields.cycle
          ? ""
          : getValues("durationType")?.toString()!,
      isPrn: formValues.isPrnChecked ? "as needed" : "",
      orderTypeSummary: getValues("orderTypeSummary"),
      isFreqGroupedByEvery: formValues.isFreqBelongsToEveryGroup,
      assignToSummary: formValues.assignToText,
    };
    setFrequencySummary(updatedFrequencySummary);
    setSummaryValue(updatedFrequencySummary);
    setValue("cyclicalSchedules.cycle", cyclicalFields.cycle, {
      shouldDirty: isModified,
    });
    setValue(
      "cyclicalSchedules.giveDays",
      cyclicalFields.cycle === 1 ? cyclicalFields.giveDays : 0,
      { shouldDirty: isModified }
    );
    setValue(
      "cyclicalSchedules.skipDays",
      cyclicalFields.cycle === 1 ? cyclicalFields.skipDays : 0,
      { shouldDirty: isModified }
    );
  };

  const handleValidatedCyclicalFields = (
    newFields: AddScheduleRequiredFields[],
    scheduleType: string
  ) => {
    setErrorFields((prevFields) => ({
      ...prevFields,
      [scheduleType]: newFields,
    }));
  };

  const handleValidatedMonthlyFields = (
    newFields: AddScheduleRequiredFields[],
    scheduleType: string
  ) => {
    return setErrorFields((prevFields) => ({
      ...prevFields,
      [scheduleType]: newFields,
    }));
  };

  const chooseRepeatType = (type: RepeatTypes, clearRepeatForms?: boolean) => {
    let weeklyRepeatString = "";
    setValue("scheduleType", type, { shouldDirty: true });
    btnDailyRef.current?.blur();
    btnCyclicalRef.current?.blur();
    btnWeeklyRef.current?.blur();
    btnMonthlyRef.current?.blur();
    if (formValues.selectedRepeatType !== type || clearRepeatForms) {
      repeatsClearForm();
      resetTimeControls();
      formValues.summaryTimeString = "";
      formValues.repeatStrings = "";
      if (!addNewMode && formValues.editScheduleData) {
        formValues.editScheduleData.cyclicalSchedule = null;
        formValues.editScheduleData.weeklySchedule = null;
        formValues.editScheduleData.monthlySchedule = null;
      }
    }
    formValues.selectedRepeatType = type;
    formValues.isDaySelectedForWeeklyBlock = null;

    if (type === RepeatTypes.Weekly) {
      setValue(
        "weeklySchedule.everyWeek",
        Number(formValues.selectedWeek.label),
        {
          shouldDirty: true,
        }
      );
      weeklyRepeatString = getWeeklySummaryRepeatString(
        Number(formValues.selectedWeek.label),
        ""
      );
      formValues.repeatStrings = weeklyRepeatString;
    } else {
      formValues.fieldsToValidate.find(
        (x) => x.fieldName === "weeklyDays"
      )!.isValid = true;
      setErrorFields((prevFields) => ({
        ...prevFields,
        daily: formValues.fieldsToValidate,
      }));
      formValues.days.forEach((x) => (x.checked = false));
    }
    let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
    const updatedFrequencySummary = {
      ...frequencySummary,
      frequencyLongForm: getFrequencyLongForm(
        formValues.selectedFrequency,
        isTimesPerDay
      ),
      repeat: type === RepeatTypes.Weekly ? weeklyRepeatString : "",
      summaryTime: "",
      duration: "",
      durationType: "",
      isPrn: formValues.isPrnChecked ? "as needed" : "",
      orderTypeSummary: getValues("orderTypeSummary"),
      assignToSummary: formValues.assignToText,
    };
    setFrequencySummary(updatedFrequencySummary);
    setSummaryValue(updatedFrequencySummary);
    resetErrorSummary(type, setErrorFields);
    setFormValues({ ...formValues });
  };

  const handleDayChange = (e: Day, index: number) => {
    formValues.days[index].checked = !e.checked;
    formValues.days = [...formValues.days];
    let selectedDays = formValues.days
      .filter((x: Day) => x.checked)
      .map((x: Day) => x.value)
      .join(",");
    setValue("weeklySchedule.selectedDays", selectedDays, {
      shouldDirty: true,
    });
    const checkedDays = formValues.days.filter((x: Day) => x.checked === true);
    validateWeeklyDays(formValues, setFormValues);
    let weeklyRepeatString = getWeeklySummaryRepeatString(
      Number(formValues.selectedWeek.label),
      selectedDays
    );
    formValues.isDaySelectedForWeeklyBlock = checkedDays.length > 0;
    formValues.repeatStrings = weeklyRepeatString;
    let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
    const updatedFrequencySummary = {
      ...frequencySummary,
      frequencyLongForm: getFrequencyLongForm(
        formValues.selectedFrequency,
        isTimesPerDay
      ),
      repeat: weeklyRepeatString,
      summaryTime: formValues.summaryTimeString,
      duration: getValues("duration")?.toString()!,
      durationType: getValues("durationType")?.toString()!,
      isPrn: formValues.isPrnChecked ? "as needed" : "",
      orderTypeSummary: getValues("orderTypeSummary"),
      isFreqGroupedByEvery: formValues.isFreqBelongsToEveryGroup,
      assignToSummary: formValues.assignToText,
    };
    setFrequencySummary(updatedFrequencySummary);
    setSummaryValue(updatedFrequencySummary);
    setFormValues({ ...formValues });
  };

  const setMonthlyScheduleFields = (
    monthlyFields: MonthlySchedules,
    isModified: boolean,
    isReset: boolean
  ) => {
    if (monthlyFields) {
      if (isReset) {
        resetTimeControls();
        resetDurationFields();
      }
      const monthlyRepeatStrings = createMonthylyRepeatString(monthlyFields);
      formValues.repeatStrings = monthlyRepeatStrings;
      let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: getFrequencyLongForm(
          formValues.selectedFrequency,
          isTimesPerDay
        ),
        repeat: monthlyRepeatStrings,
        summaryTime: isReset ? "" : formValues.summaryTimeString,
        duration: isReset ? "" : getValues("duration")?.toString()!,
        durationType: isReset ? "" : getValues("durationType")?.toString()!,
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        isFreqGroupedByEvery: formValues.isFreqBelongsToEveryGroup,
        assignToSummary: formValues.assignToText,
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
      setValue("monthlySchedule.everyMonth", monthlyFields.everyMonth, {
        shouldDirty: isModified,
      });
      setValue("monthlySchedule.chooseMonth", monthlyFields.chooseMonth, {
        shouldDirty: isModified,
      });
      setValue("monthlySchedule.selectedDays", monthlyFields.selectedDays, {
        shouldDirty: isModified,
      });
      setValue(
        "monthlySchedule.selectedDaysOfMonth",
        monthlyFields.selectedDaysOfMonth,
        { shouldDirty: isModified }
      );
      setValue(
        "monthlySchedule.selectedDaysOfWeek",
        monthlyFields.selectedDaysOfWeek,
        { shouldDirty: isModified }
      );
      setFormValues({ ...formValues });
    }
  };

  const resetDurationFields = () => {
    formValues.fieldsToValidate.find(
      (x: AddScheduleRequiredFields) => x.fieldName === "ddlDuration"
    )!.isValid = true;
    formValues.fieldsToValidate.find(
      (x: AddScheduleRequiredFields) => x.fieldName === "ddlDurationType"
    )!.isValid = true;
    setErrorFields((prevFields) => ({
      ...prevFields,
      daily: formValues.fieldsToValidate,
    }));
    formValues.durationErrorMessage = "";
    formValues.durationTypeErrorMessage = "";
    formValues.selectedDuration = null;
    formValues.selectedDurationType = null;
    setFormValues({ ...formValues });
    setValue("duration", null);
    setValue("durationType", null);
    setValue("isDefault", false);
  };

  const resetTimeControls = () => {
    formValues.isBtnSpecificTimeChecked = true;
    formValues.specificTimeErrorMessage = "";
    formValues.timeRangeErrorMessage = "";
    formValues.summaryTimeString = "";
    setFormValues({ ...formValues });
    formValues.fieldsToValidate.find(
      (x) => x.fieldName === "timeRange"
    )!.isValid = true;
    formValues.fieldsToValidate.find(
      (x) => x.fieldName === "specificTime"
    )!.isValid = true;
    setErrorFields((prevFields) => ({
      ...prevFields,
      daily: formValues.fieldsToValidate,
    }));
    generateTimeControls(formValues.selectedFrequency as Frequency, null, []);
  };

  const navigateAndSetFocus = (fieldName: string) => {
    document?.getElementById(fieldName)?.scrollIntoView({ behavior: "smooth" });
  };

  const resetTimeErrorsFields = () => {
    formValues.specificTimeErrorMessage = "";
    formValues.timeRangeErrorMessage = "";
    setFormValues({ ...formValues });
    formValues.fieldsToValidate.find(
      (x) => x.fieldName === "timeRange"
    )!.isValid = true;
    formValues.fieldsToValidate.find(
      (x) => x.fieldName === "specificTime"
    )!.isValid = true;
    setErrorFields((prevFields) => ({
      ...prevFields,
      daily: formValues.fieldsToValidate,
    }));
    setErrorFields((prevFields) => ({ ...prevFields, order: [] }));
    setErrorFields((prevFields) => ({ ...prevFields, cyclical: [] }));
    setErrorFields((prevFields) => ({ ...prevFields, monthly: [] }));
  };

  const clearForm = () => {
    reset();
    formValues.selectedFrequency = null;
    formValues.isPrnChecked = false;
    formValues.selectedOrderType = null;
    formValues.selectedRepeatType = RepeatTypes.Daily;
    formValues.selectedDuration = null;
    formValues.selectedDurationType = null;
    formValues.time = [];
    formValues.timeRange = [];
    formValues.checkedData = [];
    formValues.assignToText = "";
    formValues.scheduleLocation = [];
    formValues.durationErrorMessage = "";
    formValues.durationTypeErrorMessage = "";
    formValues.frequencyErrorMessage = "";
    formValues.showErrorSummary = false;
    formValues.selectedWeek = { value: "1", label: "1" };
    formValues.isBtnSpecificTimeChecked = true;
    formValues.summaryTimeString = "";
    formValues.repeatStrings = "";
    setFormValues({ ...formValues });
    setValue("frequencyCode", "");
    setValue("isPrn", false);
    setValue("orderType", 0);
    setValue("medicationType", null);
    setValue("scheduleType", "Daily");
    setValue("timeSchedules", []);
    setValue("duration", null);
    setValue("durationType", null);
    setValue("isDefault", false);
    setValue("scheduleLocation", []);
    setShowConfirmCancelModal(false);
    resetTimeErrorsFields();
    setValue("orderTypeSummary", "All");
    setValue("assignedToSummary", "");
    setValue("summary", "");
    setValue("timeSummary", "");
    setValue("frequencyRepeatSummary", "");
    formValues.days.forEach((x) => (x.checked = false));
    resetTimesPerDayValidations();
  };

  const repeatsClearForm = () => {
    setValue("timeSchedules", []);
    setValue("duration", null);
    formValues.selectedDuration = null;
    formValues.selectedDurationType = null;
    formValues.time = [];
    formValues.timeRange = [];
    formValues.checkedData = [];
    formValues.durationErrorMessage = "";
    formValues.durationTypeErrorMessage = "";
    formValues.showErrorSummary = false;
    formValues.selectedWeek = { value: "1", label: "1" };
    formValues.isDaySelectedForWeeklyBlock = null;
    setFormValues({ ...formValues });
    setValue("durationType", null);
    setValue("isDefault", false);
    generateTimeControls(formValues.selectedFrequency as Frequency, null, []);
    resetTimeErrorsFields();
    formValues.days.forEach((x) => (x.checked = false));
  };

  const validateAddSchedule = () => {
    let isChildComponentValid: boolean = true;
    if (formValues.selectedRepeatType === RepeatTypes.Weekly) {
      validateWeeklyDays(formValues, setFormValues);
    }
    if (formValues.selectedRepeatType === RepeatTypes.Cyclical) {
      isChildComponentValid =
        cyclicalScheduleComponentRef?.current?.validateCyclicalScheduleControls();
    }
    if (formValues.selectedRepeatType === RepeatTypes.Monthly) {
      isChildComponentValid =
        monthlyScheduleComponentRef?.current?.validateMonthlyScheduleControls();
    }
    return isChildComponentValid;
  };

  const onErrorDialogClose = () => {
    formValues.showErrorSummary = false;
    setFormValues({ ...formValues });
  };

  const renderErrorButtons = (errorFields: AddScheduleRequiredFields[]) => {
    return errorFields
      .filter((item) => !item.isValid)
      .map((item) => (
        <div key={item.fieldId}>
          <button
            data-testid="focusToField"
            onClick={(e) => navigateAndSetFocus(item.fieldId!)}
            onKeyDown={(e) => navigateAndSetFocus(item.fieldId!)}
            className="error-message-button"
          >
            {item.label}
          </button>
        </div>
      ));
  };

  const saveOrUpdateSchedule = async (
    request: FrequencyAdministrationRequestDto,
    isSaveOrUpdate: boolean,
    isOverride: boolean
  ) => {
    if (isSaveOrUpdate) {
      request.scheduleLocation?.forEach((location) => {
        location.isDefault = request.isDefault;
      });
    }
    isFormValid = false;
    isFormValid = validateAddSchedule();
    validateAndDisplayMessage(
      "frequency",
      request.frequencyCode,
      formValues,
      setFormValues,
      setErrorFields
    );
    if (request.frequencyCode === "_XD") {
      checkNumberOfTimesPerDay(request.timesPerDay!);
    } else if (request.frequencyCode === "Q_min") {
      checkSpecificTime(request.specifyMinutes!);
    }
    validateAndDisplayMessage(
      "ddlDuration",
      request.duration,
      formValues,
      setFormValues,
      setErrorFields,
      request.durationType !== null,
      "ddlDurationType"
    );
    validateAndDisplayMessage(
      "ddlDurationType",
      request.durationType,
      formValues,
      setFormValues,
      setErrorFields,
      request.duration !== null && request.duration !== undefined,
      "ddlDuration"
    );
    const invalidFields = formValues.fieldsToValidate.filter(
      (x: AddScheduleRequiredFields) => x.isValid === false
    );
    let isTimeClocksValid = true;
    if (invalidFields.length === 0 && isFormValid) {
      isTimeClocksValid = validateTimeControls(formValues, setFormValues);
    } else {
      formValues.showErrorSummary = !isFormValid || invalidFields.length > 0;
    }
    if (isTimeClocksValid && isFormValid && invalidFields.length === 0) {
      // create new save string here
      if (!formValues.isFreqBelongsToEveryGroup) {
        setTimeSummaryValue(
          request.timeSchedules,
          formValues.isBtnSpecificTimeChecked,
          formValues.isFreqBelongsToEveryGroup
        );
        request.summary = frequencySummary?.summary?.toString()!;
      }
      if (
        (request.isDefault && isSaveOrUpdate) ||
        isOverride ||
        !isSaveOrUpdate ||
        !request.isDefault
      ) {
        dispatch(
          reduxSetSelectedFrequency({
            medicationId: medication.id,
            selectedFrequency: formValues.selectedFrequency!,
          })
        );
        dispatch(
          reduxSetFrequencySchedule({
            medicationId: medication.id,
            frequencySchedule: request,
          })
        );

        dispatch(
          reduxSetPRN({
            medicationId: medication.id,
            checkedPRN: formValues.isPrnChecked,
          })
        );
        if (formValues.startDate) {
          dispatch(
            reduxSetFormattedStartDate({
              medicationId: medication.id,
              formattedStartDate: formValues.startDate.toString(),
            })
          );
        } else {
          dispatch(
            reduxSetFormattedEndDate({
              medicationId: medication.id,
              formattedEndDate: "",
            })
          );
        }
        if (
          medication?.instructions?.isEndDateOpenEnded !==
          formValues.isEndDateOpenEnded
        ) {
          dispatch(
            reduxSetEndDateOpenEnded({
              medicationId: medication.id,
              isEndDateOpenEnded: formValues.isEndDateOpenEnded!,
            })
          );
        }
        if (formValues.endDate) {
          dispatch(
            reduxSetFormattedEndDate({
              medicationId: medication.id,
              formattedEndDate: formValues.endDate.toString(),
            })
          );
        }
        let defaultSig: IStructured = JSON.parse(
          JSON.stringify(medication?.instructions?.defaultStructuredSig)
        );
        defaultSig.frequencyCode = formValues.selectedFrequency?.abbreviation;
        defaultSig.isPRN = formValues.isPrnChecked;

        dispatch(
          reduxSetDefaultSig({
            medicationId: medication.id,
            defaultStructuredSig: defaultSig,
          })
        );
        dispatch(
          reduxSetInstruction({
            medicationId: medication.id,
            instruction: getCommonInstruction(defaultSig),
          })
        );
        onOverLayCustomizeScheduleClick();
      }
    }
    setFormValues({ ...formValues });
  };

  const resetDialogBoxFlags = () => {
    if (showConfirmCancelModal) setShowConfirmCancelModal(false);
    formValues.showApiResponseMsg = false;
    formValues.showErrorSummary = false;
    formValues.showDefaultOverrideModal = false;
    formValues.defaultOverrideMessage = "";
    setFormValues({ ...formValues });
  };

  const createSaveRequest = (inputData: FrequencyAdministrationForm) => {
    let newTimeArray: TimeSchedules[] = [];
    if (
      formValues.isFreqBelongsToEveryGroup &&
      formValues.everyGroupTimes.length > 0
    ) {
      newTimeArray = formValues.everyGroupTimes;
    } else if (formValues.isBtnSpecificTimeChecked) {
      formValues.time.forEach((itm) => {
        processTimeItem(itm, newTimeArray, true, true);
      });
    } else {
      formValues.timeRange.forEach((itm) => {
        processTimeItem(itm, newTimeArray, false, true);
      });
    }
    newTimeArray = sortTimesInAscending(newTimeArray);
    setValue("timeSchedules", newTimeArray, { shouldDirty: false });
    inputData.timeSchedules = newTimeArray;
    setValue("summary", frequencySummary?.summary?.toString()!, {
      shouldDirty: false,
    });
    inputData.summary = frequencySummary?.summary?.toString()!;
    //sort time array in ascending order of a string
    const formattedTimeSlots = newTimeArray
      .map((timeSlot) => {
        const formattedStartTime = timeSlot.startTime ?? "";
        return formattedStartTime;
      })
      .join(", ");
    const formattedTimeRangeSlots = newTimeArray
      .map((timeSlot) => {
        const formattedStartTime = timeSlot.startTime ?? "";
        const formattedEndTime = timeSlot.endTime ?? "";
        return `${formattedStartTime} - ${formattedEndTime}`;
      })
      .join(", ");
    setValue(
      "timeSummary",
      formValues.isBtnSpecificTimeChecked
        ? formattedTimeSlots
        : formattedTimeRangeSlots,
      { shouldDirty: false }
    );
    inputData.timeSummary = formValues.isBtnSpecificTimeChecked
      ? formattedTimeSlots
      : formattedTimeRangeSlots;
    setValue(
      "frequencyRepeatSummary",
      frequencySummary?.frequencyRepeatSummary?.toString()!,
      { shouldDirty: false }
    );
    inputData.frequencyRepeatSummary =
      frequencySummary?.frequencyRepeatSummary?.toString()!;
    const mapper = createMapper({ strategyInitializer: classes() });
    mapRequestDto(mapper, addNewMode, Number(administrationScheduleId));
    const request = mapper.map(
      inputData,
      FrequencyAdministrationForm,
      FrequencyAdministrationRequestDto
    );
    updateRequestBasedOnRepeatType(request, formValues, addNewMode);
    request.existingAdministrationScheduleId = 1;
    return request;
  };

  const onSubmitHandler = async (data: FrequencyAdministrationForm) => {
    btnSaveRef.current?.blur();
    resetDialogBoxFlags();
    const request = createSaveRequest(data);
    saveOrUpdateSchedule(request, true, false);
  };

  const populateEditScheduleData = (
    editScheduleObj: IAdministrationSchedule
  ) => {
    if (editScheduleObj) {
      let editRepeatString = "";
      //setting data for Frequency
      const frequencyData = freqData.find(
        (freq) => freq.shortAbbreviation === editScheduleObj.frequencyCode
      );

      // generate time controls and set it's data
      const filteredTimeSchedules = editScheduleObj.timeSchedule?.filter(
        (x) => x.endTime !== null
      );

      const isInEveryGroup = FrequencyOptionsGroupedByEvery.some(
        (freq) => freq.shortAbbreviation === frequencyData?.shortAbbreviation
      );
      formValues.selectedFrequency = frequencyData as Frequency;
      formValues.isBtnSpecificTimeChecked = filteredTimeSchedules?.length === 0;
      formValues.isFreqBelongsToEveryGroup = isInEveryGroup;
      setValue("isFreqGroupedByEvery", isInEveryGroup, {
        shouldDirty: false,
      });
      if (frequencyData?.shortAbbreviation === "_XD") {
        const selectedFrequency: Frequency = {
          shortAbbreviation: formValues?.selectedFrequency?.shortAbbreviation,
          abbreviation: formValues?.selectedFrequency?.abbreviation,
          noOfSpecificTimeInstance: editScheduleObj.timesPerDay!,
          noOfRangeTimeInstance: editScheduleObj.timesPerDay!,
        };
        formValues.selectedFrequency = selectedFrequency;
        formValues.timesPerDay = editScheduleObj.timesPerDay!;
        setValue("timesPerDay", editScheduleObj.timesPerDay!, {
          shouldDirty: false,
        });
      } else if (frequencyData?.shortAbbreviation === "Q_min") {
        formValues.specifyMinutes = editScheduleObj.specifyMinutes;
        const selectedFrequency: Frequency = {
          shortAbbreviation: formValues?.selectedFrequency?.shortAbbreviation,
          abbreviation: formValues?.selectedFrequency?.abbreviation,
          noOfSpecificTimeInstance: 0,
          noOfRangeTimeInstance: 0,
        };
        formValues.selectedFrequency = selectedFrequency;
        setValue("specifyMinutes", editScheduleObj.specifyMinutes!, {
          shouldDirty: false,
        });
      }
      let everyGroupTimes: ITimeSchedule[] = [];
      let timeValue: string = "";
      let formattedEveryFreqTimeSlots = "";
      if (isInEveryGroup) {
        const timeRegex: RegExp = new RegExp(/\b\d{2}:\d{2} [AP]M\b/);
        const match: RegExpMatchArray | null =
          formValues.editScheduleData?.summary?.match(timeRegex)!;
        if (match) {
          timeValue = match[0];
        }
        everyGroupTimes = [
          {
            id: editScheduleObj.timeSchedule?.find(
              (x) => x.startTime === timeValue
            )?.id!,
            startTime: timeValue,
            endTime: null,
          },
        ];
        const newEveryGroupTimeArray = generateTimeControlsForEveryGroup(
          formValues.time,
          formValues.selectedFrequency,
          formValues.isFreqBelongsToEveryGroup
        );
        formValues.everyGroupTimes = newEveryGroupTimeArray;

        setValue("timeSchedules", newEveryGroupTimeArray, {
          shouldDirty: false,
        });
        const sortedValues = sortTimesInAscending(newEveryGroupTimeArray);
        formattedEveryFreqTimeSlots = sortedValues
          .map((timeSlot) => {
            const formattedStartTime = timeSlot.startTime ?? "";
            return formattedStartTime;
          })
          .join(", ");
      }
      generateTimeControls(
        formValues.selectedFrequency,
        null,
        isInEveryGroup ? everyGroupTimes : editScheduleObj?.timeSchedule
      );
      setValue("frequencyCode", frequencyData?.shortAbbreviation!, {
        shouldDirty: false,
      });
      setValue("summary", editScheduleObj?.summary, { shouldDirty: false });
      setValue("frequencyCodeDescription", frequencyData?.abbreviation!, {
        shouldDirty: false,
      });

      setValue("isPrn", editScheduleObj.isPrn, { shouldDirty: false });
      formValues.isPrnChecked = editScheduleObj.isPrn;
      formValues.selectedOrderType = editScheduleObj.orderType;

      //setting data for Repeat Type
      formValues.scheduleLocation = editScheduleObj.scheduleLocation;
      formValues.selectedRepeatType = editScheduleObj.scheduleType;

      setValue("scheduleType", editScheduleObj.scheduleType, {
        shouldDirty: false,
      });
      if (editScheduleObj.scheduleType === RepeatTypes.Cyclical) {
        setValue(
          "cyclicalSchedules.administrationScheduleId",
          formValues.editScheduleData?.id,
          { shouldDirty: false }
        );
        setValue(
          "cyclicalSchedules.cycle",
          formValues.editScheduleData?.cyclicalSchedule?.cycle!
        );
        if (editScheduleObj.cyclicalSchedule) {
          editScheduleObj.cyclicalSchedule.administrationScheduleId =
            formValues.editScheduleData?.id;
          editRepeatString = createCyclicalRepeatString(
            formValues.editScheduleData?.cyclicalSchedule as CyclicalSchedules
          ) as string;
        }
      }
      if (editScheduleObj.scheduleType === RepeatTypes.Weekly) {
        setValue(
          "weeklySchedule.administrationScheduleId",
          formValues.editScheduleData?.id,
          { shouldDirty: false }
        );
        if (editScheduleObj.weeklySchedule) {
          editScheduleObj.weeklySchedule.administrationScheduleId =
            formValues.editScheduleData?.id;
        }
      }
      if (editScheduleObj.scheduleType === RepeatTypes.Monthly) {
        setValue(
          "monthlySchedule.administrationScheduleId",
          formValues.editScheduleData?.id,
          { shouldDirty: false }
        );
        if (editScheduleObj.monthlySchedule) {
          editScheduleObj.monthlySchedule.administrationScheduleId =
            formValues.editScheduleData?.id;
          editRepeatString = createMonthylyRepeatString(
            formValues.editScheduleData?.monthlySchedule as MonthlySchedules
          );
        }
      }
      //setting data for Weekly Controls
      const weeklyScheduleData = editScheduleObj.weeklySchedule;
      if (
        weeklyScheduleData &&
        editScheduleObj.scheduleType === RepeatTypes.Weekly
      ) {
        if (weeklyScheduleData?.everyWeek) {
          const weekData = WeekOptions.find(
            (x) => x.id === weeklyScheduleData.everyWeek?.toString()
          );
          let weekOption: DropdownItem = {
            id: weekData?.id,
            value: weekData?.value!,
            label: weekData?.value!,
          };
          formValues.selectedWeek = weekOption;

          setValue("weeklySchedule.everyWeek", Number(weekOption.label), {
            shouldDirty: false,
          });
        }
        let usersSelectedDays;
        if (weeklyScheduleData?.selectedDays) {
          usersSelectedDays = weeklyScheduleData.selectedDays.split(",");
          usersSelectedDays?.forEach((item: string) => {
            formValues.days.find((x) => x.value === item.trim())!.checked =
              true;
          });
          setValue(
            "weeklySchedule.selectedDays",
            weeklyScheduleData.selectedDays,
            { shouldDirty: false }
          );
        }
        editRepeatString = getWeeklySummaryRepeatString(
          weeklyScheduleData.everyWeek!,
          weeklyScheduleData.selectedDays!
        );
      }
      //setting data for duration
      formValues.selectedDuration = editScheduleObj.duration
        ? Number(editScheduleObj.duration)
        : null;
      setValue(
        "duration",
        editScheduleObj.duration ? Number(editScheduleObj.duration) : null,
        {
          shouldDirty: false,
        }
      );
      //setting data for duration type
      const durationTypeData = FrequencyDurationType.find(
        (x) => x.value === editScheduleObj.durationType?.toString()
      );
      if (durationTypeData) {
        let newDurationType = {
          value: durationTypeData?.id,
          label: durationTypeData?.value,
        };
        formValues.selectedDurationType = newDurationType as DropdownItem;

        setValue("durationType", newDurationType.label.toString(), {
          shouldDirty: false,
        });
      }

      // set time string
      let formattedTimeSlots = "";
      if (isInEveryGroup) {
        formattedTimeSlots = timeValue;
      } else {
        formattedTimeSlots = editScheduleObj.timeSchedule
          ?.map((timeSlot) => {
            const formattedStartTime = timeSlot.startTime ?? "";
            return formattedStartTime;
          })
          .join(", ");
      }
      const formattedTimeRangeSlots = editScheduleObj.timeSchedule
        ?.map((timeSlot) => {
          const formattedStartTime = timeSlot.startTime ?? "";
          const formattedEndTime = timeSlot.endTime ?? "";
          return `${formattedStartTime} - ${formattedEndTime}`;
        })
        .join(", ");

      formValues.repeatStrings = editRepeatString;
      formValues.summaryTimeString =
        filteredTimeSchedules?.length === 0
          ? formattedTimeSlots
          : formattedTimeRangeSlots;
      if (formValues.selectedAdministrationScheduleId === editScheduleObj.id) {
        setValue("orderTypeSummary", editScheduleObj.orderTypeSummary!);
      }
      let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: getFrequencyLongForm(
          frequencyData as Frequency,
          isTimesPerDay
        ),
        repeat: editRepeatString,
        summaryTime:
          filteredTimeSchedules?.length === 0
            ? formattedTimeSlots
            : formattedTimeRangeSlots,
        duration: editScheduleObj?.duration?.toString(),
        durationType: editScheduleObj.durationType,
        isPrn: editScheduleObj.isPrn ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        assignToSummary: getValues("assignedToSummary"),
        isFreqGroupedByEvery: isInEveryGroup,
        timeSummary: getTimeSummary(
          isInEveryGroup,
          formattedEveryFreqTimeSlots,
          filteredTimeSchedules?.length === 0,
          formattedTimeSlots,
          formattedTimeRangeSlots
        ),
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
      setFormValues({ ...formValues });
    }
  };

  const confirmOk = () => {
    if (addNewMode) {
      clearForm();
    } else {
      clearForm();
      reset({}, { keepValues: true });
      populateEditScheduleData(formValues.editScheduleData!);
      formValues.resetScheduleData = true;
      formValues.showErrorSummary = false;
      formValues.showApiResponseMsg = false;
      setFormValues({ ...formValues });
    }
    onOverLayCustomizeScheduleClick();
  };

  const confirmCancel = () => {
    setShowConfirmCancelModal(false);
  };
  const isEndDateAvailability = () => {
    if (
      formValues.isEndDateOpenEnded &&
      formValues.endDate &&
      medication?.instructions?.formattedEndDate
    ) {
      return (
        formValues.endDate?.toDateString() ===
        new Date(medication?.instructions?.formattedEndDate).toDateString()
      );
    } else {
      return true;
    }
  };
  const adminDateScheduleValidation = () => {
    let isEndDateAvailable = isEndDateAvailability();

    if (
      formValues.startDate?.toDateString() ===
        new Date(medication?.instructions?.formattedStartDate).toDateString() &&
      isEndDateAvailable &&
      formValues.isEndDateOpenEnded ===
        medication?.instructions?.isEndDateOpenEnded
    ) {
      return false;
    } else {
      return true;
    }
  };

  const onOverLayClick = () => {
    formValues.showApiResponseMsg = false;

    setFormValues({ ...formValues });
    if (
      formValues.showErrorSummary ||
      isDirty ||
      !isFormValid ||
      adminDateScheduleValidation()
    ) {
      setShowConfirmCancelModal(true);
    } else {
      formValues.startDate = new Date(
        medication?.instructions?.formattedStartDate ?? ""
      );
      formValues.endDate = new Date(
        medication?.instructions?.formattedEndDate ?? ""
      );
      formValues.isEndDateOpenEnded =
        medication?.instructions?.isEndDateOpenEnded;
      onOverLayCustomizeScheduleClick();
    }
  };

  const handleTimesPerDay = (event: React.ChangeEvent<HTMLInputElement>) => {
    let isChanged = false;
    let numbersOfTimesPerDay: number | null = event.target.value
      ? Number(event.target.value)
      : null;
    if (formValues.timesPerDay !== numbersOfTimesPerDay) {
      isChanged = true;
    }
    const regEx = new RegExp(/^(7|8|9|1[0-9]|2[0-4])$/);
    setValue("timesPerDay", numbersOfTimesPerDay, { shouldDirty: true });
    if (numbersOfTimesPerDay && regEx.exec(numbersOfTimesPerDay.toString())) {
      formValues.timesPerDayErrorMessage = "";
      formValues.fieldsToValidate.find(
        (x: AddScheduleRequiredFields) => x.fieldName === "timesPerDay"
      )!.isValid = true;
      formValues.timesPerDay = numbersOfTimesPerDay;
      const selectedFrequency: Frequency = {
        shortAbbreviation: formValues?.selectedFrequency?.shortAbbreviation!,
        abbreviation: formValues?.selectedFrequency?.abbreviation!,
        noOfSpecificTimeInstance: numbersOfTimesPerDay,
        noOfRangeTimeInstance: numbersOfTimesPerDay,
      };
      formValues.selectedFrequency = selectedFrequency;
      generateTimeControls(formValues.selectedFrequency, null, []);
    } else {
      formValues.timesPerDay = numbersOfTimesPerDay;
      const selectedFrequency: Frequency = {
        shortAbbreviation: formValues?.selectedFrequency?.shortAbbreviation!,
        abbreviation: formValues?.selectedFrequency?.abbreviation!,
        noOfSpecificTimeInstance: 0,
        noOfRangeTimeInstance: 0,
      };
      formValues.selectedFrequency = selectedFrequency;
      generateTimeControls(formValues.selectedFrequency, null, []);
      checkNumberOfTimesPerDay(numbersOfTimesPerDay!);
      resetTimeControls();
    }
    if (isChanged) {
      formValues.selectedRepeatType = RepeatTypes.Daily;
      repeatsClearForm();
      resetTimeControls();
      setValue("scheduleType", formValues.selectedRepeatType, {
        shouldDirty: true,
      });
      let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: getFrequencyLongForm(
          formValues.selectedFrequency,
          isTimesPerDay
        ),
        repeat: "",
        summaryTime: "",
        duration: "",
        durationType: "",
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        assignToSummary: formValues.assignToText,
        timesPerDay: numbersOfTimesPerDay,
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
    }
    setFormValues({ ...formValues });
  };

  const checkNumberOfTimesPerDay = (numberOfTimesPerDay: number) => {
    if (!numberOfTimesPerDay && numberOfTimesPerDay !== 0) {
      resetTimeControls();
      validateAndDisplayMessage(
        "timesPerDay",
        numberOfTimesPerDay,
        formValues,
        setFormValues,
        setErrorFields,
        formValues.selectedFrequency?.shortAbbreviation === "_XD",
        "frequency"
      );
    } else if (
      Number(numberOfTimesPerDay) < 7 ||
      Number(numberOfTimesPerDay) > 24
    ) {
      formValues.timesPerDayErrorMessage =
        FrequencyAdministration.TimesPerDayPermissibleRangeMessage;
      formValues.fieldsToValidate.find(
        (x: AddScheduleRequiredFields) => x.fieldName === "timesPerDay"
      )!.isValid = false;
    }
  };

  const validateTimesPerDay = (
    event: React.KeyboardEvent<HTMLInputElement>,
    type: boolean
  ) => {
    const key = event.key;
    const regEx = type ? /^[0-9]$/ : /^[0-9]/;
    if (
      !regEx.test(key) &&
      key !== "Backspace" &&
      key !== "Delete" &&
      key !== "Tab"
    ) {
      event.preventDefault();
    }
  };

  const resetTimesPerDayValidations = () => {
    formValues.fieldsToValidate.find(
      (x) => x.fieldName === "timesPerDay"
    )!.isValid = true;
    formValues.timesPerDayErrorMessage = "";
    formValues.timesPerDay = null;
    setFormValues({ ...formValues });
  };

  const checkTimeperDayOrSpecifyMinutes = () => {
    if (formValues.selectedFrequency?.shortAbbreviation === "_XD") {
      return formValues.timesPerDay;
    } else {
      return formValues.specifyMinutes;
    }
  };

  const resetSpecifyMinutesValidations = () => {
    formValues.fieldsToValidate.find(
      (x) => x.fieldName === "specifyMinutes"
    )!.isValid = true;
    formValues.specifyMinutesErrorMessage = "";
    formValues.specifyMinutes = null;
    setFormValues({ ...formValues });
  };

  const handleSpecifyMinutes = (event: React.ChangeEvent<HTMLInputElement>) => {
    let isChanged = false;
    let numberOfSpecifyMinutes: number | null = event.target.value
      ? Number(event.target.value)
      : null;
    if (formValues.specifyMinutes !== numberOfSpecifyMinutes) {
      isChanged = true;
    }
    const regEx = new RegExp(/^([0-8]{0,1}[0-9]|90)$/);
    setValue("specifyMinutes", numberOfSpecifyMinutes, { shouldDirty: true });
    const selectedFrequency: Frequency = {
      shortAbbreviation: formValues?.selectedFrequency?.shortAbbreviation!,
      abbreviation: formValues?.selectedFrequency?.abbreviation!,
      noOfSpecificTimeInstance: 0,
      noOfRangeTimeInstance: 0,
    };
    formValues.selectedFrequency = selectedFrequency;
    if (
      numberOfSpecifyMinutes &&
      regEx.exec(numberOfSpecifyMinutes.toString())
    ) {
      formValues.specifyMinutesErrorMessage = "";
      formValues.fieldsToValidate.find(
        (x: AddScheduleRequiredFields) => x.fieldName === "specifyMinutes"
      )!.isValid = true;
      formValues.specifyMinutes = numberOfSpecifyMinutes;
      generateTimeControls(formValues.selectedFrequency, null, []);
    } else {
      formValues.specifyMinutes = numberOfSpecifyMinutes;
      generateTimeControls(formValues.selectedFrequency, null, []);
      checkSpecificTime(numberOfSpecifyMinutes!);
      resetTimeControls();
    }
    if (isChanged) {
      formValues.selectedRepeatType = RepeatTypes.Daily;
      repeatsClearForm();
      resetTimeControls();
      setValue("scheduleType", formValues.selectedRepeatType, {
        shouldDirty: true,
      });
      let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: getFrequencyLongForm(
          formValues.selectedFrequency,
          isTimesPerDay
        ),
        repeat: "",
        summaryTime: "",
        duration: "",
        durationType: "",
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        assignToSummary: formValues.assignToText,
        specifyMinutes: numberOfSpecifyMinutes,
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
    }
    setFormValues({ ...formValues });
  };

  const checkSpecificTime = (numberOfSpecifyMinutes: number) => {
    if (!numberOfSpecifyMinutes && numberOfSpecifyMinutes !== 0) {
      resetTimeControls();
      validateAndDisplayMessage(
        "specifyMinutes",
        numberOfSpecifyMinutes,
        formValues,
        setFormValues,
        setErrorFields,
        formValues.selectedFrequency?.shortAbbreviation === "Q_min",
        "frequency"
      );
    } else if (
      Number(numberOfSpecifyMinutes) < 1 ||
      Number(numberOfSpecifyMinutes) > 90
    ) {
      formValues.specifyMinutesErrorMessage =
        FrequencyAdministration.specifyMinutesPermissibleRangeMessage;
      formValues.fieldsToValidate.find(
        (x: AddScheduleRequiredFields) => x.fieldName === "specifyMinutes"
      )!.isValid = false;
    }
  };

  const handlePrnChange = (e: boolean) => {
    setValue("isPrn", e, { shouldDirty: true });
    formValues.isPrnChecked = e;
    setFormValues({ ...formValues });
    let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
    const updatedFrequencySummary = {
      ...frequencySummary,
      frequencyLongForm: getFrequencyLongForm(
        formValues.selectedFrequency,
        isTimesPerDay
      ),
      repeat: formValues.repeatStrings,
      summaryTime: formValues.summaryTimeString,
      duration: formValues.selectedDuration?.toString(),
      durationType: formValues.selectedDurationType?.label.toString(),
      isPrn: e ? "as needed" : "",
      orderTypeSummary: getValues("orderTypeSummary"),
      isFreqGroupedByEvery: formValues.isFreqBelongsToEveryGroup,
      assignToSummary: formValues.assignToText,
    };
    setFrequencySummary(updatedFrequencySummary);
    setSummaryValue(updatedFrequencySummary);
  };

  return (
    <div className={sideMenuClasses}>
      <div
        className="side-menu_overlay"
        onClick={onOverLayClick}
        onKeyDown={onOverLayClick}
        data-testid="btnOverLayclick"
        aria-hidden
      />
      <div className={sideMenuContentClasses}>
        <form
          noValidate
          autoComplete="off"
          data-testid="form"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <div className="modal-header" id="schedule_header">
            <h4 className="modal-title">{`Customize Scheduling`}</h4>
            <button
              type="button"
              className="close"
              onClick={onOverLayClick}
              data-dismiss="modal"
              id="btnCancel"
            >
              Close Modal
            </button>
          </div>

          <div className="modal-body">
            <div
              id="schedule_body"
              style={{
                height: bodyHeight,
                overflowY: "scroll",
              }}
            >
              <div className="col-12">
                <div className="row">
                  {formValues.showApiResponseMsg && (
                    <div className="col-7">
                      {requestResponse.alertClassName &&
                        requestResponse.textMessage && (
                          <div
                            className={requestResponse.alertClassName}
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
                  )}
                </div>
                <div className="row">
                  {formValues.showErrorSummary && (
                    <div className="col-7">
                      <div className="alert alert-danger">
                        <i
                          id="alert-error-close-btn"
                          data-testid="alert-error-close-btn"
                          className="alert-close"
                          aria-hidden="true"
                          onClick={onErrorDialogClose}
                        ></i>
                        {
                          <h6 id="num-of-errors-found">
                            {getErrorsCountMessage()}
                          </h6>
                        }
                        <div className="alert-message-container">
                          {Object.values(errorFields).map((fields) =>
                            renderErrorButtons(fields)
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="row col-12">
                  <div
                    className={`form-group mb-0 col-md-10 input-required ml-n1`}
                  >
                    <MultiColumnSingleDD
                      columns={twoColumns}
                      datafile={formValues.frequencyData}
                      onChange={(e) => frequencyChange(e)}
                      selectLabelText="Frequency"
                      id="ddlFrequency"
                      value={formValues.selectedFrequency}
                      selectedValueCoulumn="abbreviation"
                      lableClassName="input-required"
                      errorMessage={formValues.frequencyErrorMessage}
                    />
                  </div>
                  <div className="col-md-2">
                    <div className="mb-3 w-100 form-check btnCheckPRN">
                      <input
                        className="form-check-input"
                        name="chkPRN"
                        id="chkPRN"
                        data-testid="chkPRN"
                        type="checkbox"
                        checked={formValues.isPrnChecked}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handlePrnChange(e.target.checked)
                        }
                      />
                      <label
                        className="form-check-label"
                        id="chkPRN"
                        htmlFor="chkPRN"
                      >
                        PRN
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {formValues.selectedFrequency?.shortAbbreviation ===
                    "_XD" && (
                    <div
                      className={`form-group col-md-4 input-required mb-0 mt-1 ${
                        formValues.timesPerDayErrorMessage
                          ? "has-error has-feedback"
                          : ""
                      }`}
                      id="timesPerDay"
                    >
                      <label
                        htmlFor="timesPerDay"
                        id="txtTimesPerDay"
                        className={`col-form-label ${
                          formValues.timesPerDayErrorMessage
                            ? "has-error-label"
                            : ""
                        }`}
                      >
                        Times per Day
                      </label>
                      <input
                        type="text"
                        data-testid="txtTimesPerDay"
                        id="txtTimesPerDay"
                        {...register("timesPerDay")}
                        value={formValues.timesPerDay!}
                        className={`form-control ${
                          formValues.timesPerDayErrorMessage
                            ? "has-error has-feedback"
                            : ""
                        }`}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => handleTimesPerDay(event)}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) =>
                          handleTimesPerDay(event)
                        }
                        onKeyDown={(
                          event: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          validateTimesPerDay(event, true);
                        }}
                      />
                      <span
                        className={`float-right ${
                          formValues.timesPerDayErrorMessage
                            ? "invalid-feedback-message"
                            : "field-warning-message"
                        }`}
                      >
                        7-24
                      </span>
                      <div className="invalid-feedback-message">
                        {formValues.timesPerDayErrorMessage && (
                          <span>{formValues.timesPerDayErrorMessage}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {formValues.selectedFrequency?.shortAbbreviation ===
                    "Q_min" && (
                    <div
                      className={`form-group col-md-4 input-required mb-0 mt-1 ${
                        formValues.specifyMinutesErrorMessage
                          ? "has-error has-feedback"
                          : ""
                      }`}
                      id="specifyMinutes"
                    >
                      <label
                        htmlFor="specifyMinutes"
                        id="specifyMinutes"
                        className={`col-form-label ${
                          formValues.specifyMinutesErrorMessage
                            ? "has-error-label"
                            : ""
                        }`}
                      >
                        Specify Minutes
                      </label>
                      <input
                        type="text"
                        data-testid="txtspecifyMinutes"
                        id="txtspecifyMinutes"
                        {...register("specifyMinutes")}
                        value={formValues.specifyMinutes!}
                        className={`form-control ${
                          formValues.specifyMinutesErrorMessage
                            ? "has-error has-feedback"
                            : ""
                        }`}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => handleSpecifyMinutes(event)}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) =>
                          handleSpecifyMinutes(event)
                        }
                        onKeyDown={(
                          event: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          validateTimesPerDay(event, false);
                        }}
                      />
                      <span
                        className={`float-right ${
                          formValues.specifyMinutesErrorMessage
                            ? "invalid-feedback-message"
                            : "field-warning-message"
                        }`}
                      >
                        1-90
                      </span>
                      <div className="invalid-feedback-message">
                        {formValues.specifyMinutesErrorMessage && (
                          <span>{formValues.specifyMinutesErrorMessage}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-12">
                    {addNewMode && formValues.summary && (
                      <div>
                        <label htmlFor="schedule" className="required-field">
                          Administration Schedule
                        </label>
                        <div
                          className="form-group mb-0 assigned-to-box mb-3"
                          style={{
                            minHeight: "60px",
                            height: "auto",
                            padding: "5px",
                          }}
                        >
                          <label htmlFor="summary" className={`col-form-label`}>
                            Summary
                          </label>
                          <br />
                          <div
                            id="summary"
                            className={`col-form-label adminSummary`}
                          >
                            {formatSummary(formValues.summary)}
                          </div>
                        </div>
                      </div>
                    )}
                    {!addNewMode && formValues.summary && (
                      <div>
                        <label htmlFor="schedule" className="required-field">
                          Administration Schedule
                        </label>
                        <div
                          className="form-group mb-0 assigned-to-box mb-3"
                          style={{
                            minHeight: "60px",
                            height: "auto",
                            padding: "5px",
                          }}
                        >
                          <label htmlFor="summary" className={`col-form-label`}>
                            Summary
                          </label>
                          <br />
                          <div
                            id="summary"
                            className={`col-form-label adminSummary`}
                          >
                            {formatSummary(formValues.summary)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <AdministrationSchedule
                  formValues={formValues}
                  setFormValues={setFormValues}
                  administrationScheduleId={Number(administrationScheduleId)}
                  btnCyclicalRef={btnCyclicalRef}
                  btnDailyRef={btnDailyRef}
                  btnMonthlyRef={btnMonthlyRef}
                  btnWeeklyRef={btnWeeklyRef}
                  chooseRepeatType={chooseRepeatType}
                  chooseTimeHandler={chooseTimeHandler}
                  cyclicalScheduleComponentRef={cyclicalScheduleComponentRef}
                  getScheduleRecordById={getScheduleRecordById}
                  handleCyclicalScheduleFields={handleCyclicalScheduleFields}
                  handleDayChange={handleDayChange}
                  handleDropDownChange={handleDropDownChange}
                  handleOnDurationChanges={handleOnDurationChanges}
                  handleValidatedCyclicalFields={handleValidatedCyclicalFields}
                  handleValidatedMonthlyFields={handleValidatedMonthlyFields}
                  monthlyScheduleComponentRef={monthlyScheduleComponentRef}
                  onTimeChange={onTimeChange}
                  onblurEvent={onblurEvent}
                  setMonthlyScheduleFields={setMonthlyScheduleFields}
                  isOrderWriter={true}
                  medicationId={Number(medicationId)}
                ></AdministrationSchedule>
              </div>
            </div>
          </div>

          <div className="modal-footer" id="schedule_footer">
            <button
              type="submit"
              id="btnScheduleConfirm"
              data-testid="btnScheduleConfirm"
              className="btn btn-primary"
              ref={btnSaveRef}
              style={
                modalWidth <= 540 ? { width: "45%" } : { minWidth: "60px" }
              }
            >
              Confirm
            </button>
            <button
              type="button"
              id="btnCancel"
              data-testid="cancelButton"
              className="btn btn-cancel"
              data-dismiss="modal"
              onClick={onOverLayClick}
              onBlur={btnCloseFocus}
              style={
                modalWidth <= 540 ? { width: "45%" } : { minWidth: "60px" }
              }
            >
              Close
            </button>
          </div>
        </form>

        <ConfirmDialog
          showConfirmModal={showConfirmCancelModal}
          iconClass={
            FrequencyAdministration.AdministrationScheduleConfirmDialogIcon
          }
          title={
            FrequencyAdministration.AdministrationScheduleConfirmDialogTitle
          }
          messageTitle={
            FrequencyAdministration.AdministrationScheduleConfirmDialogMessageTitle
          }
          messageContent={
            FrequencyAdministration.AdministrationScheduleConfirmDialogMessageContent
          }
          confirmButtonText={
            FrequencyAdministration.AdministrationScheduleConfirmDialogConfirmButtonText
          }
          cancelButtonText={
            FrequencyAdministration.AdministrationScheduleConfirmDialogCancelButtonText
          }
          confirmOk={confirmOk}
          confirmCancel={confirmCancel}
        ></ConfirmDialog>
      </div>
    </div>
  );
};

export default CustomizeScheduleing;
