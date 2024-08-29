import {
  Given,
  When,
  Then,
  DataTable,
} from "@badeball/cypress-cucumber-preprocessor";

import snfPage from "../../pages/snfPage";

Given(
  "the user is logged into the SNF Url {string} with credentials the sessionid is recorderded",
  (url: string, dataTable: DataTable) => {
    cy.clearAllCookies;
    cy.clearAllLocalStorage;
    cy.clearAllSessionStorage;
    cy.visit(url);
    dataTable.hashes().forEach((row) => {
      cy.log(row.username);
      cy.log(row.password);
      snfPage.typeUsername(row.username);
      snfPage.typePassword(row.password);
      snfPage.clickSignin();
    });
    let cookie;

    /* cy.getCookie("JSESSIONID")
      .should("exist")
      .then((c) => {
        // save cookie until we need it
        cookie = c;
        console.log(c.value);
        sessionId = c.value;
      });*/
  }
);

Given(
  "the user is logged into the SNF Url with credentials",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row) => {
      snfPage.typeUsername(row.username);
      snfPage.typePassword(row.password);
      snfPage.clickSignin();      
    });
    cy.get("body").then(($body) => {
      cy.wait(1000);
      if ($body.find('.textlink:contains("Check all")').length > 0) {
        cy.get("#saveWard").click();
      }
    });
  }
);

When(
  "the user search for the facility name {string}",
  (facilityName: string) => {
    snfPage.fillInFacilityDetails(facilityName);
  }
);

Given(
  "the user selects the resident with name {string} from the search results",
  (name: string) => {
    cy.contains("a", name).click();
  }
);

Given(
  "the user selects the facility {string} from search results",
  (name: string) => {
    cy.contains("a", name).click();
    cy.get("body").then(($body) => {
      if ($body.find('.textlink:contains("Check all")').length > 0) {
        cy.get("#saveWard").click();
      }
    });
  }
);

Given(
  "the user clicks on {string} menu followed by {string}",
  (menuName1: string, menuName2: string) => {
    cy.get(".dropdown-toggle").contains(menuName1).should("be.visible").click();
    cy.get("a").contains(menuName2).should("be.visible").click();
    Cypress.on("uncaught:exception", (err, runnable) => {
      cy.wait(5000);
      return false;
    });
  }
);

Then(
  "the user clicks on {string} menu and then {string}",
  (menuName1: string, menuName2: string) => {
    cy.get(".dropdown-toggle").contains(menuName1).should("be.visible").click();
    cy.get("li:nth-child(12) > a:nth-child(1)")
      .contains(menuName2)
      .should("be.visible")
      .click();
    Cypress.on("uncaught:exception", (err, runnable) => {
      cy.wait(5000);
      return false;
    });
  }
);

When(
  "the user search for the first name {string} and last name {string}",
  (firstName: string, lastName: string) => {
    snfPage.fillInResidentDetails(lastName, firstName);
  }
);

When(
  "the user selects the {string} facility from dropdown",
  (facilityName: string) => {
    snfPage.selectFacilityName(facilityName);
  }
);

When("the user selects {string} in the Order Type DDL", (orderType: string) => {
  snfPage.selectOrderDDL(orderType);
});

When("the user selects the existing order then user views the Order", () => {
  if (
    cy
      .get("#tr-ab-0 > td:nth-child(4)")
      .first()
      .should("contain", "Prescription")
  ) {
    cy.get("a[title='View order']:nth-child(1)").first().click();
  }
});

When(
  "the user clicks {string} Button that navigates to New Order",
  (buttonText: string) => {
    cy.get("input[name='copyOrder']").eq(1).click();
  }
);

Then(
  "the user clicks the {string} button to navigates back to Med Search page",
  (buttonText: string) => {
    cy.get("input[name='search']").eq(1).click();
    cy.url().should("include", "medication-search");
    cy.get("#search2").should("be.visible");
  }
);

When("the user clicks {string} Button", (buttonText: string) => {
  cy.get("input[name='edit']").eq(1).click();
});

Then("the user sees the order page in edit mode", () => {
  cy.url().should("include", "edit=true");
});

When(
  "the user clicks on {string} then {string} on discharge order",
  (addOrderText: string, prescriptionText: string) => {
    cy.get("#addOrderButtonTop").contains(addOrderText).click();
    cy.get("#two > a:nth-child(2)").click();
  }
);

When(
  "the user hits next after selecting the provider {string}",
  (providerName: string) => {
    snfPage.selectProviderDDL(providerName);
    snfPage.nextButton.click();
    cy.wait(1000);
    cy.get("body").then(($body) => {
      if ($body.find(".message-title").length) {
        cy.get("#allergyAlertOkayButton").click();
      }
    });
  }
);

When("the user selects the Order Source By {string}", (orderSource: string) => {
  snfPage.selectOrderSourceDDL(orderSource);
});

When("the user selects the provider {string}", (radiologyProvider: string) => {
  snfPage.selectRadiologyProviderDDL(radiologyProvider);
});

Then("the user clicks next button on the page", () => {
  snfPage.nextButton.click();
});

Then(
  "the {string} screen shows for {string}",
  (screenName: string, medName: string) => {
    cy.get("h1").contains(screenName).should("be.visible");
    //cy.get(".main.fieldheader").contains(medName).should("be.visible");
    cy.get(".main.fieldheader").then(($element) => {
      let text = $element.text().replace(/^\s+|\s+$/g, "");
      text = text.replace(/\n|\r/g, "");
      cy.log(text);
      expect(text).contain(medName);
    });
  }
);

Then(
  "the {string} screen shows for drug {string} form {string} strength {string} and schedule {string}",
  (
    screenName: string,
    medName: string,
    form: string,
    strength: string,
    schedule: string
  ) => {
    cy.get("h1").contains(screenName).should("be.visible");
    snfPage.validatePrescriptionDetails(medName, form, strength, schedule);
  }
);

Then("the user wants to create order for the resident", () => {
  cy.visit("/Zion?zionpagealias=SELECTPATIENT&RP=ORDERHOME");
});

Then("the user sees the MCSNF Drug Search Screen", () => {
  cy.get("h1").contains("Drug Search");
});
