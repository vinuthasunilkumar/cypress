import { Medication, MedicationAdditionalDetails } from "../../types/medicationTypes";

export const defaultAdditionalDetails: MedicationAdditionalDetails = {
  pharmacyName: '',
  dispenseAsWritten: false,
  doNotFill: false,
  ekit: false,
  ekitDoses: 0,
  pharmacyNotes: "",
};

export const defaultMedication: Medication = {
  id: 0,
  description: "",
  instructions: {
    notes: "",
    formattedStartDate: "",
    formattedEndDate: "",
    isEndDateOpenEnded: true,
    selectedOrderSource: undefined,
    selectedMethod: undefined,
    selectedRoute: undefined,
    selectedMeasure: undefined,
    selectedLocation: undefined,
    selectedFrequency: undefined,
    selectedMDDMeasure: undefined,
    selectedIndication: undefined,
    selectedDurationType: undefined,
    selectedOrderBy: undefined,
    dosage: "",
    duration: "",
    maxDailyDose: "",
    instruction: "",
    icd10Instruction: "",
    orderSource: "",
    defaultStructuredSig: {
      methodCode: "",
      routeCode: "",
      frequencyCode: "",
      dose: {
        primary: {
          measureCode: "",
          value: "",
        },
        ratioBetweenPrimaryAndSecondary: "",
        secondary: {
          value: "",
          measureCode: "",
        },
      },
      duration: {
        type: {
          description: "",
          id: "",
        },
        value: "",
      },
      isPRN: undefined,
      locationCode: "",
      indicationCode: "",
      notes: "",
      perSlidingScale: {
        rowsData: [{
          from: "",
          to: "",
          give: "",
          fromError: "",
          toError: "",
          giveError: "",
        }],
        optionalData: []
      }
    },
    instructionFieldRequirement: false,
    checkedPRN: undefined,
    commonOverrideReason: "",
    otherReasonText: "",
    selectedDiagnoses: undefined,
    selectedDiagnosesType: "",
    isSavedPerSlidingScale: false,
    perSlidingScale: {
      rowsData: [{
        from: "",
        to: "",
        give: "",
        fromError: "",
        toError: "",
        giveError: "",
      }],
      optionalData: []
    },
    frequencySchedule: {
      facilityId: "",
      administrationScheduleId: 0,
      id: 0,
      summary: "",
      orderTypeSummary: "",
      assignedToSummary: "",
      timeSummary: "",
      frequencyRepeatSummary: "",
      frequencyCode: "",
      frequencyCodeDescription: "",
      durationType: "",
      scheduleType: "",
      orderType: 0,
      medicationType: null,
      fdbDrugId: 0,
      fdbMedGroupId: 0,
      duration: 0,
      isDefault: false,
      isFreqGroupedByEvery: false,
      isPrn: false,
      timeSchedules: [],
      cyclicalSchedules: null,
      weeklySchedule: null,
      monthlySchedule: null,
      scheduleLocation: null,
      existingAdministrationScheduleId: 0,
      defaultLocation: [],

    }
  },
  additionalDetails: defaultAdditionalDetails 
};
