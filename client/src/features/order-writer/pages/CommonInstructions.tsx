import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import frequencyData from "../../../assets/static-files/Frequency.json";
import measureData from "../../../assets/static-files/Measure.json";
import { getCommonInstruction, handleDispatch } from "../../../helper/Utils";
import {
  setDefaultSig as reduxSetDefaultSig,
  setDosage as reduxSetDosage,
  setSelectedLocation as reduxSetSelectedLocation,
  setSelectedIndication as reduxSetSelectedIndication,
  setNotes as reduxSetNotes,
  setDuration as reduxSetDuration,
  setInstruction as reduxSetInstruction,
  setPRN as reduxSetPRN,
  setSelectedDurationType as reduxSetSelectedDurationType,
  setSelectedFrequency as reduxSetSelectedFrequency,
  setSelectedMeasure as reduxSetSelectedMeasure,
  setSelectedMethod as reduxSetSelectedMethod,
  setSelectedRoute as reduxSetSelectedRoute,
} from "../../../redux/slices/orderWriterSlice";
import { RootState } from "../../../redux/store";
import { defaultMedication } from "../../../shared/constants/DefaultMedication";
import { Medication } from "../../../types/medicationTypes";
import ListGroup from "react-bootstrap/ListGroup";

const CommonInstructions = ({
  medicationId,
  sigInfos,
}: {
  medicationId: number;
  sigInfos: ICommonInstruction[];
}) => {
  const dispatch = useDispatch();

  const medication: Medication =
    (useSelector((state: RootState) =>
      state.orderWriter.medications.find((med) => med.id === medicationId)
    ) as Medication) || defaultMedication;

  const quickLinks = (commonInstruction: ICommonInstruction) => {
    let structured = commonInstruction.structured;

    handleDispatch(
      dispatch,
      medication.id,
      reduxSetSelectedMethod,
      "selectedMethod",
      structured?.methodCode === undefined
        ? ""
        : {
            abbreviation: structured?.methodCode,
          }
    );

    handleDispatch(
      dispatch,
      medication.id,
      reduxSetSelectedRoute,
      "selectedRoute",
      structured?.routeCode === undefined
        ? ""
        : {
            abbreviation: structured?.routeCode,
          }
    );

    handleDispatch(
      dispatch,
      medication.id,
      reduxSetDosage,
      "dosage",
      structured?.dose?.primary?.value === undefined
        ? ""
        : structured?.dose?.primary?.value
    );

    let measureCode = measureData.find(
      (measure) =>
        measure.shortAbbreviation === structured?.dose?.primary?.measureCode
    )?.abbreviation;
    handleDispatch(
      dispatch,
      medication.id,
      reduxSetSelectedMeasure,
      "selectedMeasure",
      measureCode === ""
        ? undefined
        : {
            abbreviation: measureCode ?? "",
          }
    );

    let frequency = frequencyData.find(
      (frequency) => frequency.shortAbbreviation === structured?.frequencyCode
    );
    handleDispatch(
      dispatch,
      medication.id,
      reduxSetSelectedFrequency,
      "selectedFrequency",
      frequency?.abbreviation === undefined ? "" : frequency
    );

    handleDispatch(
      dispatch,
      medication.id,
      reduxSetDuration,
      "duration",
      structured?.duration?.value === undefined
        ? ""
        : structured?.duration?.value
    );
    handleDispatch(
      dispatch,
      medication.id,
      reduxSetSelectedDurationType,
      "selectedDurationType",
      structured?.duration?.type?.description === undefined
        ? ""
        : {
            abbreviation: structured?.duration?.type?.description,
          }
    );
    handleDispatch(
      dispatch,
      medication.id,
      reduxSetPRN,
      "checkedPRN",
      structured?.isPRN
    );

    handleDispatch(
      dispatch,
      medication.id,
      reduxSetSelectedLocation,
      "selectedLocation",
      ""
    );

    handleDispatch(
      dispatch,
      medication.id,
      reduxSetSelectedIndication,
      "selectedIndication",
      ""
    );

    handleDispatch(dispatch, medication.id, reduxSetNotes, "notes", "");

    let defaultSig: IStructured = {
      frequencyCode: frequency?.abbreviation ?? "",
      methodCode: structured?.methodCode,
      routeCode: structured?.routeCode,
      dose: {
        primary: {
          measureCode: measureCode,
          value: structured?.dose?.primary?.value,
        },
        ratioBetweenPrimaryAndSecondary:
          structured?.dose?.ratioBetweenPrimaryAndSecondary,
        secondary: {
          measureCode: structured?.dose?.secondary?.measureCode,
          value: structured?.dose?.secondary?.value,
        },
      },
      duration: {
        type: {
          description: structured?.duration?.type?.description,
          id: "",
        },
        value: structured?.duration?.value,
      },
      isPRN: structured?.isPRN,
      locationCode: "",
      indicationCode: "",
      notes: "",
      perSlidingScale: medication?.instructions?.perSlidingScale,
    };

    handleDispatch(
      dispatch,
      medication.id,
      reduxSetDefaultSig,
      "defaultStructuredSig",
      defaultSig
    );

    handleDispatch(
      dispatch,
      medication.id,
      reduxSetInstruction,
      "instruction",
      getCommonInstruction(defaultSig)
    );
  };

  return (
    <div className="row col-md-12">
      <div className="col-md-12">
        <div className="form-group">
          <label
            id="commonInstruction"
            data-testid="commonInstruction-label"
            htmlFor="txtCommonInstructions"
          >
            Common Instructions
          </label>
          <input className="visually-hidden" id="txtCommonInstructions" />
          <ListGroup
            className={`list-group ${
              sigInfos?.length > 3 ? "commonInstruction-scrollPanel" : ""
            }`}
            data-testid="commonInstruction-container"
          >
            {sigInfos?.map((sigInfo, index) => (
              <ListGroup.Item
                className="list-group-item commonInstructionPanel"
                id={`commonInstruction${index}${sigInfo.priority}`}
                key={sigInfo.sig + sigInfo.priority}
                data-testid={`commonInstruction-item-${index}`}
                onClick={() => quickLinks(sigInfo)}
                onKeyDown={() => quickLinks(sigInfo)}
              >
                {sigInfo.sig}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
};

export default CommonInstructions;
