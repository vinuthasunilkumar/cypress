class StockMedicationsPage {
    get header() { return cy.get('.header') }
    get warningMessage() { return cy.get('.field-warning-message') }
    get message() { return cy.get('.inline-message > .ml-1') }
    get messageTitle() { return cy.get('#messageTitle') }
    get unitIndicator() { return cy.get('.Unit__indicator') }
    get medicationField() { return cy.get('.css-ihxobv') }
    get errorMessageButton() { return cy.get('.error-message-button') }
    get feedbackMessage() { return cy.get('.invalid-feedback-message') }
    get stockMedication() { return cy.get('[data-testid="close-stock-medication"]') }
    get summary() { return cy.get('[for="summary"]') }
    get selectedUnits() { return cy.get('#selectedUnits') }
    get outsideTextfield() { return cy.get('.row > .form-group > .col-form-label') }
    get medication() { return cy.get('.css-19bb58m') }
    get selectionWarningMessage() { return cy.get('.max-selection-warning-msg') }
    get removeicon() { return cy.get('.bg-ingridents-med-group-items-box > li:nth-child(1) > button > i') }
    get alertError() { return cy.get('[data-testid="alert-error-close-btn"]') }
    get addButton() { return cy.get("[data-testid='btnAddNewStockMedications']") }
    get searchMedication() { return cy.get("td:nth-child(2)>a:nth-child(1)") }
    get nextPageArrow() { return cy.get('[data-testid="nextPage"]') }
    get checkBoxes() { return cy.get('input[type="checkbox"]') }
    get masterCheckBoxes() { return cy.get("#masterSelect") }
    get medicationSorting() { return cy.get('[data-testid="sort-stock-medications-stockmedication"] > .fa-regular') }
    get assignToSorting() { return cy.get("[data-testid='sort-stock-medications-assignedto']") }
    get stockMedicationTable() { return cy.get('tbody>tr') }
    get medicationRow() { return cy.get("td:nth-child(2)>a:nth-child(1)") }
    get assignToRow() { return cy.get("tr>td:nth-child(3)") }
    get firstMedicationSummaryPage() { return cy.get('[data-testid = "stockMedSupplyName"]') }
    get medicationSupply() { return cy.get('#medication-supply') }
    get facility() { return cy.get('#summary') }
    get editMedicationDeleteBtn() { return cy.get('[data-testid="btnSingleDeleteStockMedication"]') }
    get deletePopupTitle() { return cy.get('.h4 > .modal-title') }
    get deletePopupBody() { return cy.get(".modal-body>p>b") }
    get deletePopupBodySecondMessage() { return cy.get(".modal-body>p:nth-child(2)") }
    get alertMessage() { return cy.get('.alert-success') }
    get delBtnOnConfirmationPage() { return cy.get('#confirmDeleteButton') }
    get noDataFound() { return cy.get('.no-data') }
    get stockMedSupplyName() { return cy.get('.stock-med-supply-name') }
    get searchStockMed() { return cy.get('#txtSearch') }
    get cancelStockMed() { return cy.get('[data-testid="cancelDeleteButton"]') }
    get crossBtn() { return cy.get('#btnCloseModal') }
    get selectAll() { return cy.get("#masterSelect") }
    get selectstockMedication() { return cy.get("#txtMedicationSupplyName") }
    get alerts() { return cy.get("[role='alert']") }
    get input() { return cy.get("input") }
    get menu() { return cy.get("h2") }
    get popUpHeader() { return cy.get("h4.modal-title") }
    get facilityTextfield() { return cy.get(".input-field-select .Export .To__input-container") }
    get exportBtn() { return cy.get("#btnConfirm") }
    get unitTextField() { return cy.get(".Units__value-container") }
    get unitLabel() { return cy.get(".showLabel") }
    get copyLinkBtn() { return cy.get('[aria-labelledby="btnExportStockMedications"]>a') }
    get errorsFound() { return cy.get("#num-of-errors-found") }
    get clearFacility() { return cy.get(".Export.To__clear-indicator") }
    get facNoOptionsFoundText() { return cy.get(".To__menu-notice--no-options") }
    get exportBtnOnSummaryPage() { return cy.get("#btnExportStockMedications") }
    get importfacilityTextfield() { return cy.get(".input-field-select.Import .From__input-container") }
    get exportLabelText() { return cy.get(".d-flex.align-items-baseline.inline-message.im-notification > span") }
    get exportHeader() { return cy.get("h4>b") }
    get selectFacility() { return cy.get("label[for='Select GM Facility A Stock Medication/Supply List Units'] span") }
    get selectImoprtFacility() { return cy.get("label[for='Select GM Facility A Stock Medication/Supply List Units']") }
    get importFacilityTextfield() { return cy.get('.From__input-container') }
    get listPage() { return cy.get('.anchor-button') }
    get headerSection() { return cy.get('h1') }
    get stockMedOnListPage() { return cy.get('[data-testid="stockMedSupplyName"]') }
    get cancelBtn() { return cy.get("#btnCancel") }
    get importDropdown() {return cy.get('.From__input-container')}
    get dropDownValue() {return cy.get('[id^= "react-select-2-option"]')}
    get messageText() {return cy.get('.inline-message')}
    get supplyName() {return cy.get('[data-testid="stockMedSupplyName"]')}
    get stockMedicationIcon() {return cy.get('[data-testid*="image-InStock"]')}
    get doNotFillCheckbox() {return cy.get("#option2stacked")}
    get secondOrderSearchResult() { return cy.get(".anchor-button")}
    get residentTab() {return cy.get('#appMenu>ul>li>a')}
    get orderMenu() {return cy.get('#dynamic-mega-menu-items>li>a')}

    deleteStockMed() {
        this.selectAll.click();
        cy.get("button").contains("Delete").click({ force: true });
        this.delBtnOnConfirmationPage.click();
    }

    deleteAllStockMedFromUI() {
        let numberOfEntries;
        cy.wait(3000)
        cy.get('body').then($element => {
            if ($element.find(".dataTables_info").length === 0)
                cy.get('body').then($ele => {
                    if ($ele.find(".no-data").length === 0)
                        this.deleteStockMed()
                })
            else {
                cy.get('.dataTables_info').invoke('text').then(entriesText => {
                    numberOfEntries = entriesText.split('of ')[1].split(' ')[0];
                    let numberOfPages = Math.ceil(numberOfEntries / 20);
                    for (let pages = 0; pages < numberOfPages; pages++) {
                        this.deleteStockMed()
                        cy.wait(1000)
                    }
                });
            }
        })
    }
}
export default new StockMedicationsPage