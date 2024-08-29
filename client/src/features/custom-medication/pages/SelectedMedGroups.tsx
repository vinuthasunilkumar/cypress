import React from "react";
import { IMedGroups } from "../../../models/interface/IMedGroups";

const SelectedMedGroups = (props: any) => {
  return (
    <div className="row m-0">
      <div className="col-md-6 pl-5">
        <span className="col-form-label m-0 p-0 ing-med-grp-box-title">
          Selected Medication Groups
        </span>
        <div className="ingridents-selected-items">
          <ul className="bg-ingridents-med-group-items-box">
            {props.selectedMedGroups
              .slice(0)
              .reverse()
              .map((item: IMedGroups, index: number) => (
                <li key={item.id + item.description + index}>
                  {item.description}
                  <button
                    aria-label="Remove Med Group"
                    className="remove-item float-right remove-med-group-ingredient-icon"
                    data-testid="rm-medication-group"
                    onClick={() => props.HandleRemoveMedGroups(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        props.HandleRemoveMedGroups(item.id);
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
export default SelectedMedGroups;
