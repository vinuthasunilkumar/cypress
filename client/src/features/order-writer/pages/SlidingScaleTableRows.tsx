import React from "react";
import { styles } from "../../../helper/UtilStyles";
import { SlidingScaleTableRowType } from "../types";
import { preventMinus, preventPasteNegative } from "../../../helper/Utils";

const SlidingScaleTableRows = ({
  rowsData,
  deleteTableRows,
  addTableRows,
  handleChange,
  fromDisabled,
  toDisabled,
  giveDisabled,
  maxToValue,
  handleOnblur,
}: SlidingScaleTableRowType) => {
  let isSinglerow: boolean = rowsData.length === 1;
  let count = 0;
  let isGiveToMaxValue = false;
  rowsData.forEach((row: any) => {
    if (Number(row.give) >= 200 || Number(row.to) >= 799) {
      isGiveToMaxValue = true;
    }
  });

  const getButtonMargin = (index: number) => {
    if (index === 0) {
      return "2px";
    } else {
      return "-6px";
    }
  };

  const getInputDisabled = (inputControlName: string, index: number) => {
    if (inputControlName === "from") {
      return isSinglerow ? false : fromDisabled;
    } else if (inputControlName === "to") {
      return rowsData.length - 1 !== index ? toDisabled : false;
    } else if (inputControlName === "give") {
      return rowsData.length - 1 !== index ? giveDisabled : false;
    }
  };

  return rowsData.map((data: IRowData, index: number) => {
    const { from, to, give, fromError, toError, giveError } = data;
    count = count + 1;
    return (
      <div key={"row" + count} className="row mt-2">
        <div className="col-3 mt-n1 my-n1">
          <div className="form-group mt-n4 my-n0">
            <label htmlFor={`from${index}`}>{index === 0 ? "From" : ""}</label>
            <div className={`input-group ${fromError ? "has-error" : ""}`}>
              <input
                type="number"
                id={`from${index}`}
                data-testid={`from${index}`}
                autoComplete="off"
                max={800}
                className="form-control"
                onChange={(evnt: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, evnt)
                }
                onBlur={(evnt: React.ChangeEvent<HTMLInputElement>) =>
                  handleOnblur(index, evnt)
                }
                name="from"
                value={from}
                disabled={getInputDisabled("from", index)}
                onPaste={preventPasteNegative}
                onKeyDown={(e) => preventMinus(e, false)}
                min={0}
                step={1}
              />
              <div className="input-group-append text-control">
                <span
                  className="input-group-text border-group-text"
                  id={`from${index}`}
                >
                  mg/dL
                </span>
              </div>
            </div>
            <div
              className="d-flex invalid-feedback mt-1"
              data-testid={`from${index}error`}
            >
              {fromError}
            </div>
          </div>
        </div>
        <div className="col-3 mt-n1 my-n1">
          <div className="form-group mt-n4 my-n0">
            <label htmlFor={`to${index}`}>{index === 0 ? "To" : ""}</label>
            <div className={`input-group ${toError ? "has-error" : ""}`}>
              <input
                type="number"
                id={`to${index}`}
                data-testid={`to${index}`}
                autoComplete="off"
                max={800}
                className="form-control"
                onChange={(evnt: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, evnt)
                }
                onBlur={(evnt: React.ChangeEvent<HTMLInputElement>) =>
                  handleOnblur(index, evnt)
                }
                name="to"
                value={to}
                disabled={getInputDisabled("to", index)}
                onPaste={preventPasteNegative}
                onKeyDown={(e) => preventMinus(e, false)}
                min={0}
                step={1}
                autoFocus={isSinglerow !== true}
              />
              <div className="input-group-append text-control">
                <span
                  className="input-group-text border-group-text"
                  id={`to${index}`}
                >
                  mg/dL
                </span>
              </div>
            </div>
            <div
              className="d-flex invalid-feedback mt-1"
              data-testid={`to${index}error`}
            >
              {toError}
            </div>
          </div>
        </div>
        <div className="col-0 mt-1">
          <i className="fa-regular fa-arrow-right"></i>
        </div>
        <div className="col-3 mt-n1 my-n1">
          <div className="form-group mt-n4 my-n0">
            <label htmlFor={`give${index}`}>{index === 0 ? "Give" : ""}</label>
            <div className={`input-group ${giveError ? "has-error" : ""}`}>
              <input
                type="number"
                id={`give${index}`}
                data-testid={`give${index}`}
                autoComplete="off"
                max={200}
                className={"form-control"}
                onChange={(evnt: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, evnt)
                }
                onBlur={(evnt: React.ChangeEvent<HTMLInputElement>) =>
                  handleOnblur(index, evnt)
                }
                name="give"
                value={give}
                disabled={getInputDisabled("give", index)}
                onPaste={preventPasteNegative}
                onKeyDown={preventMinus}
                min={0}
                step={1}
              />
              <div className="input-group-append text-control">
                <span
                  className="input-group-text border-group-text"
                  id={`give${index}`}
                >
                  Units
                </span>
              </div>
            </div>
            <div
              className="d-flex invalid-feedback mt-1"
              data-testid={`give${index}error`}
            >
              {giveError}
            </div>
          </div>
        </div>
        <div className="col-2 mt-n0">
          <div className="row">
            {rowsData.length - 1 !== index ? (
              <>
                <div className="col-6">
                  <button
                    type="button"
                    style={{
                      marginTop: getButtonMargin(index),
                      backgroundColor: "white",
                      border: "1px solid red",
                    }}
                    aria-label="delete"
                    className="btn btn-default btn-table-row"
                    onClick={() => deleteTableRows(index)}
                    id="btnDelete"
                    data-testid="btnDelete"
                  >
                    <i
                      className="fa-regular fa-trash-can"
                      style={styles.remove_button}
                    ></i>
                  </button>
                </div>
                <div className="col-6"></div>
              </>
            ) : (
              <>
                <div
                  className="col-6"
                  hidden={
                    isGiveToMaxValue ||
                    !(rowsData.length < 10 || maxToValue > 800)
                  }
                >
                  {rowsData.length < 10 || maxToValue > 800 ? (
                    <button
                      type="button"
                      style={{
                        marginTop: getButtonMargin(index),
                        backgroundColor: "white",
                      }}
                      aria-label="add"
                      className="btn btn-default btn-table-row"
                      onClick={addTableRows}
                      id="btnAdd"
                      data-testid="btnAdd"
                    >
                      <i
                        className="fa-light fa-plus"
                        style={styles.add_button}
                      ></i>
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-6">
                  {rowsData.length > 1 ? (
                    <button
                      type="button"
                      style={{
                        marginTop: getButtonMargin(index),
                        backgroundColor: "white",
                        border: "1px solid red",
                      }}
                      aria-label="delete"
                      className="btn btn-default btn-table-row"
                      onClick={() => deleteTableRows(index)}
                      id="btnDelete"
                      data-testid="btnDelete"
                    >
                      <i
                        className="fa-regular fa-trash-can"
                        style={styles.remove_button}
                      ></i>
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  });
};
export default SlidingScaleTableRows;
