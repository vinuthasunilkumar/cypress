import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Select, { components } from "react-select";
import { getBoxShadow } from "../../helper/Utility";

const MultiColumnSingleDD = (props: any) => {
  const [isClearable, setIsClearable] = useState(true);
  const datafile = Array.isArray(props.datafile) ? props.datafile : [];
  if (
    !props.isBlankOptionNotRequired &&
    !datafile.some((element: any) => element[props.selectedValueCoulumn] === "")
  ) {
    let blankOption: any = {};
    for (let column of props.columns) {
      blankOption[column.key] = "";
    }
    datafile.unshift(blankOption);
  }

  if (
    isClearable &&
    props?.value &&
    props.value[props.selectedValueCoulumn] === null
  ) {
    setIsClearable(false);
  }

  const customStyles = {
    menuOptStyle: (provided: any) => ({
      ...provided,
      overflowY: "auto",
      maxHeight: "400px",
    }),
    control: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      borderRadius: props.id === "ddlDiagnoses" ? "0rem" : ".25rem",
      borderColor:
        props.errorMessage === "" || props.errorMessage === undefined
          ? "#888"
          : "#DC3545",
      boxShadow: getBoxShadow(
        state.isFocused,
        props.errorMessage === "" || props.errorMessage === undefined
      ),
    }),
    option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#d3e3f8" : "white",
      color: state.isFocused ? "black" : null,
    }),

    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      borderTopRightRadius: "0.25rem",
      borderBottomRightRadius: "0.25rem",
      height: "100%",
      alignItems: "center",
      color: "",
      transform:
        !props.dropDownIndicatorText &&
        state.selectProps.menuIsOpen &&
        "rotate(180deg)",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      paddingLeft: 24,
    }),
  };

  const ValueContainer = useCallback(({ children, ...props }: any) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && (
            <i
              className="fa fa-search"
              aria-hidden="true"
              style={{ position: "absolute", left: 6 }}
            />
          )}
          {children}
        </components.ValueContainer>
      )
    );
  }, []);

  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <i className="fa fa-caret-down up-down-caret" />
      </components.DropdownIndicator>
    );
  };

  const customFilter = (option: any, searchText: string) => {
    let isMatch: boolean = false;

    for (const element of props.columns) {
      const column = element;
      isMatch = option.data[column.key]
        ?.toLowerCase()
        .includes(searchText?.toLowerCase());
      if (isMatch) {
        break;
      }
    }
    return isMatch;
  };

  const onChange = (option: any) => {
    if (typeof props.onChange === "function") {
      props.onChange(option);
    }
    if (option && option[props.selectedValueCoulumn] === null) {
      setIsClearable(false);
    } else {
      setIsClearable(true);
    }
  };

  return (
    <div
      className={`form-group ${props.selectLabelText} ${props.lableClassName}`}
    >
      <label
        className={`col-form-label ${
          props.errorMessage ? "has-error-label" : ""
        } ml-n1`}
        htmlFor={props.selectLabelText}
      >
        {props.selectLabelText}
      </label>
      <div data-testid={props.id}>
        <Select
          defaultValue="Select"
          inputId={props.selectLabelText}
          data-testid={props.id}
          classNamePrefix={`${props.id} input-field-select`}
          formatOptionLabel={(option: any, { context }) => {
            return context === "menu" ? (
              <div
                key={option[props.selectedValueCoulumn]}
                className="row ml-0"
              >
                {props.columns.map((column: any) => {
                  return [
                    <div
                      key={option[column.key]}
                      style={{ width: column["width"] + "%" }}
                    >
                      {option[column.key]}
                    </div>,
                  ];
                })}
              </div>
            ) : (
              option[props.selectedValueCoulumn]
            );
          }}
          options={props.datafile}
          styles={customStyles}
          components={{
            DropdownIndicator: DropdownIndicator,
            ValueContainer: ValueContainer,
            ClearIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          filterOption={customFilter}
          onChange={onChange}
          value={props.value}
          isClearable={isClearable}
          isSearchable={props.isSearchable}
          isDisabled={props.isDisabled}
        />
      </div>
      <div className="invalid-feedback-message">{props.errorMessage}</div>
    </div>
  );
};

MultiColumnSingleDD.propTypes = {
  onChange: PropTypes.func,
  datafile: PropTypes.any,
  columns: PropTypes.any,
  selectLabelText: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.object,
  selectedValueCoulumn: PropTypes.string,
  lableClassName: PropTypes.string,
  isSearchable: PropTypes.bool,
  isBlankOptionNotRequired: PropTypes.bool,
  errorMessage: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default MultiColumnSingleDD;
