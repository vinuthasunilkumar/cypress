import React, { useRef } from "react";
import FrequencyDurationTypeWeekly from "../../assets/static-files/FrequencyDurationTypeWeekly.json";
import FrequencyDurationTypeMonthly from "../../assets/static-files/FrequencyDurationTypeMonthly.json";
import SingleDropDown from "./SingleDropDown";
import DatePicker, { ReactDatePicker } from "react-datepicker";
import { FaRegClock } from "react-icons/fa";
import CyclicalSchedule from "../../features/frequency-administration/pages/CyclicalSchedule";
import MonthlySchedule from "../../features/frequency-administration/pages/MonthlySchedule";
import WeekOptions from "../../assets/static-files/WeekOptions.json";
import FrequencyDuration from "../../assets/static-files/FrequencyDuration.json";
import FrequencyDurationType from "../../assets/static-files/FrequencyDurationType.json";
import {
  AddScheduleRequiredFields,
  ScheduleTimeControls,
  Day,
  DropdownItem,
  CyclicalSchedules,
  MonthlySchedules,
} from "../../models/class/FrequencyAdministration";
import { IAdministrationScheduleList } from "../../models/interface/IAdministrationScheduleList";
import { FrequencyAdministration } from "../enum/FrequencyAdministrationValidationMessages";
import { RepeatTypes } from "../enum/FrequencyAdministration";
import { setActiveClass } from "../../helper/Utility";
import { IAdminSchedule } from "../../models/interface/IAdminSchedule";
import { timeCharacterAllowed } from "../../helper/ScheduleUtility";
import OrderWriterAdminDateTime from "../../features/order-writer/pages/OrderWriterAdminDateTime";

