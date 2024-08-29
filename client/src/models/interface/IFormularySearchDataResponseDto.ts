interface IFormularySearchDataResponseDto {
    defaultGenericFormularyStatusText: string;
    defaultBrandFormularyStatusText: string;
    defaultOTCFormularyStatusText: string;
    drugs: any;
    altDrugs: any;
    versions: any;
    id: number,
    description: string,
    defaultGenericFormularyStatus: number,
    defaultBrandFormularyStatus: number,
    defaultOTCFormularyStatus: number,
    cancelDate: string,
    isActive: boolean
}