interface IStructured {
    dose: IDose;
    frequencyCode: string | undefined;
    methodCode: string | undefined;
    routeCode: string | undefined;
    duration: IDuration;
    isPRN: boolean | undefined;
    locationCode: string | undefined;
    indicationCode: string | undefined;
    notes: string | undefined;
    perSlidingScale: IPerSlidingScale;
}