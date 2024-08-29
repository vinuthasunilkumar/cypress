import React, { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setDispenseAsWritten,
  setDoNotFill,
  setEkit,
  setEkitDoses,
  setPharmacyNotes,
} from "../../../redux/slices/orderWriterSlice";

type AdditionalDetailProps = {
  medicationId: number;
  stockMedicationFlag?: string | null;
};

const AdditionalDetail = ({ medicationId, stockMedicationFlag }: AdditionalDetailProps) => {
  const dispatch = useDispatch();
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const { dispenseAsWritten, doNotFill, ekit, ekitDoses, pharmacyNotes } =
    useSelector((state: RootState) => {
      const med = state.orderWriter.medications.find(
        (med) => med.id === medicationId
      )?.additionalDetails;
      const medDetails = state.orderWriter.medications.find(
        (med) => med.id === medicationId
      );
      return {
        dispenseAsWritten: med?.dispenseAsWritten,
        doNotFill: stockMedicationFlag?.toLowerCase() === "stock" && medDetails?.id === medicationId ? true : med?.doNotFill,
        ekit: med?.ekit,
        ekitDoses: med?.ekitDoses || "",
        pharmacyNotes: med?.pharmacyNotes || "",
      };
    });

  const [localEkitDoses, setLocalEkitDoses] = useState(
    ekitDoses === 0 ? "" : ekitDoses.toString()
  );

  useEffect(() => {
    setLocalEkitDoses(ekitDoses === 0 ? "" : ekitDoses.toString());
  }, [ekitDoses]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const name = target.name;
    const value = target.value;
    const type = target.type;
    const checked =
      target.type === "checkbox" ? (target as HTMLInputElement).checked : false;
    let eKitDoseValue = parseInt(value, 10);

    if (type === "number" && value.trim() !== "") {
      const numberValue = parseFloat(value);
      if (numberValue % 1 !== 0) {
        return;
      }
    }

    switch (name) {
      case "dispense":
        dispatch(
          setDispenseAsWritten({ medicationId, dispenseAsWritten: checked })
        );
        break;
      case "fill":
        dispatch(setDoNotFill({ medicationId, doNotFill: checked }));
        break;
      case "ekit":
        dispatch(setEkit({ medicationId, ekit: checked }));
        if (!checked) {
          dispatch(setEkitDoses({ medicationId, ekitDoses: 0 }));
          setLocalEkitDoses("");
        }
        break;
      case "ekitValue":
        if (value === "" || (eKitDoseValue >= 1 && eKitDoseValue <= 99)) {
          setLocalEkitDoses(value);
          if (eKitDoseValue >= 1 && eKitDoseValue <= 99) {
            dispatch(setEkitDoses({ medicationId, ekitDoses: eKitDoseValue }));
          } else {
            dispatch(setEkitDoses({ medicationId, ekitDoses: 0 }));
          }
        }
        break;
      case "pharmacyNotes":
        dispatch(setPharmacyNotes({ medicationId, pharmacyNotes: value }));
        break;
    }
  };

  return (
    <div className="form-group mt-2">
      <label
        id="instructions2"
        style={{ fontSize: "20px" }}
        htmlFor="txtAdditionalDetail"
      >
        Additional Detail
      </label>
      <input className="visually-hidden" id="txtAdditionalDetail" />

      <div className="card">
        <div className="card-body ml-n1">
          <div className="card col-md-10" style={{ height: "60px" }}>
            <div className="card-body mt-n3 ml-n3">
              <div className="form-group">
                <label id="pharmacy" htmlFor="pharmacyInput">
                  Pharmacy
                </label>
                <p id="pharmacyInput">{hostContext.providerName}</p>
              </div>
            </div>
          </div>

          <div className="row col-md-12">
            <div className="col-md-3 ml-n2">
              <div className="form-check  mt-4">
                <input
                  className="form-check-input"
                  id="option1stacked"
                  type="checkbox"
                  name="dispense"
                  checked={!!dispenseAsWritten}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label"
                  id="dispense"
                  htmlFor="option1stacked"
                >
                  Dispense As Written?
                </label>
              </div>
            </div>
            <div className="col-md-3 ">
              <div className="form-check  mt-4">
                <input
                  className="form-check-input"
                  id="option2stacked"
                  type="checkbox"
                  name="fill"
                  checked={!!doNotFill}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label"
                  id="fill"
                  htmlFor="option2stacked"
                >
                  Do Not Fill
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-12 ml-n1 mt-4">
            <div
              className="form-group mb-0 assigned-to-box"
              style={{ height: "90px", padding: "5px" }}
            >
              <div className="row col-md-12">
                <div className="col-md-1 text-center mt-4 ml-n3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="option3stacked"
                      type="checkbox"
                      name="ekit"
                      checked={!!ekit}
                      onChange={handleChange}
                      data-testid="ekitChkBox"
                    />
                    <label
                      className="form-check-label"
                      id="ekit"
                      htmlFor="option3stacked"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      e-Kit
                    </label>
                  </div>
                </div>
                <div className="form-group input-required col-md-8">
                  <label htmlFor="ekitValue">
                    Number of doses taken from e-Kit
                  </label>
                  <input
                    type="number"
                    className="form-control ml-1"
                    style={{ maxWidth: "127px" }}
                    id="ekitValue"
                    min={1}
                    max={99}
                    disabled={!ekit}
                    value={localEkitDoses}
                    name="ekitValue"
                    onChange={handleChange}
                  />
                  <div
                    className="ml-1"
                    style={{
                      color: "grey",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    Range 1 to 99 and should not contain decimal values
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 ml-n1">
              <div className="form-group mt-4">
                <label
                  className="col-form-label ml-n1"
                  id="additionalDetail"
                  htmlFor="txtAreaCount"
                >
                  Pharmacy Notes
                </label>
                <div>
                  <textarea
                    id="txtAreaCount"
                    data-testid="txtCount"
                    name="pharmacyNotes"
                    className="char-remaining-wrapper form-control"
                    onChange={handleChange}
                    value={pharmacyNotes}
                    maxLength={400}
                  ></textarea>
                  <aside className="float-right">
                    {pharmacyNotes.length}
                    /400
                  </aside>
                  <span className="" style={{ color: "grey" }}>
                    These are notes to pharmacist and not meant for SIG details.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetail;
