import React, { Fragment } from "react";
import {
  preventMinus,
  preventPasteNegative,
  getPerSlidingScale,
  handleDispatch,
  insertIntoDic,
} from "../../../helper/Utils";
import { Medication } from "../../../types";
import { useDispatch } from "react-redux";
import { setPerSlidingScale as reduxSetPerSlidingScale } from "../../../redux/slices/orderWriterSlice";

export type ISlidingScaleThreshold = {
  isSlidingScaleThreshold: boolean;
  setIsSlidingScaleThreshold: (isSlidingScaleThreshold: boolean) => void;
  handleOnChanges: (value: any, type: any) => void;
  medication: Medication;
  order: number;
  thresholdType: string;
  actionType: string;
  isBodyAddRow: boolean;
  rowsData: any;
  isBodyDeleteRow: boolean;
  setIsBodyDeleteRow: (isBodyDeleteRow: boolean) => void;
};

const SlidingScaleThreshold = ({
  isSlidingScaleThreshold,
  setIsSlidingScaleThreshold,
  handleOnChanges,
  medication,
  order,
  thresholdType,
  actionType,
  isBodyAddRow,
  rowsData,
  isBodyDeleteRow,
  setIsBodyDeleteRow,
}: ISlidingScaleThreshold) => {
  const dispatch = useDispatch();

  let controlName = thresholdType.replace(/\s/g, "") + actionType;

  let errorCount = rowsData?.filter(
    (rowData: IRowData) =>
      rowData.from === "" || rowData.to === "" || rowData.give === ""
  )?.length;
  let isFooterDisabled =
    controlName === "LessThanCall" ? false : isBodyAddRow || errorCount !== 0;

  let errorThresoldType =
    medication?.instructions?.perSlidingScale?.optionalData.find(
      (x) => x.key === thresholdType.replace(/\s/g, "") + order
    )?.error;

  let errorThresoldActionType =
    medication?.instructions?.perSlidingScale?.optionalData.find(
      (x) => x.key === thresholdType.replace(/\s/g, "") + order + actionType
    )?.error;

  const isChekedAutofocus = () => {
    let txtInputElement: HTMLElement | null;
    if (controlName === "LessThanCall" || controlName === "GreaterThanCall") {
      txtInputElement = document.getElementById(`txt${controlName}1`);
    } else if (controlName === "GreaterThanGive") {
      txtInputElement = document.getElementById(`txt${controlName}2`);
    }

    setTimeout(() => {
      txtInputElement?.focus();
    }, 10);
  };

  const isChekedHandle = (isChecked: boolean) => {
    setIsBodyDeleteRow(false);
    setIsSlidingScaleThreshold(!isChecked);
    let perSlidingScaleResult = getPerSlidingScale(
      isChecked,
      "is" + controlName,
      medication
    );

    let currentToBodyValue =
      medication?.instructions?.perSlidingScale?.rowsData?.filter(
        (x) => x.from
      )[medication?.instructions?.perSlidingScale?.rowsData?.length - 1]?.to;

    let isLessThanCall = perSlidingScaleResult?.optionalData?.find(
      (x) => x.key === "isLessThanCall"
    )?.value;

    let isGreaterThanCall = perSlidingScaleResult?.optionalData?.find(
      (x) => x.key === "isGreaterThanCall"
    )?.value;

    if (!isChecked) {
      perSlidingScaleResult.optionalData = insertIntoDic(
        thresholdType.replace(/\s/g, "") + order,
        "",
        perSlidingScaleResult.optionalData,
        ""
      );
      perSlidingScaleResult.optionalData = insertIntoDic(
        thresholdType.replace(/\s/g, "") + order + actionType,
        "",
        perSlidingScaleResult.optionalData,
        ""
      );
      if (controlName === "LessThanCall" && isGreaterThanCall) {
        perSlidingScaleResult.optionalData = insertIntoDic(
          "GreaterThan2",
          currentToBodyValue,
          perSlidingScaleResult.optionalData,
          ""
        );
      }
    } else {
      isChekedAutofocus();
      let lessThanChekedValue = perSlidingScaleResult?.optionalData?.find(
        (x) => x.key === "LessThan0"
      )?.value;

      perSlidingScaleResult.optionalData = insertIntoDic(
        thresholdType.replace(/\s/g, "") + order,
        "",
        perSlidingScaleResult.optionalData,
        ""
      );

      let ddVal: any = document.getElementById(`dd${controlName}`);
      perSlidingScaleResult.optionalData = insertIntoDic(
        thresholdType.replace(/\s/g, "") + order + actionType,
        thresholdType.replace(/\s/g, "") + order + actionType ===
          "GreaterThan2Call" ||
          thresholdType.replace(/\s/g, "") + order + actionType ===
            "LessThan0Call"
          ? ddVal.value
          : "",
        perSlidingScaleResult.optionalData,
        ""
      );

      if (controlName === "GreaterThanGive") {
        perSlidingScaleResult.optionalData = insertIntoDic(
          "GreaterThan1",
          currentToBodyValue,
          perSlidingScaleResult.optionalData,
          ""
        );
      } else if (controlName === "GreaterThanCall") {
        perSlidingScaleResult.optionalData = insertIntoDic(
          "GreaterThan2",
          isLessThanCall &&
            isGreaterThanCall &&
            Number(lessThanChekedValue) > Number(currentToBodyValue)
            ? lessThanChekedValue
            : currentToBodyValue,
          perSlidingScaleResult.optionalData,
          ""
        );
      }
    }

    handleDispatch(
      dispatch,
      medication.id,
      reduxSetPerSlidingScale,
      "perSlidingScale",
      perSlidingScaleResult
    );

    return isChecked;
  };

  const getIsDefaultCheked = () => {
    if ((isBodyAddRow || isBodyDeleteRow) && controlName !== "LessThanCall") {
      setIsSlidingScaleThreshold(true);
      return false;
    } else if (errorCount !== 0 && controlName !== "LessThanCall") {
      let result = medication?.instructions?.perSlidingScale?.optionalData.find(
        (x) => x.key === "is" + controlName
      )?.value;
      return result;
    } else {
      return !isSlidingScaleThreshold;
    }
  };

  return (
    <div className="row mt-2">
      <div className="col-1 mt-1">
        <div className="form-check mt-n0 ml-3">
          <label htmlFor={`chk${controlName}`}>
            <span className="visually-hidden">{controlName}</span>
          </label>
          <div className="input-group">
            <input
              className="form-check-input"
              id={`chk${controlName}`}
              data-testid={`chk${controlName}`}
              type="checkbox"
              disabled={isFooterDisabled}
              onChange={(e: any) => isChekedHandle(e.target.checked)}
              checked={getIsDefaultCheked()}
            />
          </div>
          <div
            className="d-flex invalid-feedback mt-1"
            data-testid={`chk${controlName}${order}error`}
          >
            {
              medication?.instructions?.perSlidingScale?.optionalData.find(
                (x) => x.key === "is" + controlName + order
              )?.error
            }
          </div>
        </div>
      </div>
      <div className="col-3 mt-n1 my-n1">
        <div className="form-group mt-n2 my-n0">
          <label htmlFor={`txt${controlName}1`}>{thresholdType}</label>
          <div
            className={`input-group ${errorThresoldType ? "has-error" : ""}`}
          >
            {isSlidingScaleThreshold ? (
              <input
                type="text"
                id={`txt${controlName}1`}
                className="form-control form-control-disabled"
                autoComplete="off"
                disabled={isSlidingScaleThreshold}
                value={""}
              />
            ) : (
              <Fragment>
                <input
                  type="number"
                  id={`txt${controlName}1`}
                  data-testid={`txt${controlName}1`}
                  className="form-control"
                  autoComplete="off"
                  disabled={controlName === "GreaterThanGive"}
                  onPaste={preventPasteNegative}
                  onKeyDown={(e) => preventMinus(e, false)}
                  min={0}
                  step={1}
                  onChange={(e) =>
                    handleOnChanges(
                      e.target.value,
                      thresholdType.replace(/\s/g, "") + order
                    )
                  }
                  onBlur={(e) =>
                    handleOnChanges(
                      e.target.value,
                      thresholdType.replace(/\s/g, "") + order
                    )
                  }
                  value={
                    medication?.instructions?.perSlidingScale?.optionalData.find(
                      (x) => x.key === thresholdType.replace(/\s/g, "") + order
                    )?.value
                  }
                />
                <div className="input-group-append text-control">
                  <span
                    className="input-group-text border-group-text"
                    id={`txt${controlName}Disabled1`}
                  >
                    mg/dL
                  </span>
                </div>
              </Fragment>
            )}
          </div>
          <div
            className="d-flex invalid-feedback mt-1"
            data-testid={`${controlName}${order}error`}
          >
            {errorThresoldType}
          </div>
        </div>
      </div>
      <div className="col-0 mt-4">
        <i className="fa-regular fa-arrow-right"></i>
      </div>
      {controlName === "GreaterThanGive" ? (
        <div className="col-3 mt-n1 my-n1">
          <div className="form-group mt-n2 my-n0">
            <label htmlFor={`txt${controlName}2`}>{actionType}</label>
            <div
              className={`input-group ${
                errorThresoldActionType ? "has-error" : ""
              }`}
            >
              {isSlidingScaleThreshold ? (
                <input
                  type="text"
                  id={`txt${controlName}2`}
                  className="form-control form-control-disabled"
                  autoComplete="off"
                  value={""}
                  disabled={isSlidingScaleThreshold}
                />
              ) : (
                <Fragment>
                  <input
                    type="number"
                    id={`txt${controlName}2`}
                    data-testid={`txt${controlName}2`}
                    className="form-control"
                    autoComplete="off"
                    disabled={isSlidingScaleThreshold}
                    onPaste={preventPasteNegative}
                    onKeyDown={preventMinus}
                    min={0}
                    step={1}
                    onChange={(e) =>
                      handleOnChanges(
                        e.target.value,
                        thresholdType.replace(/\s/g, "") + order + actionType
                      )
                    }
                    onBlur={(e) =>
                      handleOnChanges(
                        e.target.value,
                        thresholdType.replace(/\s/g, "") + order + actionType
                      )
                    }
                    value={
                      medication?.instructions?.perSlidingScale?.optionalData.find(
                        (x) =>
                          x.key ===
                          thresholdType.replace(/\s/g, "") + order + actionType
                      )?.value
                    }
                  />
                  <div className="input-group-append text-control">
                    <span
                      className="input-group-text border-group-text"
                      id={`txt${controlName}Disabled2`}
                    >
                      Units
                    </span>
                  </div>
                </Fragment>
              )}
            </div>
            <div
              className="d-flex invalid-feedback mt-1"
              data-testid={`${controlName}${order}error`}
            >
              {errorThresoldActionType}
            </div>
          </div>
        </div>
      ) : (
        <div className="col-7 mt-n1 my-n1">
          <div className="form-group mt-n2 my-n0">
            <label htmlFor={`dd${controlName}`}>{actionType}</label>
            <div className="input-group">
              <select
                className="form-control form-control-disabled"
                disabled={isSlidingScaleThreshold}
                id={`dd${controlName}`}
                data-testid={`dd${controlName}`}
                style={{ width: "335px" }}
                onChange={(selectedValue) => {
                  handleOnChanges(
                    selectedValue,
                    thresholdType.replace(/\s/g, "") + order + actionType
                  );
                }}
                value={
                  medication?.instructions?.perSlidingScale?.optionalData.find(
                    (x) =>
                      x.key ===
                      thresholdType.replace(/\s/g, "") + order + actionType
                  )?.value
                }
              >
                <option value="MD" defaultValue={"MD"}>
                  MD
                </option>
                <option value="NP/PA">NP/PA</option>
              </select>
            </div>
            <div
              className="d-flex invalid-feedback mt-1"
              data-testid={`dd${controlName}${order}error`}
            >
              {
                medication?.instructions?.perSlidingScale?.optionalData.find(
                  (x) =>
                    x.key ===
                    thresholdType.replace(/\s/g, "") + order + actionType
                )?.error
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidingScaleThreshold;
