class CustomMedication {

    get txtCustomMedication() { return cy.get("#customMedicationName") }
    get rdbtnControlledSubstanceYes() { return cy.get("#controlledSubstance") }
    get rdbtnControlledSubstanceNo() { return cy.get('[data-testid="notControlledSubstance"]') }
    get drpdownSchedule() { return cy.get("#deaSchedule") }
    get cancelPopUp() { return cy.get('.modal-body').last() }
    get drpdownIngredients() { return cy.get("#txtIngredientName") }
    get drpdownIngredientsField() { return cy.get("#txtIngredientName") }
    get chkboxIngredients() { return cy.get('.css-qr46ko>div>div') }
    get chkboxMedGroup() { return cy.get("#medication-group>div>ul>li>input") }
    get ingredientsCount() { return cy.get("[class*='badge badge-default ml-1']").first() }
    get iconRemove() { return cy.get(':nth-child(1) > .remove-item > .fa') }
    get customMedicationFieldBorderColor() { return cy.get("#customMedicationName.has-error") };
    get validationForCustomMedicationName() { return cy.get("#customMedicationName.has-error") };
    get controlledSubstanceColorForNo() { return cy.get("#isControlledSubstance.is-invalid") };
    get controlledSubstanceColorForYes() { return cy.get("#controlledSubstance.is-invalid") };
    get validationForControlledSubstance() { return cy.get(".invalid-feedback-message") };
    get scheduleFieldBorderColor() { return cy.get(".form-control.is-invalid") }
    get toggleStatus() { return cy.get("[data-testid='status']") }
    get toggleText() { return cy.get(".custom-control-label") }
    get mandatoryfieldCustomMedication() { return cy.get(".input-required:nth-child(1)") }
    get mandatoryfieldControlledSubstance() { return cy.get(".input-required:nth-child(1)") }
    get mandatoryfieldSchedule() { return cy.get("#lbl-deaSchedule") }
    get mandatoryFieldIcon() { return cy.get('[title="Mandatory field"]') }
    get noMedGrpSelected() { return cy.contains('No medication groups have been selected.') }
    get chkboxfirstIngredients() { return cy.get('[id$="option-0"]') }
    get chkboxfirstIngredientsDuringEdit() { return cy.get('[id$="option-0"]') }
    get selectedIngredient() { return cy.get('.bg-ingridents-med-group-items-box > li') }
    get chkboxfirstMedGroup() { return cy.get('.ingredient-med-grp-chkbox') }
    get selectedMedGroup() { return cy.get(':nth-child(11) > .row > .bg-ingridents-med-group-items-box > li') }
    get cutomMedicationInfoIcon() { return cy.get('i.fa.far.fa-info-circle:nth-child(2)') }
    get cutomMedicationfloatmessageforcharacters() { return cy.get('.float-right') }
    get drpdownIngredientsList() { return cy.get("#react-select-2-listbox") }
    get MedGroupDropdownVisiblity() { return cy.get('#medicationGroup>div:nth-child(4)') }
    get MedGroupDropdownInvisiblity() { return cy.get('#react-select-3-listbox') }
    get validationMessage() { return cy.get('.css-9x5mqu') }
    get medGroupDropdown() { return cy.get('#medicationGroup') }
    get medGroupCount() { return cy.get("[class*='badge badge-default ml-1']").last()  }
    get IngredientCountCount() { return cy.get("label[for='ingredients']>span:nth-child(1)") }
    get drpdownMedicationGroup() { return cy.get("#txtMedicationGroup") }
    get txtIngredientsbox() { return cy.get('#txtIngredientName') }
    get ingredientsListInDrpdwn() { return cy.get('#react-select-2-option-0 > .ingredients-med-group-label') }
    get ingredientScrolltoEndMsg() { return cy.get('.last-record-message.inline-message') }
    get MedicationGroupMessage() { return cy.get(':nth-child(8) > .form-group > .field-warning-message') }
    get maximumselectionmessage() { return cy.get('.max-selection-warning-msg') }
    get outsidedropdown() { return cy.get("[style='white-space: pre-wrap;']") }
    get unselectMedgroup() { return cy.get('#react-select-3-option-1') }
    get lblCustomMedicationName() { return cy.get('#lbl-customMedicationName') }
    get yesBtn() { return cy.get('.form-check-inline') }
    get ErrorsFound() { return cy.get('#num-of-errors-found') }
    //  get customMedErrorlink() { return cy.get('[href="#customMedicationName"]') }
    get customMedErrorlink() { return cy.get(".error-summary-message") }
    // get ControlledSubErrorlink() { return cy.get('[href="#isControlledSubstance"]') }
    get CustomMedErrorReason() { return cy.get('.invalid-feedback') }
    get ControlledSubErrorReason() { return cy.get('.mt-m20px > :nth-child(1) > .row > .form-group > .invalid-feedback-message') }
    get ScheduleErrorlink() { return cy.get('[href="#schedule"]') }
    get errorCloseIcon() { return cy.get('.alert-close') }
    get oneErrorfound() { return cy.get('.alert') }
    get warningMessageforCustomMedicationfeild() { return cy.get('#notifyonloststringmsg') }
    get summarypage() { return cy.get('.container-fluid') }
    get medicationGroupLabel() { return cy.get('[for="medicationGroup"]') }
    get ingredientsLabel() { return cy.get('[for="ingredients"]') }
    get heading() { return cy.get('h1') }
    get crossIcon() { return cy.get('.fa-close') }

    selectControlledSubstance(text: string) {
        if (text == 'Yes') {
            this.rdbtnControlledSubstanceYes.check().should('be.checked');
        } else {
            this.rdbtnControlledSubstanceNo.check().should('be.checked');
        }
    }
    selectSchedule(text: string) {
        this.drpdownSchedule.select(text)
    }

}
export default new CustomMedication