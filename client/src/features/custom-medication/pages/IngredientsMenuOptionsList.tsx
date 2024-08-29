import React from "react";
import { GroupBase, MenuListProps, components } from "react-select";
import { CustomMedicationsConstants } from "../../../shared/enum/CustomMedicationsConstants";
import { CustomMedicationMessages } from "../../../shared/enum/CustomMedMsgEnums";

// Displaying a custom menu list where we have integrated the last record msg once user reaches the end of results
export const IngredientsMenuOptionsList = (
    props: MenuListProps<
        IMedicationSearchResults,
        true,
        GroupBase<IMedicationSearchResults>
    >
) => {
    const optionsLength = getLength(props.options);
    return (
        <div>
            <components.MenuList {...props}>
                <div>{props.children}</div>
                {optionsLength ===
                    CustomMedicationsConstants.MaxNoOfIngredientsToBeLoaded ? (
                    <div className="text-center last-record-message inline-message im-warning">
                        <span>
                            {CustomMedicationMessages.EndOfSearchResultsMessage}
                        </span>
                    </div>
                ) : (
                    <></>
                )}
            </components.MenuList>
        </div>
    );
};

// Get the count of total loaded/displayed Ingredients Options from server into Dropdown UI
function getLength(options: any): number {
    return options.reduce((acc: number, curr: { options: any }) => {
        if ("options" in curr) return acc + getLength(curr.options);
        return acc + 1;
    }, 0);
}