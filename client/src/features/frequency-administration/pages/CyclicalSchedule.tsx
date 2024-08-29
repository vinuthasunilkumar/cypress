import React, { useEffect, forwardRef, useState, useImperativeHandle } from "react";
import SingleDropDown from "../../../shared/pages/SingleDropDown";
import { ChooseCyclicalTypes, cyclicalRequiredFields } from "../../../shared/enum/FrequencyAdministration";
import daysOptions from "../../../assets/static-files/SpecificCycleDaysOptions.json";
import CyclicalTypesOptions from "../../../assets/static-files/CyclicalTypes.json";
import { FrequencyAdministration } from "../../../shared/enum/FrequencyAdministrationValidationMessages";
import { AddScheduleRequiredFields, CyclicalSchedules, DropdownItem } from "../../../models/class/FrequencyAdministration";
import { ICyclicalSchedule } from "../../../models/interface/ICyclicalSchedule";
import { ICyclicSchedule } from "../../../models/interface/ICyclicSchedule";

const CyclicalSchedule = forwardRef((props: any, ref) => {
    const [selectedCycleType, setSelectedCycleType] = useState<number>(0);
    const [selectedCycleTypeObj, setSelectedCycleTypeObj] = useState<DropdownItem | null>();
    const [selectedGiveDays, setSelectedGiveDays] = useState<DropdownItem | null>(null);
    const [selectedNotGiveDays, setSelectedNotGiveDays] = useState<DropdownItem | null>(null);
    const [cyclicalSchedulesObj, setCyclicalSchedulesObj] = useState<CyclicalSchedules>(new CyclicalSchedules());
    const [selectCycleTypeErrorMessage, setSelectCycleTypeErrorMessage] = useState<string>("");
    const [giveDaysErrorMessage, setGiveDaysErrorMessage] = useState<string>("");
    const [skipDaysErrorMessage, setSkipDaysErrorMessage] = useState<string>("");
    const [fieldsToValidate, setFieldsToValidate] = useState<AddScheduleRequiredFields[]>(cyclicalRequiredFields);


    useEffect(() => {
        if (props.resetCyclicalScheduleData)
            resetCyclicalSchedule();
    }, [props.addNewMode, props.resetCyclicalScheduleData]);

    useImperativeHandle(ref, () => ({
        validateCyclicalScheduleControls() {
            return isValidData();
        }
    }));

    const isValidData = () => {
        let isValid = true;
        fieldsToValidate.find((x) => x.fieldName === "selectCycle")!.isValid = selectedCycleType > 0;
        if (selectedCycleType === 1) {
            setSelectCycleTypeErrorMessage("");
            fieldsToValidate.find((x) => x.fieldName === "giveDays")!.isValid = selectedGiveDays !== null;
            if (selectedGiveDays) {
                setGiveDaysErrorMessage("");
            } else {
                setGiveDaysErrorMessage(FrequencyAdministration.GiveDaysIsRequiredMessage);
                isValid = false;
            }
            fieldsToValidate.find((x) => x.fieldName === "skipDays")!.isValid = selectedNotGiveDays !== null;
            if (selectedNotGiveDays) {
                setSkipDaysErrorMessage("");
            } else {
                setSkipDaysErrorMessage(FrequencyAdministration.SkipDaysIsRequiredMessage);
                isValid = false;
            }
        } else if (selectedCycleType === 0 || isNaN(selectedCycleType)) {
            resetGiveAndSkipDaysValidations();
            setSelectCycleTypeErrorMessage(FrequencyAdministration.SelectCycleIsRequiredMessage);
            isValid = false;
        }
        setFieldsToValidate([...fieldsToValidate]);
        props.validatedCyclicalFields(fieldsToValidate);
        return isValid;
    };

    useEffect(() => {
        if (props.editCyclicalSchedule)
            setCyclicalScheduleData(props.editCyclicalSchedule);
    }, [props.addNewMode, props.editCyclicalSchedule, props.resetCyclicalScheduleData]);

    const setCyclicalScheduleData = (cyclicalSchedule: ICyclicalSchedule) => {
        if (!cyclicalSchedule) return;

        setSelectedCycleType(cyclicalSchedule.cycle!);
        const cycleOption = CyclicalTypesOptions.find(x => x.id === cyclicalSchedule.cycle);
        const selectedObj: DropdownItem = {
            id: Number(cycleOption?.id),
            value: Number(cycleOption?.id),
            label: cycleOption?.value.toString()!
        }
        setSelectedCycleTypeObj(selectedObj as DropdownItem);
        cyclicalSchedulesObj.cycle = cyclicalSchedule.cycle!;
        setDropdownItem(cyclicalSchedule.giveDays, setSelectedGiveDays, cyclicalSchedulesObj, 'giveDays');
        setDropdownItem(cyclicalSchedule.skipDays, setSelectedNotGiveDays, cyclicalSchedulesObj, 'skipDays');

        setCyclicalSchedulesObj({ ...cyclicalSchedulesObj });
        props.handleCyclicalSchedule({ ...cyclicalSchedulesObj }, false);
    };

    useEffect(() => {
        if (props.selectedCyclicalSchedule)
            handleSelectedCyclicalSchedule(props.selectedCyclicalSchedule);
    }, [props.addNewMode, props.selectedCyclicalSchedule]);

    const handleSelectedCyclicalSchedule = (value: ICyclicSchedule) => {
        const cycleOption = CyclicalTypesOptions.find(x => x.id === value?.cycle);
        const selectedObj: DropdownItem = {
            id: Number(cycleOption?.id),
            value: Number(cycleOption?.id),
            label: cycleOption?.value.toString()!
        }
        setSelectedCycleTypeObj(selectedObj as DropdownItem);
        setSelectedCycleType(value.cycle!);
        cyclicalSchedulesObj.cycle = value.cycle!;
        cyclicalSchedulesObj.giveDays = value.giveDays!;
        cyclicalSchedulesObj.skipDays = value.skipDays!;
        setDropdownItem(value.giveDays, setSelectedGiveDays, cyclicalSchedulesObj, 'giveDays');
        setDropdownItem(value.skipDays, setSelectedNotGiveDays, cyclicalSchedulesObj, 'skipDays');
        setCyclicalScheduleData(cyclicalSchedulesObj);
        setCyclicalSchedulesObj({ ...cyclicalSchedulesObj });
    }

    const setDropdownItem = (value: number | null, setDropdown: React.Dispatch<React.SetStateAction<DropdownItem | null>>, scheduleObj: CyclicalSchedules, scheduleType: 'giveDays' | 'skipDays') => {
        const dropdownItem = daysOptions.find(x => x.id === value?.toString());

        if (dropdownItem) {
            const dropdown: DropdownItem = {
                id: dropdownItem.id,
                value: dropdownItem.value,
                label: dropdownItem.value
            };
            setDropdown(dropdown);
            scheduleObj[scheduleType] = Number(dropdown.value);
        }
    };

    const handleDropDownChange = (item: DropdownItem, type: string) => {
        switch (type) {
            case "ddlSelectCycle": {
                if (item?.label !== "" && item !== null) {
                    setSelectCycleTypeErrorMessage("");
                    fieldsToValidate.find(x => x.fieldName === "selectCycle")!.isValid = true;
                } else {
                    setSelectedGiveDays(null);
                    setSelectedNotGiveDays(null);
                    setSelectCycleTypeErrorMessage(FrequencyAdministration.SelectCycleIsRequiredMessage);
                    fieldsToValidate.find(x => x.fieldName === "selectCycle")!.isValid = false;
                    fieldsToValidate.find((x) => x.fieldName === "giveDays")!.isValid = true;
                    fieldsToValidate.find((x) => x.fieldName === "skipDays")!.isValid = true;
                }
                if (cyclicalSchedulesObj.cycle !== Number(item?.value)) {
                    setSelectedGiveDays(null);
                    setSelectedNotGiveDays(null);
                }
                setSelectedCycleTypeObj(item);
                cyclicalSchedulesObj.cycle = Number(item?.value);
                if (cyclicalSchedulesObj.cycle === -1 || cyclicalSchedulesObj.cycle > 1) {
                    resetGiveAndSkipDaysValidations();
                    cyclicalSchedulesObj.giveDays = null;
                    cyclicalSchedulesObj.skipDays = null;
                }
                setSelectedCycleType(Number(item?.value));
                break;
            }
            case "ddlGiveDays": {
                if (item?.label !== "") {
                    setGiveDaysErrorMessage("");
                } else {
                    setGiveDaysErrorMessage(FrequencyAdministration.GiveDaysIsRequiredMessage);
                }
                fieldsToValidate.find((x) => x.fieldName === "giveDays")!.isValid = item?.label !== "";
                setSelectedGiveDays(item);
                cyclicalSchedulesObj.giveDays = Number(item?.value);
                break;
            }
            case "ddlNotGiveDays": {
                if (item?.label !== "") {
                    setSkipDaysErrorMessage("");
                } else {
                    setSkipDaysErrorMessage(FrequencyAdministration.SkipDaysIsRequiredMessage);
                }
                fieldsToValidate.find((x) => x.fieldName === "skipDays")!.isValid = item?.label !== "";
                setSelectedNotGiveDays(item);
                cyclicalSchedulesObj.skipDays = Number(item?.value);
                break;
            }
        }
        setCyclicalSchedulesObj({ ...cyclicalSchedulesObj });
        props.handleCyclicalSchedule({ ...cyclicalSchedulesObj }, true);
        setFieldsToValidate([...fieldsToValidate]);
        props.validatedCyclicalFields(fieldsToValidate);
    };

    const resetGiveAndSkipDaysValidations = () => {
        setGiveDaysErrorMessage("");
        setSkipDaysErrorMessage("");
        fieldsToValidate.find((x) => x.fieldName === "giveDays")!.isValid = true;
        fieldsToValidate.find((x) => x.fieldName === "skipDays")!.isValid = true;
    }

    const resetCyclicalSchedule = () => {
        setSelectCycleTypeErrorMessage("");
        setGiveDaysErrorMessage("");
        setSkipDaysErrorMessage("");
        setSelectedCycleTypeObj(null);
        setSelectedGiveDays(null)
        setSelectedNotGiveDays(null);
        setSelectedCycleType(0);
        cyclicalSchedulesObj.cycle = 0;
        cyclicalSchedulesObj.giveDays = null;
        cyclicalSchedulesObj.skipDays = null;
        fieldsToValidate.forEach((item) => {
            item.isValid = true;
        });
        props.validatedCyclicalFields(fieldsToValidate);
        setCyclicalSchedulesObj({ ...cyclicalSchedulesObj });
        props.handleCyclicalSchedule({ ...cyclicalSchedulesObj }, false);
    }

    return (
        <div className="row">
            <div className="form-group col-md-4 mb-0" id="selectCycle">
                <SingleDropDown
                    id="selectCycle"
                    dataFieldId="id"
                    dataFieldValue="value"
                    datafile={CyclicalTypesOptions}
                    isSearchable={true}
                    icon={null}
                    placeholder="Select..."
                    value={selectedCycleTypeObj}
                    isSearchIconNotRequired={true}
                    isBlankOptionNotRequired={true}
                    selectLabelText="Select Cycle"
                    errorMessage={selectCycleTypeErrorMessage}
                    onChange={(id) => handleDropDownChange(id, "ddlSelectCycle")}
                    isDisabled={props?.selectedCyclicalSchedule?.isDisabled}
                />
            </div>
            {selectedCycleType === ChooseCyclicalTypes.CustomDays && (<>
                <div className="form-group col-md-3 mb-0" id='giveDays'>
                    <SingleDropDown
                        id="ddlGiveDays"
                        dataFieldId="id"
                        dataFieldValue="value"
                        datafile={daysOptions}
                        isSearchable={true}
                        icon={null}
                        placeholder=""
                        value={selectedGiveDays}
                        isSearchIconNotRequired={true}
                        isBlankOptionNotRequired={true}
                        isClearableNotRequired={true}
                        selectLabelText="Give"
                        dropDownIndicatorText="Days"
                        errorMessage={giveDaysErrorMessage}
                        isSortByDataFieldId={true}
                        onChange={(id) => handleDropDownChange(id, "ddlGiveDays")}
                        isDisabled={props?.selectedCyclicalSchedule?.isDisabled}
                    />
                </div>
                <div className="form-group col-md-3 mb-0" id='skipDays'>
                    <SingleDropDown
                        id="ddlNotGiveDays"
                        dataFieldId="id"
                        dataFieldValue="value"
                        datafile={daysOptions}
                        isSearchable={true}
                        icon={null}
                        placeholder=""
                        value={selectedNotGiveDays}
                        isSearchIconNotRequired={true}
                        isBlankOptionNotRequired={true}
                        isClearableNotRequired={true}
                        selectLabelText="Do Not Give"
                        dropDownIndicatorText="Days"
                        isSortByDataFieldId={true}
                        errorMessage={skipDaysErrorMessage}
                        onChange={(id) => handleDropDownChange(id, "ddlNotGiveDays")}
                        isDisabled={props?.selectedCyclicalSchedule?.isDisabled}
                    />
                </div>
            </>)}
        </div>
    )
})
export default CyclicalSchedule;