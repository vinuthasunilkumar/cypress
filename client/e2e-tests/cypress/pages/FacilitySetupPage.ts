class FacilitySetupPage {
    get ddlFormularyLibrary() { return cy.get('.FormularyLibrary') }
    get ddlCustomMedicationLibrary() { return cy.get('.CustomMedicationLibrary') }
    get ddlView() { return cy.get('#dropdownMenuButton') }
    get chkEnabledMedSearch() {return cy.get('#enhancedOrderSearchCheckbox')}
}

export default new FacilitySetupPage()