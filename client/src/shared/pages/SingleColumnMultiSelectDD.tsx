import React, { useCallback, useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import type { OptionType } from "./../type/OptionType";
import type { GroupBase, OptionsOrGroups } from "react-select";
import { components } from "react-select";
import PropTypes from "prop-types";
import { getBoxShadow } from "../../helper/Utility";
import { ICheckboxOptionsForDropdownProps } from "../../models/interface/ICheckboxOptionsForDropdownProps";

const SingleColumnMultiSelectDD = (props: any) => {
    const [isClearable, setIsClearable] = useState(props.isClearable === undefined);
    const options: OptionType[] = [];
    const datafile = Array.isArray(props.datafile) ? props.datafile : [];
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    if (
        !props.isBlankOptionNotRequired &&
        !datafile.some((element: any) => element[props.dataFieldId] === null)
    ) {
        datafile.push({
            [props.dataFieldValue]: "",
            [props.dataFieldId]: null,
        });
    }

    useEffect(() => {
        if (props.isMaxSelectionRequired) {
            setSelectedOptions(props.value === null ? [] : [props.value]);
        }
    }, [props.maxSelection, props.isMaxSelectionRequired])

    datafile
        .sort((a: any, b: any) => {
            return a[props.dataFieldId] - b[props.dataFieldId];
        })
        .forEach((element: any) => {
            options.push({
                value: element[props.dataFieldId],
                label: element[props.dataFieldValue],
                id: element.id,
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

        if (!props.isClearableNotRequired && isClearable && props.value.label === "") {
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
        const { value } = selectProps.selectProps;
        const selectedValues = Array.isArray(value) ? value : [value];
        const sortedValues = selectedValues.slice().sort((a, b) => a.id - b.id);
        return (
            components.ValueContainer && (
                <components.ValueContainer {...selectProps}>
                    {
                        !props.hideSelectedValues ? (
                            sortedValues?.map((value: any, index: number) => (
                                <React.Fragment key={value?.value ? value?.value : index}>
                                    <div style={{ display: 'inline-block', marginLeft: 11 }}>
                                        {value?.label}
                                    </div>
                                    {index !== sortedValues?.length - 1 && ','}
                                </React.Fragment>
                            ))
                        ) : (
                            <></>
                        )
                    }
                    {children}
                </components.ValueContainer>
            ));
    }, []);

    const DropdownIndicator = useCallback(({ children, ...selectProps }: any) => {
        return (
            <components.DropdownIndicator {...selectProps} >
                {props.dropDownIndicatorText ? (
                    <span className="dropdown-indicator-text" >
                        {props.dropDownIndicatorText}
                    </span>
                ) : (
                    <i className="fa fa-caret-down up-down-caret" />
                )}
            </components.DropdownIndicator>
        );
    }, []);

    const customStyles = {
        menuOptStyle: (provided: any) => ({
            ...provided,
            overflowY: "auto",
            maxHeight: "400px",
        }),
        control: (provided: any, state: { isFocused: any }) => ({
            ...provided,
            borderRadius: "5px",
            borderColor: props.errorMessage === "" || props.errorMessage === undefined ? "#888" : "#DC3545",
            boxShadow: getBoxShadow(state.isFocused, props.errorMessage === "" || props.errorMessage === undefined)
        }),
        option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? "#D3D3D3"
                : state.isSelected
                    ? "#D3E3F8"
                    : null,
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
        if (
            option?.length <= props.maxSelection && props.isMaxSelectionRequired
        ) {
            setSelectedOptions(option);
            changeAndSetOption(option);
        } else if (!props.isMaxSelectionRequired) {
            changeAndSetOption(option)
        }
    }

    const changeAndSetOption = (option: any) => {
        if (typeof props.onChange === "function") {
            props.onChange(option);
        }
        if (option && option?.label === "") {
            setIsClearable(false);
        } else {
            setIsClearable(true);
        }
    }

    const checkKeysAllowedRowsItem = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    }

    const onChecked = (e: any) => { };

    const CheckboxOptionsForDropdown: React.FC<ICheckboxOptionsForDropdownProps> = ({
        selectedCount,
        isSelected,
        data,
        ...rest
    }: any) => {
        return (
            <components.Option {...rest}>
                <input
                    type="checkbox"
                    className="ingredient-med-grp-chkbox"
                    name={data.label}
                    onChange={onChecked}
                    checked={isSelected}
                    disabled={Number(selectedCount) === props.maxSelection && props.isMaxSelectionRequired && !isSelected}
                />
                <label
                    className={`ingredients-med-group-label ${Number(selectedCount) === props.maxSelection && props.isMaxSelectionRequired && !isSelected ? "isDisabled" : ""}`}
                    htmlFor={data.label}
                    data-testid={data.label}
                >
                    {data.label}
                </label>
            </components.Option>
        );
    }

    return (
        <div className="form-group mb-0">
            <label className={`col-form-label pl-0 ${props.errorMessage ? 'has-error-label' : ''}`} htmlFor={props.selectLabelText}>
                <span className={props.isSelectLabelTextNotRequired ? "hideLabel" : "showLabel"}>
                    {props.selectLabelText} {props.icon}
                </span>
            </label>
            <div className="input-group custom-multi-select">
                <AsyncPaginate
                    data-testid={props.id}
                    className={props.id}
                    required={props.isRequired}
                    inputId={props.selectLabelText}
                    value={props.value || ""}
                    loadOptions={loadItemssOptions}
                    onChange={onChange}
                    isSearchable={props.isSearchable}
                    closeMenuOnSelect={false}
                    components={{
                        DropdownIndicator: DropdownIndicator,
                        Option: (props) => (
                            <CheckboxOptionsForDropdown
                                {...props}
                                selectedCount={selectedOptions.length}
                            />
                        ),
                        ValueContainer: ValueContainer,
                        IndicatorSeparator: null,
                    }}
                    styles={customStyles}
                    hideSelectedOptions={false}
                    isClearable={isClearable && !props.isClearableNotRequired}
                    isMulti={true}
                    isDisabled={props.isDisabled}
                    backspaceRemovesValue={false}
                    classNamePrefix={`input-field-select ${props.selectLabelText}`}
                    placeholder={props.placeholder}
                    openMenuOnFocus={false}
                    onKeyDown={(event: React.KeyboardEvent<any>) => checkKeysAllowedRowsItem(event)}
                    tabIndex={props.tabIndex ? props.tabIndex : 0}  
                />
            </div>
            <div className="invalid-feedback-message" >
                {props.errorMessage}
            </div>
        </div>
    );
};

SingleColumnMultiSelectDD.propTypes = {
    id: PropTypes.string,
    value: PropTypes.any,
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
    isMulti: PropTypes.bool,
    hideSelectedValues: PropTypes.bool,
    maxSelection: PropTypes.number,
    isMaxSelectionRequired: PropTypes.bool,
    tabIndex:PropTypes.number
};

export default SingleColumnMultiSelectDD;
