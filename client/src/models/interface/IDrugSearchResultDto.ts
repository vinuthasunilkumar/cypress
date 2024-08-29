interface IDrugSearchResultsDto {
    pageNumber: number;
    pageLength: number;
    totalRows: number;
    totalPages: number;
    moreResultsExist:boolean;
    items:IDrugSearchResults[]; 
}