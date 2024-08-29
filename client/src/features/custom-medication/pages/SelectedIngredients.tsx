import React from "react";
import { IFdbIngredients } from "../../../models/interface/IFdbIngredients";

const SelectedIngredients = (props: any) => {
  return (
    <div className="row m-0">
      <div className="col-md-6 pl-5">
        <span className="col-form-label m-0 p-0 ing-med-grp-box-title">
          Selected Ingredients
        </span>
        <div className="ingridents-selected-items">
          <ul className="bg-ingridents-med-group-items-box">
            {props.selectedIngredients
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
                  <button
                    aria-label="Remove Ingredient"
                    data-testid="remove-ingredient"
                    className="remove-item float-right remove-med-group-ingredient-icon"
                    onClick={() => props.HandleRemoveIngredients(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        props.HandleRemoveIngredients(item.id);
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
export default SelectedIngredients;
