import React from "react";
import { components } from "react-select";

const DropdownIndicator = (props: any) => {
    return (
        <components.DropdownIndicator {...props}>
            <i className="fa fa-caret-down up-down-caret" />
        </components.DropdownIndicator>
    );
};

export default DropdownIndicator;