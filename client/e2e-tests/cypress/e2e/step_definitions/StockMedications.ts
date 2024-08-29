import {
  When,
  Then,
  DataTable

} from "@badeball/cypress-cucumber-preprocessor";
import StockMedicationsPage from "../../pages/StockMedicationsPage";
import CommonComponentPage from "../../pages/CommonComponentPage";
import { createMultipleStockMedicationRecords } from "../../api/stockMedicationAPIs";
const envPAGE = require("../../env.config.json");

let facilityID: any;
before(function () {
  cy.fixture('stockMedications').then(function (data) {
    facilityID = data
  })
})

Then("User able to see {string} on header sections", (header: string) => {
  StockMedicationsPage.header.should('have.text', header)
})

Then("User able to see {string} Warning Message", (message: string) => {
  StockMedicationsPage.warningMessage.should('have.text', message)
})

Then("User able to see {string}", (text: string) => {
  StockMedicationsPage.message.should('have.text', text)
})

Then("user is able to see the Cancel popup with message {string}", (message) => {
  StockMedicationsPage.messageTitle.should("have.text", message);
}
);

Then("the user navigates back to the Stock Medication List Page", () => {
  cy.url().should('include', '/stock-medications');
})

Then("User select {string} on Units Dropdown", (unit: string) => {
  StockMedicationsPage.unitIndicator.click({ force: true })
  cy.get('[data-testid="' + unit + '"]').click()

})

Then("click on Medication field drop-down", () => {
  StockMedicationsPage.medicationField.click()
})

When("user types characters as {string}", (character: string) => {
  StockMedicationsPage.medicationField.type(character);
})

Then("verify error link {string}", (message: string) => {
  StockMedicationsPage.errorMessageButton
    .should("have.text", message);
})

Then("User Verify error message {string}", (errormessage: string) => {
  StockMedicationsPage.feedbackMessage.contains(errormessage).should("have.text", errormessage);
})

Then("user close the Add New Stock Medication", () => {
  StockMedicationsPage.stockMedication.click()
})

Then("User verify {string} ,{string} Label", (facility: string, acme: string) => {
  StockMedicationsPage.summary.contains(facility).should("have.text", facility);
  cy.get('#summary').contains(acme).should("have.text", acme)
})

Then("user click on Unit dropdown", () => {
  StockMedicationsPage.unitIndicator.click({ force: true })
  cy.wait(500)
})

Then("{string}, {string} user is able to see", (unit1: string, unit3: string) => {
  cy.get('[data-testid="' + unit1 + '"]').should('be.visible');
  cy.get('[data-testid="' + unit3 + '"]').should('be.visible');
})

Then("user checks {string},{string} checkboxes", (unit1: string, unit3: string) => {
  cy.get('[data-testid="' + unit1 + '"]').click()
  cy.get('[data-testid="' + unit3 + '"]').click()
})

Then("verify {string} selected", (unit1: string) => {
  StockMedicationsPage.selectedUnits.contains(unit1).should('be.visible')
})

Then("user click on ouside of the dropdown", () => {
  StockMedicationsPage.outsideTextfield.click()
})

When("Enter {string} in the Medication", (medicationName: string) => {
  StockMedicationsPage.selectstockMedication.clear().type(medicationName);
})

Then("verify the message for the field after selecting 15 items {string}", (message: string) => {
  StockMedicationsPage.selectionWarningMessage.should('have.text', message)
})

Then("clicks on Remove icon {string} times", (count: number) => {
  let removeCount = count;
  for (let closeBtnIndex = 1; closeBtnIndex <= removeCount; closeBtnIndex++) {
    StockMedicationsPage.removeicon.click();
  }
})

Then("verify the message for {string}", (message: string) => {
  StockMedicationsPage.warningMessage.should('have.text', message)
})

Then("user click on x Button on Error message", () => {
  StockMedicationsPage.alertError.click()
})

