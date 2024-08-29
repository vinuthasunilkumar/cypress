import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setCommonOverrideReason as reduxSetCommonOverrideReason } from "../../../redux/slices/orderWriterSlice";
import { Medication } from "../../../types/medicationTypes";
import { defaultMedication } from "../../../shared/constants/DefaultMedication";

type DurAcknowledgementProps = {
  durAlerts: IPatientSafetySummary[];
  medicationId: number;
};

type Severity = "Contraindicated" | "Severe" | "Moderate" | "Informational";

const DurAcknowledgement = ({
  durAlerts,
  medicationId,
}: DurAcknowledgementProps) => {
  const dispatch = useDispatch();
  const severitiesOrder: Severity[] = [
    "Contraindicated",
    "Severe",
    "Moderate",
    "Informational",
  ];

  const medication: Medication =
    useSelector((state: RootState) =>
      state.orderWriter.medications.find((med) => med.id === medicationId)
    ) || defaultMedication;

  const [activeSeverity, setActiveSeverity] = useState<Severity>(
    severitiesOrder[0]
  );
  const [showTextarea, setShowTextarea] = useState(
    medication?.instructions?.commonOverrideReason === "other"
  );
  const [selectedOption, setSelectedOption] = useState(
    medication?.instructions?.commonOverrideReason || ""
  );
  const [otherReasonText, setOtherReasonText] = useState(
    medication?.instructions?.otherReasonText || ""
  );

  const countBySeverity: { [key in Severity]: number } = {
    Contraindicated: 0,
    Severe: 0,
    Moderate: 0,
    Informational: 0,
  };

  durAlerts.forEach((alert) => {
    if (alert.severity in countBySeverity) {
      countBySeverity[alert.severity as Severity]++;
    } else {
      countBySeverity["Informational"]++;
    }
  });

  const handleOverrideReasonChange = (
    selectedOption: string,
    otherReason: string
  ) => {
    const payload = {
      medicationId: medicationId,
      commonOverrideReason: selectedOption,
      otherReasonText: otherReason,
    };

    if (selectedOption === "Other") {
      payload.otherReasonText = otherReason;
    }

    dispatch(reduxSetCommonOverrideReason(payload));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if (selectedValue === "other") {
      setShowTextarea(true);
    } else {
      setShowTextarea(false);
    }

    handleOverrideReasonChange(
      selectedValue,
      selectedValue === "other" ? otherReasonText : ""
    );
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setOtherReasonText(value);
    handleOverrideReasonChange(selectedOption, value);
  };

  const getBadgeClass = (severity: Severity): string => {
    switch (severity) {
      case "Contraindicated":
        return "badge-danger";
      case "Severe":
        return "badge-warning";
      case "Moderate":
        return "badge-success";
      case "Informational":
      default:
        return "badge-primary";
    }
  };

  const getSeverityLabel = (severity: Severity): string => {
    if (severity === "Contraindicated") return "Contraindication";
    return severity;
  };

  const renderTabContent = (severity: Severity) => {
    let effectiveSeverity = severity;

    if (!["Contraindicated", "Severe", "Moderate"].includes(severity)) {
      effectiveSeverity = "Informational";
    }

    const alertsOfSeverity = durAlerts.filter(
      (alert) =>
        (effectiveSeverity === "Informational" &&
          !["Contraindicated", "Severe", "Moderate"].includes(
            alert.severity
          )) ||
        alert.severity === effectiveSeverity
    );

    return alertsOfSeverity.map((alert, index) => (
      <div
        key={alert.severity + index}
        className={`tab-pane fade ${
          effectiveSeverity === activeSeverity ? "show active" : ""
        } alert-container`}
        id={`tab${severitiesOrder.indexOf(effectiveSeverity) + 1}content`}
        role="tabpanel"
        aria-labelledby={`tab${severitiesOrder.indexOf(effectiveSeverity) + 1}`}
        data-testid={`alert-container-${effectiveSeverity.toLowerCase()}-${index}`}
      >
        <div
          className="row"
          data-testid={`alert-row-${effectiveSeverity.toLowerCase()}-${index}`}
        >
          <div
            className="col-md-4 col-sm-12"
            data-testid={`alert-type-col-${effectiveSeverity.toLowerCase()}-${index}`}
            
          >
            <h4 id="alertType">Alert Type</h4>
            <textarea
              className="custom-text-area"
              rows={1}
              value={alert.type}
              readOnly
              aria-labelledby="alertType"
              data-testid={`alert-type-textarea-${effectiveSeverity.toLowerCase()}-${index}`}
            ></textarea>
          </div>
          <div
            className="col-md-8 col-sm-12"
            data-testid={`alert-description-col-${effectiveSeverity.toLowerCase()}-${index}`}
          >
            <h4 id="alertDescription">Alert Description</h4>
            <textarea
              ref={(el) => el && (el.style.height = el.scrollHeight + "px")}
              className="custom-text-area"
              value={alert.summaryText}
              readOnly
              aria-labelledby="alertDescription"
              data-testid={`alert-description-textarea-${effectiveSeverity.toLowerCase()}-${index}`}
            ></textarea>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div
        className="form-group mt-3 ml-2"
        data-testid="dur-acknowledgement-group"
      >
        <label
          id="durAcknowledgement"
          style={{ fontSize: "20px" }}
          data-testid="dur-acknowledgement-label"
          htmlFor="txtdurAcknowledgement"
        >
          DUR Acknowledgement
        </label>
        <input className="visually-hidden" id="txtdurAcknowledgement" />
      </div>
      <div className="row" data-testid="severity-tabs-row">
        <div className="col-sm-12 ml-1" data-testid="severity-tabs-col">
          <div
            className="nav-tabs-wrapper nav-tabs-bordered"
            data-testid="nav-tabs-wrapper"
          >
            <ul
              className="nav nav-tabs"
              id="myTabs"
              role="tablist"
              data-testid="nav-tabs"
            >
              {severitiesOrder.map((severity, index) => (
                <li
                  key={severity + index}
                  className="nav-item"
                  data-testid={`nav-item-${severity.toLowerCase()}`}
                >
                  <a
                    href={`#tab${index + 1}content`}
                    className={`nav-link ${
                      severity === activeSeverity ? "active" : ""
                    }`}
                    id={`tab${index + 1}`}
                    data-toggle="tab"
                    role="tab"
                    aria-controls={`tab${index + 1}content`}
                    aria-selected={severity === activeSeverity}
                    onClick={() => setActiveSeverity(severity)}
                    data-testid={`tab-link-${severity.toLowerCase()}`}
                  >
                    {getSeverityLabel(severity)} &nbsp;
                    <span
                      className={`badge ${getBadgeClass(severity)}`}
                      data-testid={`badge-${severity.toLowerCase()}`}
                    >
                      {countBySeverity[severity]}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div
              className="tab-content"
              id="navTabContent"
              data-testid="tab-content"
            >
              {severitiesOrder.map((severity) => renderTabContent(severity))}
            </div>
          </div>
        </div>
      </div>
      <div className="row col-12" data-testid="override-reason-row">
        <div className="col-md-8" data-testid="override-reason-col">
          <div
            className="form-group input-required mt-3"
            data-testid="override-reason-group"
          >
            <label
              id="commonOverrideReason"
              data-testid="override-reason-label"
              htmlFor="override-reason-select"
            >
              Common Override Reason
            </label>
 
            <select
              className="form-control"
              onChange={handleSelectChange}
              value={selectedOption}
              data-testid="override-reason-select"
              id="override-reason-select"
            >
              <option value="" disabled selected>
                Select an option
              </option>
              <option value="prescriber_aware">
                Prescriber is aware of this potential risk, the resident's
                condition will be monitored
              </option>
              <option value="previous_use">
                The resident previously used this medication for this condition
              </option>
              <option value="greater_benefit">
                The benefits of the medication are greater than the risks for
                the resident
              </option>
              <option value="dosage_consideration">
                This clinical risk has been considered in the dosage of this
                medication
              </option>
              <option value="unable_acknowledgement">
                Unable to obtain acknowledgement from the prescriber
              </option>
              <option value="other">Other</option>
            </select>
            {showTextarea && (
              <textarea
                placeholder="Enter Reason"
                className="mt-3 form-control"
                onChange={handleTextareaChange}
                onBlur={() =>
                  handleOverrideReasonChange(selectedOption, otherReasonText)
                }
                value={otherReasonText}
                data-testid="override-reason-textarea"
              ></textarea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DurAcknowledgement;
