class Library {

    get popup() { return cy.get('h4.modal-title') }
    get libraryNameLbl() { return cy.get('#lbl-libraryName') }
    get libraryNameTextField() { return cy.get('#libraryName') }
    get statusText() { return cy.get('[for="status"]') }
    get messageText() { return cy.get('.inline-message>span') }
    get defaultStatusText() { return cy.get('[data-testid="library-status"]') }
    get crossIconOnPopup() { return cy.get(".fa-times") }
    get libraryNameText() { return cy.get('.container-fluid>div>div>h1') }
    get editPenIcon() { return cy.get('[data-testid="btnEditLibrary"]') }
    get libraryNameOnLibrariesPage() { return cy.get('.custom-med-library-name') }
    get invalidFeedbackMessage() { return cy.get('.invalid-feedback-message') }
    get alertMessage() { return cy.get('[role="alert"]') }
    get tableRow() { return cy.get('tbody>tr') }
    get customMedicationLibraryList() { return cy.get('h1') }
    get importBtn() { return cy.get('[data-testid="btnImport"]') }
    get exportBtn() { return cy.get('[data-testid="btnExport"]') }
    get createNewLibrary() { return cy.get('[data-testid="btnAddNewLibrary"]') }
    get arrowButton() { return cy.get('[data-testid="sort-library-name"]') }
    get firstCustomMedicationLibrary() { return cy.get('[data-testid="libraryName"]').first() }
    get upArrowIcon() { return cy.get('.fa-arrow-up-short-wide') }
    get downArrowIcon() { return cy.get(".fa-arrow-down-wide-short") }
    get firstPage() { return cy.get('[data-testid="page-1"]') }
    get view() { return cy.get("#dropdownMenuButton") }
    get search() { return cy.get("#txtCustomSearch") }

    getLibraryName(libraryName: string, statusText: string) {
        let rowCount: number;
        this.tableRow.its('length').then(length => {
            rowCount = length;
        }).then(() => {
            for (let i = 1; i <= rowCount; i++) {
                cy.get('tbody>tr:nth-child(' + i + ')>td:nth-child(2)>a').invoke('text').then((text: any) => {
                    if (text.includes(libraryName)) {
                        cy.get('tbody>tr:nth-child(' + i + ')>td:nth-child(1)>span').invoke('text').then((text1: any) => {
                            expect(text1).to.eq(statusText)
                        })
                    }
                });
            }
        })
    }

    searchFunctionality(givenText: string) {
        this.search.type(givenText)
        let rowLength = 0
        cy.get("#tab2content").find(".table-striped").find('[data-testid="libraryName"]').should("have.text",givenText).click()
         
    }
}
export default new Library
