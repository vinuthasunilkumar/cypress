import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import OrderTypes from "../../../assets/static-files/OrderTypes.json";
import SingleDropDown from "../../../shared/pages/SingleDropDown";
import MedicationTypes from "../../../assets/static-files/MedicationTypes.json";
import { GroupBase, OptionsOrGroups, components } from "react-select";
import { CustomMedicationsConstants } from "../../../shared/enum/CustomMedicationsConstants";
import { loadDrugNames, loadMedicationGroups } from "../../../services/FrequencyAdministrationService";
import DropdownIndicator from "../../../shared/pages/DropdownContainer";
import { FrequencyAdministration } from "../../../shared/enum/FrequencyAdministrationValidationMessages";
import { getBoxShadow } from "../../../helper/Utility";
import { AddScheduleRequiredFields, DropdownItem, OrderTypeFields } from "../../../models/class/FrequencyAdministration";
import { IAdministrationSchedule } from "../../../models/interface/IAdministrationSchedule";
import { Order_Type_Messages } from "../../../shared/enum/FrequencyAdministration";

const OrderType = forwardRef((props: any, ref) => {
    const pageLength = 10; // used for displaying the items in Options Multiselect DropDown
    const residentId = props?.hostContext?.residentId;
    const baseUrl = props?.hostContext?.baseUrl;
    const [isOrderTypeBlank, setIsOrderTypeBlank] = useState<boolean>(true);
    const [selectedOrderType, setSelectedOrderType] = useState<DropdownItem | null>();
    const defaultMedicationType: DropdownItem = { value: "0", label: "" };
    const [selectedMedicationType, setSelectedMedicationType] = useState<DropdownItem | null>(defaultMedicationType);
    const [selectedDrugName, setSelectedDrugName] = useState<any>("");
    const [lblDrugName, setLblDrugName] = useState<string>("All");
    const [lblDrugNameErrorMessage, setLblDrugNameErrorMessage] = useState<string>("");
    const [isControlValid, setIsControlValid] = useState<boolean>(true);
    const [medicationTypeErrorMessage, setMedicationTypeErrorMessage] = useState<string>("");
    const [selectedOrderObj, setSelectedOrderObj] = useState<OrderTypeFields>(new OrderTypeFields());

    let orderTypeRequiredFields: AddScheduleRequiredFields[] = [
        {
            fieldName: "medicationType",
            fieldId: "medicationType",
            label: "Medication Type",
            errorMessage: FrequencyAdministration.MedicationTypeRequiredMessage,
            isDependent: false,
            isValid: true
        },
        {
            fieldName: "all",
            fieldId: "all-medicationGroup",
            label: "All",
            errorMessage: FrequencyAdministration.DrugNameRequiredMessage,
            isDependent: false,
            isValid: true
        },
        {
            fieldName: "drugName",
            fieldId: "drugName-medicationGroup",
            label: "Drug Name",
            errorMessage: FrequencyAdministration.DrugNameRequiredMessage,
            isDependent: false,
            isValid: true
        },
        {
            fieldName: "medicationGroup",
            fieldId: "drugName-medicationGroup",
            label: "Medication Group",
            errorMessage: FrequencyAdministration.MedicationGroupRequiredMessage,
            isDependent: false,
            isValid: true
        }
    ]

    useEffect(() => {
        resetOrderType();
        if (props.editScheduleData)
            setEditScheduleData(props.editScheduleData);
    }, [props.addNewMode, props.editScheduleData, props.resetOrderData]);

    const setEditScheduleData = (editScheduleData: IAdministrationSchedule) => {
        if (editScheduleData && editScheduleData.orderType >= 0) {
            if (props.presetAdministrationScheduleId !== editScheduleData.id) {
                const orderTypeData = OrderTypes.find(x => x.id === editScheduleData.orderType?.toString());
                if (orderTypeData) {
                    let newOrderTypeData = {
                        id: orderTypeData?.value,
                        value: orderTypeData?.id,
                    }
                    setSelectedOrderType(newOrderTypeData as DropdownItem);
                    setIsOrderTypeBlank(false);
                    selectedOrderObj.orderTypeId = newOrderTypeData?.value === null ? 0 : Number(newOrderTypeData.value);
                    const newMedData = MedicationTypes.find(x => x.id === editScheduleData.medicationType.toString());
                    if (newMedData) {
                        let newMedTypeData = {
                            id: newMedData?.value,
                            value: newMedData?.id,
                        }
                        setSelectedMedicationType(newMedTypeData as DropdownItem);
                        setLblDrugName(newMedTypeData.id);
                        selectedOrderObj.medicationType = newMedTypeData?.value === null ? 0 : Number(newMedTypeData.value);
                        selectedOrderObj.medicationTypeName = newMedTypeData.id;
                    }
                    selectedOrderObj.fdbMedGroupId = editScheduleData.medicationType === 1 ? 0 : editScheduleData.fdbMedGroupId!;
                    selectedOrderObj.fdbMedGroupName = editScheduleData.medicationType === 1 ? null : editScheduleData.fdbMedGroupName;
                    selectedOrderObj.fdbDrugId = editScheduleData.medicationType === 1 ? editScheduleData.fdbDrugId! : 0;
                    selectedOrderObj.fdbDrugName = editScheduleData.medicationType === 1 ? editScheduleData.fdbDrugName : null;
                    let drugDetails = {
                        id: editScheduleData.medicationType === 1 ?
                            editScheduleData.fdbDrugId! :
                            editScheduleData.fdbMedGroupId!,
                        description: editScheduleData.medicationType === 1 ?
                            editScheduleData.fdbDrugName :
                            editScheduleData.fdbMedGroupName
                    }

                    setSelectedDrugName(drugDetails);
                    selectedOrderObj.orderTypeSummary = setOrderTypeSummary(orderTypeData?.value?.toString()!,
                    newMedData?.value.toString()!, drugDetails?.description?.toString()!);
                    let userSelectedOrderObj = selectedOrderObj;
                    setSelectedOrderObj(userSelectedOrderObj);
                    props.handleOrderTypeData(userSelectedOrderObj, false);
                }
            }
            else {
                let userSelectedOrderObj = selectedOrderObj;
                setSelectedOrderObj(userSelectedOrderObj);
                props.handleOrderTypeData(userSelectedOrderObj, true);
            }
        } else {
            setIsOrderTypeBlank(true);
            setSelectedOrderType(null);
            setSelectedMedicationType(null);
            resetOrderTypeDataValues();
            orderTypeRequiredFields.find((x) => x.fieldName === "medicationType")!.isValid = true;
            orderTypeRequiredFields.find((x) => x.fieldName === "drugName")!.isValid = true;
            orderTypeRequiredFields.find((x) => x.fieldName === "medicationGroup")!.isValid = true;
            setIsOrderTypeBlank(true);
            props.handleOrderTypeData(selectedOrderObj, false);
        }
    }

    const resetOrderType = () => {
        if (props.orderType == null || props.orderType === 0) {
            setSelectedOrderType(null);
            setIsOrderTypeBlank(true);
            resetOrderTypeDataValues();
            let newSelectedOrderObj = selectedOrderObj;
            setSelectedOrderObj(newSelectedOrderObj);
            props.handleOrderTypeData(newSelectedOrderObj, false);
        }
    }

    useImperativeHandle(ref, () => ({
        validateOrderTypeControls() {
            return isValidData();
        }
    }));

    const isValidData = () => {
        const isValid = setErrorMessage(selectedDrugName);
        props.validatedOrderTypesFields(orderTypeRequiredFields);
        return isValid;
    };

    const customStyles = {
        control: (provided: any, state: { isFocused: any }) => ({
            ...provided,
            borderRadius: props.id === "ddlDiagnoses" ? "0rem" : ".25rem",
            borderColor: isControlValid ? "#888" : "#DC3545",
            boxShadow: getBoxShadow(state.isFocused, isControlValid)
        }),
        dropdownIndicator: (provided: any, state: any) => ({
            ...provided,
            transform: state.selectProps.menuIsOpen && "rotate(180deg)",
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

    // Loading an Options into a paginated dropdown
    const loadOptions = async (
        searchQuery: string,
        loadedOptions: OptionsOrGroups<IDrugSearchResults, GroupBase<IDrugSearchResults>>,
        { page }: any
    ) => {
        if (lblDrugName === "Drug Name") {
            if (
                searchQuery.length < CustomMedicationsConstants.MinSearchCharactersLength
            ) {
                return {
                    options: [],
                    hasMore: false,
                    additional: {
                        page: page + 1,
                    },
                };
            }
            let pageNumber = page ? page : 1;
            const searchResults = loadDrugNames(
                pageNumber,
                searchQuery,
                pageLength
            ).then((response: IDrugSearchResultsDto) => {
                return response;
            });
            const drugNamesResponse = await searchResults;
            return {
                options: drugNamesResponse?.items?.length > 0 ? drugNamesResponse.items : [],
                hasMore:
                    page === CustomMedicationsConstants.MaxIngredientsResultsPagesToBeLoaded
                        ? false
                        : drugNamesResponse?.moreResultsExist,
                additional: {
                    page: page + 1,
                },
            };
        } else {
            if (
                searchQuery.length < CustomMedicationsConstants.MinSearchCharactersLength
            ) {
                return {
                    options: [],
                    hasMore: false,
                    additional: {
                        page: page + 1,
                    },
                };
            }
            //Medication Group
            let pageNumber = page ? page : 1;
            const searchResults = loadMedicationGroups(
                pageNumber,
                searchQuery,
                residentId,
                baseUrl
            ).then((response: IMedicationSearchResultsDto) => {
                return response;
            });
            const medicationGroupResponse = await searchResults;
            return {
                options: medicationGroupResponse.items.length > 0 ? medicationGroupResponse.items : [],
                hasMore: medicationGroupResponse.moreResultsExist,
                additional: {
                    page: page + 1,
                },
            };
        }
    };

    const resetOrderTypeDataValues = () => {
        selectedOrderObj.orderTypeId = 0;
        selectedOrderObj.medicationType = null;
        selectedOrderObj.fdbDrugId = 0;
        selectedOrderObj.fdbDrugName = "";
        selectedOrderObj.fdbMedGroupId = 0;
        selectedOrderObj.fdbMedGroupName = "";
        selectedOrderObj.medicationTypeName = "";
        selectedOrderObj.orderTypeName = "";
        selectedOrderObj.orderTypeSummary = "All"
        let newSelectedOrderObj = selectedOrderObj;
        setSelectedOrderObj(newSelectedOrderObj);
    }

    const handleDropDownChange = (
        id: DropdownItem,
        type: string
    ) => {
        setSelectedDrugName("");
        setIsControlValid(true);
        orderTypeRequiredFields.find((x) => x.fieldName === "all")!.isValid = true;
        orderTypeRequiredFields.find((x) => x.fieldName === "drugName")!.isValid = true;
        orderTypeRequiredFields.find((x) => x.fieldName === "medicationGroup")!.isValid = true;
        selectedOrderObj.fdbDrugName = "";
        selectedOrderObj.fdbMedGroupName = "";
        switch (type) {
            case "orderType":
                setSelectedOrderType(id);
                setMedicationTypeErrorMessage("");
                if (id?.value) {
                    setIsOrderTypeBlank(false);
                    setSelectedOrderType(id);
                    setSelectedMedicationType(defaultMedicationType);
                    selectedOrderObj.orderTypeId = id?.value === null ? 0 : Number(id.value);
                    selectedOrderObj.medicationType = Number(defaultMedicationType?.value);
                    selectedOrderObj.orderTypeName = id?.label?.toString();
                    selectedOrderObj.orderTypeSummary = id?.label?.toString() + ", All";
                }
                else {
                    setIsOrderTypeBlank(true);
                    setSelectedOrderType(null);
                    setSelectedMedicationType(null);
                    resetOrderTypeDataValues();
                    selectedOrderObj.orderTypeSummary = "All";
                    orderTypeRequiredFields.find((x) => x.fieldName === "medicationType")!.isValid = true;
                }
                break;
            case "medicationType":
                if (id?.value) {
                    orderTypeRequiredFields.find((x) => x.fieldName === "medicationType")!.isValid = true;
                    setMedicationTypeErrorMessage("");
                    if (id.label === MedicationTypes[0].value) {
                        setLblDrugName("All");
                        id.label = "All"
                        setSelectedMedicationType(id);
                        selectedOrderObj.fdbMedGroupId = 0;
                        selectedOrderObj.fdbDrugId = 0;
                    }
                    if (id.label === MedicationTypes[1].value) {
                        setLblDrugName("Drug Name");
                        selectedOrderObj.fdbMedGroupId = 0;
                        setSelectedMedicationType(id);
                    }
                    if (id.label === MedicationTypes[2].value) {
                        setLblDrugName("Medication Group");
                        selectedOrderObj.fdbDrugId = 0;
                        setSelectedMedicationType(id);
                    }
                    selectedOrderObj.medicationType = id?.value === null ? 0 : Number(id.value);
                    selectedOrderObj.medicationTypeName = id.label.toString()
                    selectedOrderObj.orderTypeSummary = setOrderTypeSummary(selectedOrderType?.label?.toString()!, id.label.toString(), "");
                }
                else {
                    setSelectedMedicationType(null);
                    selectedOrderObj.medicationTypeName = "";
                    selectedOrderObj.fdbMedGroupName = "";
                    selectedOrderObj.fdbDrugName = "";
                    selectedOrderObj.medicationType = 0;
                    selectedOrderObj.fdbDrugId = 0;
                    selectedOrderObj.fdbMedGroupId = 0;
                    selectedOrderObj.orderTypeSummary = setOrderTypeSummary(selectedOrderType?.label?.toString()!, "", "");
                    orderTypeRequiredFields.find((x) => x.fieldName === "medicationType")!.isValid = false;
                    if (id === null) {
                        setMedicationTypeErrorMessage(FrequencyAdministration.MedicationTypeRequiredMessage);
                    } else {
                        setMedicationTypeErrorMessage("");
                    }
                }
                break;
        }
        let newSelectedOrderObj = selectedOrderObj;
        setSelectedOrderObj(newSelectedOrderObj);
        props.handleOrderTypeData(newSelectedOrderObj, true);
        props.validatedOrderTypesFields(orderTypeRequiredFields);
    };

    const setOrderTypeSummary = (type: string, drugType: string, drugName: string) => {
        let orderSummaryString = "";
        if (type) {
            orderSummaryString += Order_Type_Messages.orderTypeName(type);
        }
        if (drugType !== "") {
            orderSummaryString += Order_Type_Messages.medicationType!(drugType);
        }
        if (drugName) {
            orderSummaryString += Order_Type_Messages.medicationName!(drugName);
        }
        return orderSummaryString;
    }

    const onDrugNameChanged = (value: any) => {
        setSelectedDrugName(value);
        setErrorMessage(value);
        if (lblDrugName === "Drug Name") {
            selectedOrderObj.fdbDrugId = value?.value === null ? 0 : value?.id;
            selectedOrderObj.fdbDrugName = value?.description;
            selectedOrderObj.fdbMedGroupName = "";
        } else if (lblDrugName === "Medication Group") {
            selectedOrderObj.fdbMedGroupId = value?.value === null ? 0 : value?.id;
            selectedOrderObj.fdbMedGroupName = value?.description;
            selectedOrderObj.fdbDrugName = "";
        }
        selectedOrderObj.orderTypeSummary = setOrderTypeSummary(selectedOrderType?.label?.toString()!, selectedMedicationType?.label.toString()!, value?.description);
        let newSelectedOrderObj = selectedOrderObj;
        setSelectedOrderObj(newSelectedOrderObj);
        props.handleOrderTypeData(newSelectedOrderObj, true);
        props.validatedOrderTypesFields(orderTypeRequiredFields);
    }

    const setErrorMessage = (drugName: any) => {
        if (lblDrugName === "Drug Name") {
            setLblDrugNameErrorMessage(FrequencyAdministration.DrugNameRequiredMessage);
        } else if (lblDrugName === "Medication Group") {
            setLblDrugNameErrorMessage(FrequencyAdministration.MedicationGroupRequiredMessage);
        }
        if (selectedOrderType ?? "") {
            if (selectedMedicationType === null) {
                orderTypeRequiredFields.find((x) => x.fieldName === "medicationType")!.isValid = false;
                orderTypeRequiredFields.find((x) => x.fieldName === "all")!.isValid = true;
                orderTypeRequiredFields.find((x) => x.fieldName === "drugName")!.isValid = true;
                orderTypeRequiredFields.find((x) => x.fieldName === "medicationGroup")!.isValid = true;
            }
            if (((drugName ?? "") && (selectedMedicationType ?? "")) || (lblDrugName === "All")) {
                setIsControlValid(true);
                setFieldValidationStatus(lblDrugName, true);
                return true;
            } else {
                setIsControlValid(false);
                if (selectedMedicationType !== null) {
                    setFieldValidationStatus(lblDrugName, false);
                }
                return false;
            }
        } else {
            return true;
        }
    }

    const setFieldValidationStatus = (lblDrugName: string, status: boolean) => {
        if (lblDrugName === "Drug Name") {
            orderTypeRequiredFields.find((x) => x.fieldName === "drugName")!.isValid = status;
        } else if (lblDrugName === "Medication Group") {
            orderTypeRequiredFields.find((x) => x.fieldName === "medicationGroup")!.isValid = status;
        }
    }

    return (
        <>
            <div className="row">
                <div className="form-gorup col-md-4">
                    <SingleDropDown
                        id="orderType"
                        dataFieldId="id"
                        dataFieldValue="value"
                        datafile={OrderTypes}
                        isSearchable={false}
                        icon={null}
                        selectLabelText="Order Type"
                        isSearchIconNotRequired={true}
                        placeholder="Select..."
                        value={selectedOrderType}
                        onChange={(id) => handleDropDownChange(id, "orderType")}
                    />
                </div>
                {
                    !isOrderTypeBlank ? (
                        <div className="form-gorup col-md-4" id="medicationType">
                            <SingleDropDown
                                id="medicationType"
                                dataFieldId="id"
                                dataFieldValue="value"
                                datafile={MedicationTypes}
                                isSearchable={false}
                                icon={null}
                                placeholder="Select..."
                                isBlankOptionNotRequired={true}
                                errorMessage={medicationTypeErrorMessage}
                                selectLabelText="Medication Type"
                                value={selectedMedicationType}
                                onChange={(id) => handleDropDownChange(id, "medicationType")}
                            />
                        </div>) : (<></>)
                }
            </div>
            {
                !isOrderTypeBlank && (selectedMedicationType?.value === "1" || selectedMedicationType?.value === "2") ? (
                    <>
                        <div className="row frequency-medication-group" id="drugName-medicationGroup">
                            <div className="form-group col-md-6">
                                <label className={`col-form-label  ${isControlValid ? '' : 'has-error-label'}`} htmlFor={lblDrugName}>
                                    {lblDrugName}
                                </label>
                                <AsyncPaginate
                                    key={lblDrugName}
                                    id="ddlDrugName"
                                    inputId={lblDrugName}
                                    loadOptions={loadOptions}
                                    isClearable={true}
                                    styles={customStyles}
                                    hideSelectedOptions={true}
                                    value={selectedDrugName}
                                    openMenuOnFocus={true}
                                    onChange={(e: any) => onDrugNameChanged(e)}
                                    getOptionValue={(option) => option.description}
                                    getOptionLabel={(option: { description: string }) => option.description}
                                    components={{
                                        IndicatorSeparator: () => null,
                                        ValueContainer: ValueContainer,
                                        DropdownIndicator: DropdownIndicator
                                    }}
                                    additional={{
                                        page: 1,
                                    }}
                                    isSearchable={true}
                                    placeholder="Search query here"
                                    required={true}
                                    backspaceRemovesValue={false}
                                />
                                {
                                    isControlValid ? (<></>) : (
                                        <span className="invalid-feedback-message">{lblDrugNameErrorMessage}</span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="inline-message im-notification mt-m10px ml-0">
                            Selected drug/medication schedule will also apply to its generic drug/medication
                        </div>
                    </>
                ) : (
                    <></>
                )
            }
        </>
    )
})
export default OrderType;