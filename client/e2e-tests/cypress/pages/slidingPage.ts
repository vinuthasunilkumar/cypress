class SlidingPage {

    get medicationName() { return cy.get('[data-testid=medDescription]') }

    get sideMenuGeneralInfo() { return cy.get('#genInfoTab') }
    get genInfoHeader() { return cy.get('#genInfoTabcontent > h3') }
    get classification() { return cy.get('[data-testid="therapeuticClassDescription"]') }
    get genericMedName() { return cy.get('[data-testid="genericmedicationDescription"]') }

    get sideIndications() { return cy.get('#indicationsTab') }
    get indicationsHeader() { return cy.get('#indicationsTabcontent > div > h3') }
    get indicationsList() { return cy.get('[data-testid="drugInfo-Indications"]') }

    get sideContraindications() { return cy.get('#contraindicationsTab') }
    get contraindicationsHeader() { return cy.get('#contraindicationsTabcontent > div > h3') }
    get contraindicationList() { return cy.get('[data-testid="drugInfo-Contraindications"]') }

    get sideSideEffects() { return cy.get('#sideEffectsTab') }
    get sideEffectsHeader() { return cy.get('#sideEffectsTabcontent > div > h3') }
    get sideEffectsList() { return cy.get('[data-testid="drugInfo-Side Effects"]') }

    get sideDrugDrugInteractions() { return cy.get('#drugDrugInteractionsTab') }
    get drugDrugInteractionsHeader() { return cy.get('#drugDrugInteractionsTabcontent > div > h3') }
    get drugDrugInteractionsList() { return cy.get('[data-testid="drugInfo-Drug-Drug Interactions"]') }


    get sideMinMaxDosing() { return cy.get('#minMaxDosingTab') }
    get minMaxHeader() { return cy.get('#minMaxDosingTabcontent > div > h3') }
    get minMaxList() { return cy.get('[data-testid="drugInfo-Min-Max Dosing"]') }

    get sideMonograph() { return cy.get('#monographTab') }
    get monographHeader() { return cy.get('#monographTabcontent > h3') }
    get monographPara() { return cy.get('#monographTabcontent > p') }

}

export default new SlidingPage();