class OrderWriterPage {
  get OrderWriterTitle() {
    return cy.get("h1");
  }
  get medicationName() {
    return cy.get("div>div.col-10");
  }
  get lblInstructions() {
    return cy.get("#instructions");
  }
  get lblIcd10() {
    return cy.get("#icd-10");
  }
  get lblSchedule() {
    return cy.get("#administrationSchedule");
  }
  get lblOrderBy() {
    return cy.get("#orderBy");
  }
  get lblOrderSource() {
    return cy.get("#orderSource");
  }
  get lblRelatedEvent() {
    return cy.get("#relatedEvent");
  }
  get iconAlerttooltip() {
    return cy.get('img[data-toggle="tootltip"]');
  }
  get orderDetailsTitle() {
    return cy.get("#orderDetails1");
  }
  get instructionTitle() {
    return cy.get("#instructions2");
  }
  get durTitle() {
    return cy.get("#durAcknowledgement");
  }
  get lblInstOrderBy() {
    return cy.get('[for="Order By"]');
  }
  get orderByDropdown() {
    return cy.get('[data-testid="ddlOrderBy"');
  }
  get lblInstOrderSrc() {
    return cy.get("#orderSource1");
  }
  get orderSourceDropdown() {
    return cy.get('[data-testid="ddlOrderSource"]');
  }
  get lblstartDate() {
    return cy.get("#startDate");
  }
  get startDate() {
    return cy.get("#startDatePicker");
  }
  get lblEndDate() {
    return cy.get("#endDate");
  }
  get endDate() {
    return cy.get("#endDatePicker");
  }
  get chkboxOpenEnded() {
    return cy.get("#option1stacked");
  }
  get lblOpenEnded() {
    return cy.get("#openEnded");
  }
  get methodQueryDropdown() {
    return cy.get('[data-testid="ddlMethod"]');
  }
  get routeQueryDropdown() {
    return cy.get('[data-testid="ddlRoute"]');
  }
  get lblInstDosage() {
    return cy.get("#dosage");
  }
  get txtInstDosage() {
    return cy.get("#dosageInput");
  }
  get doseUnitQueryDropdown() {
    return cy.get('[data-testid="ddlMeasure"]');
  }
  get frequencyQueryDropdown() {
    return cy.get('[data-testid="ddlFrequency"]');
  }
  get chkboxInstPRN() {
    return cy.get("#option2stacked");
  }
  get lblInstPRN() {
    return cy.get("#prn");
  }
  get locationQueryDropdown() {
    return cy.get('[data-testid="ddlLocation"]');
  }
  get lblInstDuration() {
    return cy.get("#duration");
  }
  get txtInstDuration() {
    return cy.get("#durationInput");
  }
  get durationTypeQueryDropdown() {
    return cy.get('[data-testid="ddlDurationType"]');
  }
  get chkboxInstfield() {
    return cy.get("#option3stacked");
  }
  get lblInstfield() {
    return cy.get("#instructionLine");
  }
  get indicationQueryDropdown() {
    return cy.get(".ddlIndication");
  }
  get lblAddInstructions() {
    return cy.get("#additionalInstruction");
  }
  get txtAddInstructions() {
    return cy.get("#txtAreaCount");
  }
  get AddInstructionscount() {
    return cy.get(".float-right");
  }
  get lblMaxDailyDose() {
    return cy.get("#maximumDailyDose");
  }
  get txtMaxDailyDose() {
    return cy.get("#maximumDailyDoseInput");
  }
  get maxDailyDoseMeasureQueryDropdown() {
    return cy.get('[data-testid="ddlMddMeasure"]');
  }
  get tabContraindiction() {
    return cy.get("#tab1");
  }
  get tabContraindictionCount() {
    return cy.get("#tab1 > span");
  }
  get tabSevere() {
    return cy.get("#tab2");
  }
  get tabSevereCount() {
    return cy.get("#tab2 > span");
  }
  get tabModerate() {
    return cy.get("#tab3");
  }
  get tabModerateCount() {
    return cy.get("#tab3 > span");
  }
  get tabInformational() {
    return cy.get("#tab4");
  }
  get tabInformationalCount() {
    return cy.get("#tab4 > span");
  }
  get lblCommonReason() {
    return cy.get("#commonOverrideReason");
  }
  get dropdwnCommonReason() {
    return cy.get("div.row.col-12 > div > div > select");
  }
  get btnPrevious() {
    return cy.get("#previousBtn");
  }
  get btnNext() {
    return cy.get("#nextBtn");
  }
  get btnSave() {
    return cy.get("#saveBtn");
  }
  get btnCancel() {
    return cy.get("#cancelBtn");
  }
  get diagnosisTitle() {
    return cy.get("#diagnosisLabel");
  }
  get lblSearchDiagnosis() {
    return cy.get("#searchDiagnoses");
  }
  get searchDropdown() {
    return cy.get('[data-testid="diagnosisType"]');
  }
  get lblSelectedDiagnosis() {
    return cy.get("#ICD-10-Diagnosis");
  }
  get activeforResidentLeftDropdown() {
    return cy.get("select > option:nth-child(1)");
  }
  get activeforResidentRightDropdown() {
    return cy.get('[data-testid="ddlDiagnoses"]');
  }
  get searchAllLeftDropdown() {
    return cy.get("select > option:nth-child(2)");
  }
  get searchAllRightDropdown() {
    return cy.get("#diagnosis");
  }
  get DeleteDiagnosisButton() {
    return cy.get("tr > td:nth-child(1) > i");
  }
  get selectedDiagnosiscode() {
    return cy.get("tr > td:nth-child(2)");
  }
  get selectedDiagnosisDesc() {
    return cy.get("tr > td:nth-child(3)");
  }
  get additionalDetailTab() {
    return cy.get(".custom-span").last();
  }
  get pharmacyValueLbl() {
    return cy.get("#pharmacyInput");
  }
  get dawChbox() {
    return cy.get("#option1stacked");
  }
  get doNotFillChbox() {
    return cy.get("#option2stacked");
  }
  get ekitChbox() {
    return cy.get("#option3stacked");
  }
  get ekitDosesTxt() {
    return cy.get("#ekitValue");
  }
  get pharmacyNotesTextAre() {
    return cy.get("#txtAreaCount");
  }
  get administrationScheduleLeftPanel() {
    return cy.get("#administration-schedule-text");
  }
  get additionalDetailsLeftPanel() {
    return cy.get("#additional-detail-text");
  }

