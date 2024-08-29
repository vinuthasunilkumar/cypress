import React from "react";
import FormularyIcons from "../features/medication-search/icon-reference/formulary-icons";
import DurAlertsIcon from "../features/medication-search/icon-reference/dur-alerts-icon";
import Custom from "../assets/images/Custom Medication.svg";
import { Medication } from "../types/medicationTypes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { SingleValue } from "react-select";
import { Row } from "react-table";
import { FrequencyAdministrationRequestDto } from "../models/class/FrequencyAdministration";

export const formularyIcon = (status: any, medId: number) => {
  if (!status) {
    return null;
  }
  const src = (status: string) => {
    // need to be update once will updated by UX
    switch (status) {
      case "NoFormulary":
        return FormularyIcons.NoFormulary;
      case "Excluded":
        return FormularyIcons.Excluded;
      case "NotReimbursable":
        return FormularyIcons.NotReimbursable;
      case "NotOnFormulary":
        return FormularyIcons.NotOnFormulary;
      case "Restricted":
        return FormularyIcons.Restricted;
      case "PriorAuthorizationRequired":
        return FormularyIcons.PriorAuthorizationRequired;
      case "PriorAuthorizationMayBeRequired":
        return FormularyIcons.PriorAuthorizationMayBeRequired;
      case "OnFormularyNoMessage":
        return FormularyIcons.OnFormularyNoMessage;
      case "OnFormulary":
        return FormularyIcons.OnFormulary;
      case "Preferred":
        return FormularyIcons.Preferred;
      case "InStock":
        return FormularyIcons.InStock;
      default:
        return "Default";
    }
  };

  if (status === null) status = "Default";
  const spacedStatus = status.replace(/([A-Z])/g, " $1").trim();
  const tooltipId = `tooltip-${status}-${medId}`;

  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip id={tooltipId}> {spacedStatus} </Tooltip>}
    >
      <img data-testid={`image-${status}-${medId}`} src={src(status)} alt="" />
    </OverlayTrigger>
  );
};

const severityOrder: any = {
  Contraindicated: 0,
  Severe: 1,
  Moderate: 2,
  Informational: 3,
};

export const sortDurAlertArray = (
  arr: IPatientSafetySummary[]
): IPatientSafetySummary[] => {
  if (!arr?.length) {
    return [];
  }

  return [...arr].sort((a, b) => {
    const severityA =
      severityOrder[a.severity] !== undefined
        ? severityOrder[a.severity]
        : Infinity;

    const severityB =
      severityOrder[b.severity] !== undefined
        ? severityOrder[b.severity]
        : Infinity;

    return severityA - severityB;
  });
};

export const sourceSeverity = (severity: string) => {
  switch (severity) {
    case "Contraindicated":
      return DurAlertsIcon.Contraindication;
    case "Severe":
      return DurAlertsIcon.Severe;
    case "Moderate":
      return DurAlertsIcon.Moderate;
    default:
      return DurAlertsIcon.Information;
  }
};

export const renderDurIcon = (alerts: any, medId: number) => {
  if (alerts.length === 0) {
    return null;
  }

  let severity = alerts[0]?.severity;

  if (sourceSeverity(severity) != null) {
    const uniqueAlerts = new Set();
    const tooltipContent: React.ReactNode[] = [];

    alerts.forEach((item: any) => {
      if (item.severity === severity) {
        const type = item.type !== null ? item.type : "";
        const severity = item.severity !== null ? `: ${item.severity}` : "";
        const summaryText =
          item.summaryText !== null ? `- ${item.summaryText}` : "";
        const alertKey = `${type}${severity}${summaryText}`;

        if (!uniqueAlerts.has(alertKey)) {
          uniqueAlerts.add(alertKey);
          tooltipContent.push(
            <div key={alertKey}>
              {type}
              {severity ? ` ${severity}` : ""} {summaryText}
            </div>
          );
        }
      }
    });

    if (severity === null) severity = DurAlertsIcon.Information;
    const tooltipId = `tooltip-${severity}-${medId}`;

    return (
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip id={tooltipId}>{tooltipContent}</Tooltip>}
      >
        <img
          data-testid={`image-${severity}-${medId}`}
          src={sourceSeverity(severity)}
          alt=""
        />
      </OverlayTrigger>
    );
  }
};