Then("the sort order of stock medication should be {string}", (value: string) => {
  CommonComponentPage.verifySortOrder(value, "td:nth-child(2)>a:nth-child(1)");
})

Then("the sort order of assigned to should be {string}", (value: string) => {
  CommonComponentPage.verifySortOrder(value, "td:nth-child(3)");
})

Then("click on Medication or Supply sort", () => {
  StockMedicationsPage.medicationSorting.scrollIntoView().then(($el) => {
    cy.wrap($el).click();
  });
})

Then("click on AssignTo sort", () => {
  cy.scrollTo('top');
  StockMedicationsPage.assignToSorting.click();
})

Then("check the main checkboxes and verify all the checkboxes is checked", () => {
  StockMedicationsPage.masterCheckBoxes.check();
  StockMedicationsPage.checkBoxes.each(($checkbox) => {
    cy.wrap($checkbox).should('be.checked');
  });
})

Then("verify all the checkboxes is unchecked in the page", () => {
  StockMedicationsPage.checkBoxes.each(($checkbox) => {
    cy.wrap($checkbox).should('not.be.checked');
  });
})

When("user clicks on next page arrow", () => {
  StockMedicationsPage.nextPageArrow.click();
})

Then("verify {string} is displayed in list page", (medication: string) => {
  StockMedicationsPage.searchMedication.should('have.text', medication)
})


Then("verify Add New button is {string}", (button: string) => {
  if (button === "disabled") {
    StockMedicationsPage.addButton.eq(0).should('have.attr', 'disabled')
  }
  else {
    StockMedicationsPage.addButton.should('not.have.attr', 'disabled')
  }
})

Then("user click {string} on Stock Medication summary page", (medicationName: string) => {
  StockMedicationsPage.firstMedicationSummaryPage.contains(medicationName).click()
})

Then("user verifies Delete button is visible", () => {
  StockMedicationsPage.editMedicationDeleteBtn.should('be.visible')
})

Then("user selects the created {string} Stock Medication", (number: number) => {
  cy.wait(2000)
  for (let deleteRecords = 0; deleteRecords < number; deleteRecords++) {
    cy.get(".text-center").children('[type="checkbox"]').eq(deleteRecords).click()
  }
})

Then("the popup appears as {string}", (message: string) => {
  StockMedicationsPage.deletePopupTitle.should('have.text', message)
})

Then("user verifies the message as {string}", (message: string) => {
  StockMedicationsPage.deletePopupBody.should('have.text', message)
})

Then("user verifies the second message as {string}", (message: string) => {
  StockMedicationsPage.deletePopupBodySecondMessage.eq(1).should('have.text', message)
})

Then("user sees the message as {string}", (message: string) => {
  StockMedicationsPage.alertMessage.should('have.text', message)
})

Then("User selects the first stock medication", () => {
  StockMedicationsPage.firstMedicationSummaryPage.eq(0).click()
})

Then("the user clicks on Delete button on edit page", () => {
  StockMedicationsPage.editMedicationDeleteBtn.click()
})

Then("the user clicks on Delete button on the confirmation popup", () => {
  StockMedicationsPage.delBtnOnConfirmationPage.click();
})

Then("Stock medication {string} exist on summary page", (textMessage: string) => {
  if (textMessage === "should not") {
    StockMedicationsPage.noDataFound.should('have.text', 'No matches found')
  }
  else {
    StockMedicationsPage.stockMedSupplyName.should("be.visible");
  }
})

Then("the user clicks on cancel button on popup", () => {
  StockMedicationsPage.cancelStockMed.click()
})

Then("the user clicks on Cross button", () => {
  StockMedicationsPage.crossBtn.click()
})

Then("user clicks on Select All checkbox", () => {
  StockMedicationsPage.selectAll.click()
})

Then("User deletes all the stock medications from UI", () => {
  StockMedicationsPage.deleteAllStockMedFromUI();
})

