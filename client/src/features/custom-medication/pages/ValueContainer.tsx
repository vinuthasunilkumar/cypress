import React from "react";
import { components, GroupBase } from "react-select";
import { IMedGroups } from "../../../models/interface/IMedGroups";

const ValueContainer: React.FC = ({ children, ...props }:any) => {
  return (
    <components.ValueContainer<IMedGroups | IMedicationSearchResults, true, GroupBase<IMedGroups | IMedicationSearchResults>> {...props}>
      {!!children && (
        <i
          className="fa fa-search"
          aria-hidden="true"
          style={{ position: "absolute", left: 6 }}
        />
      )}
      {children}
    </components.ValueContainer>
  );
};

export default ValueContainer;