export const renderIconCustomMeds = (custom: string, medId: number) => {
  if (custom == null) {
    return null;
  }
  const tooltipId = `popover-contained-${medId}-custom`;
  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip id={tooltipId}> {"Medication - Custom"} </Tooltip>}
    >
      <img data-testid={`image-custom-${medId}`} src={Custom} alt="" />
    </OverlayTrigger>
  );
};

export const getCommonInstruction = (structuredSig: IStructured) => {
  let commonInstruction: string = "";
  commonInstruction +=
    structuredSig.methodCode === null || structuredSig.methodCode === undefined
      ? ""
      : `${structuredSig.methodCode} `;

  commonInstruction +=
    structuredSig.dose.primary.value === null ||
    structuredSig.dose.primary.value === undefined
      ? ""
      : `${structuredSig.dose.primary.value} `;

  commonInstruction +=
    structuredSig.dose.primary.measureCode === null ||
    structuredSig.dose.primary.measureCode === undefined
      ? ""
      : `${structuredSig.dose.primary.measureCode} `;
  if (structuredSig.dose.secondary.value !== "0") {
    commonInstruction +=
      structuredSig.dose.secondary.value === "" ||
      structuredSig.dose.secondary.value === null ||
      structuredSig.dose.secondary.value === undefined
        ? ""
        : `(${structuredSig.dose.secondary.value} `;

    commonInstruction +=
      structuredSig.dose.secondary.measureCode === "" ||
      structuredSig.dose.secondary.measureCode === null ||
      structuredSig.dose.secondary.measureCode === undefined
        ? ""
        : `${structuredSig.dose.secondary.measureCode}) `;
  }
  commonInstruction +=
    structuredSig.routeCode === "" ||
    structuredSig.routeCode === null ||
    structuredSig.routeCode === undefined
      ? ""
      : ` by ${structuredSig.routeCode} route `;

  commonInstruction +=
    structuredSig.frequencyCode === null ||
    structuredSig.frequencyCode === undefined
      ? ""
      : `${structuredSig.frequencyCode}`;

  commonInstruction +=
    structuredSig.isPRN !== null &&
    structuredSig.isPRN !== undefined &&
    structuredSig.isPRN
      ? ` as needed `
      : "";

  commonInstruction +=
    structuredSig.locationCode === null ||
    structuredSig.locationCode === undefined
      ? ""
      : ` ${structuredSig.locationCode}`;

  commonInstruction +=
    structuredSig.duration.value === "" ||
    structuredSig.duration.value === null ||
    structuredSig.duration.value === undefined
      ? ""
      : ` for ${structuredSig.duration.value}`;

  commonInstruction +=
    structuredSig.duration.type.description === "" ||
    structuredSig.duration.type.description === null ||
    structuredSig.duration.type.description === undefined
      ? ""
      : ` ${structuredSig.duration.type.description ?? undefined}`;

  commonInstruction +=
    Number(structuredSig.duration.value) > 1 &&
    structuredSig.duration.type.description !== undefined &&
    structuredSig.duration.type.description !== null
      ? "s"
      : "";

  commonInstruction +=
    structuredSig.notes === null || structuredSig.notes === undefined
      ? ""
      : ` ${structuredSig.notes}`;

  commonInstruction +=
    structuredSig.indicationCode === null ||
    structuredSig.indicationCode === undefined
      ? ""
      : ` ${structuredSig.indicationCode}`;

  commonInstruction +=
    structuredSig?.perSlidingScale?.rowsData?.length > 0 &&
    structuredSig?.perSlidingScale?.rowsData[0].from !== ""
      ? templatePanel(structuredSig?.perSlidingScale)
      : "";

  return commonInstruction?.replace(/\s/g, "") === "" ? "-" : commonInstruction;
};

