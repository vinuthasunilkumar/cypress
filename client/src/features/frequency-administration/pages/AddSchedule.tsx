import React, { useCallback, useEffect, useRef, useState } from "react";
import MultiColumnSingleDD from "../../../shared/pages/MultiColumnSingleDD";
import { useNavigate, useParams } from "react-router-dom";
import Switch from "../../../shared/pages/Switch";
import { ToggleButton } from "../../../models/class/ToggleButton";
import freqData from "../../../assets/static-files/Frequency.json";
import FrequencyDurationType from "../../../assets/static-files/FrequencyDurationType.json";
import WeekOptions from "../../../assets/static-files/WeekOptions.json";
import "react-datepicker/dist/react-datepicker.css";

import {
  Frequency_Summary_Messages,
  FrequencyOptionsGroupedByEvery,
  removeFrequencyOptions,
  RepeatTypes,
  twoColumns,
} from "../../../shared/enum/FrequencyAdministration";

import { createMapper } from "@automapper/core";
import { classes } from "@automapper/classes";
import {
  AddScheduleRequiredFields,
  DropdownItem,
  Day,
  FrequencyAdministrationForm,
  FrequencyAdministrationRequestDto,
  OrderTypeFields,
  ScheduleTimeControls,
  TimeSchedules,
  ScheduleLocation,
  CyclicalSchedules,
  Frequency,
  MonthlySchedules,
  FrequencySummary,
  setDefaultFrequencySummary,
  UserSelectedScheduleLocations,
  setDefaultUserScheduleData,
  DefaultLocationsResponse,
} from "../../../models/class/FrequencyAdministration";
import {
  saveOrUpdateAdministrationSchedule,
  deleteScheduleAdministration,
  getFrequencyScheduleList,
  checkDefaultAdministrationSchedule,
  getAdministrationScheduleDetailsById,
} from "../../../services/FrequencyAdministrationService";
import { useForm } from "react-hook-form";
import UnitAssign from "./UnitAssign";
import OrderType from "./OrderType";
import { FrequencyAdministration } from "../../../shared/enum/FrequencyAdministrationValidationMessages";
import { IAdministrationScheduleSaveResponse } from "../../../models/interface/IAdministrationScheduleSaveResponse";
import ConfirmDialog from "../../../shared/pages/ConfirmDialog";
import { IAdministrationSchedule } from "../../../models/interface/IAdministrationSchedule";
import { ITimeSchedule } from "../../../models/interface/ITimeSchedule";
import { CustomMedicationMessages } from "../../../shared/enum/CustomMedMsgEnums";
import ConfirmDeleteDialog from "../../../shared/pages/ConfirmDeleteDialog";
import { IAdministrationScheduleListResponse } from "../../../models/interface/IAdministrationScheduleListResponse";
import { mapRequestDto } from "../../../helper/RequestMapper";
import {
  createCyclicalRepeatString,
  createMonthylyRepeatString,
  createTimeObject,
  generateTimeControlsForEveryGroup,
  getWeeklySummaryRepeatString,
  timeLinkObjMeridiumValidation,
  timeMeridiumHoursCheck,
  sortTimesInAscending,
  checkTimeValidations,
  convertTime12to24,
  convertTo12HourFormat,
  duplicateTimeEntryExists,
  errorMessageSetTimeType,
  frequencySummaryPlaceholders,
  getTimeSummary,
  getUsersLocalTimeZone,
  handleEveryGroup,
  handleRangeTimes,
  handleSpecificTimes,
  resetErrorSummary,
  resetValidityAndErrorMessage,
  updateRequestBasedOnRepeatType,
  validateAndDisplayMessage,
  validateTimeControls,
  validateWeeklyDays,
  checkFrequency,
  getFrequencyLongForm,
} from "../../../helper/ScheduleUtility";
import AdministrationSchedule from "../../../shared/pages/AdministrationSchedule";
import { initialAdminSchedule } from "../../../shared/constants/InitialAdminSchedule";
import { IAdminSchedule } from "../../../models/interface/IAdminSchedule";
import { FacilityDefaultValues } from "../../../shared/enum/ApiEndPoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const AddSchedule = () => {
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const basePath = hostContext.basePath;
  const { administrationScheduleId } = useParams();
  const addNewMode = administrationScheduleId == null;
  const navigate = useNavigate(); //used for routing
  const btnDeleteRef = useRef<HTMLButtonElement>(null);
  const btnCancelRef = useRef<HTMLButtonElement>(null);
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const orderTypeComponentRef = useRef<any>(null);
  const cyclicalScheduleComponentRef = useRef<any>();
  const monthlyScheduleComponentRef = useRef<any>();
  const btnEditUnitAssignRef = useRef<HTMLButtonElement>(null);

  const btnDailyRef = useRef<HTMLButtonElement>(null);
  const btnCyclicalRef = useRef<HTMLButtonElement>(null);
  const btnWeeklyRef = useRef<HTMLButtonElement>(null);
  const btnMonthlyRef = useRef<HTMLButtonElement>(null);

  const [formValues, setFormValues] =
    useState<IAdminSchedule>(initialAdminSchedule);

  const [showConfirmCancelModal, setShowConfirmCancelModal] =
    useState<boolean>(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);
  const [frequencySummary, setFrequencySummary] = useState<FrequencySummary>(
    setDefaultFrequencySummary()
  );
  const [userSelectedScheduleData, setUserSelectedScheduleData] =
    useState<UserSelectedScheduleLocations>(setDefaultUserScheduleData());

  // used for displaying the results on UI in a table
  const sortColumn = "Frequency";
  const [requestResponse, setRequestResponse] = useState({
    textMessage: "",
    alertClassName: "",
  });
  let isFormValid = true;
  const [errorFields, setErrorFields] = useState<
    Record<string, AddScheduleRequiredFields[]>
  >({
    daily: [],
    order: [],
    cyclical: [],
    monthly: [],
  });

  let statusToggleButton = new ToggleButton();
  statusToggleButton.controlName = "status";
  statusToggleButton.label = "Set as Default";
  statusToggleButton.isToggled = false;
  statusToggleButton.icon = "fa fa-gear";



  const [statusToggleButtonObj, setStatusToggleButtonObj] =
    useState<ToggleButton>(statusToggleButton);

  useEffect(() => {
    const filteredFreqData = formValues.frequencyData.filter(
      (x) =>
        !removeFrequencyOptions.some(
          (obj) => obj.shortAbbreviation === x.shortAbbreviation
        )
    );
    formValues.frequencyData = filteredFreqData;
    setFormValues({ ...formValues });
  }, []);

  useEffect(() => {
    // This useEffect will run every time editScheduleData changes
    if (formValues.editScheduleData) {
      populateEditScheduleData(formValues.editScheduleData);
    }
  }, [formValues.editScheduleData]);

  useEffect(() => {
    updateScheduleLocatios();
  }, [formValues.defaultCheckResponse]);

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

  useEffect(() => {
    const fetchData = async () => {
      if (administrationScheduleId) {
        formValues.selectedAdministrationScheduleId = Number(administrationScheduleId);
        setFormValues({ ...formValues });
        getScheduleRecordById(Number(administrationScheduleId), false);
      }
    };
    fetchData();
  }, [administrationScheduleId]);

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
      checkFrequency(formValues.selectedFrequency, formValues, setFormValues);
      formValues.isBtnSpecificTimeChecked = filteredTimeSchedules?.length === 0;
      formValues.isFreqBelongsToEveryGroup = isInEveryGroup;
      setValue("isFreqGroupedByEvery", isInEveryGroup, {
        shouldDirty: false,
      });
      if (frequencyData?.shortAbbreviation === "_XD") {
        formValues.timesPerDay = editScheduleObj.timesPerDay!;
        frequencyData.noOfSpecificTimeInstance = editScheduleObj.timesPerDay!;
        frequencyData.noOfRangeTimeInstance = editScheduleObj.timesPerDay!;
        setValue("timesPerDay", editScheduleObj.timesPerDay!, { shouldDirty: false });
      } else if (frequencyData?.shortAbbreviation === "Q_min") {
        formValues.specifyMinutes = editScheduleObj.specifyMinutes;
        frequencyData.noOfSpecificTimeInstance = 0;
        frequencyData.noOfRangeTimeInstance = 0;
        setValue("specifyMinutes", editScheduleObj.specifyMinutes!, { shouldDirty: false });
      }
      let timeValue: string = "";
      let formattedEveryFreqTimeSlots = "";
      if (isInEveryGroup) {
        const timeRegex: RegExp = new RegExp(/\b\d{2}:\d{2} [AP]M\b/);
        const match: RegExpMatchArray | null =
          formValues.editScheduleData?.summary?.match(timeRegex)!;
        if (match) {
          timeValue = match[0];
        }
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
        frequencyData as Frequency,
        null,
        editScheduleObj?.timeSchedule
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

      const checkedData: string[] = editScheduleObj.scheduleLocation
        ?.slice(0)
        .reverse()
        .map((item) => item.roomId);
      if (formValues.selectedAdministrationScheduleId === editScheduleObj.id) {
        //populate data for schedule locations
        userSelectedScheduleData.scheduleLocations =
          editScheduleObj.scheduleLocation;
        userSelectedScheduleData.assignedToText =
          editScheduleObj.assignedToSummary;
        loadAssignedToField(editScheduleObj);
        formValues.checkedData = checkedData;
        userSelectedScheduleData.checkedRoomsData = checkedData;
        let userSelectedScheduleValues = userSelectedScheduleData;
        setUserSelectedScheduleData(userSelectedScheduleValues);

        setValue("scheduleLocation", editScheduleObj.scheduleLocation, {
          shouldDirty: false,
        });
        setValue("assignedToSummary", editScheduleObj.assignedToSummary!);
      }
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
      formValues.selectedDuration = editScheduleObj.duration ? Number(editScheduleObj.duration) : null;
      setValue("duration", editScheduleObj.duration ? Number(editScheduleObj.duration) : null, {
        shouldDirty: false,
      });
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
      //setting data for Set as Default
      let statusToggleButton = new ToggleButton();
      statusToggleButton.controlName = "status";
      statusToggleButton.label = "Set as Default";
      statusToggleButton.icon = "fa fa-gear";
      statusToggleButton.isToggled = editScheduleObj.isDefault;
      setValue("isDefault", editScheduleObj.isDefault, { shouldDirty: false });
      setStatusToggleButtonObj(statusToggleButton);
      // set time string
      let formattedTimeSlots = "";
      formattedTimeSlots = editScheduleObj.timeSchedule
        ?.map((timeSlot) => {
          const formattedStartTime = timeSlot.startTime ?? "";
          return formattedStartTime;
        })
        .join(", ");
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
        frequencyLongForm: getFrequencyLongForm(frequencyData as Frequency, isTimesPerDay),
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
      getScheduleList(
        false,
        frequencyData?.shortAbbreviation!,
        Number(administrationScheduleId),
        sortColumn
      );
    }
  };

  const closeApiResponseMsg = () => {
    formValues.showApiResponseMsg = false;
    setFormValues({ ...formValues });
  };

  const loadAssignedToField = (editScheduleObj: IAdministrationSchedule) => {
    if (editScheduleObj?.assignedTo) {
      formValues.assignToText = editScheduleObj?.assignedTo;
      setFormValues({ ...formValues });
    }
  };
  // used to handle the toggle button for Status
  const toggleState = (state: boolean, label: string) => {
    setValue("isDefault", state, { shouldDirty: true });
    // Updating the label for Status based on toggle state
    setStatusToggleButtonObj((prevState: ToggleButton) => ({
      ...prevState,
      isToggled: state,
      label: "Set as Default",
    }));
  };

  const resetTimesPerDayValidations = () => {
    formValues.fieldsToValidate.find(x => x.fieldName === "timesPerDay")!.isValid = true;
    formValues.timesPerDayErrorMessage = "";
    formValues.timesPerDay = null;
    setFormValues({ ...formValues });
  }

  const SpecifyTimesTimesPerDayFields = () => {
    resetTimesPerDayValidations();
    resetSpecifyMinutesValidations();
    setValue("timesPerDay", null, { shouldDirty: false });
    setValue("specifyMinutes", null, { shouldDirty: false });
  }

  const resetSpecifyMinutesValidations = () => {
    formValues.fieldsToValidate.find(x => x.fieldName === "specifyMinutes")!.isValid = true;
    formValues.specifyMinutesErrorMessage = "";
    formValues.specifyMinutes = null;
    setFormValues({ ...formValues });
  }

  const frequencyChange = (val: Frequency) => {
    formValues.selectedCyclicalSchedule = null;
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
      checkFrequency(val, formValues, setFormValues);
      if (formValues.isRepeatTypesDisabled) {
        chooseRepeatType(formValues.selectedRepeatOption, true);
      }
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
      formValues.summaryTimeString = "";
      formValues.repeatStrings = "";
      if (val.shortAbbreviation !== "_XD" && val.shortAbbreviation !== "Q_min") {
        generateTimeControls(val, null, []);

      }
      else {
        generateTimeControls(null, null, []);
      }
      SpecifyTimesTimesPerDayFields();
      setValue("scheduleType", formValues.selectedRepeatType, { shouldDirty: true });
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
      if (val.shortAbbreviation !== "_XD" && val.shortAbbreviation !== "Q_min") {
        generateTimeControls(val, null, []);
      }
      else {
        generateTimeControls(null, null, []);
      }
      SpecifyTimesTimesPerDayFields();
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: val?.abbreviation === null ? "" : val?.abbreviation,
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
      formValues.isTimeRangeDisabled = val.noOfRangeTimeInstance === 0 && val.shortAbbreviation !== "_XD";
      formValues.time = [...tempTimeSpecificArray];
      formValues.timeRange = [...tempTimeRangeArray];
    } else {
      formValues.time = [];
      formValues.timeRange = [];
    }
    setFormValues({ ...formValues });
  };

  const setSummaryValue = (frequencyParams: FrequencySummary) => {
    const formattedString = frequencySummaryPlaceholders(
      frequencyParams,
      frequencySummary,
      setFrequencySummary
    );
    formValues.summary = formattedString;
    setFormValues({ ...formValues });
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
      frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
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

  const handlePrnChange = (e: boolean) => {
    setValue("isPrn", e, { shouldDirty: true });
    formValues.isPrnChecked = e;
    setFormValues({ ...formValues });
    let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
    const updatedFrequencySummary = {
      ...frequencySummary,
      frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
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

  const handleTimesPerDay = (event: React.ChangeEvent<HTMLInputElement>) => {
    let isChanged = false;
    let numbersOfTimesPerDay: number | null = event.target.value ? Number(event.target.value) : null;
    if (formValues.timesPerDay !== numbersOfTimesPerDay) {
      isChanged = true;
    }
    const regEx = new RegExp(/^(7|8|9|1[0-9]|2[0-4])$/);
    setValue("timesPerDay", numbersOfTimesPerDay!, { shouldDirty: true });
    if (numbersOfTimesPerDay && regEx.exec(numbersOfTimesPerDay.toString())) {
      formValues.timesPerDayErrorMessage = "";
      formValues.fieldsToValidate.find(
        (x: AddScheduleRequiredFields) => x.fieldName === "timesPerDay"
      )!.isValid = true;
      formValues.timesPerDay = numbersOfTimesPerDay;
      formValues.selectedFrequency!.noOfRangeTimeInstance = numbersOfTimesPerDay;
      formValues.selectedFrequency!.noOfSpecificTimeInstance = numbersOfTimesPerDay;
      generateTimeControls(formValues.selectedFrequency, null, []);
    } else {
      formValues.timesPerDay = numbersOfTimesPerDay;
      formValues.selectedFrequency!.noOfRangeTimeInstance = 0;
      formValues.selectedFrequency!.noOfSpecificTimeInstance = 0;
      generateTimeControls(formValues.selectedFrequency, null, []);
      checkNumberOfTimesPerDay(numbersOfTimesPerDay!);
      resetTimeControls();
    }
    if (isChanged) {
      formValues.selectedRepeatType = RepeatTypes.Daily;
      repeatsClearForm();
      resetTimeControls();
      setValue("scheduleType", formValues.selectedRepeatType, { shouldDirty: true });
      let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
        repeat: "",
        summaryTime: "",
        duration: "",
        durationType: "",
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        assignToSummary: formValues.assignToText,
        timesPerDay: numbersOfTimesPerDay
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
    }
    setFormValues({ ...formValues });
  }

  const handleSpecifyMinutes = (event: React.ChangeEvent<HTMLInputElement>) => {
    let isChanged = false;
    let numberOfSpecifyMinutes: number | null = event.target.value ? Number(event.target.value) : null;
    if (formValues.specifyMinutes !== numberOfSpecifyMinutes) {
      isChanged = true;
    }
    const regEx = new RegExp(/^([0-8]?\d|90)$/);
    setValue("specifyMinutes", numberOfSpecifyMinutes!, { shouldDirty: true });
    if (numberOfSpecifyMinutes && regEx.exec(numberOfSpecifyMinutes.toString())) {
      formValues.specifyMinutesErrorMessage = "";
      formValues.fieldsToValidate.find(
        (x: AddScheduleRequiredFields) => x.fieldName === "specifyMinutes"
      )!.isValid = true;
      formValues.specifyMinutes = numberOfSpecifyMinutes;
      formValues.selectedFrequency!.noOfRangeTimeInstance = 0;
      formValues.selectedFrequency!.noOfSpecificTimeInstance = 0;
      generateTimeControls(formValues.selectedFrequency, null, []);
    } else {
      formValues.specifyMinutes = numberOfSpecifyMinutes;
      formValues.selectedFrequency!.noOfRangeTimeInstance = 0;
      formValues.selectedFrequency!.noOfSpecificTimeInstance = 0;
      generateTimeControls(formValues.selectedFrequency, null, []);
      checkSpecificTime(numberOfSpecifyMinutes!);
      resetTimeControls();
    }
    if (isChanged) {
      formValues.selectedRepeatType = RepeatTypes.Daily;
      repeatsClearForm();
      resetTimeControls();
      setValue("scheduleType", formValues.selectedRepeatType, { shouldDirty: true });
      let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
        repeat: "",
        summaryTime: "",
        duration: "",
        durationType: "",
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        assignToSummary: formValues.assignToText,
        specifyMinutes: numberOfSpecifyMinutes
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
    }
    setFormValues({ ...formValues });
  }

  // type refers to is it Times Per Day or Specific time Frequency Selected
  const validateTimesPerDay = (event: React.KeyboardEvent<HTMLInputElement>, type: boolean) => {
    const key = event.key;
    const regEx = type ? /^\d$/ : /^\d/;
    if (!regEx.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'Tab') {
      event.preventDefault();
    }
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
    } else
      if (Number(numberOfTimesPerDay) < 7 || Number(numberOfTimesPerDay) > 24) {
        formValues.timesPerDayErrorMessage = FrequencyAdministration.TimesPerDayPermissibleRangeMessage;
        formValues.fieldsToValidate.find(
          (x: AddScheduleRequiredFields) => x.fieldName === "timesPerDay"
        )!.isValid = false;
      }
  }

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
    } else
      if (Number(numberOfSpecifyMinutes) < 1 || Number(numberOfSpecifyMinutes) > 90) {
        formValues.specifyMinutesErrorMessage = FrequencyAdministration.specifyMinutesPermissibleRangeMessage;
        formValues.fieldsToValidate.find(
          (x: AddScheduleRequiredFields) => x.fieldName === "specifyMinutes"
        )!.isValid = false;
      }
  }

  const {
    setValue,
    getValues,
    handleSubmit,
    reset,
    setFocus,
    register,
    formState: { isDirty },
  } = useForm<FrequencyAdministrationForm>({
    defaultValues: {
      facilityId: FacilityDefaultValues.facilityId,
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

  const createSaveRequest = (inputData: FrequencyAdministrationForm) => {
    let newTimeArray: TimeSchedules[] = [];
    if ((
      formValues.isFreqBelongsToEveryGroup &&
      formValues.everyGroupTimes.length > 0) ||
      formValues.isBtnSpecificTimeChecked
    ) {
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
    return request;
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

  const resetDialogBoxFlags = () => {
    setShowConfirmCancelModal(false);
    formValues.showApiResponseMsg = false;
    formValues.showErrorSummary = false;
    formValues.showDefaultOverrideModal = false;
    formValues.defaultOverrideMessage = "";
    setFormValues({ ...formValues });
  };

  const onSubmitHandler = async (data: FrequencyAdministrationForm) => {
    btnSaveRef.current?.blur();
    resetDialogBoxFlags();
    const request = createSaveRequest(data);
    saveOrUpdateSchedule(request, true, false);
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
      let saveResponse!: IAdministrationScheduleSaveResponse;
      // create new save string here
      setTimeSummaryValue(
        request.timeSchedules,
        formValues.isBtnSpecificTimeChecked,
        formValues.isFreqBelongsToEveryGroup
      );
      request.summary = frequencySummary?.summary?.toString()!;
      if (request.isDefault && isSaveOrUpdate) {
        try {
          saveResponse = await checkDefaultAdministrationSchedule(request);
          formValues.defaultCheckResponse = saveResponse;
          if (saveResponse?.defaultLocationsResponse?.length! === 0 && saveResponse?.id === null &&
            saveResponse.existingAdministrationScheduleId! === 0
          ) {
            setRequestResponse({
              textMessage: saveResponse?.message!,
              alertClassName: "alert alert-danger",
            });
            formValues.showApiResponseMsg = true;
          } else
            if (saveResponse?.defaultLocationsResponse?.length! > 0 ||
              saveResponse.existingAdministrationScheduleId! > 0
            ) {
              formValues.defaultOverrideMessage = saveResponse.message!;
              formValues.showDefaultOverrideModal = true;
            }
            else if (saveResponse?.id > 0) {
              formValues.defaultOverrideMessage = "";
              formValues.showDefaultOverrideModal = false;
              handleSaveResponse(saveResponse, false, FrequencyAdministration.FrequencySavedSuccessfully);
            }
        } catch (e: any) {
          setRequestResponse({
            textMessage: e?.response?.data?.error,
            alertClassName: "alert alert-danger",
          });
          formValues.showApiResponseMsg = true;
        }
      } else if (isOverride || !isSaveOrUpdate || !request.isDefault) {
        try {
          saveResponse = await saveOrUpdateAdministrationSchedule(request);
          if (saveResponse?.errorMessage) {
            handleSaveResponse(saveResponse, true, saveResponse?.errorMessage);
          } else {
            handleSaveResponse(saveResponse, true, FrequencyAdministration.FrequencySavedSuccessfully);
          }
        } catch (e: any) {
          setRequestResponse({
            textMessage: e?.response?.data?.error,
            alertClassName: "alert alert-danger",
          });
          formValues.showApiResponseMsg = true;
        }
      }
    }
    setFormValues({ ...formValues });
  };

  const checkTimeperDayOrSpecifyMinutes = () => {
    if (formValues.selectedFrequency?.shortAbbreviation === "_XD") {
      return formValues.timesPerDay;
    } else {
      return formValues.specifyMinutes;
    }
  }

  const handleSaveResponse = (
    saveResponse: IAdministrationScheduleSaveResponse,
    isFromSave: boolean,
    message: string
  ) => {
    if (isFromSave) {
      if (!saveResponse.errorMessage) {
        initialAdminSchedule.editScheduleData = null;
        setFormValues(initialAdminSchedule);
        navigateToList(true, message);
        return;
      } else {
        setRequestResponse({
          textMessage: saveResponse?.errorMessage,
          alertClassName: "alert alert-danger",
        });
        formValues.showApiResponseMsg = true;
      }
    } else if (!saveResponse.errorMessage) {
      initialAdminSchedule.editScheduleData = null;
      setFormValues(initialAdminSchedule);
      navigateToList(true, message);
      return;
    }
    setFormValues({ ...formValues });
  };

  const clearForm = () => {
    reset();
    setStatusToggleButtonObj(statusToggleButton);
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
    resetSpecifyMinutesValidations();
  };

  const repeatsClearForm = () => {
    setStatusToggleButtonObj(statusToggleButton);
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

  const editUnitAssign = () => {
    btnEditUnitAssignRef.current?.blur();
    formValues.isAssignedToOpened = true;
    setFormValues({ ...formValues });
    document.body.style.overflow = "hidden";
  };

  const closeAssignPopup = (isSucceed: boolean) => {
    if (!isSucceed) {
      formValues.scheduleLocation = [];
      formValues.checkedData = [];
    }
    formValues.isAssignedToOpened = false;
    setFormValues({ ...formValues });
    document.body.style.overflow = "visible";
  };

  const setIsAssignedToOpened = (isAssignedToOpened: boolean) => {
    formValues.isAssignedToOpened = isAssignedToOpened;
    setFormValues({ ...formValues });
  };

  const setScheduleLocationsData = (locations: ScheduleLocation[]) => {
    userSelectedScheduleData.scheduleLocations = locations;
    let userSelectedScheduleValues = userSelectedScheduleData;
    setUserSelectedScheduleData(userSelectedScheduleValues);
    setValue("scheduleLocation", locations, {
      shouldDirty: locations.length > 0,
    });
    formValues.scheduleLocation = locations;
    setFormValues({ ...formValues });
  };

  const updateCheckedData = (checkedRoomsData: string[]) => {
    userSelectedScheduleData.checkedRoomsData = checkedRoomsData;
    let userSelectedScheduleValues = userSelectedScheduleData;
    setUserSelectedScheduleData(userSelectedScheduleValues);
    formValues.checkedData = checkedRoomsData;
    setFormValues({ ...formValues });
  };

  const handleUpdateAssignTo = (assignToInfo: string) => {
    formValues.assignToText = assignToInfo;
    setFormValues({ ...formValues });
    userSelectedScheduleData.assignedToText = assignToInfo.trim();
    let userSelectedScheduleValues = userSelectedScheduleData;
    setUserSelectedScheduleData(userSelectedScheduleValues);
    setValue("assignedToSummary", assignToInfo.trim());
    let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
    const updatedFrequencySummary = {
      ...frequencySummary,
      frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
      repeat: formValues.repeatStrings,
      summaryTime: formValues.summaryTimeString,
      duration: formValues.selectedDuration?.toString(),
      durationType: formValues.selectedDurationType?.label.toString(),
      isPrn: formValues.isPrnChecked ? "as needed" : "",
      orderTypeSummary: getValues("orderTypeSummary"),
      isFreqGroupedByEvery: formValues.isFreqBelongsToEveryGroup,
      assignToSummary: assignToInfo.trim(),
    };
    setFrequencySummary(updatedFrequencySummary);
    setSummaryValue(updatedFrequencySummary);
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
    const result = orderTypeComponentRef?.current?.validateOrderTypeControls();
    return result && isChildComponentValid;
  };

  const cancelForm = () => {
    btnCancelRef.current?.blur();
    formValues.showApiResponseMsg = false;
    setFormValues({ ...formValues });
    if (formValues.showErrorSummary || isDirty || !isFormValid) {
      setShowConfirmCancelModal(true);
    } else {
      initialAdminSchedule.editScheduleData = null;
      setFormValues(initialAdminSchedule);
      navigateToList(false);
    }
  };

  const navigateToList = (isSaved: boolean, message?: string) => {
    if (isSaved) {
      if (hostContext.basePath) {
        navigate(`${basePath}/schedule-list/`, { state: message });
      } else {
        navigate(`/schedule-list/`, { state: message });
      }
    } else if (hostContext.basePath) {
      navigate(`${basePath}/schedule-list/`);
    } else {
      navigate(`/schedule-list/`);
    }
  };

  const handleOrderTypeData = (
    selectedOrderTypeData: OrderTypeFields,
    isModified: boolean
  ) => {
    if (selectedOrderTypeData) {
      formValues.userOrderTypeSummary = selectedOrderTypeData.orderTypeSummary!;
      formValues.selectedOrderType = selectedOrderTypeData.orderTypeId;
      setFormValues({ ...formValues });
      setValue("orderType", selectedOrderTypeData.orderTypeId, {
        shouldDirty: isModified,
      });
      setValue(
        "medicationType",
        selectedOrderTypeData.medicationType !== null
          ? Number(selectedOrderTypeData.medicationType)
          : null,
        { shouldDirty: isModified }
      );
      setValue("fdbDrugId", selectedOrderTypeData.fdbDrugId, {
        shouldDirty: isModified,
      });
      setValue("fdbMedGroupId", selectedOrderTypeData.fdbMedGroupId, {
        shouldDirty: isModified,
      });
      setValue("orderTypeSummary", selectedOrderTypeData.orderTypeSummary!, {
        shouldDirty: isModified,
      });
      let isTimesPerDay = checkTimeperDayOrSpecifyMinutes();
      const updatedFrequencySummary = {
        ...frequencySummary,
        frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
        repeat: formValues.repeatStrings,
        summaryTime: formValues.summaryTimeString,
        duration: formValues.selectedDuration?.toString(),
        durationType: formValues.selectedDurationType?.label?.toString(),
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: selectedOrderTypeData.orderTypeSummary!,
        isFreqGroupedByEvery: formValues.isFreqBelongsToEveryGroup,
        assignToSummary: formValues.assignToText,
      };
      setFrequencySummary(updatedFrequencySummary);
      if (isModified) setSummaryValue(updatedFrequencySummary);
    }
  };

  const onErrorDialogClose = () => {
    formValues.showErrorSummary = false;
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

  const navigateAndSetFocus = (fieldName: string | keyof FrequencyAdministrationForm) => {
    setFocus(fieldName as keyof FrequencyAdministrationForm);
    document?.getElementById(fieldName)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleValidatedOrderTypesFields = (
    newFields: AddScheduleRequiredFields[],
    scheduleType: string
  ) => {
    setErrorFields((prevFields) => ({
      ...prevFields,
      [scheduleType]: newFields,
    }));
  };

  const confirmOk = () => {
    if (addNewMode) {
      clearForm();
    } else {
      clearForm();
      reset({}, { keepValues: true });
      populateEditScheduleData(formValues.editScheduleData!);
      setShowConfirmCancelModal(false);
      formValues.resetScheduleData = true;
      formValues.showErrorSummary = false;
      formValues.showApiResponseMsg = false;
      setFormValues({ ...formValues });
    }
    navigateToList(false);
  };

  const confirmCancel = () => {
    setShowConfirmCancelModal(false);
  };

  const confirmDefaultOverrides = () => {
    resetDialogBoxFlags();
    const request = updateScheduleLocatios();
    saveOrUpdateSchedule(request, false, true);
  };

  const updateScheduleLocatios = () => {
    const newSaveRequest = getValues();
    let locationsWithIds: DefaultLocationsResponse[] = [],
      locationsWithOutIds: DefaultLocationsResponse[] = [];
    if (formValues.defaultCheckResponse?.defaultLocationsResponse?.length) {
      locationsWithIds =
        formValues.defaultCheckResponse.defaultLocationsResponse.filter(
          (x) => x.administrationScheduleId !== 0
        );
      if (locationsWithIds.length > 0) {
        setValue(
          "defaultLocation",
          formValues.defaultCheckResponse.defaultLocationsResponse
        );
        setValue(
          "existingAdministrationScheduleId",
          formValues.defaultCheckResponse?.existingAdministrationScheduleId
        );
      }
      locationsWithOutIds =
        formValues.defaultCheckResponse.defaultLocationsResponse.filter(
          (x) => x.administrationScheduleId === 0
        );
      if (
        locationsWithOutIds.length > 0 ||
        formValues.defaultCheckResponse?.isCompleteFacilitySelected
      ) {
        setValue("existingAdministrationScheduleId", 0);
        setValue("defaultLocation", []);
      }
    } else if (
      formValues.defaultCheckResponse?.existingAdministrationScheduleId! > 0
    ) {
      setValue(
        "existingAdministrationScheduleId",
        formValues.defaultCheckResponse?.existingAdministrationScheduleId
      );
    }
    let request = createSaveRequest(newSaveRequest);
    if (
      formValues.defaultCheckResponse?.defaultLocationsResponse?.length! > 0
    ) {
      request = handleRequestLocations(
        request,
        locationsWithIds,
        locationsWithOutIds
      );
    } else if (
      formValues.defaultCheckResponse?.defaultLocationsResponse?.length === 0 &&
      formValues.defaultCheckResponse?.existingAdministrationScheduleId! > 0
    ) {
      request.scheduleLocation?.forEach((location) => {
        location.isDefault = request.isDefault;
      });
    }
    return request;
  };

  const handleRequestLocations = (
    request: FrequencyAdministrationRequestDto,
    locationsWithIds: DefaultLocationsResponse[],
    locationsWithOutIds: DefaultLocationsResponse[]
  ) => {
    if (request.isDefault && locationsWithOutIds?.length > 0) {
      request.scheduleLocation?.forEach((location) => {
        const itemFound =
          formValues.defaultCheckResponse?.defaultLocationsResponse?.find(
            (x) => x.roomId === location.roomId
          );
        if (itemFound) {
          if (
            itemFound.isCompleteUnitSelected &&
            location.isCompleteUnitSelected
          ) {
            location.isDefault = true;
          } else {
            location.isDefault = false;
          }
        } else {
          location.isDefault = true;
        }
      });
    }
    const unitLocations = request.scheduleLocation?.filter(
      (x) => x.isCompleteUnitSelected
    );
    let tempArray: DefaultLocationsResponse[] = [];
    if (unitLocations?.length) {
      unitLocations?.forEach((location) => {
        const itemFound =
          formValues.defaultCheckResponse?.defaultLocationsResponse?.find(
            (x) => x.roomId === location.roomId && x.isCompleteUnitSelected
          );
        if (itemFound) {
          tempArray.push(itemFound);
        }
      });
    }
    if (tempArray.length) {
      setValue(
        "existingAdministrationScheduleId",
        formValues.defaultCheckResponse?.existingAdministrationScheduleId
      );
      setValue("defaultLocation", tempArray);
    }
    if (request.isDefault && locationsWithIds?.length > 0) {
      if (formValues.defaultCheckResponse?.isCompleteFacilitySelected) {
        request.scheduleLocation?.forEach((location) => {
          const itemFound =
            formValues.defaultCheckResponse?.defaultLocationsResponse?.find(
              (x) => x.roomId === location.roomId
            );
          if (itemFound) {
            location.isDefault = false;
          } else {
            location.isDefault = true;
          }
        });
      } else {
        formValues.defaultCheckResponse?.defaultLocationsResponse?.forEach(
          (localtion) => {
            localtion.isDefault = request.isDefault;
          }
        );
        request.scheduleLocation?.forEach((location) => {
          location.isDefault = request.isDefault;
        });
      }
    }
    return request;
  };

  const confirmCancelDefaultOverrides = () => {
    setValue("existingAdministrationScheduleId", 0);
    setValue("defaultLocation", []);
    formValues.showDefaultOverrideModal = false;

    setValue("isDefault", false);
    setStatusToggleButtonObj((prevState: ToggleButton) => ({
      ...prevState,
      isToggled: false,
      label: "Set as Default",
    }));
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

  const confirmDeleteCancel = () => {
    setShowConfirmDeleteModal(false);
  };

  const btnDeleteClick = () => {
    btnDeleteRef?.current?.blur();
    setFormValues({ ...formValues });
    setShowConfirmDeleteModal(true);
  };

  const confirmDeleteOk = async () => {
    setShowConfirmDeleteModal(false);
    initialAdminSchedule.showApiResponseMsg = false;
    const deleteResponse = await deleteScheduleAdministration(
      administrationScheduleId!
    );
    if (deleteResponse?.data?.statusCode === 500) {
      setRequestResponse({
        textMessage: deleteResponse?.data?.responseMessage,
        alertClassName: "alert alert-danger",
      });
      initialAdminSchedule.showApiResponseMsg = true;
    } else if (deleteResponse?.status === 200) {
      navigateToList(true, deleteResponse?.data?.responseMessage);
    }
    initialAdminSchedule.editScheduleData = null;
    setFormValues(initialAdminSchedule);
  };

  const loadScheduleList = () => {
    getScheduleList(
      true,
      formValues.selectedFrequency?.shortAbbreviation!,
      formValues.selectedAdministrationScheduleId,
      sortColumn
    );
  };
  // used to load the schedule list data
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
      frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
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
    const duration = value ? Number(value) : null;;
    if (duration! <= 999) {
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
        frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
        repeat: formValues.repeatStrings,
        summaryTime: formValues.summaryTimeString,
        duration: value!,
        durationType: getValues("durationType")?.toString()!,
        isPrn: formValues.isPrnChecked ? "as needed" : "",
        orderTypeSummary: getValues("orderTypeSummary"),
        isFreqGroupedByEvery: formValues.isFreqBelongsToEveryGroup,
        assignToSummary: formValues.assignToText,
      };
      setFrequencySummary(updatedFrequencySummary);
      setSummaryValue(updatedFrequencySummary);
    }
  }

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
      formValues.time = updatedTimeArray;
      updatedTimeArray?.forEach((itm: any) => {
        processTimeItem(itm, newTimeArray, isSpecificTime, performValidations);
      });
      setValue("timeSchedules", newTimeArray, { shouldDirty: true });
      setTimeSummaryValue(
        newTimeArray,
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
      !timeVal.includes("invalid") &&
      !timeVal.includes("unique")
    ) {
      timeArray[index].strVal = timeVal;
      formValues.time = updatedTimeArray;
      updatedTimeArray?.forEach((itm: any) => {
        processTimeItem(itm, newTimeArray, isSpecificTime, performValidations);
      });
      setValue("timeSchedules", newTimeArray, { shouldDirty: true });
      setTimeSummaryValue(
        newTimeArray,
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
        frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
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
    generateTimeControls(
      formValues.selectedFrequency as Frequency,
      true,
      addNewMode ? [] : formValues.editScheduleData?.timeSchedule
    );
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
      frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
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
      frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
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
      frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
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
        frequencyLongForm: getFrequencyLongForm(formValues.selectedFrequency, isTimesPerDay),
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
    setStatusToggleButtonObj(statusToggleButton);
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

  return (
    <div className="container-fluid">
      <form
        noValidate
        autoComplete="off"
        data-testid="form"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className="row">
          <div className="col-12 mt-3">
            <h1>{addNewMode ? "Add Schedule" : "Update Schedule"}</h1>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-6">
            <button
              type="submit"
              data-testid="btnSave"
              className="btn btn-success"
              ref={btnSaveRef}
            >
              Save
            </button>
            <button
              type="button"
              data-testid="btnReset"
              className="btn btn-outline-secondary"
              ref={btnCancelRef}
              onClick={cancelForm}
            >
              Cancel
            </button>
            {!addNewMode && (
              <button
                type="button"
                data-testid="btnDelete"
                className="btn btn-danger"
                ref={btnDeleteRef}
                onClick={btnDeleteClick}
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <hr />
        <div className="row">
          {formValues.showApiResponseMsg && (
            <div className="col-md-7">
              {requestResponse.alertClassName &&
                requestResponse.textMessage && (
                  <div className={requestResponse.alertClassName} role="alert">
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
            <div className="col-md-7">
              <div className="alert alert-danger">
                <i
                  id="alert-error-close-btn"
                  data-testid="alert-error-close-btn"
                  className="alert-close"
                  aria-hidden="true"
                  onClick={onErrorDialogClose}
                ></i>
                {<h6 id="num-of-errors-found">{getErrorsCountMessage()}</h6>}
                <div className="alert-message-container">
                  {Object.values(errorFields).map((fields) =>
                    renderErrorButtons(fields)
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-md-7">
            {isDirty && addNewMode && (
              <div
                className="form-group mb-2 assigned-to-box"
                style={{ minHeight: "58px", padding: "5px" }}
              >
                <span className={`span-highlight-label p-0`}>
                  Administration Schedule Summary
                </span>
                <br />
                <span id="summary">{formValues.summary}</span>
              </div>
            )}
            {!addNewMode && (
              <div
                className="form-group mb-0 assigned-to-box"
                style={{ minHeight: "58px", padding: "5px" }}
              >
                <span className={`span-highlight-label`}>
                  Administration Schedule Summary
                </span>
                <br />
                <span id="summary">{formValues.summary}</span>
              </div>
            )}
          </div>
        </div>
        <div className="row" id="ddlFrequency">
          <div className={`form-group mb-0 col-md-4 input-required`}>
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
              isBlankOptionNotRequired={true}
            />
          </div>
          {
            formValues.selectedFrequency?.shortAbbreviation === "_XD" && (
              <div
                className={`form-group col-md-2 input-required mb-0 mt-1 ${formValues.timesPerDayErrorMessage ? "has-error has-feedback" : ""}`} id="timesPerDay">
                <label
                  htmlFor="timesPerDay"
                  id="txtTimesPerDay"
                  className={`col-form-label ${formValues.timesPerDayErrorMessage ? "has-error-label" : ""}`}
                >
                  Times per Day
                </label>
                <input
                  type="text"
                  data-testid="txtTimesPerDay"
                  id="txtTimesPerDay"
                  {...register("timesPerDay")}
                  value={formValues.timesPerDay!}
                  className={`form-control ${formValues.timesPerDayErrorMessage ? "has-error has-feedback" : ""}`}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleTimesPerDay(event)
                  }
                  onBlur={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleTimesPerDay(event)
                  }
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => { validateTimesPerDay(event, true) }}
                />
                <span className={`float-right ${formValues.timesPerDayErrorMessage ? "invalid-feedback-message" : "field-warning-message"}`}>
                  7-24
                </span>
                <div
                  className="invalid-feedback-message"
                >
                  {formValues.timesPerDayErrorMessage && (
                    <span>
                      {formValues.timesPerDayErrorMessage}
                    </span>
                  )}
                </div>
              </div>
            )
          }
          {
            formValues.selectedFrequency?.shortAbbreviation === "Q_min" && (
              <div
                className={`form-group col-md-2 input-required mb-0 mt-1 ${formValues.specifyMinutesErrorMessage ? "has-error has-feedback" : ""}`} id="specifyMinutes">
                <label
                  htmlFor="specifyMinutes"
                  id="specifyMinutes"
                  className={`col-form-label ${formValues.specifyMinutesErrorMessage ? "has-error-label" : ""}`}
                >
                  Specify Minutes
                </label>
                <input
                  type="text"
                  data-testid="txtspecifyMinutes"
                  id="txtspecifyMinutes"
                  {...register("specifyMinutes")}
                  value={formValues.specifyMinutes!}
                  className={`form-control ${formValues.specifyMinutesErrorMessage ? "has-error has-feedback" : ""}`}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleSpecifyMinutes(event)
                  }
                  onBlur={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleSpecifyMinutes(event)
                  }
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => { validateTimesPerDay(event, false) }}
                />
                <span className={`float-right ${formValues.specifyMinutesErrorMessage ? "invalid-feedback-message" : "field-warning-message"}`}>
                  1-90
                </span>
                <div
                  className="invalid-feedback-message"
                >
                  {formValues.specifyMinutesErrorMessage && (
                    <span>
                      {formValues.specifyMinutesErrorMessage}
                    </span>
                  )}
                </div>
              </div>
            )
          }
          <div className="col-md-2">
            <div className="form-check" style={{ marginTop: "1.8rem" }}>
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
              <label className="form-check-label" id="chkPRN" htmlFor="chkPRN">
                PRN
              </label>
            </div>
          </div>
        </div>
        <OrderType
          ref={orderTypeComponentRef}
          addNewMode={addNewMode}
          resetOrderData={formValues.resetScheduleData}
          editScheduleData={formValues.editScheduleData}
          orderType={formValues.selectedOrderType}
          handleOrderTypeData={handleOrderTypeData}
          presetAdministrationScheduleId={
            formValues.presetAdministrationScheduleId
          }
          validatedOrderTypesFields={(newFields: AddScheduleRequiredFields[]) =>
            handleValidatedOrderTypesFields(newFields, "order")
          }
        ></OrderType>
        <div className="row">
          <div className="col-md-7">
            <div
              className="form-group mb-0 assigned-to-box"
              style={{ minHeight: "58px", padding: "5px" }}
            >
              <span className={`span-highlight-label`}>
                Assigned To
              </span>
              <br />
              <span id="assignedToInput">{formValues.assignToText}</span>
            </div>
          </div>
          <div className="col-md-1 assignedToBtnEdit">
            <button
              className="btn btn-primary"
              data-testid="btnEditAssignedTo"
              id="btnEditAssignedTo"
              type="button"
              ref={btnEditUnitAssignRef}
              onClick={editUnitAssign}
            >
              Edit
            </button>
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
          isOrderWriter={false}
          medicationId={0}
        ></AdministrationSchedule>
        <div className="row m-0 mt-1 p-0">
          <div className="form-group col-md-12 m-0 p-0">
            <div className="col-md-6 pl-5 m-0">
              <span className="span-highlight-label col-form-label p-0">Status</span>
              <div className="inline-message im-notification">
                <span className="ml-1">
                  Manage availability of this Administration Schedule for
                  current facility.
                </span>
              </div>
              <Switch
                controlName={statusToggleButtonObj.controlName}
                isToggled={statusToggleButtonObj.isToggled}
                label={statusToggleButtonObj.label}
                icon={statusToggleButtonObj.icon}
                onClick={toggleState}
              ></Switch>
            </div>
          </div>
        </div>
        {formValues.isAssignedToOpened && (
          <UnitAssign
            isAssignedToOpened={formValues.isAssignedToOpened}
            checkedRoomsData={userSelectedScheduleData.checkedRoomsData}
            userSelectedData={userSelectedScheduleData}
            addNewMode={addNewMode}
            updateCheckedData={updateCheckedData}
            updateAssignTo={handleUpdateAssignTo}
            setIsAssignedToOpened={setIsAssignedToOpened}
            onCloseAssignment={closeAssignPopup}
            setScheduleLocations={setScheduleLocationsData}
          />
        )}
      </form>
      <ConfirmDialog
        showConfirmModal={showConfirmCancelModal}
        iconClass={
          FrequencyAdministration.AdministrationScheduleConfirmDialogIcon
        }
        title={FrequencyAdministration.AdministrationScheduleConfirmDialogTitle}
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
      <ConfirmDialog
        showConfirmModal={formValues.showDefaultOverrideModal}
        iconClass={
          FrequencyAdministration.AdministrationScheduleConfirmDialogIcon
        }
        title={
          FrequencyAdministration.DefaultOverrideScheduleConfirmDialogTitle
        }
        messageTitle={formValues.defaultOverrideMessage}
        messageContent={
          FrequencyAdministration.DefaultOverrideScheduleConfirmDialogMessageContent
        }
        confirmButtonText={
          FrequencyAdministration.AdministrationScheduleConfirmDialogConfirmButtonText
        }
        cancelButtonText={
          FrequencyAdministration.AdministrationScheduleConfirmDialogCancelButtonText
        }
        confirmOk={confirmDefaultOverrides}
        confirmCancel={confirmCancelDefaultOverrides}
      ></ConfirmDialog>
      <ConfirmDeleteDialog
        data-testid="btnDelete"
        showConfirmDeleteModal={showConfirmDeleteModal}
        iconClass={
          FrequencyAdministration.AdministrationScheduleConfirmDialogIcon
        }
        title={FrequencyAdministration.DeleteScheduleAdminConfirmDialogTitle}
        messageTitle={
          FrequencyAdministration.DeleteScheduleAdminConfirmDialogMessageTitle
        }
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
    </div>
  );
};
export default AddSchedule;
