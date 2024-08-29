class CustomMedLibraryPage {
    get btnEditPencil() { return cy.get('[data-testid="btnEditLibrary"]') }
    get btnUpdate() { return cy.get('[data-testid="confirmButton"]') }
    get btnCancel() { return cy.get('[data-testid="cancelButton"]') }
    get lableLibStatus() { return cy.get('.custom-control-label') }
}

export default new CustomMedLibraryPage()