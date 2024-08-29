class SnfPage {
  get usernameInput() { return cy.get("#okta-signin-username") }
  get passwordInput() { return cy.get("#okta-signin-password") }
  get signinBtn() { return cy.get("#okta-signin-submit") }
  get lastNameInput() { return cy.get("#LastName") }
  get firstNameInput() { return cy.get('input[name="FirstName"]') }
  get facilityNameInput() { return cy.get('input[name="facility_name"]') }
  get clearLink() { return cy.get('a[href="javascript:clearForm();"]') }
  get searchButton() { return cy.get(".btn").contains("Search") }
  get orderTypeDDL() { return cy.get("#orderType") }
  get facilityNameDropdown() { return cy.get("#facility") }
  get providerTypeDDL() { return cy.get("#PROVIDERID") }
  get nextButton() { return cy.get("#orderNextButton") }
  get iptDrug() { return cy.get("#drugName") }
  get iptStrength() { return cy.get("#strength") }
  get iptForm() { return cy.get("#form") }
  get iptSchedule() { return cy.get("#cSASchedule") }
  get orderSourceTypeDDL() { return cy.get("#orderSourceId") }
  get radiologyProviderTypeDDL() { return cy.get("#XRAYPROVIDERID") }

  typeUsername(username: string) {
    this.usernameInput.type(username);
  }

  typePassword(password: string) {
    this.passwordInput.type(password);
  }

  clickSignin() {
    this.signinBtn.click();
  }

  fillInResidentDetails(lastName: string, firstName: string) {
    cy.contains("a", "Check All").should("be.visible").click();
    this.clearLink.click();
    this.lastNameInput.type(lastName);
    this.firstNameInput.type(firstName);
    this.searchButton.click();
  }

  fillInFacilityDetails(facilityName: string) {
    this.facilityNameInput.type(facilityName);
    this.searchButton.click();
  }

  selectFacilityName(facilityName: string) {
    this.facilityNameDropdown.select(facilityName);
  }

  selectOrderDDL(orderType: string) {
    this.orderTypeDDL.select(orderType);
  }

  selectProviderDDL(providerName: string) {
    this.providerTypeDDL.select(providerName);
  }

  selectOrderSourceDDL(orderSource: string) {
    this.orderSourceTypeDDL.select(orderSource);
  }

  selectRadiologyProviderDDL(orderSource: string) {
    this.radiologyProviderTypeDDL.select(orderSource);
  }

  validatePrescriptionDetails(medName: string, form: string, strength: string, schedule :string) {
    this.iptDrug.should('have.value', medName)
    this.iptStrength.should('have.value', strength)
    this.iptForm.should('have.value', form)
    this.iptSchedule.should('have.value', schedule)
    
  }
}

export default new SnfPage();