export const handleDispatch = (
  dispatch: any,
  medicationId: number,
  actionType: Function,
  type: string,
  value:
    | string
    | boolean
    | { abbreviation: string }
    | IStructured
    | undefined
    | SingleValue<IDiagnoses>
    | IPerSlidingScale
    | FrequencyAdministrationRequestDto
) => {
  dispatch(
    actionType({
      medicationId: medicationId,
      [type]: value,
    })
  );
};

export const preventMinus = (
  event: React.KeyboardEvent<HTMLInputElement>,
  isDecimal: boolean = true
) => {
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  if (
    event.code === "Minus" ||
    (!isDecimal && exceptThisSymbols.includes(event.key))
  ) {
    event.preventDefault();
  }
};

export const preventPasteNegative = (
  e: React.ClipboardEvent<HTMLInputElement>
) => {
  const clipboardData = e.clipboardData;
  const pastedData = parseFloat(clipboardData.getData("text"));

  if (pastedData < 0) {
    e.preventDefault();
  }
};

export const insertIntoDic = (
  key: string,
  value: any,
  dictionary: IDictionary[],
  error: string = ""
) => {
  let isExist = false;
  for (const element of dictionary) {
    if (element.key === key) {
      element.value = value;
      element.error = error;
      isExist = true;
      break;
    }
  }
  if (!isExist) {
    let obj = { key: key, value: value, error: error };
    dictionary = [...dictionary, obj];
  }

  return dictionary;
};

export const optionalFieldValidation = (
  perSlidingScale: IPerSlidingScale,
  type: string,
  updatedValue: string
) => {
  let errorMessage = "";
  if (updatedValue === "") {
    errorMessage =
      type === "GreaterThan1Give"
        ? "Enter a whole or decimal number"
        : "Enter a whole number";
  } else if (type === "GreaterThan2") {
    errorMessage = getGreaterThan2validation(
      errorMessage,
      perSlidingScale,
      Number(updatedValue)
    );
  } else if (type === "GreaterThan1Give") {
    errorMessage = greaterThan1GiveValidation(
      errorMessage,
      perSlidingScale,
      Number(updatedValue)
    );
  } else if (type === "LessThan0") {
    errorMessage = lessThan0CallValidation(
      errorMessage,
      perSlidingScale,
      Number(updatedValue)
    );
  }
  return errorMessage;
};

export const getGreaterThan2validation = (
  errorMessage: string,
  perSlidingScale: IPerSlidingScale,
  updatedValue: number
) => {
  let lastBodyToFieldValue = Number(
    perSlidingScale?.rowsData?.filter(function (x) {
      return x.from;
    })[perSlidingScale?.rowsData?.length - 1]?.to
  );
  let lessThanChekedValue = perSlidingScale?.optionalData?.find(
    (x) => x.key === "LessThan0"
  )?.value;
  let isLessThanCall = perSlidingScale?.optionalData?.find(
    (x) => x.key === "isLessThanCall"
  )?.value;
  if (
    (isLessThanCall && updatedValue < lastBodyToFieldValue) ||
    (isLessThanCall &&
      updatedValue >= lastBodyToFieldValue &&
      Number(updatedValue) > 800)
  ) {
    errorMessage =
      lastBodyToFieldValue > 800 || Number(updatedValue) > 800
        ? "Enter a whole number no greater than 800"
        : `Enter a whole number between ${lastBodyToFieldValue} and 800`;
  } else if (
    (isLessThanCall && updatedValue < lessThanChekedValue) ||
    (isLessThanCall &&
      updatedValue >= lessThanChekedValue &&
      Number(updatedValue) > 800)
  ) {
    errorMessage = `Enter a whole number between ${lessThanChekedValue} and 800`;
  }

  return errorMessage;
};

export const greaterThan1GiveValidation = (
  errorMessage: string,
  perSlidingScale: IPerSlidingScale,
  updatedValue: any
) => {
  let currentValue = perSlidingScale?.rowsData?.filter(function (x) {
    return x.from;
  })[perSlidingScale?.rowsData?.length - 1]?.give;
  if (
    updatedValue < currentValue ||
    (updatedValue >= currentValue && Number(updatedValue) > 200)
  ) {
    if (Number(currentValue) === 200) {
      errorMessage = `Enter a whole or decimal number no greater than 200`;
    } else {
      errorMessage = `Enter a whole or decimal number between ${currentValue} and 200`;
    }
  }
  return errorMessage;
};

