import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import orderSource from "../../../assets/static-files/OrderSource.json";
import durationTypeData from "../../../assets/static-files/DurationType.json";
import frequencyData from "../../../assets/static-files/Frequency.json";
import indicationData from "../../../assets/static-files/Indication.json";
import locationData from "../../../assets/static-files/Location.json";
import mddMeasureData from "../../../assets/static-files/MDD Mesaure.json";
import measureData from "../../../assets/static-files/Measure.json";
import methodData from "../../../assets/static-files/Method.json";
import routeData from "../../../assets/static-files/Route.json";
import { getCommonInstruction, handleDispatch } from "../../../helper/Utils";
import {
  orderByColumns,
  singleColumns,
  twoColumns,
} from "../../../library/columnConfigurations";
import {
  setDefaultSig as reduxSetDefaultSig,
  setSelectedOrderBy as reduxsetSelectedOrderBy,
  setSelectedOrderSource as reduxsetSelectedOrderSource,
  setDosage as reduxSetDosage,
  setDuration as reduxSetDuration,
  setInstruction as reduxSetInstruction,
  setInstructionFieldRequirement as reduxSetInstructionFieldRequirement,
  setMaxDailyDose as reduxSetMaxDailyDose,
  setNotes as reduxSetNotes,
  setPRN as reduxSetPRN,
  setSelectedDurationType as reduxSetSelectedDurationType,
  setSelectedFrequency as reduxSetSelectedFrequency,
  setSelectedIndication as reduxSetSelectedIndication,
  setSelectedLocation as reduxSetSelectedLocation,
  setSelectedMDDMeasure as reduxSetSelectedMDDMeasure,
  setSelectedMeasure as reduxSetSelectedMeasure,
  setSelectedMethod as reduxSetSelectedMethod,
  setSelectedRoute as reduxSetSelectedRoute,
  setOrderSource as reduxsetOrderSource,
  setPerSlidingScale as reduxSetPerSlidingScale,
  setIsSavedPerSlidingScale as reduxSetIsSavedPerSlidingScale,
} from "../../../redux/slices/orderWriterSlice";
import { RootState } from "../../../redux/store";
import { searchMedicationById } from "../../../services/MedicationService";
import { defaultMedication } from "../../../shared/constants/DefaultMedication";
import MultiColumnSingleDD from "../../../shared/pages/MultiColumnSingleDD";
import { Medication } from "../../../types/medicationTypes";
import CommonInstructions from "./CommonInstructions";
import { ToggleButton } from "../../../models/class/ToggleButton";
import Switch from "../../../shared/pages/Switch";
import PerSlidingScaleSidebar from "./PerSlidingScaleSidebar";
import PerSlidingScaleEditTemplate from "./PerSlidingScaleEditTemplate";
import ConfirmDialog from "../../../shared/pages/ConfirmDialog";
import { AppConstant } from "../../../shared/constants/AppConstant";
import { OrderWriterEnum } from "../../../shared/enum/OrderWriterEnum";
import CustomizeScheduleing from "./CustomizeScheduling";
import { loadOrderByUsers } from "../../../services/OrderWriterService";
import {
  getPrimaryPhysician,
  groupBy,
  physicianList,
  preparePhysicianName,
} from "../../../helper/Utility";
import GroupByDropDown from "../../../shared/pages/GroupByDropDown";
import OrderWriterAdminDateTime from "./OrderWriterAdminDateTime";

