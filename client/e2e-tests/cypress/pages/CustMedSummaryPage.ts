import { searchCustomMedication } from "../api/customMedicationAPIS";

class CustomMedicationSummary {
    get pagination() { return cy.get(".pagination") }
    get tableRow() { return cy.get('tbody>tr') }
    get custMedNameHeader() { return cy.get('[data-testid="sort-custom-medications"]') }
    get custMedNameInTable() { return cy.get("td:nth-child(2)>a:nth-child(1)") }
    get totalEntriesTextInPagination() { return cy.get(".dataTables_info") }
    get nextPageArrowBtn() { return cy.get('[data-testid="nextPage"]') }
    get noResultsFound() { return cy.get(".no-data") }
    get pageThreeInPagination() { return cy.get('[data-testid="page-3"]') }
    get lastPageArrowBtn() { return cy.get('[data-testid="lastPage"]') }
    get firstPageArrowBtn() { return cy.get(".pagination>li:nth-child(1)") }
    get secondPageArrowBtn() { return cy.get(".pagination>li:nth-child(2)") }
    get controlledSubColumn() { return cy.get(':nth-child(3) > span') }
    get status() { return cy.get('[data-testid^="status-"]') }
    get statusCloseIcon() { return cy.get("#btnCloseModal") }
    get medGroupColumnValue1() { return cy.get('.fbdMedGroups > :nth-child(1)') }
    get medGroupColumnValue2() { return cy.get('.fbdMedGroups > :nth-child(2)') }
    get CustomMedicationName() { return cy.get('.custom-medication-name') }
    get SetUppage() { return cy.get('[data-testid="form"]') }
    get noBtnOnPopup() { return cy.get('#btnCancel') }
    get YesBtnOnPopup() { return cy.get('#btnConfirm') }
    get lastLineOnPopup() { return cy.get('.modal-body>p:nth-child(2)') }
    get firstLineOnPopup() { return cy.get('.modal-body>p:nth-child(1)') }
    get btn() { return cy.get("button") }
    get getFirstRowInTable() { return cy.get('.custom-medication-list>tbody>tr:nth-child(1)') }
    get btnDelete() { return cy.get('[data-testid="btnDelete"]') }
    get cancelDeleteBtn() { return cy.get('#cancelDeleteButton') }
    get deleteValidationMsg() { return cy.get('.modal-content') }
    get confirmDeleteBtn() { return cy.get('#confirmDeleteButton') }
    get addNewBtn() { return cy.get("[data-testid='btnAddNew']") }
    get noDataFoundMesaage() { return cy.get(".no-data") }
    get obseleteIngredients() { return cy.get(':nth-child(9) > .row > .bg-ingridents-med-group-items-box > :nth-child(1)') }
    get firstCustomMedication() {return cy.get('[data-testid="customMedicationName"]').first() }
    get pageThreeCustomMedication() {return cy.get('li:contains("3")')}
    get importButton() {return cy.get("[data-testid=btnImport]")}
    get exportButton() {return cy.get("[data-testid=btnImport]")}
    get fileType() {return cy.get("[type=file]")}
    get importListHeader() {return cy.get(".header")}
    get searchTextField() { return cy.get('[data-testid="txtSearch"]') }

    verfiyCustMedValues(pageNumber: number, searchText: string) {
        let custMedFromAPI: any = []
        let custMedFromUI: any = [];
        //  Search results from API on the first page

        cy.window().then((win) => {
            const libraryId = win.localStorage.getItem('libraryId');
            searchCustomMedication('custom-medications', searchText, pageNumber, libraryId, "false").then(response => {
                expect(response.status).to.eq(200)
                let length = response.body?.customMedications.length
                for (let i = 0; i < length; i++) {
                    custMedFromAPI.push(response.body?.customMedications[i]?.description)
                }
                cy.wait(2000)
                // Search results from UI on the first page
                cy.get('tbody>tr').each(($row, idx, array) => {
                    cy.wrap($row).within(() => {
                        cy.get("td:nth-child(2)>a:nth-child(1)").then((e) => {
                            custMedFromUI.push(e.text());
                            if (idx === array.length - 1) {
                                expect(custMedFromAPI.length).equal(custMedFromUI.length)
                                custMedFromAPI.sort()
                                custMedFromUI.sort()
                                for (let i = 0; i < custMedFromAPI?.length; i++) {
                                    expect(custMedFromAPI[i]).to.eq(custMedFromUI[i])
                                }
                            }
                        })
                    })
                })
            })
        })
    }
}
export default new CustomMedicationSummary
