import { FrequencyAdministrationRequestDto } from "../models/class/FrequencyAdministration";

interface MedicationInstruction {
  notes: string;
  formattedStartDate: string;
  formattedEndDate?: string;
  isEndDateOpenEnded: boolean;
  selectedOrderSource: object | undefined;
  selectedMethod: object | undefined;
  selectedRoute: object | undefined;
  selectedMeasure: object | undefined;
  selectedLocation: object | undefined;
  selectedFrequency: object | undefined;
  selectedMDDMeasure: object | undefined;
  selectedIndication: object | undefined;
  selectedDurationType: object | undefined;
  selectedOrderBy: IOrderByUser | undefined;
  dosage: string;
  duration: string;
  maxDailyDose: string;
  instruction: string;
  icd10Instruction: string;
  orderSource: string;
  defaultStructuredSig: IStructured;
  instructionFieldRequirement: boolean;
  commonOverrideReason: string;
  otherReasonText: string;
  checkedPRN: boolean | undefined;
  selectedDiagnoses: IDiagnoses | undefined;
  selectedDiagnosesType: string;
  isSavedPerSlidingScale: boolean;
  perSlidingScale: IPerSlidingScale;
  frequencySchedule: FrequencyAdministrationRequestDto;
}

interface MedicationAdditionalDetails {
  pharmacyName: string;
  dispenseAsWritten: boolean;
  doNotFill: boolean;
  ekit: boolean;
  ekitDoses: number;
  pharmacyNotes: string;
}

interface Medication {
  id: number;
  description: string;
  instructions: MedicationInstruction;
  additionalDetails: MedicationAdditionalDetails;
}

export type { Medication, MedicationInstruction, MedicationAdditionalDetails };