const Instructions = ({
  medicationId,
  isStandalone,
  prescriberId,
}: {
  medicationId: number;
  isStandalone: boolean;
  prescriberId: number;
}) => {
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const strippedBaseUrl = hostContext?.baseUrl?.replace(/^https?:\/\//, "");
  const [dynamicOrderSource, setDynamicOrderSource] =
    useState<OrderSource[]>(orderSource);
  const [sigInfos, setSigInfos] = useState<ICommonInstruction[]>([]);
  const dispatch = useDispatch();
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isPerSclidingEditClick, setIsPerSclidingEditClick] = useState(false);
  const [perSlidingScaleEditData, setPerSlidingScaleEditData] =
    useState<IPerSlidingScale>(
      defaultMedication?.instructions?.perSlidingScale
    );
  const [showConfirmCancelModal, setShowConfirmCancelModal] =
    useState<boolean>(false);

  const [isCustomizeSchedulActive, setIsCustomizeSchedulActive] =
    useState(false);

  const medication: Medication =
    (useSelector((state: RootState) =>
      state.orderWriter.medications.find((med) => med.id === medicationId)
    ) as Medication) || defaultMedication;

  const [rowsData, setRowsData] = useState<IRowData[]>(
    medication.instructions.perSlidingScale.rowsData
  );

  const [orderByUsers, setOrderByUsers] = useState<IOrderByUser[]>();
  const [isGroupDropdown, setIsGroupDropdown] = useState<boolean>(false);
  const [groupByDDData, setGroupByDDData] =
    useState<Record<string, IOrderByUser[]>>();

  useEffect(() => {
    if (medication?.id) {
      let modifiedOrderSource = [...orderSource];
      if (hostContext.isUserPhysician === "true") {
        modifiedOrderSource = [
          { abbreviation: "Prescriber Entered" },
          ...orderSource,
        ];
        setDynamicOrderSource(modifiedOrderSource);

        const defaultOrderSource = { abbreviation: "Prescriber Entered" };
        handleOnChanges(defaultOrderSource, "orderSource");
      } else {
        setDynamicOrderSource(orderSource);
      }
    }
  }, [medication.id]);

  useEffect(() => {
    medicationInfoById();
    loadAllOrderByUsers();
  }, []);

  const medicationInfoById = useCallback(async () => {
    searchMedicationById(medicationId, true).then((response) => {
      if (response !== undefined) {
        setSigInfos(response.CommonSIGs);
      }
    });
  }, []);

  const loadAllOrderByUsers = useCallback(async () => {
    loadOrderByUsers(
      Number(hostContext?.facilityId),
      hostContext?.residentId,
      strippedBaseUrl,
      hostContext?.ectConfigId
    ).then((response: IOrderByUser[]) => {
      if (response !== undefined && response.length > 0) {
        setOrderByUsers(response);
        let physicianData: IOrderByUser[] = physicianList(
          response,
          prescriberId,
          Number(hostContext?.userId || 0)
        );
        if (physicianData.length <= 0) {
          let primaryPhysician = getPrimaryPhysician();
          physicianData = response.filter(
            (orderByUser: IOrderByUser) =>
              preparePhysicianName(orderByUser) === primaryPhysician
          );
        }
        if (response.length > 0 && response.filter((x) => x.group !== null)) {
          let groupByPhysicianData = groupBy(
            response,
            (i: IOrderByUser) => i.group
          );
          setGroupByDDData(groupByPhysicianData);
          setIsGroupDropdown(true);
        }

        handleOnChanges(physicianData[0], "orderBy");
      }
    });
  }, []);

  const getStructureSig = (updatedValue: any, type: string): IStructured => {
    let defaultSig: IStructured = {
      frequencyCode:
        type === "frequency"
          ? updatedValue
          : medication.instructions.defaultStructuredSig.frequencyCode,
      methodCode:
        type === "method"
          ? updatedValue
          : medication.instructions.defaultStructuredSig.methodCode,
      routeCode:
        type === "route"
          ? updatedValue
          : medication.instructions.defaultStructuredSig.routeCode,
      dose: {
        primary: {
          measureCode:
            type === "doseUnit"
              ? updatedValue
              : medication.instructions.defaultStructuredSig.dose.primary
                  .measureCode,
          value:
            type === "dose"
              ? updatedValue
              : medication.instructions.defaultStructuredSig.dose.primary.value,
        },
        ratioBetweenPrimaryAndSecondary:
          medication.instructions.defaultStructuredSig.dose
            .ratioBetweenPrimaryAndSecondary,
        secondary: {
          measureCode:
            medication.instructions.defaultStructuredSig.dose.secondary
              .measureCode ?? "",
          value:
            type === "dose"
              ? (
                  updatedValue *
                  Number(
                    medication.instructions.defaultStructuredSig.dose
                      .ratioBetweenPrimaryAndSecondary
                  )
                )?.toString()
              : medication.instructions.defaultStructuredSig.dose.secondary
                  .value ?? "",
        },
      },
      duration: {
        type: {
          description:
            type === "durationType"
              ? updatedValue
              : medication.instructions.defaultStructuredSig.duration.type
                  .description,
          id: "",
        },
        value:
          type === "duration"
            ? updatedValue
            : medication.instructions.defaultStructuredSig.duration.value,
      },
      isPRN:
        type === "prn"
          ? updatedValue
          : medication.instructions.defaultStructuredSig.isPRN,
      indicationCode:
        type === "indication"
          ? updatedValue
          : medication.instructions.defaultStructuredSig.indicationCode,
      locationCode:
        type === "location"
          ? updatedValue
          : medication.instructions.defaultStructuredSig.locationCode,
      notes:
        type === "notes"
          ? updatedValue
          : medication.instructions.defaultStructuredSig.notes,
      perSlidingScale: medication?.instructions?.perSlidingScale,
    };
    return defaultSig;
  };

  const typeToDispatchMapping: Record<string, [Function, string]> = {
    method: [reduxSetSelectedMethod, "selectedMethod"],
    route: [reduxSetSelectedRoute, "selectedRoute"],
    dose: [reduxSetDosage, "dosage"],
    doseUnit: [reduxSetSelectedMeasure, "selectedMeasure"],
    frequency: [reduxSetSelectedFrequency, "selectedFrequency"],
    duration: [reduxSetDuration, "duration"],
    durationType: [reduxSetSelectedDurationType, "selectedDurationType"],
    prn: [reduxSetPRN, "checkedPRN"],
    location: [reduxSetSelectedLocation, "selectedLocation"],
    indication: [reduxSetSelectedIndication, "selectedIndication"],
    notes: [reduxSetNotes, "notes"],
    orderSource: [reduxsetSelectedOrderSource, "selectedOrderSource"],
    orderBy: [reduxsetSelectedOrderBy, "selectedOrderBy"],
  };

  const getabbreviationValue = (selectedValue: any) => {
    let abbreviationValue = undefined;
    if (selectedValue?.abbreviation === undefined) {
      abbreviationValue = selectedValue;
    } else if (selectedValue?.abbreviation === null) {
      abbreviationValue = "";
    } else {
      abbreviationValue = selectedValue?.abbreviation;
    }
    return abbreviationValue;
  };

  const handleOnChanges = (
    selectedValue: any,
    type:
      | "orderBy"
      | "orderSource"
      | "method"
      | "route"
      | "dose"
      | "doseUnit"
      | "frequency"
      | "duration"
      | "durationType"
      | "prn"
      | "location"
      | "indication"
      | "notes"
  ) => {
    let abbreviationValue = getabbreviationValue(selectedValue);
    let defaultSig = defaultMedication.instructions.defaultStructuredSig;
    if (type in typeToDispatchMapping) {
      const [action, stateKey] = typeToDispatchMapping[type];
      defaultSig = getStructureSig(abbreviationValue, type);
      handleDispatch(
        dispatch,
        medication.id === 0 ? medicationId : medication.id,
        action,
        stateKey,
        selectedValue
      );
    }

    handleDispatch(
      dispatch,
      medication.id,
      reduxSetDefaultSig,
      "defaultStructuredSig",
      defaultSig
    );

    if (type === "orderSource") {
      handleDispatch(
        dispatch,
        medication.id,
        reduxsetOrderSource,
        "orderSource",
        selectedValue?.abbreviation
      );
    }

    return handleDispatch(
      dispatch,
      medication.id,
      reduxSetInstruction,
      "instruction",
      getCommonInstruction(defaultSig)
    );
  };

  let statusToggleButton = new ToggleButton();
  statusToggleButton.controlName = "slidingScale";
  statusToggleButton.label = "Per Sliding Scale";
  statusToggleButton.isToggled = medication.instructions.isSavedPerSlidingScale;
  statusToggleButton.icon = "";

  const [statusToggleButtonObj, setStatusToggleButtonObj] =
    useState<any>(statusToggleButton);

  const toggleState = (state: any) => {
    if (
      !showConfirmCancelModal &&
      !isPerSclidingEditClick &&
      medication?.instructions?.perSlidingScale?.rowsData[0].from !== ""
    ) {
      setShowConfirmCancelModal(true);
    } else {
      setShowConfirmCancelModal(false);
      setStatusToggleButtonObj((prevState: any) => ({
        ...prevState,
        isToggled:
          isPerSclidingEditClick &&
          medication?.instructions?.isSavedPerSlidingScale
            ? true
            : state,
      }));
      setIsMenuActive(isPerSclidingEditClick ? false : state);
      if (isMenuActive || isPerSclidingEditClick) {
        document.body.style.overflowY = "visible";
      }
      if (state) {
        setRowsData(medication?.instructions?.perSlidingScale?.rowsData);
        document.body.style.overflowY = "hidden";
      } else {
        let defaultSig: IStructured = JSON.parse(
          JSON.stringify(medication?.instructions?.defaultStructuredSig)
        );
        let perSlidingScaleResult =
          defaultMedication.instructions.perSlidingScale;
        defaultSig.perSlidingScale = isPerSclidingEditClick
          ? perSlidingScaleEditData
          : perSlidingScaleResult;

        handleDispatch(
          dispatch,
          medication.id,
          reduxSetInstruction,
          "instruction",
          getCommonInstruction(defaultSig)
        );

        handleDispatch(
          dispatch,
          medication.id,
          reduxSetPerSlidingScale,
          "perSlidingScale",
          defaultSig.perSlidingScale
        );
        handleDispatch(
          dispatch,
          medication.id,
          reduxSetIsSavedPerSlidingScale,
          "isSavedPerSlidingScale",
          !!isPerSclidingEditClick
        );
        setIsPerSclidingEditClick(false);
      }
    }
  };

  const editClick = () => {
    setPerSlidingScaleEditData(medication?.instructions?.perSlidingScale);
    setRowsData(medication?.instructions?.perSlidingScale?.rowsData);
    setIsPerSclidingEditClick(true);
    setIsMenuActive(true);
    document.body.style.overflowY = "hidden";
  };

  const confirmCancel = () => {
    setShowConfirmCancelModal(false);
  };

  const isFieldValueChanges = () => {
    const optionsResult =
      medication?.instructions?.perSlidingScale?.optionalData;
    let isGreaterThanGive = optionsResult?.find(
      (x) => x.key === "isGreaterThanGive"
    )?.value;
    let isGreaterThanCall = optionsResult?.find(
      (x) => x.key === "isGreaterThanCall"
    )?.value;
    let isLessThanCall = optionsResult?.find(
      (x) => x.key === "isLessThanCall"
    )?.value;
    if (
      (isGreaterThanGive !== undefined && isGreaterThanGive) ||
      (isGreaterThanCall !== undefined && isGreaterThanCall) ||
      (isLessThanCall !== undefined && isLessThanCall) ||
      !(
        rowsData[rowsData.length - 1].to === "" &&
        rowsData[rowsData.length - 1].from === "" &&
        rowsData[rowsData.length - 1].from === ""
      )
    ) {
      return true;
    }
    return false;
  };

  const isExistingValueChanges = () => {
    const perSlidingScaleResult = medication?.instructions?.perSlidingScale;
    if (
      (isPerSclidingEditClick &&
        perSlidingScaleEditData !== perSlidingScaleResult) ||
      (!isPerSclidingEditClick && isFieldValueChanges())
    ) {
      return true;
    } else {
      return false;
    }
  };

  const formatSummary = (str: string) => {
    return str.replace(/ at/g, "\nat").replace(/ for/g, "\nfor");
  };

  const hideOverlay = () => {
    if (!showConfirmCancelModal && isExistingValueChanges()) {
      setShowConfirmCancelModal(true);
    } else {
      toggleState(false);
    }
  };

  const onOverLayCustomizeSchedulClick = () => {
    document.body.style.overflowY = "visible";
    setIsCustomizeSchedulActive(false);
  };

  return (
    <div className="conatiner-fluid">
      <div className="form-group mt-n4 ml-1">
        <h3
          id="instructions2"
          data-testid="instructions2"
          style={{ fontSize: "20px" }}
          className="ml-2"
        >
          Instructions
        </h3>
      </div>

      <div className="row">
        <div className="row col-md-12">
          <div className="col-md-3">
            {!isGroupDropdown ? (
              <MultiColumnSingleDD
                columns={orderByColumns}
                selectLabelText={"Ordered By"}
                id={"ddlOrderBy"}
                selectedValueCoulumn={"name"}
                value={medication?.instructions?.selectedOrderBy}
                isBlankOptionNotRequired={true}
                onChange={(selectedValue) => {
                  handleOnChanges(selectedValue, "orderBy");
                }}
                datafile={orderByUsers}
                lableClassName={"input-required"}
              />
            ) : (
              <GroupByDropDown
                columns={orderByColumns}
                datafile={groupByDDData}
                onChange={(selectedValue) => {
                  handleOnChanges(selectedValue, "orderBy");
                }}
                selectLabelText={"Ordered By"}
                id={"ddlOrderBy"}
                selectedValueCoulumn={"name"}
                value={medication?.instructions?.selectedOrderBy}
                lableClassName={"input-required"}
              />
            )}
          </div>
          <div className="col-md-3">
            <MultiColumnSingleDD
              columns={singleColumns}
              datafile={dynamicOrderSource}
              onChange={(selectedValue) => {
                handleOnChanges(selectedValue, "orderSource");
              }}
              selectLabelText={"Order Source"}
              id={"ddlOrderSource"}
              value={medication?.instructions?.selectedOrderSource}
              selectedValueCoulumn={"abbreviation"}
              isBlankOptionNotRequired={true}
              lableClassName={"input-required"}
            />
          </div>
        </div>

        {sigInfos?.length > 0 ? (
          <CommonInstructions medicationId={medicationId} sigInfos={sigInfos} />
        ) : (
          <></>
        )}

        <div className="row col-md-12">
          <div className="col-md-12">
            <div className="form-group">
              <Switch
                controlName={statusToggleButtonObj.controlName}
                isToggled={statusToggleButtonObj.isToggled}
                label={statusToggleButtonObj.label}
                icon={statusToggleButtonObj.icon}
                onClick={toggleState}
              ></Switch>
            </div>
          </div>
        </div>
        <PerSlidingScaleEditTemplate
          editClick={editClick}
          medication={medication}
          statusToggleButtonObj={statusToggleButtonObj}
        ></PerSlidingScaleEditTemplate>

        <div className="row col-md-12">
          <div className="col-md-3">
            <MultiColumnSingleDD
              columns={singleColumns}
              datafile={methodData}
              onChange={(selectedValue) => {
                handleOnChanges(selectedValue, "method");
              }}
              selectLabelText={"Method"}
              id={"ddlMethod"}
              value={medication?.instructions?.selectedMethod}
              selectedValueCoulumn={"abbreviation"}
              lableClassName={
                medication?.instructions?.instructionFieldRequirement
                  ? ""
                  : "input-required"
              }
            />
          </div>
          <div className="col-md-3">
            <MultiColumnSingleDD
              columns={singleColumns}
              datafile={routeData}
              onChange={(selectedValue) => {
                handleOnChanges(selectedValue, "route");
              }}
              selectLabelText={"Route"}
              id={"ddlRoute"}
              value={medication?.instructions?.selectedRoute}
              selectedValueCoulumn={"abbreviation"}
              lableClassName={
                medication?.instructions?.instructionFieldRequirement
                  ? ""
                  : "input-required"
              }
            />
          </div>
          <div className="col-md-3">
            <div
              className={
                medication?.instructions?.instructionFieldRequirement
                  ? "form-group Dosage"
                  : "form-group Dosage input-required"
              }
            >
              <label
                className="col-form-label ml-n1"
                id="dosage"
                htmlFor="dosageInput"
              >
                Dosage
              </label>
              <input
                className="form-control form-control-custom-number"
                id="dosageInput"
                data-testid="dosageInput"
                type="number"
                min={0}
                maxLength={999999}
                autoComplete="off"
                value={medication?.instructions?.dosage}
                onChange={(e) => handleOnChanges(e.target.value, "dose")}
              />
            </div>
          </div>
          <div className="col-md-3">
            <MultiColumnSingleDD
              columns={twoColumns}
              datafile={measureData}
              onChange={(selectedValue) => {
                handleOnChanges(selectedValue, "doseUnit");
              }}
              selectLabelText={"Dose Unit"}
              id={"ddlMeasure"}
              value={medication?.instructions?.selectedMeasure}
              selectedValueCoulumn={"abbreviation"}
              lableClassName={
                medication?.instructions?.instructionFieldRequirement
                  ? ""
                  : "input-required"
              }
            />
          </div>
        </div>

        <div className="row col-md-12">
          <div className="col-md-3">
            <MultiColumnSingleDD
              columns={twoColumns}
              datafile={frequencyData}
              onChange={(selectedValue) => {
                handleOnChanges(selectedValue, "frequency");
              }}
              selectLabelText={"Frequency"}
              id={"ddlFrequency"}
              value={medication?.instructions?.selectedFrequency}
              selectedValueCoulumn={"abbreviation"}
              lableClassName={
                medication?.instructions?.instructionFieldRequirement
                  ? ""
                  : "input-required"
              }
            />
          </div>

          <div className="col-md-2">
            <div className="form-check mt-4 ml-5">
              <input
                className="form-check-input"
                id="option2stacked"
                data-testid="option2stacked"
                type="checkbox"
                value=""
                checked={medication?.instructions?.checkedPRN}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  handleOnChanges(isChecked, "prn");
                }}
              />
              <label
                className="form-check-label"
                id="prn"
                htmlFor="option2stacked"
              >
                PRN
              </label>
            </div>
          </div>

          <div className="col-md-7">
            <div
              className="form-group mb-0 assigned-to-box"
              style={{ minHeight: "60px", height: "auto", padding: "5px" }}
            >
              <label htmlFor="assignedToInput" className="col-form-label">
                Administration Schedule
              </label>
              <p className="ml-2 adminSummary">
                {medication?.instructions?.frequencySchedule?.summary
                  ? formatSummary(
                      medication?.instructions?.frequencySchedule?.summary
                    )
                  : ""}
              </p>
            </div>
            <div className="text-right">
              <button
                data-testid="btnCustomizeScheduling"
                className="anchor-button"
                style={{
                  textDecoration: "underline",
                }}
                onClick={() => {
                  document.body.style.overflowY = "hidden";
                  setIsCustomizeSchedulActive(true);
                }}
              >
                {`Customize Scheduling`}
              </button>
            </div>
          </div>
        </div>

        <div className="row col-md-12 mt-3">
          <div className="col-md-6">
            <MultiColumnSingleDD
              columns={twoColumns}
              datafile={locationData}
              onChange={(selectedValue) => {
                handleOnChanges(selectedValue, "location");
              }}
              selectLabelText={"Site"}
              id={"ddlLocation"}
              value={medication?.instructions?.selectedLocation}
              selectedValueCoulumn={"abbreviation"}
            />
          </div>

          <div className="col-md-6">
            <MultiColumnSingleDD
              columns={singleColumns}
              datafile={indicationData}
              onChange={(selectedValue) => {
                handleOnChanges(selectedValue, "indication");
              }}
              selectLabelText={"Indication"}
              id={"ddlIndication"}
              value={medication?.instructions?.selectedIndication}
              selectedValueCoulumn={"abbreviation"}
            />
          </div>
        </div>

        <div className="row col-md-12 mt-3">
          <div className="col-md-3">
            <div className="form-group Duration">
              <label
                className="col-form-label ml-n1"
                id="duration"
                htmlFor="durationInput"
              >
                Duration
              </label>
              <input
                className="form-control form-control-custom-number"
                id="durationInput"
                data-testid="durationInput"
                type="number"
                min={0}
                autoComplete="off"
                value={medication?.instructions?.duration}
                onChange={(e) => handleOnChanges(e.target.value, "duration")}
              />
            </div>
          </div>
          <div className="col-md-3">
            <MultiColumnSingleDD
              columns={singleColumns}
              datafile={durationTypeData}
              onChange={(selectedValue) => {
                handleOnChanges(selectedValue, "durationType");
              }}
              selectLabelText={"Duration Type"}
              id={"ddlDurationType"}
              value={medication?.instructions?.selectedDurationType}
              selectedValueCoulumn={"abbreviation"}
            />
          </div>
        </div>
        <OrderWriterAdminDateTime
          medicationId={Number(medicationId)}
          isAddSchedule={false}
        />
        <div className="row col-md-12">
          <div className="col-md-8">
            <div className="form-check">
              <input
                className="form-check-input"
                id="option3stacked"
                data-testid="checkBtn"
                type="checkbox"
                value=""
                defaultChecked={
                  medication?.instructions?.instructionFieldRequirement === true
                }
                onChange={(e) => {
                  const Checked = e.target.checked;
                  handleDispatch(
                    dispatch,
                    medication.id,
                    reduxSetInstructionFieldRequirement,
                    "instructionFieldRequirement",
                    Checked
                  );
                }}
              />
              <label
                className="form-check-label ml-n1"
                id="instructionLine"
                htmlFor="option3stacked"
              >
                Instruction fields requirement not applicable
              </label>
            </div>
          </div>
        </div>
        <div className="row col-md-12">
          <div className="col-md-12 mt-2">
            <div className="form-group">
              <label
                className="col-form-label ml-n1"
                id="additionalInstruction"
                htmlFor="txtAreaCount"
              >
                Additional Instructions
              </label>
              <div>
                <textarea
                  id="txtAreaCount"
                  data-testid="txtAreaCount"
                  name="tb2"
                  className="char-remaining-wrapper form-control"
                  maxLength={900}
                  onChange={(e) => handleOnChanges(e.target.value, "notes")}
                  value={medication?.instructions?.notes}
                ></textarea>
                <aside className="float-right">
                  {medication?.instructions?.notes?.length}
                  /900
                </aside>
              </div>
            </div>
          </div>
        </div>
        <div className="row col-md-12">
          <div className="col-md-3">
            <div className="form-group">
              <label
                className="col-form-label ml-n1"
                id="maximumDailyDose"
                htmlFor="maximumDailyDoseInput"
              >
                Maximum Daily Dose
              </label>
              <input
                className="form-control form-control-custom-number"
                id="maximumDailyDoseInput"
                data-testid="maximumDailyDoseInput"
                value={medication?.instructions?.maxDailyDose || ""}
                autoComplete="off"
                onChange={(e) =>
                  handleDispatch(
                    dispatch,
                    medication.id,
                    reduxSetMaxDailyDose,
                    "maxDailyDose",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
          <div className="col-md-4">
            <MultiColumnSingleDD
              columns={twoColumns}
              datafile={mddMeasureData}
              onChange={(selectedValue) =>
                handleDispatch(
                  dispatch,
                  medication.id,
                  reduxSetSelectedMDDMeasure,
                  "selectedMDDMeasure",
                  selectedValue
                )
              }
              selectLabelText={"Maximum Daily Dose Measure"}
              id={"ddlMddMeasure"}
              value={medication?.instructions?.selectedMDDMeasure}
              selectedValueCoulumn={"abbreviation"}
            />
          </div>
        </div>
        {isMenuActive ? (
          <PerSlidingScaleSidebar
            isMenuActive={isMenuActive}
            setIsMenuActive={setIsMenuActive}
            onOverLayClick={hideOverlay}
            medicationId={medicationId}
            isPerSclidingEditClick={isPerSclidingEditClick}
            rowsData={rowsData}
            setRowsData={setRowsData}
          />
        ) : (
          <></>
        )}

        {isCustomizeSchedulActive ? (
          <CustomizeScheduleing
            isCustomizeScheduleActive={isCustomizeSchedulActive}
            onOverLayCustomizeScheduleClick={onOverLayCustomizeSchedulClick}
            medicationId={medicationId}
          />
        ) : (
          <></>
        )}

        <ConfirmDialog
          showConfirmModal={showConfirmCancelModal}
          iconClass={AppConstant.ConfirmDialogWarningIcon}
          title={OrderWriterEnum.DialogTitle}
          messageTitle={OrderWriterEnum.DataLossWarningMessage}
          messageContent={OrderWriterEnum.DataLossWarningMessageContent}
          confirmButtonText={AppConstant.ConfirmDialogYesButton}
          cancelButtonText={AppConstant.ConfirmDialogNoButton}
          confirmOk={hideOverlay}
          confirmCancel={confirmCancel}
        ></ConfirmDialog>
      </div>
    </div>
  );
};

export default Instructions;
