import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  setEndDateOpenEnded as reduxSetEndDateOpenEnded,
  setFormattedEndDate as reduxSetFormattedEndDate,
  setFormattedStartDate as reduxSetFormattedStartDate,
} from "../../../redux/slices/orderWriterSlice";
import { useDispatch, useSelector } from "react-redux";
import { Medication } from "../../../types/medicationTypes";
import { RootState } from "../../../redux/store";
import { defaultMedication } from "../../../shared/constants/DefaultMedication";
import { IAdminSchedule } from "../../../models/interface/IAdminSchedule";

type OrderWriterAdminDateTimeType = {
  medicationId: number;
  isAddSchedule: boolean;
  formValues?: IAdminSchedule;
  setFormValues?: (value: React.SetStateAction<IAdminSchedule>) => void;
};
const OrderWriterAdminDateTime = (props: OrderWriterAdminDateTimeType) => {
  const dispatch = useDispatch();

  const medication: Medication =
    (useSelector((state: RootState) =>
      state.orderWriter.medications.find(
        (med: Medication) => med.id === props.medicationId
      )
    ) as Medication) || defaultMedication;

  useEffect(() => {
    if (props?.isAddSchedule && props.formValues) {
      props.formValues.isEndDateOpenEnded =
        medication?.instructions?.isEndDateOpenEnded;
      if (medication?.instructions?.formattedEndDate !== "")
        props.formValues.endDate = new Date(
          medication?.instructions?.formattedEndDate ?? ""
        );
      props.setFormValues!({ ...props.formValues });
    }
  }, [props?.isAddSchedule]);

  const today = new Date();

  const startDate =
    medication?.instructions?.formattedStartDate &&
    new Date(medication?.instructions?.formattedStartDate) >= today
      ? new Date(medication?.instructions?.formattedStartDate)
      : today;

  const isStartDateValid =
    startDate instanceof Date && !isNaN(startDate.getTime());

  const endDate =
    (isStartDateValid &&
      medication?.instructions?.formattedEndDate &&
      new Date(medication?.instructions?.formattedEndDate)) ||
    (isStartDateValid ? startDate : today);

  useEffect(() => {
    if (!props.isAddSchedule) {
      dispatch(
        reduxSetFormattedStartDate({
          medicationId: props.medicationId,
          formattedStartDate: startDate.toString(),
        })
      );
    }
  }, [startDate]);

  const startDateChanged = (date: Date | null) => {
    if (!date) {
      return;
    }

    let formattedStartDate = date.toString();

    if (date < today) {
      formattedStartDate = today.toString();
    }

    if (!props.isAddSchedule) {
      dispatch(
        reduxSetFormattedStartDate({
          medicationId: props.medicationId,
          formattedStartDate: formattedStartDate,
        })
      );

      if (
        new Date(formattedStartDate) >
        new Date(medication?.instructions?.formattedEndDate || "")
      ) {
        dispatch(
          reduxSetFormattedEndDate({
            medicationId: props.medicationId,
            formattedEndDate: "",
          })
        );
      }
    } else {
      props.formValues!.startDate = new Date(formattedStartDate);
      if (
        new Date(formattedStartDate) >
        (medication?.instructions?.formattedEndDate === ""
          ? new Date()
          : new Date(medication?.instructions?.formattedEndDate || ""))
      ) {
        props.formValues!.endDate = new Date(formattedStartDate);
      }
      props.setFormValues!({ ...props.formValues! });
    }
  };

  const endDateChanged = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) {
      date = new Date(startDate);
    }

    if (!date) {
      return;
    }

    let formattedEndDate = date.toString();

    if (date < startDate) {
      formattedEndDate = startDate.toString();
    }
    if (!props.isAddSchedule) {
      dispatch(
        reduxSetFormattedEndDate({
          medicationId: props.medicationId,
          formattedEndDate: formattedEndDate,
        })
      );
    } else {
      props.formValues!.endDate = new Date(formattedEndDate);
      props.setFormValues!({ ...props.formValues! });
    }
  };

  const isOpenEnded = () => {
    if (
      (medication?.instructions?.isEndDateOpenEnded && !props.isAddSchedule) ||
      (props.isAddSchedule && props.formValues?.isEndDateOpenEnded)
    ) {
      return null;
    } else if (
      props.isAddSchedule &&
      props.formValues?.endDate &&
      !props.formValues?.isEndDateOpenEnded
    ) {
      return props.formValues?.endDate;
    } else if (
      props.isAddSchedule &&
      !props.formValues?.endDate &&
      !props.formValues?.isEndDateOpenEnded
    ) {
      return startDate;
    } else {
      dispatch(
        reduxSetFormattedEndDate({
          medicationId: props.medicationId,
          formattedEndDate: endDate.toString(),
        })
      );
      return endDate;
    }
  };

  const getIsDefaultCheked = () => {
    if (props?.isAddSchedule && props.formValues) {
      return props.formValues.isEndDateOpenEnded!;
    } else {
      return medication?.instructions?.isEndDateOpenEnded;
    }
  };

  return (
    <div className="row col-md-12 align-items-center">
      <div className="col-5">
        <div className="form-group">
          <label
            className="col-form-label ml-n1"
            id="startDate"
            htmlFor="startDatePickerLabel"
          >
            First Admin Date & Time
          </label>
          <input className="visually-hidden" id="startDatePickerLabel" />
          <div className="datepicker-container">
            <DatePicker
              className="form-control form-control-custom-number"
              selected={
                props.formValues?.startDate
                  ? props.formValues?.startDate
                  : startDate
              }
              onChange={(date: Date | null) => {
                startDateChanged(date);
              }}
              onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                const manuallyEnteredDate = new Date(event.target.value);
                startDateChanged(manuallyEnteredDate);
              }}
              minDate={today}
              id="startDatePicker"
              data-testid="startDatePicker"
              placeholderText="Start Date"
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy hh:mm aa"
              showTimeInput
            />
            <i className="fa-regular fa-calendar-clock datepicker-icon"></i>
          </div>
        </div>
      </div>
      <div className="col-2 endDateOpenEnded">
        <div className="form-check text-center mt-4">
          <input
            className="form-check-input"
            id="option1stacked"
            type="checkbox"
            checked={getIsDefaultCheked()}
            onChange={(e) => {
              const isChecked = e.target.checked;
              if (isChecked && !props?.isAddSchedule) {
                dispatch(
                  reduxSetFormattedEndDate({
                    medicationId: props.medicationId,
                    formattedEndDate: "",
                  })
                );
              }

              if (props?.isAddSchedule && props.formValues) {
                props.formValues.isEndDateOpenEnded = isChecked;
                props.setFormValues!({ ...props.formValues });
              } else {
                dispatch(
                  reduxSetEndDateOpenEnded({
                    medicationId: props.medicationId,
                    isEndDateOpenEnded: isChecked,
                  })
                );
              }
            }}
            data-testid="openEnded-select"
          />
          <label
            className="form-check-label"
            id="openEnded"
            htmlFor="option1stacked"
          >
            Open Ended
          </label>
        </div>
      </div>
      <div className="col-5">
        <div className="form-group">
          <label
            className="col-form-label ml-n1"
            id="endDate"
            htmlFor="endDatePickerLabel"
          >
            Calculated Last Admin Date & Time
          </label>
          <input className="visually-hidden" id="endDatePickerLabel" />
          <div className="datepicker-container">
            <DatePicker
              className="form-control form-control-custom-number"
              selected={isOpenEnded()}
              onChange={(date: Date | null) => {
                endDateChanged(date);
              }}
              onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                // Handle manual input date change
                const manuallyEnteredDate = new Date(event.target.value);
                endDateChanged(manuallyEnteredDate);
              }}
              minDate={
                props.formValues?.startDate
                  ? props.formValues?.startDate
                  : startDate
              }
              id="endDatePicker"
              data-testid="endDatePicker"
              placeholderText="End Date"
              disabled={
                props.isAddSchedule && props.formValues
                  ? props.formValues.isEndDateOpenEnded!
                  : medication?.instructions?.isEndDateOpenEnded
              }
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy hh:mm aa"
              showTimeInput
            />
            <i className="fa-regular fa-calendar-clock datepicker-icon"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderWriterAdminDateTime;
