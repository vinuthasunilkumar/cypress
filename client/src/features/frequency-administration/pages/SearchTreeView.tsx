import React, { useEffect, useRef, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { getEditUnitAssignList } from "../../../services/FrequencyAdministrationService";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { ScheduleLocation } from '../../../models/class/FrequencyAdministration';
import { FacilityDefaultValues } from '../../../shared/enum/ApiEndPoints';
import { loadUnitsByFacilities } from '../../../services/CustomerService';
import { FrequencyAdministration, SCHEDULE_MESSAGES } from '../../../shared/enum/FrequencyAdministrationValidationMessages';

const SearchTreeView = (props: any) => {
    const libraries = useRef([]);
    const allRoomsIds = useRef<string[]>([]);
    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<any>([]);
    const [schduleLocations, setSchduleLocationsData] = useState<any>({
        locations: []
    });
    const [filterText, setFilterText] = useState({
        search: "",
    });
    const [assignToText, setAssignToText] = useState<string>("");
    const [filteredNodes, setFilteredNodes] = useState<any>([]);
    const [expandAll, setExpandAll] = useState<boolean>(true);
    const [facility, setFacility] = useState({
        description: "MatrixCare Center",
        id: "",
    });
    let assignToUnit: string = "";
    const facilityId: string = FacilityDefaultValues.facilityId;
    const customerId = FacilityDefaultValues.corporationId;

    const LoadExistingCheckedData = () => {
        if (props.checkedRoomsData?.length > 0) {
            let sortedCheckedData = sortArrayStringValues(props.checkedRoomsData);
            sortedCheckedData = removeDuplicateStrVals(sortedCheckedData);
            setChecked(sortedCheckedData);
            traceCheckboxes(sortedCheckedData);
        }
        if (props.scheduleLocations?.length) {
            schduleLocations.locations = props.scheduleLocations;
            setSchduleLocationsData(schduleLocations);
        }
    }

    const removeDuplicateStrVals = (strVal: string[]) => {
        return strVal.filter((value, index) => strVal.indexOf(value) === index);
    }

    const traceCheckboxes = (checkedData: string[]) => {
        let assignTo: string = "";
        let assignToArray: string[];
        let assignToArrayFull: string[] = [];
        let assignToString: string = "";

        if (checkedData.length > 0 && libraries?.current.length > 0) {
            checkedData.forEach((element: any) => {
                // check for direct match with Units Values for conditions when filter text is used
                libraries?.current?.forEach((childNode: { value: any; children: any }) => {
                    if (element?.toLowerCase() === childNode.value?.toLowerCase()) {
                        let childNodesValues: any = [];
                        childNode.children?.forEach((item: any) => {
                            childNodesValues.push(item);
                        });
                        childNodesValues = childNodesValues.concat(checkedData);
                        childNodesValues.forEach((item: any) => {
                            assignTo = findArrayElementByEdit(libraries.current, item.value);
                            if (assignTo.length > 0) {
                                assignToArray = assignTo.split(",");
                                assignToArrayFull = assignToArrayFull.concat(assignToArray);
                            }
                        });
                    }
                });

                assignTo = findArrayElementByEdit(libraries.current, element);
                if (assignTo.length > 0) {
                    assignToArray = assignTo.split(",");
                    assignToArrayFull = assignToArrayFull.concat(assignToArray);
                }

            });
            assignToString = assignAndSortToStringData(assignToString, assignToArrayFull)
            assignToString = stringRemoveSpaceAndComma(assignToString);
            assignToUnit = "";
        }
        assignToString = roomsToAll(assignToString);
        assignToString = allUnitsChecked(checkedData, assignToString);
        setAssignToText(assignToString);
        props.handleAssignToText(assignToString);
        props.handleCheckedData(checkedData);
    }

    const allUnitsChecked = (checkedData: string[], assignToString: string) => {
        if (checkAllRoomsChecked(checkedData)) {
            setAssignToText(props.selectedFacility !== null ? props.selectedFacility.label : facility.description);
            assignToString = props.selectedFacility !== null ? props.selectedFacility.label : facility.description;
        }
        return assignToString;
    }

    // logic if all rooms of unit is selected then display All instead of rooms 
    const roomsToAll = (string: string) => {
        let assignToTextArray: string[] = [];
        let itemPresent: boolean = false;
        assignToTextArray = string.trim().split(";");
        assignToTextArray.forEach((element, index) => {
            if (libraries?.current) {
                libraries?.current?.forEach((unitsNode: { label: string; children: []; }) => {
                    if (element.includes(unitsNode.label)) {
                        itemPresent = unitAllRoomsPresent(unitsNode, element);
                        if (itemPresent) {
                            assignToTextArray[index] = " " + unitsNode.label + " - All"
                            itemPresent = false;
                        }
                    }
                });
            }
        });
        return assignToTextArray.join(";");
    }

    const unitAllRoomsPresent = (searchNode: { label: string; children: []; }, searchedItem: string) => {
        let itemPresent: boolean = false;
        if (searchNode.children) {
            itemPresent = true;
            searchNode.children.forEach((roomsNode: { label: string; }) => {
                if (searchedItem.includes(roomsNode.label) && itemPresent) {
                    itemPresent = true;
                } else {
                    itemPresent = false;
                }
            });
        }
        return itemPresent;
    }

    const stringRemoveSpaceAndComma = (string: string) => {
        if (string.trimEnd().endsWith(",")) {
            string = string.slice(0, -2);
        }
        return string;
    }

    const assignAndSortToStringData = (string: string, stringArray: string[]) => {
        stringArray.forEach(element => {
            if (string.length == 0) {
                string = element + " - ";
            }
            else if (string.trimEnd().endsWith("-")) {
                string = string + element + ", ";
            }
            else if (element.includes("Unit")) {
                string = stringRemoveSpaceAndComma(string);
                string = string + "; " + element + " - ";
            }
            else {
                string = string + element + ", ";
            }

        });
        return string;
    }

    const findArrayElementByEdit = (array: any, value: any) => {
        let singleAssignTo: string = "";
        let itemChecked: boolean = false;
        const unitSearchText = "Unit";
        array?.forEach((element: { children: { value: string; label: string; }[]; label: string }) => {
            if (element.children) {
                element.children.forEach((element: { value: string; label: string; }) => {
                    if (element.value === value) {
                        singleAssignTo = element.label;
                        itemChecked = true;
                    }
                });
                if (element.label.includes(unitSearchText) && itemChecked) {
                    if (!(assignToUnit === element.label && assignToUnit.length > 0)) {
                        assignToUnit = element.label;
                        singleAssignTo = element.label + "," + singleAssignTo;
                    }
                    itemChecked = false;
                    return;
                }
            }
        });
        return singleAssignTo;
    }

    const onFilterChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const value = (e.target as HTMLInputElement).value;
        const name = (e.target as HTMLInputElement).name;
        if (name === "txtSearchQueryHere") {
            filterText.search = value;
            setFilterText(filterText);
        }
        filterTree(value);
    }

    const filterTree = (searchText: string) => {
        // Reset nodes back to unfiltered state
        if (!searchText) {
            setFilteredNodes(libraries.current);
            return;
        }
        const res = libraries?.current?.reduce((acc: any, a: any) => {
            const ch = a.children?.filter((b: any) => b.label.toLowerCase().includes(searchText.toLowerCase()));
            if (ch?.length) acc.push({ ...a, children: ch });
            else if (a.label.toLowerCase().includes(searchText.toLowerCase())) acc.push({ ...a, children: a.children });
            return acc;
        }, []);
        // toggle expand and collapse button based on checkboxes visible or not         
        res.length ? setExpandAll(true) : setExpandAll(false);
        setFilteredNodes(res);
        allCheckBoxesExpanded(res);
    }

    const clearAll = () => {
        setChecked([]);
        setAssignToText("");
        props.handleAssignToText("");
        props.handleCheckedData("");
        props.setScheduleLocations([]);
        setSchduleLocationsData([]);
    }

    const checkAll = () => {
        if (allRoomsIds?.current) {
            setChecked(allRoomsIds.current);
            setAssignToText(props.selectedFacility !== null ? props.selectedFacility.label : facility.description);
            if (props.isImportSchedules) {
                setAssignToText(FacilityDefaultValues.facilityLabel);
            } else {
                props.handleAssignToText(props.selectedFacility !== null ? props.selectedFacility.label : facility.description);
            }
            props.handleCheckedData(allRoomsIds.current);
            let tempRoomsData: ScheduleLocation[] = [];
            libraries?.current?.forEach((item: any) => {
                item.children.forEach((childItem: any) => {
                    const scheduleLocationObj = {
                        roomId: childItem.value,
                        unitId: item.value,
                        facilityId: props.selectedFacility !== null ? props.selectedFacility.value : facilityId,
                        isCompleteFacilitySelected: true,
                        isCompleteUnitSelected: false,
                    }
                    tempRoomsData.push(scheduleLocationObj);
                })
            })
            schduleLocations.locations = [...tempRoomsData];
            setSchduleLocationsData(schduleLocations);
            props.setScheduleLocations(schduleLocations.locations);
        }
    }

    const allRoomsValue = () => {
        let mylist: string[] = [];
        if (libraries.current) {
            libraries?.current?.forEach((ParentNode: { children: []; }) => {
                if (ParentNode.children) {
                    ParentNode.children.forEach((childNode: { value: string; }) => {
                        mylist.push(childNode.value);
                    });
                }
            });
            allRoomsIds.current = mylist;
        }
    }

    const areAllChildrenAvailable = (unit: any) => {
        const childrenIds = unit?.children.map((child: any) => child.value);
        const areAllRoomIdsPresent = childrenIds.every((roomId: any) =>
            schduleLocations.locations.some((location: any) => location.roomId === roomId)
        );
        return areAllRoomIdsPresent;
    };

    const areAllUnitsAvailable = () => {
        libraries?.current?.forEach((unit: any) => {
            if (areAllChildrenAvailable(unit)) {
                schduleLocations.locations.forEach((x: any) => {
                    if (x.unitId === unit.value)
                        x.isCompleteUnitSelected = true;
                });
            }
        });
    };

    const getAllChildrensCount = () => {
        return libraries?.current?.reduce((acc, unit: any) => acc + unit?.children.length, 0);
    }

    const areAllUnitsAndRoomsAvailable = () => {
        if (schduleLocations.locations.length === getAllChildrensCount()) {
            libraries?.current?.forEach((unit: any) => {
                if (areAllChildrenAvailable(unit)) {
                    schduleLocations.locations.forEach((x: any) => {
                        if (x.unitId === unit.value) {
                            x.isCompleteUnitSelected = false;
                            x.isCompleteFacilitySelected = true;
                        }
                    });
                }
            });
        }
    };

    const onCheckBoxes = (checkedData: string[], nodes: any) => {
        let tempRoomsData: ScheduleLocation[] = [];
        if (nodes.isParent && nodes.checked) {
            nodes.children.forEach((child: any) => {
                const index = libraries.current.findIndex((item: any) =>
                    item.roomId === child.value
                );
                if (index !== -1) {
                    schduleLocations.locations.splice(index, 1);
                }
                let scheduleLocationObj = {
                    roomId: child.value,
                    unitId: nodes.value,
                    facilityId: props.selectedFacility !== null ? props.selectedFacility.value : facilityId,
                    isCompleteFacilitySelected: false,
                    isCompleteUnitSelected: true
                }
                tempRoomsData.push(scheduleLocationObj);
            })
            if(schduleLocations?.locations){
                schduleLocations.locations = [...schduleLocations.locations, ...tempRoomsData];
            }else{
                schduleLocations.locations = [...tempRoomsData];
            }            
            areAllUnitsAndRoomsAvailable();
            setSchduleLocationsData(schduleLocations);
        } else if (nodes.checked) {
            let scheduleLocationObj = {
                roomId: nodes.value,
                unitId: nodes.parent.value,
                facilityId: props.selectedFacility !== null ? props.selectedFacility.value : facilityId,
                isCompleteFacilitySelected: false,
                isCompleteUnitSelected: false
            }
            tempRoomsData.push(scheduleLocationObj);
            if (schduleLocations?.locations) {
                schduleLocations.locations = [...schduleLocations.locations, ...tempRoomsData];
            }
            else {
                schduleLocations.locations = [...tempRoomsData];
            }
            areAllUnitsAvailable();
            areAllUnitsAndRoomsAvailable();
            setSchduleLocationsData(schduleLocations);
        }
        if (nodes.isParent && !nodes.checked) {
            schduleLocations.locations = schduleLocations.locations.filter((x: any) => !nodes.children.some((obj: any) => obj.value === x.roomId))
            schduleLocations.locations.forEach((item: any) => {
                item.facilityId = props.selectedFacility !== null ? props.selectedFacility.value : facilityId;
                item.isCompleteFacilitySelected = false;
            })
            areAllUnitsAvailable();
            setSchduleLocationsData(schduleLocations);
        } else if (!nodes.checked) {
            const index = schduleLocations.locations.findIndex((item: any) =>
                item.roomId === nodes.value
            );
            // If the element is found, remove it from the array
            if (index !== -1) {
                schduleLocations.locations.splice(index, 1);
                schduleLocations.locations.forEach((item: any) => {
                    if (item.unitId === nodes.parent.value) {
                        item.isCompleteUnitSelected = false;
                    }
                    item.isCompleteFacilitySelected = false;
                });
            }
            areAllUnitsAvailable();
            setSchduleLocationsData(schduleLocations);
        }
        props.setScheduleLocations(schduleLocations.locations);
        setChecked(checkedData);
        if (checkedData.length > 0) {
            traceCheckboxes(checkedData);
        }
        else {
            setAssignToText("");
            props.handleAssignToText("");
            props.handleCheckedData("");
            props.setScheduleLocations([]);
        }

        if (nodes.checked) {
            // logic for filterSearch checked checkboxes for Units and Rooms
            filterSearchCheckedCheckBoxes(nodes);
        }
        else {
            // logic for filterSearch uncheck checkboxes for Units and Rooms
            filterSearchUncheckCheckBoxes(nodes);
        }
        if (checkAllRoomsChecked(checkedData)) {
            if (props.isImportSchedules) {
                setAssignToText(FacilityDefaultValues.facilityLabel);
            } else {
                setAssignToText(props.selectedFacility !== null ? props.selectedFacility.label : facility.description);
            }
            const incompleteLocations = schduleLocations.locations.filter((x: any) => !x.isCompleteUnitSelected);
            if (incompleteLocations.length === 0) {
                schduleLocations.locations.forEach((x: any) => {
                    x.isCompleteFacilitySelected = true;
                    x.isCompleteUnitSelected = false;
                });
            }
        }
        if (props.isImportExportSchedules) {
            props.setScheduleLocations(schduleLocations.locations);
        }
    }

    const sortSetCheckedBoxesAndAssignTo = (currentCheckBoxesData: string[]) => {
        currentCheckBoxesData = sortArrayStringValues(currentCheckBoxesData);
        setChecked(currentCheckBoxesData);
        traceCheckboxes(currentCheckBoxesData);
    }

    const sortArrayStringValues = (arrayStringValues: string[]) => {
        arrayStringValues = [...arrayStringValues].sort((a, b) =>
            a > b ? 1 : -1);
        return arrayStringValues;
    }

    const checkAllRoomsChecked = (roomIds: string[]) => {
        if (sortArrayStringValues(roomIds).join(",") === sortArrayStringValues(allRoomsIds?.current).join(",")) {
            return true;
        }
        return false;
    }

    const filterSearchCheckedCheckBoxes = (nodes: any) => {
        let currentCheckBoxesData: string[] = [];
        if (nodes.label.toLowerCase().includes('room')) {
            if (!checked.includes(nodes.value)) {
                if (checked.length > 0) {
                    checked.forEach((element: any) => {
                        currentCheckBoxesData.push(String(element));
                    });
                }
                currentCheckBoxesData.push(nodes.value);
                sortSetCheckedBoxesAndAssignTo(currentCheckBoxesData);
            }
        }
        else {
            nodes.children.forEach((element: { value: string; }) => {
                currentCheckBoxesData.push(element.value);
            });

            if (checked.length > 0) {
                //merge arrays and remove duplicates
                currentCheckBoxesData = Array.from(new Set(checked.concat(currentCheckBoxesData)));
            }
            sortSetCheckedBoxesAndAssignTo(currentCheckBoxesData);
        }
    }

    const filterSearchUncheckCheckBoxes = (nodes: any) => {
        let currentCheckBoxesData: string[] = [];
        if (nodes.label.toLowerCase().includes('room')) {
            if (checked.includes(nodes.value)) {
                currentCheckBoxesData = checked;
                currentCheckBoxesData = currentCheckBoxesData.filter(item => item != nodes.value);
                sortSetCheckedBoxesAndAssignTo(currentCheckBoxesData);
            }
        }
        else {
            currentCheckBoxesData = checked;
            nodes.children.forEach((element: { value: string; }) => {
                currentCheckBoxesData = currentCheckBoxesData.filter(item => item != element.value);
            });
            sortSetCheckedBoxesAndAssignTo(currentCheckBoxesData);
        }
    }

    const allCheckBoxesExpanded = (allNodes: any) => {
        let allCheckBoxesExpandedData: string[] = [];
        if (allNodes) {
            allNodes.forEach((element: { children: any; value: any; }) => {
                if (element.value) {
                    allCheckBoxesExpandedData.push(element.value);
                }
            });
            setExpanded(allCheckBoxesExpandedData);
        }
    }

    const getEditUnitAssignInfo = async () => {
        let unitListResponse = await getEditUnitAssignList();
        let convertedResponse = JSON.parse(JSON.stringify(unitListResponse).replaceAll('id', 'value').replaceAll('description', 'label').replaceAll('facilities', 'children').replaceAll('units', 'children').replaceAll('rooms', 'children'));
        libraries.current = convertedResponse;
        allRoomsValue();
        setFilteredNodes(convertedResponse);
        allCheckBoxesExpanded(convertedResponse);
        LoadExistingCheckedData();
    };

    useEffect(() => {
        if (!props.isImportExportSchedules) {
            getEditUnitAssignInfo();
        }
        else if (props.isImportExportSchedules && !props.isImportSchedules) {
            loadUnitsByFacility(customerId, props.selectedFacility.value);
        } else {
            loadUnitsByFacility(customerId, FacilityDefaultValues.facilityId);
        }
    }, [props.selectedFacility]);

    const loadUnitsByFacility = async (customerId: string, facilityId: string) => {
        let unitListResponse = await loadUnitsByFacilities(customerId, facilityId);
        let convertedResponse = JSON.parse(JSON.stringify(unitListResponse).replaceAll('id', 'value').replaceAll('description', 'label').replaceAll('facilities', 'children').replaceAll('units', 'children').replaceAll('rooms', 'children'));
        libraries.current = convertedResponse;
        setAssignToText("");
        allRoomsValue();
        setFilteredNodes(convertedResponse);
        allCheckBoxesExpanded(convertedResponse);
        LoadExistingCheckedData();
        if(props.isImportExportSchedules){
            checkAll();
        }        
        if (props.isImportSchedules) {            
            setAssignToText(FacilityDefaultValues.facilityLabel);
        }
    }

    return (
        <>
            <div className='row m-0 p-0'>
                {props.isImportExportSchedules ? <h3 className='col-md-12 mb-0 p-0 my-2'><b>{props.isImportSchedules ? FrequencyAdministration.AssignImportedList : FrequencyAdministration.AssignExportedList}</b></h3> : <></>}
            </div>
            <div className="row m-0 p-0" >
                <div className='col-md-12 p-0'>
                    <div className="form-group assigned-to-box mb-1" style={{ marginLeft: '0px' }}>
                        <span className={`col-form-label`} style={{ paddingLeft: "0.5rem", fontWeight: "bold" }}>Assigned To</span><br />
                        <div style={{ paddingLeft: "0.5rem" }}>{assignToText}</div>
                    </div>
                </div>
            </div>
            <div className="m-0 filter-container info-msg">
                {props.isImportExportSchedules && <div className="d-flex align-items-baseline inline-message im-notification">
                    <span className='ml-2'>
                    {FrequencyAdministration.DefaultIMessageSchedules}
                    </span>
                </div>
                }
                <div className='form-group col-md-12 px-0'>
                    <label className='col-form-label p-0' htmlFor='txtSearchQueryHere'>Search</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span
                                className="input-group-text search-input-group-text"
                                id="search-medication"
                            >
                                <i className="fa fa-magnifying-glass"></i>
                            </span>
                        </div>
                        <input
                            className="form-control col-12"
                            placeholder="Search query here"
                            type="text"
                            name="txtSearchQueryHere"
                            id="txtSearchQueryHere"
                            data-testid="txtSearchQueryHere"
                            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => onFilterChange(e)}
                            style={{ borderLeft: "none", padding: ".375rem 5px" }}
                        />
                    </div>
                </div>
                {props.isImportExportSchedules && <div><b>{props.isImportSchedules ? "Select Matrixcare Center Units/Rooms" : SCHEDULE_MESSAGES.Export_FacilityName(props.selectedFacility?.label)}</b></div>}
                <div className='d-flex'>
                    <div className='mb-2'>
                        <button className='p-0 btn-link bg-transparent border-0 tree-check-uncheck-button' id="btnCheckAll" onClick={checkAll} data-testid="chkAll" type='button'>Check All</button><span> | </span>
                        <button className='p-0 btn-link bg-transparent border-0 tree-check-uncheck-button' id="btnClearAll" onClick={clearAll} data-testid="clearAll" type='button'>Clear All</button>
                    </div>
                </div>
                <div className='nav-tabs-wrapper nav-tabs-bordered tree-container' style={{ overflow: 'auto' }}>
                    <CheckboxTree
                        nodes={filteredNodes}
                        checked={checked}
                        expanded={expanded}
                        onCheck={(checkedData, nodes) => {
                            onCheckBoxes(checkedData, nodes)
                        }}
                        onExpand={(expandedData, nodes) => {
                            setExpanded(expandedData);
                        }}
                        showNodeIcon={false}
                        showExpandAll={expandAll}
                    />
                </div>
            </div>
        </>
    )
}

export default SearchTreeView;
