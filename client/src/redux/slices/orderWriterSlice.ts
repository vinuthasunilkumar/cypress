import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Medication, MedicationInstruction, MedicationAdditionalDetails } from "../../types/medicationTypes"
import { defaultMedication } from "../../shared/constants/DefaultMedication";
import { FrequencyAdministrationRequestDto } from "../../models/class/FrequencyAdministration";

const initialState: OrderWriterState = {
  medications: [
    defaultMedication
  ],
};

interface OrderWriterState {
  medications: Medication[];
}

const findMedicationById = (state: OrderWriterState, medicationId: number): Medication | undefined => {
  return state.medications.find(med => med.id === medicationId);
}

const setMedicationPropertyFromPayload = <T extends keyof MedicationInstruction>(
  state: OrderWriterState,
  medicationId: number,
  value: MedicationInstruction[T],
  field: T
) => {
  const medication = findMedicationById(state, medicationId);
  if (medication?.instructions) {
    medication.instructions[field] = value;
  }
}

const setMedicationAdditionalPropertyFromPayload = <T extends keyof MedicationAdditionalDetails>(
  state: OrderWriterState,
  medicationId: number,
  value: MedicationAdditionalDetails[T],
  field: T
) => {
  const medication = findMedicationById(state, medicationId);
  if (medication?.additionalDetails) {
    medication.additionalDetails[field] = value;
  }
}