type AdministrationScheduleType = {
  formValues: IAdminSchedule;
  setFormValues: (value: React.SetStateAction<IAdminSchedule>) => void;
  handleDropDownChange: (id: DropdownItem, type: string) => void;
  handleOnDurationChanges: (value: string) => void;
  administrationScheduleId: number | null;
  onblurEvent: (
    val: React.FocusEvent<HTMLInputElement>,
    index: number,
    isSpecificTime: boolean,
    performValidations: boolean,
    label: string
  ) => void;
  onTimeChange: (
    val: ScheduleTimeControls,
    index: number,
    isSpecificTime: boolean,
    performValidations: boolean
  ) => void;
  chooseRepeatType: (type: RepeatTypes) => void;
  cyclicalScheduleComponentRef: any;
  monthlyScheduleComponentRef: any;
  chooseTimeHandler: (status: boolean, clikedButtonId?: string) => void;
  handleDayChange: (e: Day, index: number) => void;
  handleValidatedMonthlyFields: (
    newFields: AddScheduleRequiredFields[],
    scheduleType: string
  ) => void;
  handleValidatedCyclicalFields: (
    newFields: AddScheduleRequiredFields[],
    scheduleType: string
  ) => void;
  handleCyclicalScheduleFields: (
    cyclicalFields: CyclicalSchedules,
    isModified: boolean
  ) => void;
  setMonthlyScheduleFields: (
    monthlyFields: MonthlySchedules,
    isModified: boolean,
    isReset: boolean
  ) => void;
  btnDailyRef: any;
  btnWeeklyRef: any;
  btnMonthlyRef: any;
  btnCyclicalRef: any;
  getScheduleRecordById: (id: number, isPreset: boolean) => Promise<void>;
  isOrderWriter: boolean;
  medicationId: number;
};
const AdministrationSchedule = (props: AdministrationScheduleType) => {
  const addNewMode = props.administrationScheduleId == null;
  const datePickerRef = useRef<ReactDatePicker<never, undefined>[]>([]);

  const setHandleMonthlyScheduleFlag = (isReset: boolean) => {
    props.formValues.resetScheduleData = isReset;
    props.setFormValues({ ...props.formValues });
  };
  return (
    <div className={`col-12 ${props.isOrderWriter ? "" : "mt-2 m-0 p-0"}`}>
      {!props.formValues.summary && (
        <div
          className={`row mt-3 col-12 ${
            props.isOrderWriter ? "px-0" : "m-0 p-0"
          }`}
        >
          <div className="form-group mb-0 input-required">
            <label
              className={`col-form-label p-0`}
              htmlFor="AdministrationSchedule"
            >
              Administration Schedule
            </label>
            <input id="AdministrationSchedule" className="visually-hidden" />
          </div>
        </div>
      )}
      <div className="row">
        <div className={`col-sm-12 col-md-${props.isOrderWriter ? 12 : 7}`}>
          <div className="nav-tabs-wrapper nav-tabs-bordered">
            <ul className="nav nav-tabs" id="myTabs" role="tabpanel">
              <li className="nav-item">
                <a
                  href="#presetsTabContent"
                  className={`nav-link ${
                    !props.formValues.isCustomTabSelected ? "active" : ""
                  }`}
                  id="presetsTab"
                  data-testid="presetsTab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="presetsTabContent"
                  aria-selected={!props.formValues.isCustomTabSelected}
                  onClick={() => {
                    props.formValues.isCustomTabSelected = false;
                    props.setFormValues({ ...props.formValues });
                  }}
                >
                  <span
                    className={`${
                      !props.formValues.isCustomTabSelected
                        ? "selected-tab-label"
                        : ""
                    }`}
                  >
                    Presets
                  </span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#customTabContent"
                  className={`nav-link ${
                    props.formValues.isCustomTabSelected ? "active" : ""
                  }`}
                  id="customTab"
                  data-testid="customTab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="customTabContent"
                  aria-selected={props.formValues.isCustomTabSelected}
                  onClick={() => {
                    props.formValues.isCustomTabSelected = true;
                    props.setFormValues({ ...props.formValues });
                  }}
                >
                  <span
                    className={`${
                      props.formValues.isCustomTabSelected
                        ? "selected-tab-label"
                        : ""
                    }`}
                  >
                    Custom
                  </span>
                </a>
              </li>
            </ul>
            <div className="tab-content" id="navTabContent">
              <div
                className={`tab-pane fade ${
                  !props.formValues.isCustomTabSelected ? "show active" : ""
                }`}
                id="presetsTabContent"
                role="tabpanel"
                aria-labelledby="presetsTab"
              >
                <div className="row col-12">
                  <div className="presets-frequency-schedule-list">
                    <ul className="bg-freq-schedule-items-box">
                      {props.formValues.administrationScheduleList &&
                      props.formValues.administrationScheduleList.length > 0 ? (
                        props.formValues.administrationScheduleList?.map(
                          (itm: IAdministrationScheduleList, index: number) => (
                            <li key={itm.administrationScheduleId}>
                              <a
                                className="presets-schedule-link"
                                onClick={() =>
                                  props.getScheduleRecordById(
                                    Number(itm?.administrationScheduleId!),
                                    true
                                  )
                                }
                              >
                                {itm?.description}
                              </a>
                            </li>
                          )
                        )
                      ) : (
                        <li>{FrequencyAdministration.NoMatchesFound}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className={`tab-pane fade ${
                  props.formValues.isCustomTabSelected ? "show active" : ""
                }`}
                id="customTabContent"
                role="tabpanel"
                aria-labelledby="customTab"
              >
                <div className="col-12">
                  <div className="row form-group mb-0">
                    <label htmlFor="Repeats">Repeats</label>
                    <input id="Repeats" className="visually-hidden" />
                  </div>
                  <div
                    className="row btn-group"
                    role="group"
                    aria-label="Default example"
                  >
                    <button
                      type="button"
                      ref={props.btnDailyRef}
                      className={`btn btn-primary${setActiveClass(
                        props.formValues.selectedRepeatType ===
                          RepeatTypes.Daily
                      )}`}
                      onClick={(e) => props.chooseRepeatType(RepeatTypes.Daily)}
                      id="btnDaily"
                      data-testid="btnDaily"
                      disabled={
                        props.formValues.selectedRepeatType !==
                          RepeatTypes.Daily &&
                        props.formValues.isRepeatTypesDisabled
                      }
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      ref={props.btnCyclicalRef}
                      className={`btn btn-primary${setActiveClass(
                        props.formValues.selectedRepeatType ===
                          RepeatTypes.Cyclical
                      )}`}
                      onClick={(e) =>
                        props.chooseRepeatType(RepeatTypes.Cyclical)
                      }
                      id="btnCyclical"
                      data-testid="btnCyclical"
                      disabled={
                        props.formValues.selectedRepeatType !==
                          RepeatTypes.Cyclical &&
                        props.formValues.isRepeatTypesDisabled
                      }
                    >
                      Cyclical
                    </button>
                    <button
                      type="button"
                      ref={props.btnWeeklyRef}
                      className={`btn btn-primary${setActiveClass(
                        props.formValues.selectedRepeatType ===
                          RepeatTypes.Weekly
                      )}`}
                      onClick={(e) =>
                        props.chooseRepeatType(RepeatTypes.Weekly)
                      }
                      id="btnWeekly"
                      data-testid="btnWeekly"
                      disabled={
                        props.formValues.selectedRepeatType !==
                          RepeatTypes.Weekly &&
                        props.formValues.isRepeatTypesDisabled
                      }
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      ref={props.btnMonthlyRef}
                      className={`btn btn-primary${setActiveClass(
                        props.formValues.selectedRepeatType ===
                          RepeatTypes.Monthly
                      )}`}
                      onClick={(e) =>
                        props.chooseRepeatType(RepeatTypes.Monthly)
                      }
                      id="btnMonthly"
                      data-testid="btnMonthly"
                      disabled={
                        props.formValues.selectedRepeatType !==
                          RepeatTypes.Monthly &&
                        props.formValues.isRepeatTypesDisabled
                      }
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                <br />
                {props.formValues.selectedRepeatType ===
                  RepeatTypes.Cyclical && (
                  <CyclicalSchedule
                    ref={props.cyclicalScheduleComponentRef}
                    addNewMode={addNewMode}
                    resetCyclicalScheduleData={
                      props.formValues.resetScheduleData
                    }
                    editCyclicalSchedule={
                      props.formValues.editScheduleData?.cyclicalSchedule
                    }
                    validatedCyclicalFields={(
                      newFields: AddScheduleRequiredFields[]
                    ) =>
                      props.handleValidatedCyclicalFields(newFields, "cyclical")
                    }
                    handleCyclicalSchedule={props.handleCyclicalScheduleFields}
                    selectedCyclicalSchedule={
                      props.formValues.selectedCyclicalSchedule
                    }
                  ></CyclicalSchedule>
                )}
                {props.formValues.selectedRepeatType ===
                  RepeatTypes.Monthly && (
                  <MonthlySchedule
                    ref={props.monthlyScheduleComponentRef}
                    addNewMode={addNewMode}
                    resetMonthlyScheduleData={
                      props.formValues.resetScheduleData
                    }
                    editMonthlySchedule={
                      props.formValues.editScheduleData?.monthlySchedule
                    }
                    validatedMonthlyFields={(
                      newFields: AddScheduleRequiredFields[]
                    ) =>
                      props.handleValidatedMonthlyFields(newFields, "monthly")
                    }
                    handleMonthlyScheduleFields={props.setMonthlyScheduleFields}
                    handleMonthlyScheduleFlag={setHandleMonthlyScheduleFlag}
                    maxSelections={props.formValues.maxDaysSelection}
                    isMaxSelectionRequired={
                      props.formValues?.selectedFrequency?.shortAbbreviation?.toLowerCase() ===
                      "qmonth"
                    }
                    isOrderWriter={props.isOrderWriter}
                  ></MonthlySchedule>
                )}
                {props.formValues.selectedRepeatType === RepeatTypes.Weekly &&
                  (props.isOrderWriter ? (
                    <>
                      <div className="row">
                        <div className="col-3 weekly-wrrapper">
                          <div className="form-group  mb-0">
                            <SingleDropDown
                              id="ddlEveryWeeks"
                              dataFieldId="id"
                              dataFieldValue="value"
                              datafile={WeekOptions}
                              isSearchable={true}
                              icon={null}
                              placeholder="Select..."
                              value={props.formValues.selectedWeek}
                              isSearchIconNotRequired={true}
                              isBlankOptionNotRequired={true}
                              selectLabelText="Every"
                              isClearableNotRequired={true}
                              dropDownIndicatorText="Weeks"
                              reducedWidth={true}
                              isSortByDataFieldId={true}
                              onChange={(id) =>
                                props.handleDropDownChange(id, "ddlEveryWeeks")
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 days-control-wrapper">
                          <div className="form-group mb-2">
                            <span
                              className={`span-highlight-label ${
                                props.formValues.isDaySelectedForWeeklyBlock ||
                                props.formValues.isDaySelectedForWeeklyBlock ===
                                  null
                                  ? ""
                                  : "has-error-label"
                              }`}
                            >
                              Choose Days
                            </span>
                            <div
                              className="days-control-container"
                              id="weeklyDays"
                            >
                              {props.formValues.days.map(
                                (item: Day, index: number) => (
                                  <div
                                    className="form-check form-check-inline"
                                    key={item.id}
                                  >
                                    <input
                                      className={`form-check-input`}
                                      id={item.label}
                                      data-testid={item.label}
                                      type="checkbox"
                                      value={item.label}
                                      checked={item.checked}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => props.handleDayChange(item, index)}
                                      disabled={
                                        props.formValues.maxDaysSelection ===
                                          props.formValues.days.filter(
                                            (x: Day) => x.checked === true
                                          ).length && !item.checked
                                      }
                                    />
                                    <label
                                      className={`form-check-label ${
                                        props.formValues
                                          .isDaySelectedForWeeklyBlock ||
                                        props.formValues
                                          .isDaySelectedForWeeklyBlock === null
                                          ? ""
                                          : "has-error-label"
                                      }`}
                                      htmlFor={item.label}
                                    >
                                      {item.label}
                                    </label>
                                  </div>
                                )
                              )}
                            </div>
                            {!props.formValues.isDaySelectedForWeeklyBlock &&
                              props.formValues.isDaySelectedForWeeklyBlock !=
                                null && (
                                <span className="invalid-feedback-message">
                                  {FrequencyAdministration.DayIsRequiredMessage}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="row">
                      <div className="col-3 col-lg-2 weekly-wrrapper">
                        <div className="form-group  mb-0">
                          <SingleDropDown
                            id="ddlEveryWeeks"
                            dataFieldId="id"
                            dataFieldValue="value"
                            datafile={WeekOptions}
                            isSearchable={true}
                            icon={null}
                            placeholder="Select..."
                            value={props.formValues.selectedWeek}
                            isSearchIconNotRequired={true}
                            isBlankOptionNotRequired={true}
                            selectLabelText="Every"
                            isClearableNotRequired={true}
                            dropDownIndicatorText="Weeks"
                            reducedWidth={true}
                            isSortByDataFieldId={true}
                            onChange={(id) =>
                              props.handleDropDownChange(id, "ddlEveryWeeks")
                            }
                          />
                        </div>
                      </div>
                      <div className="col-9 col-lg-10 days-control-wrapper">
                        <div className="form-group  mb-0">
                          <span
                            className={`span-highlight-label ${
                              props.formValues.isDaySelectedForWeeklyBlock ||
                              props.formValues.isDaySelectedForWeeklyBlock ===
                                null
                                ? ""
                                : "has-error-label"
                            }`}
                          >
                            Choose Days
                          </span>
                          <div
                            className="days-control-container"
                            id="weeklyDays"
                          >
                            {props.formValues.days.map(
                              (item: Day, index: number) => (
                                <div
                                  className="form-check form-check-inline"
                                  key={item.id}
                                >
                                  <input
                                    className={`form-check-input`}
                                    id={item.label}
                                    data-testid={item.label}
                                    type="checkbox"
                                    value={item.label}
                                    checked={item.checked}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => props.handleDayChange(item, index)}
                                    disabled={
                                      props.formValues.maxDaysSelection ===
                                        props.formValues.days.filter(
                                          (x: Day) => x.checked === true
                                        ).length && !item.checked
                                    }
                                  />
                                  <label
                                    className={`form-check-label ${
                                      props.formValues
                                        .isDaySelectedForWeeklyBlock ||
                                      props.formValues
                                        .isDaySelectedForWeeklyBlock === null
                                        ? ""
                                        : "has-error-label"
                                    }`}
                                    htmlFor={item.label}
                                  >
                                    {item.label}
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                          {!props.formValues.isDaySelectedForWeeklyBlock &&
                            props.formValues.isDaySelectedForWeeklyBlock !=
                              null && (
                              <span className="invalid-feedback-message">
                                {FrequencyAdministration.DayIsRequiredMessage}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                {props.formValues.selectedFrequency?.shortAbbreviation !==
                  "Q_min" && (
                  <div className="row">
                    <div className="form-group col-12 mb-0">
                      <legend className={`col-form-label`}>Choose Time</legend>
                      <div className="form-check form-check-inline">
                        <input
                          className={`form-check-input`}
                          id="btnSpecificTime"
                          value="true"
                          checked={
                            props.formValues.isBtnSpecificTimeChecked === true
                          }
                          data-testid="btnSpecificTime"
                          onClick={(e) =>
                            props.chooseTimeHandler(true, "btnSpecificTime")
                          }
                          onChange={(e) =>
                            props.chooseTimeHandler(true, "btnSpecificTime")
                          }
                          type="radio"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="btnSpecificTime"
                        >
                          Specific Time
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className={`form-check-input`}
                          id="btnTimeRange"
                          value="false"
                          checked={
                            props.formValues.isBtnSpecificTimeChecked === false
                          }
                          data-testid="btnTimeRange"
                          disabled={props.formValues.isTimeRangeDisabled}
                          onClick={(e) =>
                            props.chooseTimeHandler(false, "btnTimeRange")
                          }
                          onChange={(e) =>
                            props.chooseTimeHandler(false, "btnTimeRange")
                          }
                          type="radio"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="btnTimeRange"
                        >
                          Time Range
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                <div className="row">
                  {props.formValues.isBtnSpecificTimeChecked ? (
                    <div className="row col-12" id="specificTime">
                      {props.formValues.time
                        .slice(0)
                        .map((item: ScheduleTimeControls, index: number) => (
                          <div
                            className={`time-control-container form-group ${
                              item.isValid ? "" : "error-time-control"
                            } ${props.isOrderWriter ? "" : "ml-0"}`}
                            key={item.name}
                          >
                            <label
                              htmlFor={item.name}
                              className={`col-form-label ${
                                item.isValid ? "" : "has-error-label"
                              }`}
                            >
                              {item.label}
                            </label>
                            <div className="row col-12 pr-0">
                              <DatePicker
                                ref={(el: DatePicker) =>
                                  (datePickerRef.current[index] = el)
                                }
                                className={`form-control time-picker-control ${
                                  item.isValid ? "" : "form-control-has-error"
                                }`}
                                id={item.name}
                                name={item.name}
                                selected={
                                  item.value ? new Date(item.value) : null
                                }
                                onChange={(date: Date | null) => {
                                  props.onTimeChange(
                                    { ...item, value: date! },
                                    index,
                                    true,
                                    false
                                  );
                                }}
                                onBlur={(
                                  e: React.FocusEvent<HTMLInputElement>
                                ) =>
                                  props.onblurEvent(
                                    e,
                                    index,
                                    true,
                                    false,
                                    item.label
                                  )
                                }
                                onKeyDown={(
                                  event: React.KeyboardEvent<HTMLInputElement>
                                ) => timeCharacterAllowed(event, index, true)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                timeFormat="hh:mm aa"
                                dateFormat="hh:mm aa"
                                showIcon={true}
                                popperClassName="date-picker-popper"
                                icon={
                                  <FaRegClock
                                    className={`${
                                      item.isValid
                                        ? ""
                                        : "react-datepicker__calendar-icon-error"
                                    }`}
                                    onClick={() => {
                                      if (datePickerRef.current[index]) {
                                        datePickerRef.current[index].setOpen(
                                          true
                                        );
                                      }
                                    }}
                                  />
                                }
                              />
                              <div>
                                <span className="invalid-feedback-message">
                                  {item.isValid ? "" : item.errorMessage}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="row col-12" id="timeRange">
                      {props.formValues.timeRange
                        .slice(0)
                        .map((item: ScheduleTimeControls, index: number) => (
                          <div
                            className={`form-group ${
                              item.isValid ? "" : "error-time-control"
                            } ${
                              item.label.includes("Start Time")
                                ? "time-range-container"
                                : "time-range-container-merge"
                            }`}
                            key={item.name}
                          >
                            <label
                              htmlFor={item.name}
                              className={`col-form-label ${
                                item.isValid ? "" : "has-error-label"
                              }`}
                            >
                              {item.label}
                            </label>
                            <div className="row col-12 pr-0 position-relative">
                              <DatePicker
                                ref={(el: DatePicker) =>
                                  (datePickerRef.current[index] = el)
                                }
                                className={`form-control time-picker-control ${
                                  item.isValid ? "" : "form-control-has-error"
                                }`}
                                id={item.name}
                                name={item.name}
                                selected={
                                  item.value ? new Date(item.value) : null
                                }
                                onChange={(date: Date | null) => {
                                  props.onTimeChange(
                                    { ...item, value: date! },
                                    index,
                                    false,
                                    false
                                  );
                                }}
                                onBlur={(
                                  e: React.FocusEvent<HTMLInputElement>
                                ) =>
                                  props.onblurEvent(
                                    e,
                                    index,
                                    false,
                                    false,
                                    item.label
                                  )
                                }
                                onKeyDown={(
                                  event: React.KeyboardEvent<HTMLInputElement>
                                ) => timeCharacterAllowed(event, index, false)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                timeFormat="hh:mm aa"
                                dateFormat="hh:mm aa"
                                popperClassName="date-picker-popper"
                                showIcon={true}
                                icon={
                                  <FaRegClock
                                    className={`${
                                      item.isValid
                                        ? ""
                                        : "react-datepicker__calendar-icon-error"
                                    }`}
                                    onClick={() => {
                                      if (datePickerRef.current[index]) {
                                        datePickerRef.current[index].setOpen(
                                          true
                                        );
                                      }
                                    }}
                                  />
                                }
                              />
                              <div>
                                <span className="invalid-feedback-message">
                                  {item.isValid ? "" : item.errorMessage}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {props.formValues.isFreqBelongsToEveryGroup && (
                  <div className="inline-message im-notification ml-0">
                    Schedule intervals will be calculated based on this start
                    time.
                  </div>
                )}

                <div className="row">
                  <div
                    className={`form-group col-4 mb-0 ${
                      props.formValues.durationErrorMessage
                        ? "has-error has-feedback"
                        : ""
                    }`}
                    id="ddlDuration"
                  >
                    <label
                      className={`col-form-label p-0 ${
                        props.formValues.durationErrorMessage
                          ? "has-error-label"
                          : ""
                      }`}
                      htmlFor="ddlDuration"
                    >
                      Duration
                    </label>
                    <input
                      className={`form-control form-control-custom-number ${
                        props.formValues.durationErrorMessage
                          ? "has-error has-feedback"
                          : ""
                      }`}
                      id="ddlDuration"
                      name="duration"
                      data-testid="ddlDuration"
                      type="number"
                      min={0}
                      max={999}
                      autoComplete="off"
                      value={props?.formValues?.selectedDuration?.toString()}
                      onChange={(e) =>
                        props.handleOnDurationChanges(e.target.value)
                      }
                    />
                    <div className="invalid-feedback-message">
                      {props.formValues?.durationErrorMessage}
                    </div>
                  </div>
                  {(props.formValues.selectedRepeatType === "Daily" ||
                    props.formValues.selectedRepeatType === "Cyclical") && (
                    <div className="form-group col-4 mb-0" id="ddlDurationType">
                      <SingleDropDown
                        id="ddlDurationType"
                        dataFieldId="id"
                        dataFieldValue="value"
                        datafile={FrequencyDurationType}
                        isSearchable={true}
                        icon={null}
                        placeholder="Select..."
                        value={props.formValues.selectedDurationType}
                        isBlankOptionNotRequired={true}
                        selectLabelText="Duration Type"
                        errorMessage={props.formValues.durationTypeErrorMessage}
                        onChange={(id) =>
                          props.handleDropDownChange(id, "ddlDurationType")
                        }
                      />
                    </div>
                  )}
                  {props.formValues.selectedRepeatType === "Weekly" && (
                    <div className="form-group col-4 mb-0" id="ddlDurationType">
                      <SingleDropDown
                        id="ddlDurationType"
                        dataFieldId="id"
                        dataFieldValue="value"
                        datafile={FrequencyDurationTypeWeekly}
                        isSearchable={false}
                        isSearchIconNotRequired={true}
                        icon={null}
                        placeholder="Select..."
                        value={props.formValues.selectedDurationType}
                        isBlankOptionNotRequired={true}
                        selectLabelText="Duration Type"
                        errorMessage={props.formValues.durationTypeErrorMessage}
                        onChange={(id) =>
                          props.handleDropDownChange(id, "ddlDurationType")
                        }
                      />
                    </div>
                  )}
                  {props.formValues.selectedRepeatType === "Monthly" && (
                    <div className="form-group col-4 mb-0" id="ddlDurationType">
                      <SingleDropDown
                        id="ddlDurationType"
                        dataFieldId="id"
                        dataFieldValue="value"
                        datafile={FrequencyDurationTypeMonthly}
                        isSearchable={false}
                        isSearchIconNotRequired={true}
                        icon={null}
                        placeholder="Select..."
                        value={props.formValues.selectedDurationType}
                        isBlankOptionNotRequired={true}
                        selectLabelText="Duration Type"
                        errorMessage={props.formValues.durationTypeErrorMessage}
                        onChange={(id) =>
                          props.handleDropDownChange(id, "ddlDurationType")
                        }
                      />
                    </div>
                  )}
                </div>
                {props.isOrderWriter && props.medicationId > 0 && (
                  <div className="row">
                    <OrderWriterAdminDateTime
                      medicationId={props.medicationId}
                      isAddSchedule={true}
                      formValues={props.formValues}
                      setFormValues={props.setFormValues}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrationSchedule;