export const lessThan0CallValidation = (
  errorMessage: string,
  perSlidingScale: IPerSlidingScale,
  updatedValue: any
) => {
  let latestToBodyValue = perSlidingScale?.rowsData?.filter(function (x) {
    return x.from;
  })[perSlidingScale?.rowsData?.length - 1]?.to;

  let isCheked = perSlidingScale?.optionalData?.find(
    (x) => x.key === "isLessThanCall"
  )?.value;

  if (isCheked) {
    if (Number(updatedValue) > 800) {
      errorMessage = `Enter a whole number no greater than 800`;
    } else if (Number(updatedValue) > Number(latestToBodyValue)) {
      perSlidingScale.optionalData = insertIntoDic(
        "GreaterThan2",
        updatedValue,
        perSlidingScale?.optionalData,
        ""
      );
    } else {
      perSlidingScale.optionalData = insertIntoDic(
        "GreaterThan2",
        latestToBodyValue,
        perSlidingScale?.optionalData,
        ""
      );
    }
  }
  return errorMessage;
};

export const getPerSlidingScale = (
  updatedValue: any,
  type: string,
  medication: Medication
): IPerSlidingScale => {
  let perSlidingScale: IPerSlidingScale = JSON.parse(
    JSON.stringify(medication?.instructions?.perSlidingScale)
  );
  if (type !== "rowsData") {
    let errorMessage = optionalFieldValidation(
      perSlidingScale,
      type,
      updatedValue
    );
    perSlidingScale.optionalData = insertIntoDic(
      type,
      updatedValue,
      perSlidingScale.optionalData,
      errorMessage
    );
  }

  let defaultPerSlidingScale: IPerSlidingScale = {
    rowsData:
      type === "rowsData"
        ? updatedValue
        : medication.instructions.perSlidingScale.rowsData,
    optionalData:
      type !== "rowsData"
        ? perSlidingScale.optionalData
        : medication.instructions.perSlidingScale.optionalData,
  };
  return defaultPerSlidingScale;
};

export const getCurrentItemValue = (
  key: string,
  perSlidingScale: IPerSlidingScale
) => {
  let result = perSlidingScale?.optionalData?.filter((x) => x.key === key);
  return result.length > 0 ? result[0].value : "";
};

export const templatePanel = (perSlidingScale: IPerSlidingScale) => {
  let result = "\nIf Blood Sugar is,";
  let LessThan0 = getCurrentItemValue("LessThan0", perSlidingScale);
  let LessThan0Call = getCurrentItemValue("LessThan0Call", perSlidingScale);
  let GreaterThan1 = getCurrentItemValue("GreaterThan1", perSlidingScale);
  let GreaterThan1Give = getCurrentItemValue(
    "GreaterThan1Give",
    perSlidingScale
  );
  let GreaterThan2 = getCurrentItemValue("GreaterThan2", perSlidingScale);
  let GreaterThan2Call = getCurrentItemValue(
    "GreaterThan2Call",
    perSlidingScale
  );

  if (LessThan0 !== "" && LessThan0Call !== "") {
    result += ` \nLess than ${LessThan0} mg/dL, Call ${LessThan0Call}`;
  }
  perSlidingScale?.rowsData.map((data: IRowData) => {
    result += ` \nFrom ${data.from} mg/dL, To ${data.to} mg/dL, Give ${data.give} Units`;
  });
  if (GreaterThan1 !== "" && GreaterThan1Give !== "") {
    result += ` \nGreater than ${GreaterThan1} mg/dL, Give ${GreaterThan1Give} Units`;
  }
  if (GreaterThan2 !== "" && GreaterThan2Call !== "") {
    result += ` \nGreater than ${GreaterThan2} mg/dL, Call ${GreaterThan2Call}`;
  }
  return result;
};

