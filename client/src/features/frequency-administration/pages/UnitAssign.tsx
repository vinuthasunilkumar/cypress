import React, { useState, useEffect } from "react";
import SearchTreeView from "./SearchTreeView";
import { ScheduleLocation, UserSelectedScheduleLocations } from "../../../models/class/FrequencyAdministration";
import classnames from "classnames";

const UnitAssign = ({ isAssignedToOpened,
    addNewMode,
    userSelectedData,
    setIsAssignedToOpened,
    onOverLayClick,
    onCloseAssignment,
    checkedRoomsData,
    setScheduleLocations,
    updateAssignTo,
    updateCheckedData }: Props) => {

    const [handleAssignText, setHandleAssignText] = useState<string>('');
    const [checkedData, setCheckedData] = useState<string[]>([]);
    const [locations, setLocations] = useState<ScheduleLocation[]>([]);

    const sideMenuClasses = classnames("side-menu", {
        "side-menu-active": isAssignedToOpened,
    });

    const sideMenuContentClasses = classnames("side-menu_content", {
        "side-menu_content-active": isAssignedToOpened,
        "overflow-auto": isAssignedToOpened, // new class to enable scrolling
    });

    useEffect(() => {
        if (!addNewMode)
            setLocations(userSelectedData?.scheduleLocations!)
    }, [])

    const handleAssignToText = (text: string) => {
        setHandleAssignText(text);
    }

    const handleCheckedData = (checked: string[]) => {
        setCheckedData(checked);
    }

    const confirmAssignRooms = () => {
        document.body.style.overflow = "visible";
        if (userSelectedData !== undefined && userSelectedData?.scheduleLocations === undefined) {
            userSelectedData.scheduleLocations = [];
        }
        const newArray = [...userSelectedData?.scheduleLocations!, ...locations];
        userSelectedData!.scheduleLocations = addNewMode ? newArray : locations;
        userSelectedData!.assignedToText = handleAssignText;
        userSelectedData!.checkedRoomsData = [...checkedData];
        if (updateCheckedData)
            updateCheckedData(userSelectedData!.checkedRoomsData)
        setIsAssignedToOpened(false);
        if (updateAssignTo)
            updateAssignTo(userSelectedData!.assignedToText);
        setScheduleLocations!(userSelectedData?.scheduleLocations!);
        onCloseAssignment(true);
    }

    const handleScheduleLocations = (scheduleLocations: ScheduleLocation[]) => {
        setLocations(scheduleLocations);
    }

    const btnCloseAssignPopup = () => {
        document.body.style.overflow = "visible";
        setIsAssignedToOpened(false);
        if (updateCheckedData)
            updateCheckedData(userSelectedData?.checkedRoomsData!);
        if (updateAssignTo)
            updateAssignTo(userSelectedData?.assignedToText!);
        setScheduleLocations!(userSelectedData?.scheduleLocations!);
        onCloseAssignment(false);
    }

    return (
        <div className={`import-list ${sideMenuClasses}`}>
            <div className="side-menu_overlay" onClick={onOverLayClick} role="none" />
            <div className={`import-list-content ${sideMenuContentClasses} d-flex flex-column justify-content-between`}>
                <div className="container-fluid">
                    <div className="row import-list-header">
                    <h4 className="header"><b>Edit Assigned To</b></h4>
                        <div className="row">
                            <span
                                className="close-import-list"
                                id="close-import-list"
                                data-testid="close-import-list"
                                onClick={btnCloseAssignPopup}
                                onKeyUp={(e) => e.cancelable}
                            >
                                <i className="fa fa-times"></i>
                            </span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 p-0">
                            <SearchTreeView
                                handleAssignToText={handleAssignToText}
                                setScheduleLocations={handleScheduleLocations}
                                handleCheckedData={handleCheckedData}
                                checkedRoomsData={checkedRoomsData}
                                isExportSchedules={false}
                                selectedFacility={null}
                                scheduleLocations={addNewMode ? locations : userSelectedData?.scheduleLocations!}
                            ></SearchTreeView>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end import-footer-content">
                    <button
                        type="button"
                        id="btnConfirm"
                        data-testid="confirmButton"
                        className="btn btn-primary"
                        onClick={confirmAssignRooms}
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        id="btnCancel"
                        data-testid="cancelButton"
                        className="btn btn-cancel float-right"
                        data-dismiss="modal"
                        onClick={btnCloseAssignPopup}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
export default UnitAssign;


export type Props = {
    isAssignedToOpened?: boolean;
    addNewMode?: boolean;
    setIsAssignedToOpened: (isOpened: boolean) => void;
    onCloseAssignment: (isSucceed: boolean) => void;
    onOverLayClick?: () => void;
    checkedRoomsData?: string[];
    updateAssignTo?: (assignedToText: string) => void;
    updateCheckedData?: (assignedCheckedData: string[]) => void;
    setScheduleLocations?: (locations: ScheduleLocation[]) => void;
    userSelectedData?: UserSelectedScheduleLocations;
};