const orderWriterSlice = createSlice({
  name: "orderWriter",
  initialState,
  reducers: {
    addMedication: (state, action) => {
      state.medications.push({
        description: action.payload.description,
        id: action.payload.id,
        instructions: defaultMedication.instructions,
        additionalDetails: defaultMedication.additionalDetails
      });
    },
    resetMedications: () => {
      return initialState;
    },
    setNotes: (state, action: PayloadAction<{ medicationId: number, notes: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.notes, 'notes');
    },
    setSelectedOrderSource: (state, action: PayloadAction<{ medicationId: number, selectedOrderSource: object }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedOrderSource, 'selectedOrderSource');
    },
    setSelectedOrderBy: (state, action: PayloadAction<{ medicationId: number, selectedOrderBy: IOrderByUser }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedOrderBy, 'selectedOrderBy');
    },
    setFormattedStartDate: (state, action: PayloadAction<{ medicationId: number, formattedStartDate: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.formattedStartDate, 'formattedStartDate');
    },
    setFormattedEndDate: (state, action: PayloadAction<{ medicationId: number, formattedEndDate: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.formattedEndDate, 'formattedEndDate');
    },
    setEndDateOpenEnded: (state, action: PayloadAction<{ medicationId: number, isEndDateOpenEnded: boolean }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.isEndDateOpenEnded, 'isEndDateOpenEnded');
    },
    setSelectedMethod: (state, action: PayloadAction<{ medicationId: number, selectedMethod: object }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedMethod, 'selectedMethod');
    },
    setSelectedRoute: (state, action: PayloadAction<{ medicationId: number, selectedRoute: object }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedRoute, 'selectedRoute');
    },
    setSelectedIndication: (state, action: PayloadAction<{ medicationId: number, selectedIndication: object }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedIndication, 'selectedIndication');
    },
    setSelectedFrequency: (state, action: PayloadAction<{ medicationId: number, selectedFrequency: object }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedFrequency, 'selectedFrequency');
    },
    setSelectedLocation: (state, action: PayloadAction<{ medicationId: number, selectedLocation: object }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedLocation, 'selectedLocation');
    },
    setSelectedMeasure: (state, action: PayloadAction<{ medicationId: number, selectedMeasure: object }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedMeasure, 'selectedMeasure');
    },
    setSelectedMDDMeasure: (state, action: PayloadAction<{ medicationId: number, selectedMDDMeasure: object }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedMDDMeasure, 'selectedMDDMeasure');
    },
    setSelectedDurationType: (state, action: PayloadAction<{ medicationId: number, selectedDurationType: object }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedDurationType, 'selectedDurationType');
    },
    setDosage: (state, action: PayloadAction<{ medicationId: number, dosage: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.dosage, 'dosage');
    },
    setDuration: (state, action: PayloadAction<{ medicationId: number, duration: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.duration, 'duration');
    },
    setMaxDailyDose: (state, action: PayloadAction<{ medicationId: number, maxDailyDose: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.maxDailyDose, 'maxDailyDose');
    },
    setInstruction: (state, action: PayloadAction<{ medicationId: number, instruction: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.instruction, 'instruction');
    },
    setICD10Instruction: (state, action: PayloadAction<{ medicationId: number, icd10Instruction: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.icd10Instruction, 'icd10Instruction');
    },
    setOrderSource: (state, action: PayloadAction<{ medicationId: number, orderSource: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.orderSource, 'orderSource');
    },
    setDefaultSig: (state, action: PayloadAction<{ medicationId: number, defaultStructuredSig: IStructured }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.defaultStructuredSig, 'defaultStructuredSig');
    },
    setInstructionFieldRequirement: (state, action: PayloadAction<{ medicationId: number, instructionFieldRequirement: boolean }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.instructionFieldRequirement, 'instructionFieldRequirement');
    },
    setPRN: (state, action: PayloadAction<{ medicationId: number, checkedPRN: boolean }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.checkedPRN, 'checkedPRN');
    },
    setCommonOverrideReason: (state, action: PayloadAction<{ medicationId: number, commonOverrideReason: string, otherReasonText?: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.commonOverrideReason, 'commonOverrideReason');
      if (action.payload.otherReasonText) {
        setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.otherReasonText, 'otherReasonText');
      }
    },
    setSelectedDiagnoses: (state, action: PayloadAction<{ medicationId: number, selectedDiagnoses: IDiagnoses }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedDiagnoses, 'selectedDiagnoses');
    },
    setSelectedDiagnosesType: (state, action: PayloadAction<{ medicationId: number, selectedDiagnosesType: string }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.selectedDiagnosesType, 'selectedDiagnosesType');
    },
    setIsSavedPerSlidingScale: (state, action: PayloadAction<{ medicationId: number, isSavedPerSlidingScale: boolean }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.isSavedPerSlidingScale, 'isSavedPerSlidingScale');
    },
    setPerSlidingScale: (state, action: PayloadAction<{ medicationId: number, perSlidingScale: IPerSlidingScale }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.perSlidingScale, 'perSlidingScale');
    },
    setFrequencySchedule: (state, action: PayloadAction<{ medicationId: number, frequencySchedule: FrequencyAdministrationRequestDto }>) => {
      setMedicationPropertyFromPayload(state, action.payload.medicationId, action.payload.frequencySchedule, 'frequencySchedule');
    },
    setPharmacyName: (state, action: PayloadAction<{ medicationId: number; pharmacyName: string }>) => {
      setMedicationAdditionalPropertyFromPayload(state, action.payload.medicationId, action.payload.pharmacyName, 'pharmacyName');
    },
    setDispenseAsWritten: (state, action: PayloadAction<{ medicationId: number; dispenseAsWritten: boolean }>) => {
      setMedicationAdditionalPropertyFromPayload(state, action.payload.medicationId, action.payload.dispenseAsWritten, 'dispenseAsWritten');
    },
    setDoNotFill: (state, action: PayloadAction<{ medicationId: number; doNotFill: boolean }>) => {
      setMedicationAdditionalPropertyFromPayload(state, action.payload.medicationId, action.payload.doNotFill, 'doNotFill');
    },
    setEkit: (state, action: PayloadAction<{ medicationId: number; ekit: boolean }>) => {
      setMedicationAdditionalPropertyFromPayload(state, action.payload.medicationId, action.payload.ekit, 'ekit');
    },
    setEkitDoses: (state, action: PayloadAction<{ medicationId: number; ekitDoses: number }>) => {
      setMedicationAdditionalPropertyFromPayload(state, action.payload.medicationId, action.payload.ekitDoses, 'ekitDoses');
    },
    setPharmacyNotes: (state, action: PayloadAction<{ medicationId: number, pharmacyNotes: string }>) => {
      setMedicationAdditionalPropertyFromPayload(state, action.payload.medicationId, action.payload.pharmacyNotes, 'pharmacyNotes');
    },
  },
});

export const {
  addMedication,
  resetMedications,
  setSelectedOrderBy,
  setSelectedOrderSource,
  setNotes,
  setFormattedStartDate,
  setFormattedEndDate,
  setEndDateOpenEnded,
  setSelectedMethod,
  setSelectedRoute,
  setSelectedIndication,
  setSelectedFrequency,
  setSelectedLocation,
  setSelectedMeasure,
  setSelectedMDDMeasure,
  setSelectedDurationType,
  setDosage,
  setDuration,
  setMaxDailyDose,
  setInstruction,
  setICD10Instruction,
  setOrderSource,
  setDefaultSig,
  setInstructionFieldRequirement,
  setPRN,
  setCommonOverrideReason,
  setSelectedDiagnoses,
  setSelectedDiagnosesType,
  setIsSavedPerSlidingScale,
  setPerSlidingScale,
  setFrequencySchedule,
  setPharmacyName,
  setDispenseAsWritten,
  setDoNotFill,
  setEkit,
  setEkitDoses,
  setPharmacyNotes
} = orderWriterSlice.actions;

export default orderWriterSlice.reducer;