export const createCustomMedicationUrl = (
  base: string,
  eventId: string,
  providerId: string,
  isPendingOrder: string,
  isDischargeOrder: string,
  drugDescription: string,
  prescriberId: string,
  deaCode: string
): string => {
  let params: any = {
    zionpagealias: "ORDERMED",
    EVENTID: eventId,
    ASSESSMENTID: "0",
    physicianOrderNoteId: "0",
    prescriberId: isDischargeOrder?.toLowerCase() === "true" ? prescriberId : "0",
    isCustomOrder: "true",
    drugSource: "FDB",
    copyOrderId: "0",
    copyOrder: "",
    orderId: "0",
    pharmacyFillReview: "false",
    goToPage: "0",
    sortBy: "",
    sortOrder: "",
    orderCreateOrig: "",
    formId: "",
    orgId: "0",
    subCategoryID: "0",
    orderTypeId: "0",
    generatedGeneralID: "0",
    isPendingOrder: isPendingOrder,
    isDischargeOrder: isDischargeOrder,
    drugName: drugDescription,
    customerOrderButton: "Add Custom Order",
    cSASchedule: deaCode
  };

  if (providerId && parseInt(providerId) > 0) {
    params.PROVIDERID = providerId;
  }

  let url = new URL(`${base}/Zion`);
  url.search = new URLSearchParams(params).toString();
  return url.toString();
};

export const createPrescriptionOrderUrl = (
  base: string,
  drugId: string,
  eventId: string,
  providerId: string,
  isPendingOrder: string,
  isDischargeOrder: string,
  prescriberId: string
): string => {
  let params: any = {
    "key.drugId": drugId,
    "key.type": "DispensableDrug",
    drugSource: "FDB",
    EVENTID: eventId,
    ASSESSMENTID: "0",
    prescriberId: isDischargeOrder?.toLowerCase() === "true" ? prescriberId : "0",
    orderId: "0",
    FrequencyTypeID_: "0",
    mMDCId: drugId,
    brandcode: "0",
    copyOrderId: "0",
    copyOrder: "",
    isDischargeOrder: isDischargeOrder,
    isPendingOrder: isPendingOrder,
    formId: "",
    orgId: "0",
    subCategoryID: "0",
    orderTypeId: "0",
    generatedGeneralID: "0",
    physicianOrderNoteId: "0",
  };

  if (providerId && parseInt(providerId) > 0) {
    params.PROVIDERID = providerId;
  }

  let url = new URL(`${base}/createNewPrescriptionOrder.action`);
  url.search = new URLSearchParams(params).toString();
  return url.toString();
};

export const createGenericMedicationUrl = (
  base: string,
  genericMedicationId: string,
  eventId: string,
  providerId: string,
  isPendingOrder: string,
  isDischargeOrder: string,
  prescriberId: string
): string => {
  let params: any = {
    "key.drugId": genericMedicationId,
    "key.type": "DispensableDrug",
    drugSource: "FDB",
    EVENTID: eventId,
    ASSESSMENTID: "0",
    prescriberId: isDischargeOrder?.toLowerCase() === "true" ? prescriberId : "0",
    orderId: "0",
    FrequencyTypeID_: "0",
    mMDCId: genericMedicationId,
    brandcode: "0",
    copyOrderId: "0",
    copyOrder: "",
    isDischargeOrder: isDischargeOrder,
    isPendingOrder: isPendingOrder,
    formId: "",
    orgId: "0",
    subCategoryID: "0",
    orderTypeId: "0",
    generatedGeneralID: "0",
    physicianOrderNoteId: "0",
  };

  if (providerId && parseInt(providerId) > 0) {
    params.PROVIDERID = providerId;
  }

  let url = new URL(`${base}/createNewPrescriptionOrder.action`);
  url.search = new URLSearchParams(params).toString();
  return url.toString();
};

export const customInsensitiveCompare = (
  rowA: Row,
  rowB: Row,
  columnId: string,
  desc: boolean
) => {
  const valueA = rowA.values[columnId].toLowerCase();
  const valueB = rowB.values[columnId].toLowerCase();

  if (desc) {
    return valueA.localeCompare(valueB) > 0 ? 1 : -1;
  }
  return valueB.localeCompare(valueA) > 0 ? -1 : 1;
};
