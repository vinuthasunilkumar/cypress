import React, { useState, useCallback, useEffect } from "react";
import classnames from "classnames";
import { Props } from "../types";
import { searchMedicationById } from "../../../services/MedicationService";
import MedicationInfoList from "./MedicationInfoList";

const DrugInformation = ({
  isMenuActive,
  setIsMenuActive,
  onOverLayClick,
  medicationId,
}: Props) => {
  const [medicationInfo, setMedicationInfo] = useState<IMedicationInfo>();

  useEffect(() => {
    medicationInfoById();
  }, []);

  const medicationInfoById = useCallback(async () => {
    searchMedicationById(medicationId).then((response) => {
      if (response !== undefined) {
        setMedicationInfo(response);
        setTimeout(() => {
          let btnElement = document.getElementById("backBtn");
          btnElement?.focus();
        }, 10);
      }
    });
  }, []);

  const sideMenuClasses = classnames("side-menu", {
    "side-menu-active": isMenuActive,
  });
  const sideMenuContentClasses = classnames("side-menu_content", {
    "side-menu_content-active": isMenuActive,
    "overflow-auto": isMenuActive, // new class to enable scrolling
  });

  const backClick = () => {
    setIsMenuActive(false);
    document.body.style.overflow = "visible";
  };

  if (!medicationInfo) {
    return <div></div>;
  }

  const btnElementFocus = () => {
    let btnElement = document.getElementById("backBtn");
    btnElement?.focus();
  };
  return (
    <div className={sideMenuClasses}>
      <div
        className="side-menu_overlay"
        onClick={onOverLayClick}
        data-testid="btnOverLayclick"
        aria-hidden="true"
      />
      <div className={sideMenuContentClasses} id="drugInformation">
        <div className="container no-padding-right">
          <div className="row">
            <div className="col-12 py-3">
              <button
                type="button"
                id="backBtn"
                data-testid="backBtn"
                className="btn btn-cancel"
                onClick={backClick}
              >
                Back
              </button>
            </div>
            <div className="drug-info-container">
              <div className="col-12 drug-info-content ml-1">
                <h3 className="drug-info-title">
                  <b>Drug Information</b>
                </h3>
                <h2 className="drug-description" data-testid="medDescription">
                  <b>{medicationInfo?.description}</b>
                </h2>
              </div>
            </div>
          </div>
          <div className="row mt-4 container-padding-right">
            <div className="col-4 position-relative">
              <div className="nav-tabs-wrapper ">
                <ul className="nav sticky-top">
                  <li id="sideMenu">
                    <a
                      href="#genInfoTabcontent"
                      className="nav-link active"
                      data-testid="genInfoLink"
                      id="genInfoTab"
                      data-toggle="tab"
                      role="tab"
                    >
                      General Information
                    </a>
                    <a
                      href="#indicationsTabcontent"
                      className="nav-link"
                      data-testid="indicationsLink"
                      id="indicationsTab"
                      data-toggle="tab"
                      role="tab"
                    >
                      Indications
                    </a>
                    <a
                      href="#contraindicationsTabcontent"
                      className="nav-link"
                      data-testid="contraindicationsLink"
                      id="contraindicationsTab"
                      data-toggle="tab"
                      role="tab"
                    >
                      Contraindications
                    </a>
                    <a
                      href="#sideEffectsTabcontent"
                      className="nav-link"
                      data-testid="sideEffectsLink"
                      id="sideEffectsTab"
                      data-toggle="tab"
                      role="tab"
                    >
                      Side Effects
                    </a>
                    <a
                      href="#drugDrugInteractionsTabcontent"
                      className="nav-link"
                      data-testid="drugDrugInteractionsLink"
                      id="drugDrugInteractionsTab"
                      data-toggle="tab"
                      role="tab"
                    >
                      Drug-Drug Interactions
                    </a>
                    <a
                      href="#minMaxDosingTabcontent"
                      className="nav-link"
                      data-testid="minMaxDosingLink"
                      id="minMaxDosingTab"
                      data-toggle="tab"
                      role="tab"
                    >
                      Min-Max Dosing
                    </a>
                    <a
                      href="#monographTabcontent"
                      className="nav-link"
                      data-testid="monographLink"
                      id="monographTab"
                      data-toggle="tab"
                      role="tab"
                      onBlur={btnElementFocus}
                    >
                      Monograph
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-8">
              <div className="tab-content mt-n3 ml-3">
                <div
                  className="tab-pane fade show active"
                  id="genInfoTabcontent"
                  role="tabpanel"
                  aria-labelledby="genInfoTab"
                >
                  <h3 className="section-title">General Information</h3>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-12">
                        <h4 className="subheading">Classification</h4>
                        <p
                          data-testid="therapeuticClassDescription"
                          className="description-text"
                        >
                          {medicationInfo?.therapeuticClass?.description}
                        </p>
                      </div>
                      <div className="col-12 mt-2">
                        <h4 className="subheading">Generic Name</h4>
                        <p
                          data-testid="genericmedicationDescription"
                          className="description-text"
                        >
                          {medicationInfo?.genericmedication?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="indicationsTabcontent"
                  role="tabpanel"
                  aria-labelledby="indicationsTab"
                >
                  <MedicationInfoList
                    infoType={1}
                    headerText="Indications"
                    medicationInfo={medicationInfo}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="contraindicationsTabcontent"
                  role="tabpanel"
                  aria-labelledby="contraindicationsTab"
                >
                  <MedicationInfoList
                    infoType={2}
                    headerText="Contraindications"
                    medicationInfo={medicationInfo}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="sideEffectsTabcontent"
                  role="tabpanel"
                  aria-labelledby="sideEffectsTab"
                >
                  <MedicationInfoList
                    infoType={3}
                    headerText="Side Effects"
                    medicationInfo={medicationInfo}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="drugDrugInteractionsTabcontent"
                  role="tabpanel"
                  aria-labelledby="drugDrugInteractionsTab"
                >
                  <MedicationInfoList
                    infoType={4}
                    headerText="Drug-Drug Interactions"
                    medicationInfo={medicationInfo}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="minMaxDosingTabcontent"
                  role="tabpanel"
                  aria-labelledby="minMaxDosingTab"
                >
                  <MedicationInfoList
                    infoType={6}
                    headerText="Min-Max Dosing"
                    medicationInfo={medicationInfo}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="monographTabcontent"
                  role="tabpanel"
                  aria-labelledby="monographTab"
                >
                  <h3>Monograph</h3>
                  <p>{medicationInfo?.patientMonograph}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugInformation;
