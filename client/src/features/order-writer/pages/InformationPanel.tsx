import React, { useEffect, useState } from "react";
import {
  formularyIcon,
  renderDurIcon,
  renderIconCustomMeds,
} from "../../../helper/Utils";
import DrugInformation from "../../medication-search/pages/DrugInformation";
import { styles } from "../../../helper/UtilStyles";
import { Medication } from "../../../types/medicationTypes";
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { defaultMedication } from "../../../shared/constants/DefaultMedication";
import { updateBannerZIndex } from "../../../helper/Utility";
import Moment from "react-moment";
import styled from "styled-components";
import { setDoNotFill } from "../../../redux/slices/orderWriterSlice";

type InformationPanelProps = {
  description: string;
  durIcon: IPatientSafetySummary[];
  formulariesIcon: string;
  customIcon: string;
  medicationId: number;
  residentId: string;
  baseUrl: string;
  durAlerts?: IPatientSafetySummary[];
  informationPanelHeight?: string;
};

const InformationPanel = ({
  description,
  durIcon,
  formulariesIcon,
  customIcon,
  medicationId,
  residentId,
  baseUrl,
  durAlerts,
  informationPanelHeight
}: InformationPanelProps) => {
  const dispatch = useDispatch();
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [activeMedicationId, setActiveMedicationId] = useState(0);
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const { dispenseAsWritten, doNotFill, ekit, ekitDoses } = useSelector(
    (state: RootState) => {
      const med = state.orderWriter.medications.find(
        (med) => med.id === medicationId
      )?.additionalDetails;
      return {
        dispenseAsWritten: med?.dispenseAsWritten,
        doNotFill: med?.doNotFill,
        ekit: med?.ekit,
        ekitDoses: med?.ekitDoses,
      };
    }
  );

  useEffect(() => {
    updateBannerZIndex();
  }, []);

  const medication: Medication =
    (useSelector((state: RootState) =>
      state.orderWriter.medications.find((med) => med.id === medicationId)
    ) as Medication) || defaultMedication;

  const hideOverlay = () => {
    setIsMenuActive(!isMenuActive);
    document.body.style.overflow = "visible";
  };

  const handleInfoButtonClick = (medicationId: number) => {
    setActiveMedicationId(medicationId);
    setIsMenuActive(true);
    document.body.style.overflow = "hidden";
  };

  const getConditionalIcon = () => {
    if (durIcon && durIcon.length > 0) {
      return renderDurIcon(durIcon, medicationId);
    } else if (durAlerts && durAlerts.length > 0) {
      return renderDurIcon(durAlerts, medicationId);
    } else if (customIcon !== "" && customIcon !== null) {
      return renderIconCustomMeds(customIcon, medicationId);
    } else {
      return null;
    }
  };

  const makeBold = (item: string) => {
    if (item && item.replace(/ +/g, "").length === 0) {
      return;
    }
    const result: any = [];
    let items: string[] = item.split(" ");
    let boldItems = [
      "If",
      "Blood",
      "Sugar",
      "is,",
      "Less",
      "Greater",
      "From",
      "To",
      "Call",
      "Give",
      "than",
    ];
    items.map((ele, key) => {
      result.push(
        <span id={"span" + key.toString()}>
          {boldItems.includes(ele) ? <b>{ele + " "}</b> : ele + " "}
        </span>
      );
    });
    return result;
  };

  const formatSummary = (str: string) => {
    return str.replace(/ at/g, "\nat").replace(/ for/g, "\nfor");
  };

  const getInstructions = () => {
    let listOfInstruction = medication?.instructions?.instruction?.split("\n");

    return (
      <>
        {listOfInstruction?.length === 1 ? (
          <div>{listOfInstruction[0] ? listOfInstruction[0] : "-"}</div>
        ) : (
          <>
            {listOfInstruction?.map((val, key) => {
              return (
                <div id={"div" + key.toString()} key={val}>
                  {makeBold(val)}
                </div>
              );
            })}
          </>
        )}
      </>
    );
  };

  const StickysidePanelDiv = styled.div`
    background-color: #eeeeee;
    height: ${informationPanelHeight};
    overflow-y: scroll;
    transition: height 0.25s ease-in;
  `;

  return (
    <StickysidePanelDiv
      className="card sticky-top stickyside-panel"
      id="stickyside-panel"
    >
      <div className="card-body ml-n3">
        <div className="card-person-info ml-1">
          <div className="row" data-testid="icon-row">
            <div className="col-1">{getConditionalIcon()}</div>
            <div className="col-1">
              {formulariesIcon
                ? formularyIcon(formulariesIcon, medicationId)
                : null}
            </div>
          </div>
          <h2 data-testid="description-heading">
            <div className="row" data-testid="description-row">
              <div className="col-10 mt-2">
                <b data-testid="description">{description}</b>
              </div>
              <div className="col-2">
                {customIcon === "Custom" ? (
                  <></>
                ) : (
                  <i
                    className="fa far fa-info-circle mt-2"
                    style={styles.baseIcon}
                    aria-hidden="true"
                    id="info"
                    onClick={() => handleInfoButtonClick(medicationId)}
                    data-testid="btnHandleInfo"
                  ></i>
                )}
              </div>
            </div>
          </h2>
          <div className="form-group" data-testid="form-group">
            <div>
              <label
                className="mt-3"
                id="instructions"
                htmlFor="instructions-text"
              >
                Instructions
              </label>
              <div data-testid="instructions-text" id="instructions-text">
                {getInstructions()}
              </div>
            </div>
            <div>
              <label className="mt-3" id="icd-10" htmlFor="icd-10-text">
                ICD-10
              </label>
              <div data-testid="icd-10-text" id="icd-10-text">
                {medication?.instructions?.icd10Instruction
                  ? medication?.instructions?.icd10Instruction
                  : "-"}
              </div>
            </div>
            <hr />
            <div>
              <label
                id="administrationSchedule"
                htmlFor="administration-schedule-text"
              >
                Administration Schedule
              </label>
              <div
                data-testid="administration-schedule-text"
                id="administration-schedule-text"
                className="adminSummary"
              >
                {medication?.instructions?.frequencySchedule?.summary
                  ? formatSummary(
                      medication?.instructions?.frequencySchedule?.summary
                    )
                  : "-"}
              </div>
            </div>
            <br />
            <div className="row col-12">
              <div className="col-6 ml-n2">
                <label id="firstAdminDate" htmlFor="first-admin-date-time">
                  First Admin Date & Time
                </label>
                <div
                  data-testid="first-admin-date-time"
                  id="first-admin-date-time"
                >
                  {medication?.instructions?.formattedStartDate ? (
                    <Moment format="MM/DD/yyyy hh:mm A">
                      {medication?.instructions?.formattedStartDate}
                    </Moment>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="col-6">
                <label
                  id="calculatedLastAdminDateTime"
                  htmlFor="calculated-last-admin-datetime"
                >
                  Calculated Last Admin Date & Time
                </label>
                <div
                  data-testid="calculated-last-admin-datetime"
                  id="calculated-last-admin-datetime"
                >
                  {medication?.instructions?.formattedEndDate ? (
                    <Moment format="MM/DD/yyyy hh:mm A">
                      {medication?.instructions?.formattedEndDate}
                    </Moment>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <hr />
            <div className="row col-12">
              <div className="col-6 ml-n2">
                <label id="orderBy" htmlFor="order-by-text">
                  Order By
                </label>
                <div data-testid="order-by-text" id="order-by-text">
                  {medication?.instructions?.selectedOrderBy?.name
                    ? medication?.instructions?.selectedOrderBy?.name
                    : "-"}
                </div>
              </div>
              <div className="col-6">
                <label id="orderSource" htmlFor="order-source-text">
                  Order Source
                </label>
                <div data-testid="order-source-text" id="order-source-text">
                  {medication?.instructions?.orderSource
                    ? medication?.instructions?.orderSource
                    : "-"}
                </div>
              </div>
            </div>
            <hr />
            <div className="col-12">
              <label id="additionalDetail" htmlFor="additional-source-detail">
                Additional Detail
              </label>
              <div
                id="additional-detail-text"
                data-test-id="additional-detail-text"
              >
                {hostContext.providerName
                  ? `Pharmacy - ${hostContext.providerName},`
                  : ""}{" "}
                {dispenseAsWritten ? "Dispense As Written," : ""}{" "}
                {doNotFill ? "Do not fill," : ""}{" "}
                {ekit && ekitDoses && ekitDoses >= 1
                  ? ` ${ekitDoses} doses taken from ekit.`
                  : ""}
              </div>
            </div>
          </div>
        </div>
        {isMenuActive === true ? (
          <DrugInformation
            isMenuActive={isMenuActive}
            setIsMenuActive={setIsMenuActive}
            onOverLayClick={hideOverlay}
            medicationId={activeMedicationId}
            data-testid="drug-information"
          />
        ) : (
          <></>
        )}
      </div>
    </StickysidePanelDiv>
  );
};

export default InformationPanel;
