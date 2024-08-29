import React from "react";
import { components } from "react-select";
import { CustomMedicationsConstants } from "../../../shared/enum/CustomMedicationsConstants";
import { IMedGroups } from "../../../models/interface/IMedGroups";

const onChecked = (event: React.ChangeEvent<HTMLInputElement>) => {};

interface CheckboxOptionsForMedGroupProps {
  selectedMedGroupsCount: number;
  isSelected: boolean;
  data: IMedGroups;
}

const CheckboxOptionsForMedGroups: React.FC<CheckboxOptionsForMedGroupProps> = ({
    selectedMedGroupsCount,
  isSelected,
  data,
  ...rest
}: any) => {
  return (
    <components.Option {...rest}>
      <input
        type="checkbox"
        disabled={
          Number(selectedMedGroupsCount) === CustomMedicationsConstants.MaxMedicationGroupsSelectionLimit &&
          !isSelected
        }
        className="ingredient-med-grp-chkbox"
        name={data.description}
        id={data.description}
        onChange={onChecked}
        checked={isSelected}
      />
      <label
        className={`ingredients-med-group-label ${Number(selectedMedGroupsCount) === 
          CustomMedicationsConstants.MaxMedicationGroupsSelectionLimit 
          ? "isDisabled"
          : ""
          }`}
        htmlFor={data.description}
        data-testid={data.description}
      >
        {data.description}
      </label>
    </components.Option>
  );
}
export default CheckboxOptionsForMedGroups;