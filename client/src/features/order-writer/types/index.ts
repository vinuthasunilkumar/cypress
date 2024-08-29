import React from "react";

export type Props = {
    isMenuActive: boolean;
    setActiveMenu: (isMenu: boolean) => void;
    onOverLayClick: () => void;
    medicationId: any;
    drugStyle: any
}

export type SlidingScaleTableRowType = {
    rowsData: any;
    deleteTableRows: (index: number) => void;
    addTableRows: () => void;
    handleChange: (index: number, evnt: React.ChangeEvent<HTMLInputElement>) => void;
    fromDisabled: boolean;
    toDisabled: boolean;
    giveDisabled: boolean;
    maxToValue: number;
    handleOnblur: (value: any, type: any) => void;
};
