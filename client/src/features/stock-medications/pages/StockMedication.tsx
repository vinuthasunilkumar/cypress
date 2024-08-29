import React, { useState, useCallback, useRef, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import classnames from "classnames";
import { createMapper } from "@automapper/core";
import { classes } from "@automapper/classes";
import { AsyncPaginate, wrapMenuList } from "react-select-async-paginate";
import {
    ActionMeta,
    GroupBase,
    InputActionMeta,
    MultiValue,
    OptionsOrGroups,
} from "react-select";
import { StockMedications, StockMedicationsSupplyConstants, DUPLICATE_STOCK_MED_MESSAGES } from "../../../shared/enum/StockMedicationsEnum";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { IngredientsMenuOptionsList } from "../../custom-medication/pages/IngredientsMenuOptionsList";
import CheckboxOptionsForIngredients from "../../custom-medication/pages/CheckboxOptionsForIngredients";
import DropdownIndicator from "../../../shared/pages/DropdownContainer";
import ValueContainer from "../../custom-medication/pages/ValueContainer";
import { customStyles } from "../../../shared/constants/CustomStylesForDropdown";
import SelectedStockMedications from "./SelectedStockMedications";
import { getStockMedicationSupplyDetailsById, loadMedicationSupplies, saveOrUpdateStockMedications } from "../../../services/StockMedicationsService";
import SingleColumnMultiSelectDD from "../../../shared/pages/SingleColumnMultiSelectDD";
import { DropdownItem } from "../../../models/class/FrequencyAdministration";
import { StockMedicationLocation, StockMedicationSupplyForm, StockMedicationSupplyRequestDto, StockMedicationSupplyRequiredFields, stockMedicationFieldsToValidate } from "../../../models/class/StockMedicationSupply";
import { ValidationSchema } from "./ValidationSchema";
import { AppConstant } from "../../../shared/constants/AppConstant";
import ConfirmDialog from "../../../shared/pages/ConfirmDialog";
import { mapRequestDto } from "./RequestMapper";
import { IStockMedicationSaveResponse } from "../../../models/interface/IStockMedicationSaveResponse";
import { IStockMedication } from "../../../models/interface/IStockMedication";
import { loadUnitsByFacilityId } from "../../../services/CustomerService";
import LoadSpinner from "../../../shared/common-ui/LoadSpinner";

const StockMedication = ({ isStockMedicationOpened,
    addNewMode,
    editStockMedId,
    setIsStockMedicationOpened,
    onOverLayClick,
    onCloseStockMedication,
    onDeleteModalResetFocus,
    onDeleteStockMedication }: Props) => {
    const btnSaveRef = useRef<HTMLButtonElement>(null);
    const btnDeleteStockMedicationsRef = useRef<HTMLButtonElement>(null);
    const hostContext = useSelector((state: RootState) => state.hostContext);
    const [selectedMedicationsSupplies, setSelectedMedicationsSupplies] = useState<IMedicationSearchResults[]>([]); // used for displaying the selected Stock Medications
    const [medicationSupplyNameText, setMedicationSupplyNameText] = useState<string>(""); // used set and display the Ingreident name in Async Paginate
    const [selectedUnits, setSelectedUnits] = useState<DropdownItem[] | null>(null);
    const [unitList, setUnitList] = useState<any[]>([]);
    const [showConfirmCancelModal, setShowConfirmCancelModal] = useState<boolean>(false);
    const [showApiResponseMsg, setShowApiResponseMsg] = useState<boolean>(false);
    const [showErrorSummary, setShowErrorSummary] = useState<boolean>(false);
    const [deleteBtnClicked, setDeleteBtnClicked] = useState<boolean>(false);
    const [editStockMedicationSupplyData, setEditStockMedicationSupplyData] = useState<IStockMedication | null>(null);
    const [errorFields, setErrorFields] = useState<StockMedicationSupplyRequiredFields[]>(stockMedicationFieldsToValidate);
    const [requestResponse, setRequestResponse] = useState({
        textMessage: "",
        alertClassName: "",
    });
    const pageLength: number = 10; // used for displaying the items in Ingredients Multiselect DropDown
    let medicationSupplies: IMedicationSearchResults[] = [];
    let unitListResponse: any[] = [];
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [facilityName, setFacilityName] = useState<string>(hostContext.facilityName!);
    useEffect(() => {
        if (editStockMedId! > 0) {
            loadEditStockMedData(editStockMedId!);

        }
        loadUnitsByFacility();
    }, [])

    useEffect(() => {
        if(isStockMedicationOpened){
        let styleBtn = document.getElementById('close-stock-medication');
        if (styleBtn) {
            styleBtn?.focus();
        }
    }
    }, [isLoadingData])

    const loadUnitsByFacility = async () => {
        if (sessionStorage.getItem("selectedSMSupplyLibraryDetails")) {
            const selectedSMLibraryDetails = JSON.parse(
                sessionStorage.getItem("selectedSMSupplyLibraryDetails")!
            );
            setFacilityName(selectedSMLibraryDetails.description);
            setValue("facilityId", selectedSMLibraryDetails.globalFacilityId, { shouldDirty: false });
            unitListResponse = await loadUnitsByFacilityId(selectedSMLibraryDetails?.globalFacilityId);
            let newextractedResponse = extractUnits(unitListResponse);
            setUnitList(newextractedResponse);
        }
        setIsLoadingData(false);
    }

    const extractUnits = (data: any[]): { value: string; label: string }[] => {
        return data.map(unit => ({ value: unit.id, label: unit.unitName }));
    };

    const loadEditStockMedData = async (id: number) => {
        if (id) {
            const response = await getStockMedicationSupplyDetailsById(id);
            if (response) {
                setValue("id", response.id);
                setValue("facilityId", response.facilityId, { shouldDirty: false });
                setEditStockMedicationSupplyData(response);
                let locations: DropdownItem[] = [];
                response.stockMedicationLocation?.forEach((item) => {
                    const objNew: DropdownItem = {
                        label: item.unitName,
                        value: item.unitId
                    }
                    locations.push(objNew);
                });
                setSelectedUnits(locations);
                let stockMedLocations: StockMedicationLocation[] = [];
                if (locations.length) {
                    locations?.forEach((element: DropdownItem) => {
                        const objNew: StockMedicationLocation = {
                            id: 0,
                            stockMedicationId: response.id,
                            unitId: element.value.toString()
                        };
                        stockMedLocations.push(objNew);
                    });
                } else {
                    setSelectedUnits([]);
                }
                setValue("stockMedicationLocation", stockMedLocations, { shouldDirty: false });
                const obj: IMedicationSearchResults = {
                    id: response.fdbMedicationId,
                    description: response.description,
                    gcnSequenceNumber: response.gcnSequenceNumber,
                    isGeneric: response.isGeneric,
                };
                medicationSupplies.push(obj);
                setSelectedMedicationsSupplies(medicationSupplies);
                let newName = medicationSupplyNameText;
                setMedicationSupplyNameText(newName);
                setValue("fdbMedications", [obj] as IMedicationSearchResults[], { shouldDirty: false });
            }
        }
    }

    const {
        setValue,
        handleSubmit,
        formState: { isDirty },
    } = useForm<StockMedicationSupplyForm>({
        resolver: yupResolver(ValidationSchema),
        defaultValues: {
            fdbMedications: [],
            stockMedicationLocation: [],
            id: 0
        },
        mode: "onChange"
    });

    const sideMenuClasses = classnames("side-menu", {
        "side-menu-active": isStockMedicationOpened,
    });

    const sideMenuContentClasses = classnames("side-menu_content", {
        "side-menu_content-active": isStockMedicationOpened,
        "overflow-auto": isStockMedicationOpened, // new class to enable scrolling
    });

    // loading an Medication Supplies Options into a paginated dropdown
    const loadMedicationSuppliesOptions = async (
        searchQuery: string,
        loadedOptions: OptionsOrGroups<IMedicationSearchResults, GroupBase<IMedicationSearchResults>>,
        { page }: any
    ) => {
        if (
            searchQuery.length < StockMedicationsSupplyConstants.MinSearchCharactersLength
        ) {
            return {
                options: [],
                hasMore: false,
                additional: {
                    page: page + 1,
                },
            };
        }
        let pageNumber = page ?? 1;
        const responseJSON = await loadMedicationSupplies(
            pageNumber,
            searchQuery,
            hostContext.residentId,
            hostContext.baseUrl,
            pageLength
        ).then((response: IMedicationSearchResultsDto) => {
            return response;
        });
        return {
            options: responseJSON?.items?.length > 0 ? responseJSON.items : [],
            hasMore:
                page === StockMedicationsSupplyConstants.MaxMedicationSupplyResultsPagesToBeLoaded
                    ? false
                    : responseJSON?.moreResultsExist,
            additional: {
                page: page + 1,
            },
        }
    }

    const medicationSuppliesMenuList = useCallback(
        wrapMenuList(IngredientsMenuOptionsList),
        []
    );

    // used to add the selected Stock Medication items in a list to display on UI
    const onSelectMedicationSupply = (value: MultiValue<IMedicationSearchResults>, actionMeta: ActionMeta<IMedicationSearchResults>) => {
        if (actionMeta.action === "deselect-option") {
            value = value.filter(x => x.parentFdbMedId != actionMeta.option?.id!);
        }
        if (
            value.filter(x => !x.isGeneric)?.length <= StockMedicationsSupplyConstants.MaxMedicationSupplySelectionLimit
        ) {
            value.forEach((itm: IMedicationSearchResults) => {
                if (itm) {
                    const obj: IMedicationSearchResults = {
                        id: itm.id,
                        description: itm.description,
                        gcnSequenceNumber: itm.hasOwnProperty('elements') ? itm?.elements?.gcnSequenceNumber : itm?.gcnSequenceNumber,
                        isGeneric: itm.hasOwnProperty('isGeneric') ? itm.isGeneric : false,
                        parentFdbMedId: itm.hasOwnProperty('parentFdbMedId') ? itm.parentFdbMedId : itm.id,
                    };
                    if (itm.hasOwnProperty('genericMedication')) {
                        const genericMedObj = {
                            id: itm?.genericMedication?.id!,
                            description: itm?.genericMedication?.description!,
                            isGeneric: true,
                            parentFdbMedId: itm.id,
                            gcnSequenceNumber: itm.hasOwnProperty('elements') ? itm?.elements?.gcnSequenceNumber : itm?.gcnSequenceNumber,
                        }
                        if (itm.description !== itm?.genericMedication?.description! &&
                            itm.id !== itm?.genericMedication?.id
                        ) {
                            medicationSupplies.push(genericMedObj);
                        }
                    }
                    medicationSupplies.push(obj);
                }
            });
            setSelectedMedicationsSupplies([...medicationSupplies]);
            let newName = medicationSupplyNameText;
            setMedicationSupplyNameText(newName);
            setValue("fdbMedications", medicationSupplies, { shouldDirty: true });
            checkValidations("medicationSupplyName", medicationSupplies.length > 0);
        }
    };

    // will be called once a user has entered something to search for Medication / Supply Name
    const onMedicationSupplyNameChanged = useCallback(
        (newInputValue: string, { action }: InputActionMeta) => {
            setMedicationSupplyNameText(newInputValue);
        },
        []
    );

    // will be called once a Dropdown Options List is closed to remove the typed medication / supply name
    const onMedicationSupplyDropdownClosed = () => {
        setMedicationSupplyNameText("");
    };

    // used for removing the selected Stock Medication item from displayed list
    const handleRemoveMedicationSupply = (id: number) => {
        const newList = selectedMedicationsSupplies.filter((item) => item?.id !== id && item.parentFdbMedId !== id);
        setSelectedMedicationsSupplies(newList);
        setValue("fdbMedications", newList, { shouldDirty: true });
        checkValidations("medicationSupplyName", newList.length > 0);
    };

    const btnCancelClick = () => {
        if (isDirty) {
            setShowConfirmCancelModal(true);
        } else {
            document.body.style.overflow = "visible";
            setIsStockMedicationOpened(false);
            onCloseStockMedication(false);
            resetErrorsSummary();
        }
    }

    const resetErrorsSummary = () => {
        errorFields.forEach(x => x.isValid = true);
        setErrorFields([...errorFields]);
    }

    const onSubmitHandler = async (data: any) => {
        const requestIds: number[] = [];
        setShowApiResponseMsg(false);
        const mapper = createMapper({ strategyInitializer: classes() });
        mapRequestDto(mapper, addNewMode!, editStockMedId!);
        const request = mapper.map(
            data,
            StockMedicationSupplyForm,
            StockMedicationSupplyRequestDto
        );
        const saveResponse: IStockMedicationSaveResponse = await saveOrUpdateStockMedications(request);
        request.fdbMedications.forEach(element => {
            if (!element.isGeneric) {
                requestIds.push(element.id);
            }
        });
        const addedItems = saveResponse.ids?.split(',');
        // Below logic is for New medications and Duplicate medication appropriate message to display
        const requestIdsCount: number = requestIds?.length ? requestIds?.length : 0;
        const responseIdsCount: number = addedItems?.length ? addedItems?.length : 0;
        if (requestIdsCount > 0 || responseIdsCount > 0) {
            if (requestIdsCount === responseIdsCount) {
                onCloseStockMedication(true, DUPLICATE_STOCK_MED_MESSAGES.SINGLE());
            } else {
                onCloseStockMedication(true, DUPLICATE_STOCK_MED_MESSAGES.MULTIPLE(responseIdsCount, requestIdsCount));
            }
        } else {
            setRequestResponse({
                textMessage: saveResponse.error!,
                alertClassName: "alert alert-danger",
            });
            setShowApiResponseMsg(true);
        }
    }

    const checkKeysAllowedRowsItem = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    }

    const handleDropDownChange = (
        item: DropdownItem[],
        type: string
    ) => {
        if (type === "ddlUnits") {
            let stockMedLocations: StockMedicationLocation[] = [];
            if (item.length) {
                item?.forEach((element: DropdownItem) => {
                    const objNew: StockMedicationLocation = {
                        id: 0,
                        stockMedicationId: addNewMode ? 0 : editStockMedicationSupplyData?.id!,
                        unitId: element.value.toString()
                    };
                    stockMedLocations.push(objNew);
                });
                setSelectedUnits(item);
            } else {
                setSelectedUnits([]);
            }
            setValue("stockMedicationLocation", stockMedLocations, { shouldDirty: true });
        }
    }

    const checkValidations = (fieldName: string, isValid: boolean, isShowSummary?: boolean) => {
        if (fieldName === "medicationSupplyName") {
            errorFields.find(x => x.fieldName === "medicationSupplyName")!.isValid = isValid;
            setErrorFields([...errorFields]);
            setShowErrorSummary(isShowSummary!);
        }
    }

    const checkValidateForm = () => {
        btnSaveRef?.current?.blur();
        checkValidations("medicationSupplyName", selectedMedicationsSupplies.length > 0, true);
    }

    const overLayClick = () => {
        if (isDirty) {
            setShowConfirmCancelModal(true);
        } else {
            onOverLayClick(isDirty);
        }
    }

    const confirmOk = () => {
        resetErrorsSummary();
        setShowConfirmCancelModal(false);
        onOverLayClick(true);
    }

    const confirmCancel = () => {
        setShowConfirmCancelModal(false);
    }

    const closeApiResponseMsg = () => {
        setShowApiResponseMsg(false);
    }

    const onErrorDialogClose = () => {
        setShowErrorSummary(false);
    }

    const getErrorsCountMessage = () => {
        let errorFieldCount = errorFields.filter(x => !x.isValid).length;
        if (errorFieldCount === 0) {
            setShowErrorSummary(false);
        }
        return errorFieldCount === 1 ? `${errorFieldCount} Error found` : `${errorFieldCount} Errors found`;
    }

    useEffect(() => {
        if (onDeleteModalResetFocus) {
            setDeleteBtnClicked(false);
        }
    }, [onDeleteModalResetFocus, deleteBtnClicked])

    const navigateAndSetFocus = (fieldName: string) => {
        document?.getElementById(fieldName)?.scrollIntoView({ behavior: 'smooth' });
    }

    const btnDeleteStockMedicationsClick = () => {
        btnDeleteStockMedicationsRef.current?.blur();
        onDeleteStockMedication(editStockMedId!);
        setDeleteBtnClicked(true);
    }

    const btnCloseStockMedicationFocus = () => {
        let styleBtn = document.getElementById('close-stock-medication');
        if (styleBtn) {
            styleBtn?.focus();
        }
    }

    return (
        <div className={`import-list ${sideMenuClasses}`}>
            {isLoadingData ? (
                <LoadSpinner />
            ) : (
                <>
                    <div className="side-menu_overlay" onClick={overLayClick} role="none" />
                    <div className={`stock-med--suuply-content ${sideMenuContentClasses} d-flex flex-column add-stock-slider justify-content-between`}>
                        <form className="custom-form"
                            noValidate
                            data-testid="form"
                            onSubmit={handleSubmit(onSubmitHandler)}>
                            <div className="row import-list-header pl-lg-3 pt-lg-3 m-0">
                                <h2 className="header">{
                                    addNewMode ? StockMedications.AddStockMedicationDialogTitle :
                                        StockMedications.EditStockMedicationDialogTitle
                                }</h2>
                                <div className="row">
                                    <button type="button"
                                        className="close-import-list close-btn"
                                        id="close-stock-medication"
                                        data-testid="close-stock-medication"
                                        onClick={btnCancelClick}
                                        tabIndex={204}
                                        onKeyDown={(event) => { event.key === "Tab" && event.shiftKey && event.preventDefault() }}
                                        onKeyUp={(event) => { event.type === "keydown" && event.key === "Enter" && btnCancelClick }}
                                    >
                                        <i className="fa fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="container-fluid side-bar_content">
                                <div className="row m-0">
                                    {
                                        showErrorSummary && (
                                            <div className="col-md-12 p-0 mt-1">
                                                <div className="alert alert-danger mb-0">
                                                    <i
                                                        id="alert-error-close-btn"
                                                        data-testid="alert-error-close-btn"
                                                        className="alert-close"
                                                        aria-hidden="true"
                                                        onClick={onErrorDialogClose}
                                                    ></i>
                                                    {
                                                        <h6 id="num-of-errors-found">
                                                            {getErrorsCountMessage()}
                                                        </h6>
                                                    }
                                                    <div className="alert-message-container">
                                                        {
                                                            errorFields.map((item) => (
                                                                <div key={item.fieldId}>
                                                                    <button type="button"
                                                                        data-testid="focusToField"
                                                                        onClick={(e) => navigateAndSetFocus(item.fieldId)}
                                                                        onKeyDown={(e) => navigateAndSetFocus(item.fieldId)}
                                                                        className="error-message-button"
                                                                    >
                                                                        {item.label}
                                                                    </button>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="row m-0">
                                    {showApiResponseMsg && (
                                        <div className="col-md-12 p-0 mt-1">
                                            {requestResponse.alertClassName && requestResponse.textMessage && (
                                                <div className={requestResponse.alertClassName} role="alert">
                                                    <i
                                                        id="btnCloseApiRespMsg"
                                                        data-testid="alert-error-close-btn"
                                                        className="alert-close"
                                                        aria-hidden="true"
                                                        onClick={closeApiResponseMsg}
                                                    ></i>
                                                    {requestResponse.textMessage}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {
                                    addNewMode ? (
                                        <>
                                            <div className="row m-0 p-0">
                                                <div className="col-md-12 m-0 p-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="form-group col-md-12 m-0 p-0 mb-0 input-required">
                                                            <label className={`col-form-label p-0 ${errorFields.find(x => x.fieldName === "medicationSupplyName")?.isValid === false ? "has-error-label" : ""}`} htmlFor="txtMedicationSupplyName">
                                                                Medication/Supply
                                                            </label>
                                                            {selectedMedicationsSupplies?.length > 0 && (
                                                                <>
                                                                    <span className="badge badge-default ml-1">
                                                                        {selectedMedicationsSupplies.filter(x => !x.isGeneric).length}
                                                                    </span>
                                                                    <span className="max-selection-warning-msg">
                                                                        {
                                                                            StockMedications.StockMedMaxSelectionMsg
                                                                        }
                                                                    </span>
                                                                </>
                                                            )}
                                                            <div className="input-group ingredient-multiselect">
                                                                <AsyncPaginate
                                                                    id="medicationSupplyName"
                                                                    inputId="txtMedicationSupplyName"
                                                                    name="medicationSupplyName"
                                                                    loadOptions={loadMedicationSuppliesOptions}
                                                                    closeMenuOnSelect={false}
                                                                    getOptionValue={(option) => option.description}
                                                                    getOptionLabel={(option: { description: string }) =>
                                                                        option.description
                                                                    }
                                                                    onChange={(
                                                                        newValue: MultiValue<IMedicationSearchResults>,
                                                                        actionMeta: ActionMeta<IMedicationSearchResults>
                                                                    ) => onSelectMedicationSupply(newValue, actionMeta)}
                                                                    isSearchable={true}
                                                                    isMulti={true}
                                                                    noOptionsMessage={() =>
                                                                        medicationSupplyNameText.length <
                                                                            StockMedicationsSupplyConstants.MinSearchCharactersLength
                                                                            ? StockMedications.SearchCharactersLimitMessage
                                                                            : StockMedications.NoMatchesFound
                                                                    }
                                                                    loadingMessage={() =>
                                                                        StockMedications.LoadingMedicationSupplyMessage
                                                                    }
                                                                    onInputChange={onMedicationSupplyNameChanged}
                                                                    hideSelectedOptions={false}
                                                                    components={{
                                                                        MenuList: medicationSuppliesMenuList,
                                                                        Option: (props) => (
                                                                            <CheckboxOptionsForIngredients
                                                                                {...props}
                                                                                selectedIngredientsCount={selectedMedicationsSupplies.filter(x => !x.isGeneric).length}
                                                                            />
                                                                        ),
                                                                        ClearIndicator: () => null,
                                                                        IndicatorSeparator: () => null,
                                                                        DropdownIndicator: DropdownIndicator,
                                                                        ValueContainer: ValueContainer,
                                                                    }}
                                                                    styles={customStyles}
                                                                    value={selectedMedicationsSupplies}
                                                                    inputValue={medicationSupplyNameText}
                                                                    placeholder="Search query here"
                                                                    onMenuClose={onMedicationSupplyDropdownClosed}
                                                                    openMenuOnFocus={true}
                                                                    tabIndex={205}
                                                                    backspaceRemovesValue={false}
                                                                    additional={{
                                                                        page: 1,
                                                                    }}
                                                                    onKeyDown={(event: React.KeyboardEvent<any>) => checkKeysAllowedRowsItem(event)}
                                                                />

                                                                {selectedMedicationsSupplies.filter(x => !x.isGeneric).length === 0 && errorFields.find(x => x.fieldName === "medicationSupplyName")?.isValid === false && (
                                                                    <span className="invalid-feedback-message">
                                                                        {StockMedications.MedicationRequiredMessage}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {selectedMedicationsSupplies.filter(x => !x.isGeneric)?.length == 0 && (
                                                                <span className="field-warning-message float-left">
                                                                    {StockMedications.NoMedicationSupplySelectedMessage}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row m-0 p-0">
                                                <div className="inline-message im-notification col-md-12 p-0 pb-0">
                                                    <span className="ml-1">{StockMedications.StockMedGenericMessage}</span>
                                                </div>
                                            </div>
                                            {selectedMedicationsSupplies?.length > 0 && (
                                                <SelectedStockMedications
                                                    selectedMedications={selectedMedicationsSupplies}
                                                    handleRemoveMedicationSupply={handleRemoveMedicationSupply}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="row mt-1 m-0 p-0">
                                                <div className="col-md-12 grayborder-box p-0">
                                                    <div className="form-group mb-0 p-1">
                                                        <label htmlFor="medication-supply" className={`col-form-label p-0`}>Medication/Supply</label><br />
                                                        <span id="medication-supply">{editStockMedicationSupplyData?.description}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </>
                                    )
                                }
                                <div className="row mt-3 m-0 p-0">
                                    <div className="col-md-12 p-0 assigned-to-box">
                                        <div className="form-group mb-0 p-1">
                                            <label htmlFor="summary" className={`col-form-label p-0`}>Facility</label><br />
                                            <span id="summary">
                                                {addNewMode ? facilityName :
                                                    editStockMedicationSupplyData?.facilityName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row m-0">
                                    <div className="col-md-12 m-0 p-0">
                                        <SingleColumnMultiSelectDD
                                            id="ddlUnits"
                                            dataFieldId="value"
                                            dataFieldValue="label"
                                            datafile={unitList}
                                            isSearchable={true}
                                            icon={null}
                                            placeholder="Select..."
                                            value={selectedUnits}
                                            isSearchIconNotRequired={true}
                                            isBlankOptionNotRequired={true}
                                            selectLabelText="Unit"
                                            isClearableNotRequired={true}
                                            hideSelectedValues={true}
                                            onChange={(id) => handleDropDownChange(id, "ddlUnits")}
                                            tabIndex={222}
                                        />
                                    </div>
                                </div>
                                {
                                    selectedUnits?.length! > 0 && (
                                        <div className="row m-0 p-0">
                                            <div className="col-md-12 p-0 assigned-to-box">
                                                <div className="form-group mb-0 p-1">
                                                    <label htmlFor="selectedUnits" className={`col-form-label p-0`}>Selected Units</label><br />
                                                    <span id="selectedUnits">
                                                        {
                                                            selectedUnits?.map((item, index) => (
                                                                <span key={item.value}>
                                                                    {item.label}
                                                                    {index !== selectedUnits.length - 1 && ', '}
                                                                </span>
                                                            ))
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="d-flex justify-content-end import-footer-content px-4">
                                {
                                    !addNewMode && (
                                        <button
                                            type="button"
                                            data-testid="btnSingleDeleteStockMedication"
                                            className="btn btn-danger"
                                            ref={btnDeleteStockMedicationsRef}
                                            onClick={btnDeleteStockMedicationsClick}
                                            tabIndex={223}
                                        >
                                            Delete
                                        </button>
                                    )
                                }
                                <button
                                    type="submit"
                                    id="btnSave"
                                    data-testid="btnSave"
                                    ref={btnSaveRef}
                                    className="btn btn-success"
                                    onClick={checkValidateForm}
                                    tabIndex={224}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    id="btnCancel"
                                    data-testid="cancelButtonStockMedication"
                                    className="btn btn-cancel float-right"
                                    data-dismiss="modal"
                                    onClick={btnCancelClick}
                                    onBlur={btnCloseStockMedicationFocus}
                                    tabIndex={225}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        <ConfirmDialog
                            showConfirmModal={showConfirmCancelModal}
                            iconClass={AppConstant.ConfirmDialogWarningIcon}
                            title={StockMedications.DialogTitle}
                            messageTitle={
                                StockMedications.DataLossWarningMessage
                            }
                            messageContent={
                                StockMedications.DataLossWarningMessageContent
                            }
                            confirmButtonText={
                                AppConstant.ConfirmDialogYesButton
                            }
                            cancelButtonText={
                                AppConstant.ConfirmDialogNoButton
                            }
                            confirmOk={confirmOk}
                            confirmCancel={confirmCancel}
                        ></ConfirmDialog>
                    </div>
                </>
            )
            }
        </div>
    )
}
export default StockMedication;

export type Props = {
    isStockMedicationOpened?: boolean;
    addNewMode?: boolean;
    editStockMedId?: number;
    setIsStockMedicationOpened: (isOpened: boolean) => void;
    onCloseStockMedication: (isSucceed: boolean, message?: string) => void;
    onOverLayClick: (isModified: boolean) => void;
    onDeleteStockMedication: (id: number) => void;
    onDeleteModalResetFocus: boolean;
};