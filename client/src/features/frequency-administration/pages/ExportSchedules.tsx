import React, { useState, useEffect, useRef } from "react";
import SearchTreeView from "./SearchTreeView";
import { AddScheduleRequiredFields, ExportFrequencyAdministrationRequestDto, DropdownItem, ScheduleLocation } from "../../../models/class/FrequencyAdministration";
import classnames from "classnames";
import SingleDropDown from "../../../shared/pages/SingleDropDown";
import { loadFacilities } from "../../../services/CustomerService";
import { exportSchedulesFieldsToValidate } from "../../../shared/enum/FrequencyAdministration";
import { FrequencyAdministration, SCHEDULE_MESSAGES } from "../../../shared/enum/FrequencyAdministrationValidationMessages";
import { importAdministrationSchedule, exportAdministrationSchedule, importCountAdministrationSchedule } from "../../../services/FrequencyAdministrationService";
import { FacilityDefaultValues } from "../../../shared/enum/ApiEndPoints";
import FocusTrap from "focus-trap-react";

const ExportSchedules = ({ isExportSchedulesOpened,
    setIsExportSchedulesOpened,
    selectedScheduleIds,
    title,
    selectedCount,
    onOverLayClick,
    onCloseExportPopup,
    checkedRoomsData,
    setScheduleLocations,
    updateAssignTo,
    updateCheckedData,
    confirmButtonText,
    cancelButtonText,
    confirmCancel,
    confirmOk,
    isImport }: Props) => {

    const btnExportRef = useRef<HTMLButtonElement>(null);
    const [handleAssignText, setHandleAssignText] = useState<string>('');
    const [checkedData, setCheckedData] = useState<string[]>([]);
    const [locations, setLocations] = useState<ScheduleLocation[]>([]);
    const [selectedFacility, setSelectedFacility] = useState<DropdownItem | null>(null);
    const [facilityOptions, setFacilityOptions] = useState<any[] | null>(null);
    const [errorFields, setErrorFields] = useState<AddScheduleRequiredFields[]>(exportSchedulesFieldsToValidate);
    const [facilityErrorMsg, setFacilityErrorMsg] = useState<string>("");
    const [showUnits, setShowUnits] = useState<boolean>(false);
    const [showErrorSummary, setShowErrorSummary] = useState<boolean>(false);
    const [isDefault, setIsDefault] = useState<boolean>(true);
    const [importNewTitle, setImportNewTitle] = useState<string>(SCHEDULE_MESSAGES.Import_Dialog_Title(null));
    const [importFacilityRecordCount, setImportFacilityRecordCount] = useState<number>(0);
    const [focusTrap, setFocusTrap] = useState(false);

    const sideMenuClasses = classnames("side-menu", {
        "side-menu-active": isExportSchedulesOpened,
    });

    const sideMenuContentClasses = classnames("side-menu_content", {
        "side-menu_content-active": isExportSchedulesOpened,
        "overflow-auto": isExportSchedulesOpened, // new class to enable scrolling
    });

    useEffect(() => {
        if (isExportSchedulesOpened) {
            document.body.style.overflow = "hidden";
            getFacilityListAsyn();
            setFocusTrap(true);
        }
    }, [isExportSchedulesOpened]);

    useEffect(() => {
        if (isImport) {
            setShowUnits(true);
        }
    }, []);

    const getFacilityListAsyn = async () => {
        let userFacilityResult: any = await loadFacilities();
        let tempFaciliyOptions: DropdownItem[] = [];
        if (userFacilityResult) {
            userFacilityResult.facilities?.forEach((item: any) => {
                if (item.id !== FacilityDefaultValues.facilityId) {
                    const objItem: DropdownItem = {
                        id: item.id,
                        value: item.name,
                        label: item.name,
                    }
                    tempFaciliyOptions.push(objItem);
                }
            });
        }
        setFacilityOptions(tempFaciliyOptions);
    }

    const handleAssignToText = (text: string) => {
        setHandleAssignText(text);
    }

    const handleScheduleLocations = (scheduleLocations: ScheduleLocation[]) => {
        setLocations(scheduleLocations);
    }

    const handleCheckedData = (checked: string[]) => {
        setCheckedData(checked);
    }

    const btnExportSchedulesClick = async () => {
        btnExportRef?.current?.blur();
        document.body.style.overflow = "visible";
        validateFields(selectedFacility !== null, "facility", true);
        FacilityErrorMessage(selectedFacility);
        if (isImport) {
            locations.forEach((item) => {
                item.facilityId = FacilityDefaultValues.facilityId;
                item.isDefault = isDefault;
            });
        } else {
            locations.forEach((item) => {
                item.isDefault = isDefault;
            });
        }
        if (selectedFacility !== null) {
            const request: ExportFrequencyAdministrationRequestDto = {
                administrationScheduleIds: selectedScheduleIds!.toString(),
                scheduleLocation: locations,
                isDefault: isDefault
            }
            let response;
            let msg = "";
            if (isImport) {
                response = await importAdministrationSchedule(FacilityDefaultValues.facilityId, selectedFacility.value.toString(), request);
            } else {
                response = await exportAdministrationSchedule(selectedFacility.value.toString(), FacilityDefaultValues.facilityId, request);
            }
            let requestIdsCount = selectedCount;
            let responseCount = response?.split(",").length;
            if (isImport) {
                requestIdsCount = importFacilityRecordCount;
            }
            if (response) {
                if (selectedCount === responseCount) {
                    msg = isImport ? SCHEDULE_MESSAGES.Import_All() : SCHEDULE_MESSAGES.Export_All();
                } else {
                    msg = isImport ? SCHEDULE_MESSAGES.Import_Message(responseCount, requestIdsCount!) : SCHEDULE_MESSAGES.Export_Message(responseCount, requestIdsCount!);
                }
            } else {
                msg = isImport ? SCHEDULE_MESSAGES.Import_Message(0, requestIdsCount!) : SCHEDULE_MESSAGES.Export_Message(0, requestIdsCount!);
            }
            resetAndClosePopup(true, msg);
            confirmOk(true, msg);
        }
    }

    const resetAndClosePopup = (isExportedSucceed: boolean, message?: string) => {
        setIsExportSchedulesOpened(false);
        onCloseExportPopup(isExportedSucceed, message!);
        setErrorFields(exportSchedulesFieldsToValidate);
        setFacilityErrorMsg("");
        setSelectedFacility(null);
        resetErrorsSummary();
    }

    const handleClose = () => {
        document.body.style.overflow = "visible";
        resetAndClosePopup(false)
        confirmCancel(false);
    };

    const validateFields = (isValid: boolean, fieldName: string, isShowSummary?: boolean) => {
        errorFields.find(x => x.fieldName === fieldName)!.isValid = isValid;
        errorFields.forEach(element => {
            if (isImport) {
                element.label = FrequencyAdministration.ImportFrom;
            } else {
                element.label = FrequencyAdministration.ExportTo;
            }
        });
        setErrorFields([...errorFields]);
        setShowErrorSummary(isShowSummary!);
    }

    const handleDropDownChange = async (item: DropdownItem, type: string) => {
        if (type === "ddlFacility") {
            validateFields(item !== null, "facility", false);
            if (isImport) {
                setShowUnits(true);
            } else {
                setShowUnits(item !== null);
            }
            FacilityErrorMessage(item);
            setSelectedFacility(prevSelectedFacility => {
                if (prevSelectedFacility?.label !== item?.label || item === null) {
                    setLocations([]);
                    setCheckedData([]);
                    setHandleAssignText("");
                }
                return item;
            });
            if (item !== null) {
                let recordCount = await getImportFacilityRecordCount(item.value!);
                setImportNewTitle(SCHEDULE_MESSAGES.Import_Dialog_Title(recordCount));
                setImportFacilityRecordCount(recordCount);
            } else {
                setImportNewTitle(SCHEDULE_MESSAGES.Import_Dialog_Title(null));
            }
        }
    }

    const resetErrorsSummary = () => {
        errorFields.forEach(x => x.isValid = true);
        setErrorFields([...errorFields]);
    }

    const FacilityErrorMessage = (item: DropdownItem | null) => {
        if (item === null) {
            setFacilityErrorMsg(FrequencyAdministration.FacilityRequiredMessage);
        } else {
            setFacilityErrorMsg("");
        }
    }

    const getImportFacilityRecordCount = async (val: string | number) => {
        let facilityStr = val?.toString() ? val?.toString() : FacilityDefaultValues.facilityId;
        return await importCountAdministrationSchedule(facilityStr);
    }

    const handleIsDefaultChange = (val: boolean) => {
        setIsDefault(val);
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

    const navigateAndSetFocus = (fieldName: string) => {
        document?.getElementById(fieldName)?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <FocusTrap>
        <div className={`import-list ${sideMenuClasses}`}>
            <div className="side-menu_overlay" onClick={onOverLayClick} role="none" />
            <div className={`import-list-content ${sideMenuContentClasses} d-flex flex-column justify-content-between`}>
                <div className="container-fluid">
                    <div className="row import-list-header">
                        <h2 className="header pb-2"><b>{isImport ? importNewTitle : title }</b></h2>
                        <div className="row">
                            <span
                                className="close-import-list"
                                id="close-import-list"
                                data-testid="close-import-list"
                                onClick={handleClose}
                                onKeyUp={(e) => e.cancelable}
                            >
                                <i className="fa fa-times"></i>
                            </span>
                        </div>
                    </div>
                    <div className="row">
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
                                                        <button
                                                            data-testid="focusToField"
                                                            onClick={(e) => navigateAndSetFocus(item.fieldId!)}
                                                            onKeyDown={(e) => navigateAndSetFocus(item.fieldId!)}
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
                    <div className="row" id="facility">
                        <div className="col-md-12 p-0 pt-2">
                            <SingleDropDown
                                id="ddlFacility"
                                dataFieldId="id"
                                dataFieldValue="value"
                                datafile={facilityOptions}
                                isSearchable={true}
                                icon={null}
                                placeholder="Select..."
                                value={selectedFacility}
                                selectLabelText={isImport ? FrequencyAdministration.ImportFrom : FrequencyAdministration.ExportTo}
                                isSortByDataFieldId={true}
                                isSearchIconNotRequired={true}
                                isBlankOptionNotRequired={true}
                                lableClassName="input-required mb-0"
                                errorMessage={facilityErrorMsg}
                                onChange={(id) => handleDropDownChange(id, "ddlFacility")}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`form-group col-md-12 mb-0 p-0`}>
                            <div className="d-flex align-items-baseline inline-message im-notification">                    
                                <span className="ml-2">
                                {isImport? FrequencyAdministration.ImportFacilityIMessage:FrequencyAdministration.ExportFacilityIMessage}                    
                                </span>
                            </div>                            
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 pl-0">
                        <input
                        className="form-check-input m-0 mt-1"
                        name="chkIsDefault"
                        id="chkIsDefault"
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleIsDefaultChange(e.target.checked)
                        }
                        />
                        <label className="form-check-label" id="chkIsDefault" htmlFor="chkIsDefault" style={{marginLeft:"1.35rem"}}>
                                {isImport ? FrequencyAdministration.OverrideDefaultScheduleImportMessage:FrequencyAdministration.OverrideDefaultScheduleExportMessage}
                            </label>                            
                        </div>
                    </div>  
                    {
                        showUnits && (
                            <div className="row">
                                <div className="col-md-12 p-0">
                                    <SearchTreeView
                                        handleAssignToText={handleAssignToText}
                                        setScheduleLocations={handleScheduleLocations}
                                        handleCheckedData={handleCheckedData}
                                        checkedRoomsData={checkedRoomsData}
                                        selectedFacility={selectedFacility}
                                        isImportExportSchedules={true}
                                        isImportSchedules={isImport ? true:false}
                                    ></SearchTreeView>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="import-footer-content d-flex justify-content-end import-footer-content">                    
                    <button
                        type="button"
                        id="btnConfirm"
                        data-testid="confirmButton"
                        className="btn btn-primary btn-align"
                        ref={btnExportRef}
                        onClick={btnExportSchedulesClick}
                    >
                        {confirmButtonText}
                    </button>
                    <button
                        type="button"
                        id="btnCancel"
                        data-testid="cancelButton"
                        className="btn btn-cancel btn-align"
                        data-dismiss="modal"
                        onClick={handleClose}
                    >
                        {cancelButtonText}
                    </button>
                </div>
            </div>
        </div>
        </FocusTrap>
    )
}
export default ExportSchedules;


export type Props = {
    isExportSchedulesOpened?: boolean;
    title: string;
    selectedScheduleIds?: string;
    selectedCount: number;
    setIsExportSchedulesOpened: (isOpened: boolean) => void;
    onCloseExportPopup: (isSucceed: boolean, message?: string) => void;
    onOverLayClick?: () => void;
    checkedRoomsData?: string[];
    updateAssignTo?: (assignedToText: string) => void;
    updateCheckedData?: (assignedCheckedData: string[]) => void;
    setScheduleLocations?: (locations: ScheduleLocation[]) => void;
    isImport: boolean;
    confirmButtonText: string;
    cancelButtonText: string;
    confirmCancel: (isTrue: boolean) => void;
    confirmOk: (isExported: boolean, message: string) => void;
};
