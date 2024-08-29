import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { defaultMedication } from "../../../shared/constants/DefaultMedication";
import {
  getCommonInstruction,
  getPerSlidingScale,
  insertIntoDic,
} from "../../../helper/Utils";
import { useDispatch, useSelector } from "react-redux";
import { Medication } from "../../../types/medicationTypes";
import { RootState } from "../../../redux/store";
import {
  setPerSlidingScale as reduxSetPerSlidingScale,
  setIsSavedPerSlidingScale as reduxSetIsSavedPerSlidingScale,
  setInstruction as reduxSetInstruction,
  setDefaultSig as reduxSetDefaultSig,
} from "../../../redux/slices/orderWriterSlice";
import SlidingScaleThreshold from "./SlidingScaleThreshold";
import SlidingScaleTableRows from "./SlidingScaleTableRows";
import { getDivHeight, updateBannerZIndex } from "../../../helper/Utility";
import "../../../styles/App.scss";
import "../../../styles/PerSlidding.scss";

export type PerSlidingScaleSidebarType = {
  isMenuActive: boolean;
  setIsMenuActive: (isMenu: boolean) => void;
  onOverLayClick: () => void;
  medicationId: number;
  isPerSclidingEditClick: boolean;
  rowsData: IRowData[];
  setRowsData: (rowsData: IRowData[]) => void;
};
const PerSlidingScaleSidebar = ({
  isMenuActive,
  setIsMenuActive,
  onOverLayClick,
  medicationId,
  isPerSclidingEditClick,
  rowsData,
  setRowsData,
}: PerSlidingScaleSidebarType) => {
  const dispatch = useDispatch();
  const rowInput: IRowData = {
    from: "",
    to: "",
    give: "",
    fromError: "",
    toError: "",
    giveError: "",
  };
  const medication: Medication =
    (useSelector((state: RootState) =>
      state.orderWriter.medications.find((med) => med.id === medicationId)
    ) as Medication) || defaultMedication;

  const [isGreaterThanGive, setIsGreaterThanGive] = useState(true);
  const [isGreaterThanCall, setIsGreaterThanCall] = useState(true);
  const [isLessThanCall, setIsLessThanCall] = useState(true);
  const [isBodyAddRow, setIsBodyAddRow] = useState(false);

  const [fromDisabled, setFromDisabled] = useState(false);
  const [toDisabled, setToDisabled] = useState(false);
  const [giveDisabled, setGiveDisabled] = useState(false);
  const [maxToValue, setMaxToValue] = useState(0);
  const [isBodyDeleteRow, setIsBodyDeleteRow] = useState(false);
  const [bodyHeight, setBodyHeight] = useState("0vh");
  const [modalWidth, setModalWidth] = useState(0);

  const resizeWindow = () => {
    let headerHeight = getDivHeight("slidding_header","id");
    let footerHeight = getDivHeight("slidding_footer","id");

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

  let perSlidingScaleResult = defaultMedication.instructions.perSlidingScale;

  const sideMenuClasses = classnames("side-menu", {
    "side-menu-active": isMenuActive,
  });

  const sideMenuContentClasses = classnames("side-menu_content", {
    "side-menu_content-active": isMenuActive,
    "overflow-auto": !isMenuActive,
  });

  const btnCloseFocus = () => {
    let btnElement = document.getElementById("backBtn");
    btnElement?.focus();
  };

  useEffect(() => {
    updateBannerZIndex();
    if (rowsData.length > 1) {
      setFromDisabled(true);
      setToDisabled(true);
      setGiveDisabled(true);
    }
    if (isPerSclidingEditClick) {
      setIsGreaterThanGive(
        !medication?.instructions?.perSlidingScale?.optionalData?.find(
          (x) => x.key === "isGreaterThanGive"
        )?.value
      );
      setIsGreaterThanCall(
        !medication?.instructions?.perSlidingScale?.optionalData?.find(
          (x) => x.key === "isGreaterThanCall"
        )?.value
      );
      setIsLessThanCall(
        !medication?.instructions?.perSlidingScale?.optionalData?.find(
          (x) => x.key === "isLessThanCall"
        )?.value
      );
    }

    setTimeout(() => {
      let btnElement = document.getElementById("backBtn");
      btnElement?.focus();
    }, 10);
  }, []);

  const onSave = () => {
    const newRowsInput: IRowData[] = JSON.parse(JSON.stringify(rowsData));
    validation("from", newRowsInput.length - 1, newRowsInput);
    validation("to", newRowsInput.length - 1, newRowsInput);
    validation("give", newRowsInput.length - 1, newRowsInput);
    setRowsData(newRowsInput);
    let isErrorsTableRowCount = newRowsInput.filter(
      (rowData: IRowData) =>
        rowData.fromError !== "" ||
        rowData.toError !== "" ||
        rowData.giveError !== ""
    )?.length;
    let isOptionalErrorCount: number = 0;
    let perSlidingScaleSaveResult = medication?.instructions?.perSlidingScale;
    let isLessThanCall = perSlidingScaleSaveResult?.optionalData?.find(
      (x) => x.key === "isLessThanCall"
    )?.value;

    if (isLessThanCall) {
      handleOnChanges(
        perSlidingScaleSaveResult?.optionalData?.find(
          (x) => x.key === "LessThan0"
        )?.value,
        "LessThan0"
      );
      if (
        perSlidingScaleResult?.optionalData?.find((x) => x.key === "LessThan0")
          ?.error !== ""
      ) {
        isOptionalErrorCount++;
      }
    }

    let isGreaterThanCall = perSlidingScaleSaveResult?.optionalData?.find(
      (x) => x.key === "isGreaterThanCall"
    )?.value;
    if (isGreaterThanCall) {
      handleOnChanges(
        perSlidingScaleSaveResult?.optionalData?.find(
          (x) => x.key === "GreaterThan2"
        )?.value,
        "GreaterThan2"
      );
      if (
        perSlidingScaleResult?.optionalData?.find(
          (x) => x.key === "GreaterThan2"
        )?.error !== ""
      ) {
        isOptionalErrorCount++;
      }
    }

    let isGreaterThanGive = perSlidingScaleSaveResult?.optionalData?.find(
      (x) => x.key === "isGreaterThanGive"
    )?.value;
    if (isGreaterThanGive) {
      handleOnChanges(
        perSlidingScaleSaveResult?.optionalData?.find(
          (x) => x.key === "GreaterThan1Give"
        )?.value,
        "GreaterThan1Give"
      );
      if (
        perSlidingScaleResult?.optionalData?.find(
          (x) => x.key === "GreaterThan1Give"
        )?.error !== ""
      ) {
        isOptionalErrorCount++;
      }
    }
    if (isErrorsTableRowCount === 0 && isOptionalErrorCount === 0) {
      let defaultSig: IStructured = JSON.parse(
        JSON.stringify(medication?.instructions?.defaultStructuredSig)
      );
      defaultSig.perSlidingScale = medication?.instructions?.perSlidingScale;
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
      dispatch(
        reduxSetIsSavedPerSlidingScale({
          medicationId: medication.id,
          isSavedPerSlidingScale: true,
        })
      );

      setIsMenuActive(!isMenuActive);
      document.body.style.overflowY = "visible";
    }
  };

  const handleOnChanges = (
    selectedValue: any,
    type:
      | "LessThan0"
      | "LessThan0Call"
      | "GreaterThan1"
      | "GreaterThan1Give"
      | "GreaterThan2"
      | "GreaterThan2Call"
  ) => {
    switch (type) {
      case "LessThan0Call":
      case "GreaterThan2Call":
        perSlidingScaleResult = getPerSlidingScale(
          selectedValue.target.value,
          type,
          medication
        );
        break;
      default:
        perSlidingScaleResult = getPerSlidingScale(
          selectedValue,
          type,
          medication
        );
        break;
    }

    return dispatch(
      reduxSetPerSlidingScale({
        medicationId: medication.id,
        perSlidingScale: perSlidingScaleResult,
      })
    );
  };

  const addTableRows = () => {
    const newRowsInput: IRowData[] = JSON.parse(JSON.stringify(rowsData));
    validation("from", newRowsInput.length - 1, newRowsInput);
    validation("to", newRowsInput.length - 1, newRowsInput);
    validation("give", newRowsInput.length - 1, newRowsInput);
    setRowsData(newRowsInput);
    let isErrorsCount = newRowsInput.filter(
      (rowData: IRowData) =>
        rowData.fromError !== "" ||
        rowData.toError !== "" ||
        rowData.giveError !== ""
    )?.length;

    let maxToVal = "";
    if (newRowsInput.length > 0) {
      let prevFromVal = newRowsInput?.filter(function (x) {
        return x.from;
      })[newRowsInput.length - 1]?.to;
      maxToVal = prevFromVal;
      rowInput.from = (Number(prevFromVal) + 1).toString();
      setMaxToValue(Number(prevFromVal));
    }
    if (
      Number(maxToVal) < 800 &&
      newRowsInput.length < 10 &&
      isErrorsCount === 0
    ) {
      setFromDisabled(true);
      setToDisabled(true);
      setGiveDisabled(true);
      setIsBodyAddRow(true);
      setIsBodyDeleteRow(false);
      setRowsData([...newRowsInput, rowInput]);
      perSlidingScaleResult = getPerSlidingScale(
        newRowsInput,
        "rowsData",
        medication
      );
      let perSlidingScale = reset(perSlidingScaleResult);
      dispatch(
        reduxSetPerSlidingScale({
          medicationId: medication.id,
          perSlidingScale: perSlidingScale,
        })
      );
    }
  };

  const reset = (perSlidingScaleResult: IPerSlidingScale) => {
    let perSlidingScale: IPerSlidingScale = JSON.parse(
      JSON.stringify(perSlidingScaleResult)
    );
    perSlidingScale.optionalData = insertIntoDic(
      "isGreaterThanCall",
      false,
      perSlidingScale.optionalData,
      ""
    );
    perSlidingScale.optionalData = insertIntoDic(
      "isGreaterThanGive",
      false,
      perSlidingScale.optionalData,
      ""
    );
    perSlidingScale.optionalData = insertIntoDic(
      "GreaterThan1Give",
      "",
      perSlidingScale.optionalData,
      ""
    );
    perSlidingScale.optionalData = insertIntoDic(
      "GreaterThan2",
      "",
      perSlidingScale.optionalData,
      ""
    );
    return perSlidingScale;
  };

  const deleteTableRows = (index: number) => {
    const rows = [...rowsData];
    rows.splice(index, index === 0 ? rows.length - 1 : rows.length - index);
    if (index === 0) {
      setRowsData([rowInput]);
    } else {
      setRowsData(rows);
    }
    setIsBodyAddRow(false);
    setIsBodyDeleteRow(true);
    perSlidingScaleResult = getPerSlidingScale(
      index !== 0 ? rows : [rowInput],
      "rowsData",
      medication
    );
    let perSlidingScale = reset(perSlidingScaleResult);
    dispatch(
      reduxSetPerSlidingScale({
        medicationId: medication.id,
        perSlidingScale: perSlidingScale,
      })
    );
  };

  const handleOnblur = (
    index: number,
    evnt: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsBodyAddRow(false);
    setIsBodyDeleteRow(false);
    const rowInput = [...rowsData];
    rowInput[index] = {
      ...rowInput[index],
      [evnt.target.name]: evnt.target.value,
    };

    validation(evnt?.target?.name, index, rowInput);
    setRowsData(rowInput);
  };

  const handleChange = (
    index: number,
    evnt: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsBodyAddRow(true);
    const rowInput = [...rowsData];
    rowInput[index] = {
      ...rowInput[index],
      [evnt.target.name]: evnt.target.value,
    };
    if (evnt?.target?.name === "to") {
      setMaxToValue(Number(evnt?.target?.value));
    }
    validation(evnt?.target?.name, index, rowInput);
    setRowsData(rowInput);
    perSlidingScaleResult = getPerSlidingScale(
      rowInput,
      "rowsData",
      medication
    );
    let perSlidingScale = reset(perSlidingScaleResult);
    dispatch(
      reduxSetPerSlidingScale({
        medicationId: medication.id,
        perSlidingScale: perSlidingScale,
      })
    );
  };

  const fromValidation = (index: number, data: IRowData[]) => {
    if (data[index].from === "") {
      data[index].fromError = "Enter a whole number";
    } else if (Number(data[index].from) >= 800) {
      data[index].fromError = `Enter a whole number less than 800 `;
    } else {
      data[index].fromError = "";
    }

    if (Number(data[index].to) === 0) {
      data[index].toError = "";
    } else if (Number(data[index].from) - Number(data[index].to) > 0) {
      data[index].toError =
        Number(data[index].to) > 800
          ? `Enter a whole number no greater than 800`
          : `Enter a whole number between ${data[index].from} and 800 `;
    } else {
      data[index].toError = "";
    }
  };

  const toValidation = (index: number, data: IRowData[]) => {
    if (data[index].to === "") {
      data[index].toError = "Enter a whole number";
    } else if (
      Number(data[index].to) <= Number(data[index].from) ||
      Number(data[index].to) > 800
    ) {
      data[index].toError =
        Number(data[index].to) > 800
          ? `Enter a whole number no greater than 800`
          : `Enter a whole number between ${data[index].from} and 800 `;
    } else {
      data[index].toError = "";
    }
  };

  const giveValidation = (index: number, data: IRowData[]) => {
    if (data[index].give === "") {
      data[index].giveError = "Enter a whole or decimal number";
    } else if (
      Number(data[index].give) > 200 ||
      (data.length > 1 &&
        Number(data[index].give) <= Number(data[index - 1].give))
    ) {
      data[index].giveError =
        Number(data[index].give) > 200
          ? `Enter a whole or decimal number no greater than 200`
          : `Enter a whole or decimal number between ${
              data[index - 1].give
            } and 200`;
    } else {
      data[index].giveError = "";
    }
  };

  const validation = (controlName: string, index: number, data: IRowData[]) => {
    if (controlName === "from") {
      fromValidation(index, data);
    } else if (controlName === "to") {
      toValidation(index, data);
    } else if (controlName === "give") {
      giveValidation(index, data);
    }
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
        <div className="modal-header" id="slidding_header">
          {modalWidth <= 540 ? (
            <>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={onOverLayClick}
                data-dismiss="modal"
                id="backBtn"
              >
                <i className="fa-regular fa-arrow-left"></i>
                {`Back`}
              </button>
              <h4 className="modal-title mt-2">Per Sliding Scale</h4>
            </>
          ) : (
            <>
              <h4 className="modal-title">Per Sliding Scale</h4>
              <button
                type="button"
                className="close"
                onClick={onOverLayClick}
                data-dismiss="modal"
                id="backBtn"
              >
                Close Modal
              </button>
            </>
          )}
        </div>

        <div className="modal-body">
          <div className="row table-responsive-sm">
            <div
              id="slidding_body"
              style={{
                height: bodyHeight,
                overflowY: "scroll",
              }}
            >
              <div className="row ml-1">
                <label htmlFor="ifSugarIs">
                  <h4>If Blood Sugar is,</h4>
                </label>
                <input
                  className="form-control visually-hidden"
                  id="ifSugarIs"
                />
              </div>

              <SlidingScaleThreshold
                isSlidingScaleThreshold={isLessThanCall}
                setIsSlidingScaleThreshold={setIsLessThanCall}
                handleOnChanges={handleOnChanges}
                medication={medication}
                order={0}
                thresholdType="Less Than"
                actionType="Call"
                isBodyAddRow={isBodyAddRow}
                rowsData={rowsData}
                isBodyDeleteRow={isBodyDeleteRow}
                setIsBodyDeleteRow={setIsBodyDeleteRow}
              ></SlidingScaleThreshold>

              <div className="mt-4 ml-5">
                <SlidingScaleTableRows
                  rowsData={rowsData}
                  deleteTableRows={deleteTableRows}
                  handleChange={handleChange}
                  addTableRows={addTableRows}
                  fromDisabled={fromDisabled}
                  toDisabled={toDisabled}
                  giveDisabled={giveDisabled}
                  maxToValue={maxToValue}
                  handleOnblur={handleOnblur}
                />
              </div>
              <SlidingScaleThreshold
                isSlidingScaleThreshold={isGreaterThanGive}
                setIsSlidingScaleThreshold={setIsGreaterThanGive}
                handleOnChanges={handleOnChanges}
                medication={medication}
                order={1}
                thresholdType="Greater Than"
                actionType="Give"
                isBodyAddRow={isBodyAddRow}
                rowsData={rowsData}
                isBodyDeleteRow={isBodyDeleteRow}
                setIsBodyDeleteRow={setIsBodyDeleteRow}
              ></SlidingScaleThreshold>
              <SlidingScaleThreshold
                isSlidingScaleThreshold={isGreaterThanCall}
                setIsSlidingScaleThreshold={setIsGreaterThanCall}
                handleOnChanges={handleOnChanges}
                medication={medication}
                order={2}
                thresholdType="Greater Than"
                actionType="Call"
                isBodyAddRow={isBodyAddRow ?? null}
                rowsData={rowsData}
                isBodyDeleteRow={isBodyDeleteRow}
                setIsBodyDeleteRow={setIsBodyDeleteRow}
              ></SlidingScaleThreshold>
            </div>
          </div>
        </div>

        <div className="modal-footer" id="slidding_footer">
          <button
            type="button"
            id="btnConfirm"
            data-testid="confirmButton"
            className="btn btn-primary"
            onClick={onSave}
            style={modalWidth <= 540 ? { width: "45%" } : { minWidth: "60px" }}
          >
            Confirm
          </button>
          <button
            type="button"
            id="backBtn"
            data-testid="cancelButton"
            className="btn btn-cancel"
            data-dismiss="modal"
            onClick={onOverLayClick}
            onBlur={btnCloseFocus}
            style={modalWidth <= 540 ? { width: "45%" } : { minWidth: "60px" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerSlidingScaleSidebar;
