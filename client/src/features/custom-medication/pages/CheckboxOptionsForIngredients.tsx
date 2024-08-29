import React from "react";
import { components } from "react-select";
import { CustomMedicationsConstants } from "../../../shared/enum/CustomMedicationsConstants";

const onChecked = (event: React.ChangeEvent<HTMLInputElement>) => {};

interface CheckboxOptionsForIngredientsProps {
  selectedIngredientsCount: number;
  isSelected: boolean;
  data: IMedicationSearchResults;
}

const CheckboxOptionsForIngredients: React.FC<CheckboxOptionsForIngredientsProps> = ({
  selectedIngredientsCount,
  isSelected,
  data,
  ...rest
}: any) => {
  return (
    <components.Option {...rest}>
      <input
        type="checkbox"
        disabled={
          Number(selectedIngredientsCount) === CustomMedicationsConstants.MaxIngredientsSelectionLimit &&
          !isSelected
        }
        className="ingredient-med-grp-chkbox"
        name={data.description}
        id={data.description}
        onChange={onChecked}
        checked={isSelected}
      />
      <label
        className={`ingredients-med-group-label ${Number(selectedIngredientsCount) ===
          CustomMedicationsConstants.MaxIngredientsSelectionLimit
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
export default CheckboxOptionsForIngredients;
