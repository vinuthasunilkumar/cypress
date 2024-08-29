import React from "react";
import { Medication } from "../../../types";
import { getCurrentItemValue } from "../../../helper/Utils";

export type PerSlidingScaleEditTemplateType = {
  statusToggleButtonObj: any;
  medication: Medication;
  editClick: () => void;
};

const PerSlidingScaleEditTemplate = ({
  statusToggleButtonObj,
  medication,
  editClick,
}: PerSlidingScaleEditTemplateType) => {
  let LessThan0 = getCurrentItemValue(
    "LessThan0",
    medication?.instructions?.perSlidingScale
  );
  let LessThan0Call = getCurrentItemValue(
    "LessThan0Call",
    medication?.instructions?.perSlidingScale
  );
  let GreaterThan1 = getCurrentItemValue(
    "GreaterThan1",
    medication?.instructions?.perSlidingScale
  );
  let GreaterThan1Give = getCurrentItemValue(
    "GreaterThan1Give",
    medication?.instructions?.perSlidingScale
  );
  let GreaterThan2 = getCurrentItemValue(
    "GreaterThan2",
    medication?.instructions?.perSlidingScale
  );
  let GreaterThan2Call = getCurrentItemValue(
    "GreaterThan2Call",
    medication?.instructions?.perSlidingScale
  );
  let errorCount = medication?.instructions?.perSlidingScale?.rowsData?.filter(
    (rowData: IRowData) =>
      rowData.from === "" || rowData.to === "" || rowData.give === ""
  )?.length;
  return (
    <>
      {errorCount === 0 &&
      statusToggleButtonObj.isToggled === true &&
      medication?.instructions?.perSlidingScale?.rowsData?.length > 0 ? (
        <div
          id="perSlidingEditPanel"
          data-testid="perSlidingEditPanel"
          className="col-md-12 mb-3"
        >
          <div className="row col-md-5 PerSlidingPanel">
            <div className="col">
              <div className="d-flex justify-content-between per-sliding-scale-edit">
                <span className="ml-n3">
                  <b>If Blood Sugar is,</b>
                </span>
                <button
                  type="button"
                  aria-label="edit"
                  id="btnEditPerSlidingScale"
                  data-testid="btnEditPerSlidingScale"
                  className="btn btn-default btn-sm"
                  style={{
                    marginRight: "-17px",
                    color: "#007bff",
                    border: "1px solid #007bff !important",
                  }}
                  onClick={editClick}
                >
                  <i className="fa fa-pencil" style={{ color: "#007bff" }}></i>
                </button>
              </div>
            </div>
          </div>
          {LessThan0 !== "" &&
          getCurrentItemValue(
            "LessThan0Call",
            medication?.instructions?.perSlidingScale
          ) !== "" ? (
            <div className="row col-md-5 PerSlidingPanel">
              <span>
                <b> Less than</b> {LessThan0} mg/dL,
                <b> Call</b> {LessThan0Call}
              </span>
            </div>
          ) : (
            <></>
          )}

          {errorCount === 0 &&
            medication?.instructions?.perSlidingScale?.rowsData.map(
              (rowData: IRowData, key: number) => {
                return (
                  <div
                    className="row col-md-5 PerSlidingPanel"
                    key={rowData.from}
                  >
                    <span>
                      <b> From</b> {rowData.from} mg/dL,
                      <b> To</b> {rowData.to} mg/dL,
                      <b> Give</b> {rowData.give} Units
                    </span>
                  </div>
                );
              }
            )}

          {GreaterThan1 !== "" && GreaterThan1Give !== "" ? (
            <div className="row col-md-5 PerSlidingPanel">
              <span>
                <b> Greater than</b> {GreaterThan1} mg/dL,
                <b> Give</b> {GreaterThan1Give} Units
              </span>
            </div>
          ) : (
            <></>
          )}

          {GreaterThan2 !== "" && GreaterThan2Call !== "" ? (
            <div className="row col-md-5 PerSlidingPanel">
              <span>
                <b> Greater than</b> {GreaterThan2} mg/dL,
                <b> Call</b> {GreaterThan2Call}
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PerSlidingScaleEditTemplate;
