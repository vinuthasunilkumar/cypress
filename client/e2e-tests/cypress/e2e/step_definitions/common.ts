import {
  Given,
  When,
  Then,
  DataTable,
} from "@badeball/cypress-cucumber-preprocessor";
import FrequencyAndAdminPage from "../../pages/FrequencyAndAdminPage";
import CommonComponentPage from "../../pages/CommonComponentPage";
import StockMedicationsPage from "../../pages/StockMedicationsPage";

beforeEach(() => {
  // listen for events bubbling up to the top window: cypress specs
  // then re-emits those events down to the application under test (AUT)
  cy.window().then((win) => {
    win!.top!.addEventListener("message", (e) => {
      win.postMessage({ ...e.data }, "*");
    });
  });
  const stub = cy.stub().as("open");
  cy.on("window:before:load", (win) => {
    cy.stub(win, "open").callsFake(stub);
  });
  cy.intercept(/\/cloud-service\/orders-pilot\/api\/medications\/[0-9]+$/).as(
    "medInfo"
  );
  cy.intercept("/cloud-service/orders-pilot/api/user-security/facilities*").as(
    "facilityList"
  );
  cy.intercept("/cloud-service/orders-pilot/api/user-security/permissions*").as(
    "permissions"
  );
  cy.intercept(
    "/cloud-service/orders-pilot/api/custom-medication-library/facilities*"
  ).as("libFacilities");
  cy.intercept(
    "/cloud-service/orders-pilot/api/medication/patientSafetyAlerts*"
  ).as("alerts");
  cy.intercept("/cloud-service/orders-pilot/api/stock-medication-library").as(
    "stockMedLib"
  );
  cy.intercept(
    "/cloud-service/orders-pilot/api/administration-schedule-list"
  ).as("adminSchedList");

  cy.visit("/");
});

Then("accesibility testing is performed", () => {
  cy.injectAxe();

  // Configure aXe and test the page at initial load
  cy.configureAxe({
    branding: {
      brand: "Order MFE UI",
      application: "Order MFE",
    },
    reporter: "v1",
    iframes: true,
  });
  //cy.customCheckAlly();
});

When("the user clicks on {string} button", (buttonText: string) => {
  cy.get("button").contains(buttonText).click({ force: true });
});

When(
  "the user clicks on {string} link opens Medication Reconciliation Page",
  (editLink: string) => {
    cy.get("a").contains("Edit").click();
    cy.url().should("include", "medicationReconciliation/medRec/");
  }
);

When(
  "the user selects the {string} tab to sees the Discharge Order Page",
  (dischargeOrderTab: string) => {
    cy.get("#tab-2_li").contains(dischargeOrderTab).click();
    cy.url().should("include", "OrdersDischargeList.do");
  }
);

Given("the user should launch {string}", (url: string) => {
  cy.visit(url);
});

Given("the user clicks on the {string} navigation menu", (navmenu: string) => {
  cy.wait(2000);
  cy.get(".nav-link").contains(navmenu).should("be.visible").click();
});

Then("user click on {string} button", (button: string) => {
  cy.wait(2000);
  FrequencyAndAdminPage.addScheduleButton
    .contains(button)
    .should("be.visible")
    .click();
});

When(
  "the user can view a grid with the {string} columns",
  (size: string, dataTable: DataTable) => {
    cy.get(".table-responsive>.table>thead>tr>th").should("have.length", size),
      dataTable.hashes().forEach((row) => {
        cy.get(".table-responsive>.table>thead>tr>th").contains(
          row.column_header
        );
      });
  }
);

When("the {string} button is enabled", (btnText: string) => {
  cy.get("button").contains(btnText).wait(5000).should("not.be.disabled");
});

When("user verifies the {string} title is displayed", (title: string) => {
  cy.contains(title).should("be.visible");
});

Then("user verifies {string} header is displayed", (header: string) => {
  cy.get("th").contains(header).should("be.visible");
});

When("Search text field should be displayed", () => {
  CommonComponentPage.searchTextField.should("be.visible");
});

When(
  "placeholder {string} should be present in the search text field",
  (placeholder: any) => {
    CommonComponentPage.searchTextField
      .invoke("attr", "placeholder")
      .should("equal", placeholder);
  }
);

When("user types {string} in the search text field", (searchText: any) => {
  CommonComponentPage.searchTextField.clear();
  let i: number;
  let text = searchText.split("");
  for (i = 0; i < text.length; i++) {
    CommonComponentPage.searchTextField.type(text[i]);
    cy.wait(200);
  }
});

When("search icon should be visible in the search text field", () => {
  CommonComponentPage.displayMagnifyingGlass
    .invoke("attr", "class")
    .should("equal", "fa-regular fa-magnifying-glass");
});

Then("click on Search icon", () => {
  CommonComponentPage.searchIcon.click();
  cy.wait(3000);
});

When("the search text field should be blank", () => {
  CommonComponentPage.searchTextField.invoke("val").should("be.empty");
  cy.wait(4000);
});

When("the user clicks on {string} tab", (tabName: string) => {
  cy.get('[id^="tab"][class="nav-link"]')
    .contains(tabName)
    .click({ force: true });
});

When("the user clicks on {string} link", (linkText: string) => {
  cy.get("a").contains(linkText).click({ force: true });
});

Then("the user can see {string} button", (buttonName: string) => {
  cy.get("button").contains(buttonName).should("exist");
});

Then("the user clicks the {string} checkbox", (checkboxName: string) => {
  cy.contains("label", checkboxName)
    .siblings("input[type=checkbox]")
    .click({ force: true });
});

Then("User selects {string} from the list", (text: string) => {
  StockMedicationsPage.listPage.contains(text).click();
});

Then("the {string} checkbox is checked", (checkboxName: string) => {
  cy.contains("label", checkboxName)
    // this will get checkbox input
    .siblings("input[type=checkbox]")
    .should("be.checked");
});

Then("the {string} checkbox is unchecked", (checkboxName: string) => {
  cy.contains("label", checkboxName)
    // this will get checkbox input
    .siblings("input[type=checkbox]")
    .should("not.be.checked");
});