Then("the user see the message {string}", (message: string) => {
  cy.wait(500)
  StockMedicationsPage.alerts.should("have.text", message);
})

When("user select the following in the {string} field", (type: string, dataTable: DataTable) => {
  if (type == "Medication/Supply") {
    dataTable.hashes().forEach((row) => {
      StockMedicationsPage.selectstockMedication.type(row.MedicationName);
      cy.wait(4000);
      StockMedicationsPage.input.realPress("Tab");
      StockMedicationsPage.menu.click({ force: true })
    })
  }
})

Then("the user verifies {string} {string} {string} to popup appears", (text: string, selectedMedications: number, stockMedText: string) => {
  StockMedicationsPage.popUpHeader.eq(1).should('have.text', text + " " + selectedMedications + " " + stockMedText)
})

Then("user selects {string} facility", (facilityName: string) => {
  StockMedicationsPage.facilityTextfield.click().type(facilityName).realPress("Tab");
  cy.wait(1000)
})

Then("the user clicks on Export button on popup", () => {
  StockMedicationsPage.exportBtn.click()
})

Then("user selects {string} unit", (unitName: string) => {
  StockMedicationsPage.unitTextField.type(unitName).realPress("Tab");
  cy.wait(1000)
  StockMedicationsPage.unitLabel.eq(1).click()
})

Then("user verifies the validation message as {string}", (textMessage: string) => {
  StockMedicationsPage.alertMessage.should('have.text', textMessage)
})

Then("verify user is redirected to stockMed list page", () => {
  cy.url().should("include", "/stock-medications");
})

Then("user verifies {string} stock medications are exported in the {string} facility", (stockMedNumber: number, facilityName: string) => {
  cy.window().then((win) => {
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `SELECT COUNT(*)
        FROM public."StockMedication" 
        where "FacilityId" = '` + facilityID[facilityName] + `';`
    }).then((result: any) => {
      expect(result.rows[0].count).to.equals(stockMedNumber);
    })
  })
})

Then("user verifies the {string} button is disabled", (linkText: string) => {
  if (linkText === "Export List") {
    StockMedicationsPage.copyLinkBtn.eq(1).should(
      "have.class",
      "export-disabled-item"
    );
  }
  else if (linkText === "Export") {
    StockMedicationsPage.exportBtnOnSummaryPage.should('be.disabled')
  }
  else {
    StockMedicationsPage.copyLinkBtn.eq(0).should(
      "have.class",
      "export-disabled-item"
    );
  }
})

Then("user verifies validation message as {string}", (validationMessage: string) => {
  StockMedicationsPage.feedbackMessage.should("have.text", validationMessage)
})

Then("user verifies {string} header", (headerMessage: string) => {
  StockMedicationsPage.errorsFound.should("have.text", headerMessage)
})

Then("user verifies {string} link", (errorMessage: string) => {
  StockMedicationsPage.errorMessageButton.should("have.text", errorMessage)
})

Then("user clicks on cross button on facility dropdown", () => {
  StockMedicationsPage.clearFacility.click()
})

Then("user type {string} in Facility field", (facilityName: string) => {
  StockMedicationsPage.facilityTextfield.click().type(facilityName);
})

Then("User verifies {string} is displayed", (messageText: string) => {
  cy.wait(500)
  StockMedicationsPage.facNoOptionsFoundText.should("have.text", messageText)
})

Then("verify all the selected checkboxes are reset now", () => {
  StockMedicationsPage.checkBoxes.should('not.be.checked');
})

Then("user deletes the stock med in the {string} facility in DB", (facilityName: string) => {
  cy.window().then((win) => {
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `DELETE FROM public."StockMedication"
         where "FacilityId" = '` + facilityID[facilityName] + `';`
    })
  })
})

Then("user creates multiple records for Stock Medication through API", () => {
  cy.window().then((win) => {
    createMultipleStockMedicationRecords()
  })
})

