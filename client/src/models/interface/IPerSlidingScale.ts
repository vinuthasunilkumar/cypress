interface IPerSlidingScale {
    rowsData: IRowData[];
    optionalData: IDictionary[];
}

interface IDictionary {
    key: string;
    value: any;
    error: string;
}