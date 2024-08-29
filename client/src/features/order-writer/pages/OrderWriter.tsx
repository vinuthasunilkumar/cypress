import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sortDurAlertArray } from "../../../helper/Utils";
import InformationPanel from "./InformationPanel";
import NavigationPanel from "./NavigationPanel";
import Buttons from "./Buttons";
import Instructions from "./Instructions";
import DurAcknowledgement from "./DurAcknowledgement";
import Diagnosis from "./Diagnosis";
import AdminstrationTasks from "./AdminstrationTasks";
import AdditionalDetail from "./AdditionalDetail";
import { getPatientSafetyAlerts } from "../../../services/MedicationService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  addMedication,
  resetMedications,
} from "../../../redux/slices/orderWriterSlice";
import {
  getDivHeight,
  getWindowScrollPercentage,
} from "../../../helper/Utility";

const OrderWriter = () => {
  const { state } = useLocation();
  const [durAlerts, setDurAlerts] = useState<IPatientSafetySummary[]>([]);
  const isStandalone = !!(
    !state?.orderWriterInput?.hostContext ||
    state?.orderWriterInput?.hostContext?.remoteMfeUrl === ""
  );
  const dispatch = useDispatch();
  const currentMedications = useSelector(
    (state: RootState) => state.orderWriter.medications
  );
  const [activeStep, setActiveStep] = useState(0);

  const inputResult: IOrderWriterInput = state.orderWriterInput;
  const strippedBaseUrl = inputResult?.hostContext?.baseUrl?.replace(
    /^https?:\/\//,
    ""
  );
  inputResult.hostContext.baseUrl = strippedBaseUrl;
  const ectConfigId = inputResult?.hostContext?.ectConfigId;
  const navigate = useNavigate();
  const hasRunRef = useRef(false);
  const [informationPanelHeight, setInformationPanelHeight] =
    useState<string>("0vh");

  useEffect(() => {
    const allParamsPopulated =
      inputResult.medicationId &&
      strippedBaseUrl &&
      inputResult.hostContext.residentId;

    if (allParamsPopulated && !hasRunRef.current) {
      const isMedicationAdded = currentMedications.some(
        (med) => med.id === inputResult.medicationId
      );

      if (!isMedicationAdded) {
        dispatch(
          addMedication({
            description: inputResult.description,
            id: inputResult.medicationId,
          })
        );
      }

      getPatientSafetyAlerts(
        inputResult.medicationId?.toString(),
        strippedBaseUrl,
        ectConfigId,
        inputResult.hostContext.residentId
      ).then((data) => {
        if (data?.patientSafetyAlertsV1Dto?.alerts) {
          setDurAlerts(sortDurAlertArray(data.patientSafetyAlertsV1Dto.alerts));
        }
      });
    }
  }, [
    inputResult.medicationId,
    inputResult.hostContext.residentId,
    strippedBaseUrl,
  ]);

  let pbextend = document.querySelector<HTMLElement>(".pbextend");
  let pbcontainer = document.querySelector<HTMLElement>(".pbcontainer");

  const NavigationPanelTopHeight = () => {
    let stickyLeftPanel: any = document.getElementsByClassName(
      "stickynavigation-panel"
    )[0];
    if (pbcontainer?.classList.contains("extended")) {
      let bannerExtendedHeight: any = document.querySelector(
        ".pbcontainer.extended .pb"
      )?.clientHeight;
      if (stickyLeftPanel !== undefined && stickyLeftPanel !== null) {
        stickyLeftPanel.style.top = bannerExtendedHeight + "px";
      }
    } else if (pbcontainer?.classList.contains("pinned")) {
      let bannerPinnedHeight: any = document.querySelector(
        ".pbcontainer.pinned .pb"
      )?.clientHeight;
      if (stickyLeftPanel !== undefined && stickyLeftPanel !== null) {
        stickyLeftPanel.style.top = bannerPinnedHeight + "px";
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      NavigationPanelTopHeight();
    });

    pbextend?.addEventListener("click", function () {
      setTimeout(function () {
        NavigationPanelTopHeight();
      });
    });
  }, []);

  const SidePanelTopHeight = () => {
    let scrollPercent = getWindowScrollPercentage();
    let footerHeight = getDivHeight("footer", "class");
    let calculateBodyHeight = "";
    let stickyNavigationPanel: any =
      document.getElementsByClassName("stickyside-panel")[0];
    if (pbcontainer?.classList.contains("extended")) {
      let bannerExtendedHeight: any = document.querySelector(
        ".pbcontainer.extended .pb"
      )?.clientHeight;
      if (
        stickyNavigationPanel !== undefined &&
        stickyNavigationPanel !== null
      ) {
        stickyNavigationPanel.style.top = bannerExtendedHeight + 12 + "px";
        calculateBodyHeight =
          scrollPercent <= 94
            ? window.innerHeight -
              bannerExtendedHeight -
              footerHeight +
              38 +
              "px"
            : window.innerHeight -
              bannerExtendedHeight -
              footerHeight -
              30 +
              "px";
      }
    } else if (pbcontainer?.classList.contains("pinned")) {
      let bannerPinnedHeight: any = document.querySelector(
        ".pbcontainer.pinned .pb"
      )?.clientHeight;
      if (
        stickyNavigationPanel !== undefined &&
        stickyNavigationPanel !== null
      ) {
        stickyNavigationPanel.style.top = bannerPinnedHeight + 12 + "px";
        calculateBodyHeight =
          scrollPercent <= 90
            ? window.innerHeight - bannerPinnedHeight - footerHeight + 38 + "px"
            : window.innerHeight -
              bannerPinnedHeight -
              footerHeight -
              30 +
              "px";
      }
    }
    setInformationPanelHeight(calculateBodyHeight);
  };

  useEffect(() => {
    SidePanelTopHeight();
    window.addEventListener("scroll", () => {
      SidePanelTopHeight();
    });

    pbextend?.addEventListener("click", function () {
      setTimeout(function () {
        SidePanelTopHeight();
      });
    });
  }, []);

  const handleClick = (event: any) => {
    // save information
  };

  const handleNext = (increment: number) => {
    renderComponent(increment);
    setActiveStep(increment);
  };

  const handleBack = (decrement: number) => {
    renderComponent(decrement);
    setActiveStep(decrement);
  };

  const renderComponent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <div className="form-group">
            <div className="d-flex align-items-center">
              <span className="required-field"></span>
              <h2
                id="orderDetails1"
                data-testid="orderDetails1"
                className="mb-0"
                style={{ display: "inline" }}
              >
                Order Details
              </h2>
            </div>

            <div className="card instruction-panel mt-2">
              <div className="card-body instructionSection">
                <Instructions
                  medicationId={inputResult.medicationId}
                  isStandalone={isStandalone}
                  prescriberId={Number(
                    inputResult.hostContext.urlParameters.prescriberId || 0
                  )}
                />
                {durAlerts !== null && durAlerts.length > 0 ? (
                  <DurAcknowledgement
                    durAlerts={durAlerts}
                    medicationId={inputResult.medicationId}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <Diagnosis
            hostContext={inputResult.hostContext}
            medicationId={inputResult.medicationId}
          />
        );
      case 2:
        return <AdminstrationTasks />;
      case 3:
        return <AdditionalDetail medicationId={inputResult.medicationId} stockMedicationFlag={inputResult.stockMedicationFlag!} />;
      default:
        return <></>;
    }
  };

  const cancelBtnClick = () => {
    navigate(`${inputResult.basePath}/medication-search`);
    dispatch(resetMedications());
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 mt-3">
          <h1>New Order</h1>
        </div>
      </div>
      <div>
        <Buttons
          handleClick={handleClick}
          nextClick={() => handleNext(activeStep + 1)}
          prevClick={() => handleBack(activeStep - 1)}
          cancelBtnClick={cancelBtnClick}
          index={activeStep}
        />
      </div>
      <hr />
      <div className="row col-12 position-relative">
        <div className="col-md-3 col-sm-12 ml-n3 ">
          <InformationPanel
            description={inputResult.description}
            durIcon={inputResult.durIcon}
            customIcon={inputResult.customIcon}
            formulariesIcon={inputResult.formularyIcon}
            medicationId={inputResult.medicationId}
            residentId={inputResult.hostContext.residentId}
            baseUrl={strippedBaseUrl}
            durAlerts={durAlerts}
            informationPanelHeight={informationPanelHeight}
          />
        </div>
        <div className="col-md-9 col-sm-12 ml-3 position-relative">
          <NavigationPanel
            activeIndex={activeStep}
            nextStep={handleNext}
            prevStep={handleBack}
          />
          {renderComponent(activeStep)}

          <div>
            <Buttons
              handleClick={handleClick}
              nextClick={() => handleNext(activeStep + 1)}
              prevClick={() => handleBack(activeStep - 1)}
              cancelBtnClick={cancelBtnClick}
              index={activeStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderWriter;
