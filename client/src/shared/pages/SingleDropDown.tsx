import React, { useCallback, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import type { OptionType } from "./../type/OptionType";
import type { GroupBase, OptionsOrGroups } from "react-select";
import { components } from "react-select";
import PropTypes from "prop-types";
import { getBoxShadow } from "../../helper/Utility";

const SingleDropDown = (props: any) => {
  const [isClearable, setIsClearable] = useState(
    props.isClearable === undefined
  );
  const options: OptionType[] = [];

  const addSpecialOptions = (sourceData: any) => {
    if (!props.isBlankOptionNotRequired &&
      !sourceData.some((element: any) => element[props.dataFieldId] === null)) {
      sourceData.unshift({
        [props.dataFieldValue]: "",
        [props.dataFieldId]: null,
      });
    }
    if (props.isNoneOptionIsRequired &&
      !sourceData.some((element: any) => element[props.dataFieldId] === -1)) {
      sourceData.push({
        [props.dataFieldValue]: "None",
        [props.dataFieldId]: -1,
      });
    }
  };

  const sortingDataSource = (
    sourceData: any,
    isSortByDataFieldId: boolean = false
  ) => {
    addSpecialOptions(sourceData);
    if (!isSortByDataFieldId) {
      sourceData.sort((a: any, b: any) => {
        a = a[props.dataFieldValue] || "";
        b = b[props.dataFieldValue] || "";
        return a.localeCompare(b);
      });
    } else {
      sourceData.sort((a: any, b: any) => {
        return a[props.dataFieldId] - b[props.dataFieldId];
      });
    }
    return sourceData;
  };
  const datafile = Array.isArray(props.datafile)
    ? sortingDataSource(props.datafile, props.isSortByDataFieldId)
    : [];

  datafile.forEach((element: any) => {
    options.push({
      value: element[props.dataFieldId],
      label: element[props.dataFieldValue],
    });
  });

  // set value in label from source data
  let newLabel;
  if (props?.value) {
    const filtered = Array.isArray(props.datafile)
      ? props.datafile.filter(
        (element: any) => element[props.dataFieldId] === props?.value?.value
      )
      : [];
    newLabel = filtered[0]?.[props.dataFieldValue];
    props.value.label = newLabel;

    if (
      !props.isClearableNotRequired &&
      isClearable &&
      props.value.label === ""
    ) {
      setIsClearable(false);
    }
  }

  const loadItemssOptions = async (
    search: string,
    prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
  ) => {
    let filteredOptions: OptionType[];
    if (!search) {
      filteredOptions = options;
    } else {
      const searchLower = search.toLowerCase();

      filteredOptions = options.filter(({ label }) =>
        label?.toLowerCase().includes(searchLower)
      );
    }

    const hasMore = filteredOptions.length > prevOptions.length + 10;
    const slicedOptions = filteredOptions.slice(
      prevOptions.length,
      prevOptions.length + 10
    );

    return {
      options: slicedOptions,
      hasMore,
    };
  };

  const ValueContainer = useCallback(({ children, ...selectProps }: any) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...selectProps}>
          {!props.isSearchIconNotRequired ? (
            !!children && (
              <i
                className="fa fa-search"
                aria-hidden="true"
                style={{ position: "absolute", left: 6 }}
              />
            )
          ) : (
            <></>
          )}
          {children}
        </components.ValueContainer>
      )
    );
  }, []);

  const DropdownIndicator = useCallback(({ children, ...selectProps }: any) => {
    return (
      <components.DropdownIndicator {...selectProps}>
        {props.dropDownIndicatorText ? (
          <span className="dropdown-indicator-text">
            {props.dropDownIndicatorText}
          </span>
        ) : (
          <i className="fa fa-caret-down up-down-caret" />
        )}
      </components.DropdownIndicator>
    );
  }, []);

  const GetBackGroundColor = (state: { isFocused: any; isSelected: any }) => {
    if (state.isFocused) {
      return "#D3D3D3";
    } else if (state.isSelected) {
      return "#D3E3F8";
    } else {
      return null;
    }
  };

  const customStyles = {
    menuOptStyle: (provided: any) => ({
      ...provided,
      overflowY: "auto",
      maxHeight: "400px",
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: props?.pageSize === 5 ? "185px" : "300px"
    }),
    control: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      borderRadius: "5px",
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
      backgroundColor: GetBackGroundColor(state),
      color: state.isFocused ? "black" : null,
    }),
    indicatorSeparator: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: props.dropDownIndicatorText && "#CCCCCC",
      marginBottom: "0px",
      marginTop: "0px",
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: props.dropDownIndicatorText && "#EEEEEE",
      borderTopRightRadius: props.dropDownIndicatorText && "0.25rem",
      borderBottomRightRadius: props.dropDownIndicatorText && "0.25rem",
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
      paddingLeft: !props.isSearchIconNotRequired ? 24 : 3,
    }),
  };

  const onChange = (option: any) => {
    if (typeof props.onChange === "function") {
      props.onChange(option);
    }
    if (option && option?.label === "") {
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
        className={`col-form-label p-0  ${props.errorMessage ? "has-error-label" : ""
          }`}
        htmlFor={props.selectLabelText}
      >
        <span
          className={
            props.isSelectLabelTextNotRequired ? "hideLabel" : "showLabel"
          }
        >
          {props.selectLabelText} {props.icon}
        </span>
      </label>
      <div className={`input-group custom-single-select`}>
        <AsyncPaginate
          data-testid={props.id}
          className={props.id}
          required={props.isRequired}
          inputId={props.selectLabelText}
          value={props.value || ""}
          loadOptions={loadItemssOptions}
          onChange={onChange}
          isSearchable={props.isSearchable}
          components={{
            DropdownIndicator: DropdownIndicator,
            IndicatorSeparator: null,
            ValueContainer: ValueContainer,
          }}
          styles={customStyles}
          isClearable={isClearable && !props.isClearableNotRequired}
          isMulti={false}
          isDisabled={props.isDisabled}
          classNamePrefix={`input-field-select ${props.selectLabelText}`}
          placeholder={props.placeholder}
          tabIndex={props.tabIndex ? props.tabIndex : 0}
        />
        <div className="invalid-feedback-message">{props.errorMessage}</div>
      </div>
    </div>
  );
};

SingleDropDown.propTypes = {
  id: PropTypes.string,
  value: PropTypes.object,
  onChange: PropTypes.func,
  datafile: PropTypes.any,
  selectLabelText: PropTypes.string,
  icon: PropTypes.any, //note: if icon is not required pass icon={null}
  dataFieldId: PropTypes.string,
  dataFieldValue: PropTypes.string,
  isSearchable: PropTypes.bool,
  isSearchIconNotRequired: PropTypes.bool,
  placeholder: PropTypes.string,
  isBlankOptionNotRequired: PropTypes.bool,
  dropDownIndicatorText: PropTypes.string,
  isDisabled: PropTypes.bool,
  isSelectLabelTextNotRequired: PropTypes.bool,
  errorMessage: PropTypes.string,
  isClearableNotRequired: PropTypes.bool,
  reducedWidth: PropTypes.bool,
  isSortByDataFieldId: PropTypes.bool,
  lableClassName: PropTypes.string,
  isNoneOptionIsRequired: PropTypes.bool,
  pageSize: PropTypes.number,
  tabIndex: PropTypes.number
};

export default SingleDropDown;