  get administrationScheduleOrderDetails() {
    return cy.get(".adminSummary").last();
  }

  get frequencyQueryDropdownSelectFirstOption() {
    return cy.get('[class^="ddlFrequency input-field-select__option"] > div');
  }
  get firstAdminDateTimeLeftPanel() {
    return cy.get("#first-admin-date-time");
  }
  get lastAdminDateTimeLeftPanel() {
    return cy.get("#calculated-last-admin-datetime");
  }
  selectFrequencyFromDropDown(frequency: string) {
    this.frequencyQueryDropdown.click();
    this.frequencyQueryDropdown.type(frequency);
    this.frequencyQueryDropdownSelectFirstOption.contains(frequency).click();
  }

  verifyElementIsEnabled(id: string, isenabled: string) {
    if (isenabled == "false") {
      cy.get(id).should("be.disabled");
    } else if (isenabled == "true") {
      cy.get(id).should("be.enabled");
    }
  }

  verifylabelIdDisplayed(labelText: string, isdisplayed: string) {
    if (isdisplayed == "is not") {
      cy.contains(labelText).should("not.exist");
    } else if (isdisplayed == "is") {
      cy.contains(labelText).should("exist").and("be.visible");
    }
  }

  validateWarningMessaages(exitType: string, choice: string) {
    if (exitType == "body") {
      cy.get(exitType).click(0, 0);
    } else {
      cy.get(exitType).click({ force: true });
    }
    if (choice == "Yes") {
      cy.get("div.fade.modal.show > div")
        .should("be.visible")
        .then(($modal) => {
          cy.wrap($modal)
            .find(".modal-content > div.modal-footer > #btnConfirm")
            .click({ force: true });
        });
    } else {
      cy.get("div.fade.modal.show > div")
        .should("be.visible")
        .then(($modal) => {
          cy.wrap($modal)
            .find(".modal-content > div.modal-footer > #btnCancel")
            .click({ force: true });
        });
    }
  }
  errorValidationOnTextField(element: string, valueType: string) {
    if (valueType == "invalid") {
      cy.get(`[data-testid=${element}error]`)
        .invoke("text")
        .should("not.be.empty");
    } else if (valueType == "valid") {
      cy.get(`[data-testid=${element}error]`).should("not.have.text", "");
    }
  }

  verifyAdminDateTimeWithCustomizeScheduling() {
    this.startDate.invoke("val").then((value) => {
      cy.wrap(value).as("firstAdminDateTimeOrderDetails");
    });
    this.endDate.invoke("val").then((value) => {
      cy.wrap(value).as("lastAdminDateTimeOrderDetails");
    });
    cy.get("@firstAdminDateTimeCustomizeScheduling").then(
      (firstAdminDateTimeCustomizeScheduling) => {
        cy.get("@lastAdminDateTimeCustomizeScheduling").then(
          (lastAdminDateTimeCustomizeScheduling) => {
            cy.get("@firstAdminDateTimeOrderDetails").should(
              "eq",
              firstAdminDateTimeCustomizeScheduling
            );
            cy.get("@lastAdminDateTimeOrderDetails").should(
              "eq",
              lastAdminDateTimeCustomizeScheduling
            );
          }
        );
      }
    );
  }

  verifyAdminDateTimeWithLeftPanel() {
    this.startDate.invoke("val").then((value) => {
      cy.wrap(value).as("firstAdminDateTimeOrderDetails");
    });
    this.endDate.invoke("val").then((value) => {
      cy.wrap(value).as("firstAdminDateTimeOrderDetails");
    });
    this.firstAdminDateTimeLeftPanel.invoke("text").then((value) => {
      cy.wrap(value).as("firstAdminDateTimeLeftPanel");
    });
    this.lastAdminDateTimeLeftPanel.invoke("text").then((value) => {
      cy.wrap(value).as("lastAdminDateTimeLeftPanel");
    });
    cy.get("@firstAdminDateTimeOrderDetails").then(
      (firstAdminDateTimeOrderDetails) => {
        cy.get("@lastAdminDateTimeOrderDetails").then(
          (lastAdminDateTimeOrderDetails) => {
            cy.get("@firstAdminDateTimeLeftPanel").should(
              "eq",
              firstAdminDateTimeOrderDetails
            );
            cy.get("@lastAdminDateTimeLeftPanel").should(
              "eq",
              lastAdminDateTimeOrderDetails
            );
          }
        );
      }
    );
  }
}

export default new OrderWriterPage();