Then("User able to see the text {string}", (text: string) => {
  StockMedicationsPage.exportLabelText.contains(text)
})

Then("{string} label displayed", (text: string) => {
  StockMedicationsPage.exportHeader.contains(text)
})

Then("User checks {string}", (text: string) => {
  StockMedicationsPage.selectFacility.contains(text)
})

Then("User checks the {string}", (text: string) => {
  StockMedicationsPage.selectImoprtFacility.should('have.text', text)
})

Then("{string} facility is slected in Import pop-up", (facilityName: string) => {
  StockMedicationsPage.importFacilityTextfield.click().type(facilityName).realPress("Tab");
  cy.wait(1000)
})

Then("Stock Medication Header should be {string}", (text: string) => {
  StockMedicationsPage.headerSection.should('have.text', text)
})

Then("user verifies on UI {string} stock medications are exported in the {string} facility", (facilityCount: number, facilityName: string) => {
  StockMedicationsPage.headerSection.should('have.text', facilityName)
  if (facilityCount == 0) {
    StockMedicationsPage.noDataFound.should('have.text', "No matches found")
  }
  else {
    StockMedicationsPage.stockMedOnListPage.its('length').should('eq', Number(facilityCount))
  }
})

Then("the user clicks on Import button", () => {
  StockMedicationsPage.exportBtn.click()
})

Then("the user clicks on cancel button", () => {
  StockMedicationsPage.cancelBtn.click()
})

Then("database count should be 1 less than UI count", () => {
  let databaseCount: number, uiCount: number
  cy.window().then((win) => {
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `SELECT COUNT(*)
           FROM public."Facility" where "GlobalFacilityId" is not null;`
    }).then((result: any) => {
      databaseCount = result.rows[0].count
    })
  }).then(() => {
    StockMedicationsPage.importDropdown.click();
    for (let scrollIndex = 4; scrollIndex <= 13; scrollIndex++) {
      cy.get('[id$="option-' + scrollIndex + '"]').scrollIntoView()
    }
    StockMedicationsPage.dropDownValue.its('length').then((len) => {
      uiCount = len;
    })
  }).then(() => {
    expect(databaseCount - 1).to.eq(uiCount)
  })
})

Then("database count should be {string}", (rowscount: string) => {
  cy.window().then((win) => {
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `SELECT "StockMedicationId","FacilityId", "FdbMedId", "CreatedDateTime", "CreatedBy", "ModifiedDateTime", "ModifiedBy", "IsGeneric", "ParentFdbMedId"
	FROM public."StockMedication"`
    }).then((result: any) => {
      let databaseCount = result.rows[0].count
      expect(databaseCount === rowscount);
    })
  })
})


Then("UI count should be {string}", (count: string) => {
  StockMedicationsPage.supplyName.should('have.length', count)
})

Then("user Verify text {string}", (text: string) => {
  StockMedicationsPage.messageText.should('have.text', text)
})

Then("click on {string} tab and {string} menu",(tab:string,menu:string)=>{
  StockMedicationsPage.residentTab.contains(tab).click();
  StockMedicationsPage.orderMenu.contains(menu).click()
})

Then("verify stock medication icon {string} present next to the medication",(textMessage:string)=>{
   if(textMessage==="is"){
    StockMedicationsPage.stockMedicationIcon.should('be.visible')
   }
   else{
    StockMedicationsPage.stockMedicationIcon.should('not.exist')
   }
})

Then("the user sees {string} in second row",(medication:string)=>{
  StockMedicationsPage.secondOrderSearchResult.eq(2).should('contain',medication)
  })


Then("verify Do not fill checkbox {string} checked", (textMessage: string) => {
    if (textMessage === "is not") {
      StockMedicationsPage.doNotFillCheckbox.should('not.be.checked');
    }
    else {
      StockMedicationsPage.doNotFillCheckbox.should('be.checked');
    }
  })
