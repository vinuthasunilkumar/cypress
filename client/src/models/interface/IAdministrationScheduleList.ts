export interface IAdministrationScheduleList {
    administrationScheduleId?: number;
    frequencyCode?: string;
    description?: string;
    orderType?: string;
    assignedTo?: string;
    isDefault?: boolean;
    createdDateTime?: Date;
    createdBy?: string;
    modifiedDateTime?: Date;
    modifiedBy?: string;
    isChecked?: boolean;
    [key: string]: any;
}

export interface IAdministrationScheduleDetailList {
    id: number;
    description: string;
    corporationId: number;
}