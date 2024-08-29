import { When, Then, DataTable } from "@badeball/cypress-cucumber-preprocessor";

import customMedLib from "../../pages/CustomMedLibraryPage";

When("the user clicks on the edit pencil", () => {
  customMedLib.btnEditPencil.click();
});

Then("the user can update the library name", () => {
  cy.get(".modal-dialog")
    .should("be.visible")
    .then(($modal) => {
      cy.wrap($modal).find("#libraryName").type("updatedLibName");
      cy.wrap($modal)
        .find('[data-testid="confirmButton"]')
        .should("not.be.disabled");
    });
});

Then("the user can inactivate or toggle the library status", () => {
  cy.wait(2000);
  cy.get(".modal-dialog")
    .should("be.visible")
    .then(($modal) => {
      cy.wrap($modal).find(".custom-control-label").click({ force: true });
    });
});

Then("user toggles the custom medication status", () => {
  const featuresSelector = '[data-testid^="status-"]';
  cy.get(featuresSelector).first().click({ force: true });
});

Then("the user cannot inactivate or toggle the library status", () => {
  cy.get(".modal-dialog")
    .should("be.visible")
    .then(($modal) => {
      cy.wrap($modal).find(".custom-control-label").should("not.exist");
    });
});

When("user cannot toggle the custom medication status", () => {
  const featuresSelector = '[data-testid^="status-"]';
  cy.get(featuresSelector).should("not.exist");
});

Then(
  "the user sees the warning message in the Inactivate Library modal mentioning the following facilities",
  (facilityList: DataTable) => {
    cy.get('[data-testid="confirmWarningModel"]')
      .should("be.visible")
      .then(($modal) => {
        cy.wrap($modal)
          .find(".modal-body")
          .contains(
            "You are about to inactivate this library. The following facilities have the library assigned as a Custom Medication Library."
          );
        let n = 0;
        facilityList.hashes().forEach((row) => {
          cy.wrap($modal)
            .find(".modal-body")
            .find(".anchor-button")
            .contains(row.facilityName);
          n++;
        });
        cy.wrap($modal).find("#btnConfirm").click();
      });
  }
);
