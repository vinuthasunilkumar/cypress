import React from "react";
import { IFdbIngredients } from "../../../models/interface/IFdbIngredients";

const SelectedStockMedications = (props: any) => {
    return (
        <div className="row m-0 p-0">
            <div className="col-md-12 m-0 p-0">
                <span className="col-form-label m-0 p-0 ing-med-grp-box-title">
                    Selected Medications/Supplies
                </span>
                <div className="ingridents-selected-items">
                    <ul className="bg-ingridents-med-group-items-box">
                        {props.selectedMedications.filter((x: IFdbIngredients) => !x.isGeneric)
                            .slice(0)
                            .reverse()
                            .map((item: IFdbIngredients, index: number) => (
                                <li key={item.id + item.description + index}>
                                    {item.description}
                                    {item?.isObsolete && (
                                        <span
                                            style={{
                                                color: "red",
                                                textDecoration: "none",
                                            }}
                                        >
                                            {" "}
                                            (obsolete)
                                        </span>
                                    )}
                                    <button type="button"
                                        aria-label="Remove Medication Supply"
                                        data-testid="remove-medication-supply"
                                        className="remove-item float-right remove-med-group-ingredient-icon"
                                        onClick={() => props.handleRemoveMedicationSupply(item.id)}
                                        tabIndex={206 + index}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                props.handleRemoveMedicationSupply(item.id);
                                            }
                                        }}
                                    >
                                        <i
                                            className="fa fa-close remove-ing-med-icon float-right"
                                            aria-hidden="true"
                                        ></i>
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default SelectedStockMedications;
