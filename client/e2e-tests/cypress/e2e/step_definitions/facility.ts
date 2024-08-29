import {
  Given,
  When,
  Then,
  DataTable,
} from "@badeball/cypress-cucumber-preprocessor";
import facilitySetupPage from "../../pages/FacilitySetupPage";

let id: number = 0;

When(
  "the user clicks {string} tab in the Order Platform Configuration screen",
  (tabName: string) => {
    cy.get('[id*="Tab"][class="nav-link"]')
      .contains(tabName)
      .click({ force: true });
  }
);

Then(
  "the user sees the Order Platform Configuration screen highlighting the Facilty Setup tab",
  () => {
    cy.contains("h1", "Order Platform Configuration");
    cy.contains("h2", "Facility Setup");
    cy.get("#horizontalTab1")
      .contains("Facility Setup")
      .invoke("attr", "aria-selected")
      .should("equal", "true");
    cy.get("#horizontalTab2")
      .contains("Order Platform Setup")
      .invoke("attr", "aria-selected")
      .should("equal", "false");
  }
);

When(
  "the user selects the facility {string} from facility list",
  (facilityName: string) => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // expect(err.message).to.include('Axios')
      //done()
      return false;
    });
    cy.get("#tab1content")
      .find(".table-striped")
      .find(`[data-testid=` + facilityName + `]`)
      .should("be.visible")
      .click();
  }
);

When("the user selects the unit for the facility", () => {
  cy.get("a").contains("Check all").should("be.visible").click();
  cy.get("#saveWard").click();
});

Then("the user sees the option for selecting the formulary", () => {
  facilitySetupPage.ddlFormularyLibrary.should("be.visible");
  facilitySetupPage.ddlFormularyLibrary.should("contain.value", "");
});

When("the user selects a value in the formulary dropdown", () => {
  cy.get(".FormularyLibrary").click();
  cy.get("#react-select-3-option-4").click();
  cy.get(".css-1dimb5e-singleValue")
    .invoke("text")
    .then((text) => {
      cy.wrap(text).as("selectedFormulary");
    });
});

Then("the user sees the selected formulary", () => {
  cy.get("@selectedFormulary").then((selectedFormulary) => {
    cy.get(".css-1dimb5e-singleValue")
      .invoke("text")
      .should("eq", selectedFormulary);
  });
});

Then("the user sees the previous selected formulary and custom library", () => {
  facilitySetupPage.ddlCustomMedicationLibrary.should("be.visible");
  facilitySetupPage.ddlFormularyLibrary.should("be.visible");
});

Then(
  "the user sees the option for selecting the custom medication library",
  () => {
    facilitySetupPage.ddlCustomMedicationLibrary.should("be.visible");
    facilitySetupPage.ddlCustomMedicationLibrary.should("contain.value", "");
  }
);

When(
  "the user selects a value in the custom medication library dropdown",
  () => {
    cy.get(".css-1dimb5e-singleValue")
      .invoke("text")
      .then((text) => {
        cy.wrap(text).as("selectedMedicationLibrary");
      });
    cy.get(".CustomMedicationLibrary").click();
    cy.get("@selectedMedicationLibrary").then((selectedMedicationLibrary) => {
      const featuresSelector = '[id^="react-select-2-option-"]';
      cy.get(featuresSelector).each((element, index, collection) => {
        // or event loop through the entire collection
      });
      cy.get(featuresSelector)
        .should("not.have.text", selectedMedicationLibrary)
        .last()
        .click();
    });
  }
);

Then("the user sees the selected custom medication library", () => {
  cy.get("@selectedMedicationLibrary").then((selectedMedicationLibrary) => {
    cy.get(".css-1dimb5e-singleValue")
      .invoke("text")
      .should("eq", selectedMedicationLibrary);
  });
});

When("the user observes that Save button disabled as no changes made", () => {
  cy.get('[data-testid="saveBtn"]').should("be.disabled");
});

When("the user clicks the Save button", () => {
  cy.get('[data-testid="saveBtn"]').click();
});

When("the user clicks the Cancel button to cancel", () => {
  cy.get('[data-testid="cancelBtn"]').click();
});

Then("the user navigates back to facility setup page", () => {
  cy.url().should("include", "facility-setup");
});

Then(
  "the list of facilities displayed is present in the list of facilities in the api response",
  () => {
    interface Facility {
      facilityName: string;
    }

    let facilityList: Facility[] = [];
    cy.wait("@facilityList").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      facilityList = response?.body;
      facilityList.sort((a, b) => a.facilityName.localeCompare(b.facilityName));
    });
    cy.get("#tab1content")
      .find(".table-striped")
      .find('[data-testid="libraryName"]')
      .each(($e1, index) => {
        //iterating through array of elements
        const StoreText = $e1.text(); //storing iterated element
        expect(StoreText).to.equal(facilityList[index]?.facilityName);
      });
  }
);

Then(
  "facility results should be displayed according to the search criteria for {string}",
  (searchText: string) => {
    //cy.get(".table").find("tbody").find("tr");
    cy.get("#tab1content")
      .find(".table-striped")
      .find('[data-testid="libraryName"]')
      .each(($e1, index) => {
        //iterating through array of elements
        const StoreText = $e1.text()?.toLowerCase(); //storing iterated element
        expect(StoreText).to.contains(searchText?.toLowerCase());
      });
  }
);

Then("the user makes a note of the current medication library", () => {
  cy.get(".css-1dimb5e-singleValue")
    .first()
    .invoke("text")
    .then((text) => {
      cy.wrap(text).as("selectedMedicationLibrary");
    });
});

Then("the user selects {string} in the View DDL", (option: string) => {
  facilitySetupPage.ddlView
    .click()
    .get(".dropdown-item")
    .contains(option)
    .click({ force: true });
});

Then("the user navigates to the Medication Library as noted earlier", () => {
  cy.get("@selectedMedicationLibrary").then((selectedMedicationLibrary) => {
    cy.get("h1").invoke("text").should("eq", selectedMedicationLibrary);
  });
});

Then(
  "the user makes a note of the current medication library to be empty",
  () => {
    cy.get(".css-1dimb5e-singleValue")
      .first()
      .invoke("text")
      .then((text) => {
        cy.wrap(text).as("selectedMedicationLibrary");
      });
    cy.get("@selectedMedicationLibrary").then((selectedMedicationLibrary) => {
      expect(selectedMedicationLibrary).to.equal("");
    });
  }
);

Then("the user can view only {string} in the View DDL", (option: string) => {
  facilitySetupPage.ddlView
    .click({ force: true })
    .get(".dropdown-item")
    .contains(option)
    .should("exist");

  if (option == "Custom Medication Library List") {
    facilitySetupPage.ddlView
      .click()
      .get(".dropdown-item")
      .contains("Current Selected Library")
      .should("not.exist");
  }
});

Given("the following security tokens are validated", (dataTable: DataTable) => {
  dataTable.hashes().forEach((row) => {
    cy.wait("@permissions").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);

      cy.log(response?.body);

      expect(response?.body.customMedicationDelete).equal(
        row.customMedicationDelete === "true"
      );

      expect(response?.body.customMedicationLibraryEdit).equal(
        row.customMedicationLibraryEdit === "true"
      );

      expect(response?.body.customMedicationLibraryInactivate).equal(
        row.customMedicationLibraryInactivate === "true"
      );

      expect(response?.body.facilitySetupEdit).equal(
        row.facilitySetupEdit === "true"
      );
    });
  });
});

Given(
  "the following stock medication security tokens are validated",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row) => {
      cy.wait("@permissions").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);

        cy.log(response?.body);

        expect(response?.body.facilitySetupEdit).equal(
          row.facilitySetupEdit === "true"
        );
        expect(response?.body.stockMedicationListEdit).equal(
          row.stockMedicationListEdit === "true"
        );

        expect(response?.body.stockMedicationListCopy).equal(
          row.stockMedicationListCopy === "true"
        );

        expect(response?.body.stockMedicationListInactivate).equal(
          row.stockMedicationListInactivate === "true"
        );
      });
    });
  }
);

Given(
  "the following frequency administration schedule list security tokens are validated",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row) => {
      cy.wait("@permissions").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);

        cy.log(response?.body);

        expect(response?.body.facilitySetupEdit).equal(
          row.facilitySetupEdit === "true"
        );
        expect(response?.body.frequencyAdministrationScheduleListEdit).equal(
          row.frequencyAdministrationScheduleListEdit === "true"
        );

        expect(response?.body.frequencyAdministrationScheduleListCopy).equal(
          row.frequencyAdministrationScheduleListCopy === "true"
        );

        expect(
          response?.body.frequencyAdministrationScheduleListInactivate
        ).equal(row.frequencyAdministrationScheduleListInactivate === "true");
      });
    });
  }
);

Then(
  "the user cannot see the View button beside the Custom Medication Library DDL",
  () => {
    cy.get("button").contains("View").should("not.exist");
  }
);

Then(
  "the user cannot see the View button beside the Stock Medication List",
  () => {
    cy.get("button").contains("View").should("not.exist");
  }
);

Then(
  "the user will not see the create Button for the Stock Medication List",
  () => {
    cy.get("button").contains("Create New List").should("not.exist");
  }
);

Then(
  /^the user cannot see the View button beside the Frequency Administration Schedule List$/,
  () => {
    cy.get(".form-group")
      .eq(1)
      .parent()
      .parent()
      .get("#dropdownMenuButton")
      .should("not.exist");
  }
);

Then(
  /^the user will not see the create Button for the Frequency Administration Schedule List$/,
  () => {
    cy.get(".form-group")
      .eq(1)
      .parent()
      .parent()
      .get("button")
      .contains("Create New List")
      .should("not.exist");
  }
);

Then(
  "the user can change the custom medication library selection from the dropdown",
  () => {
    cy.get("#react-select-2-option-1").clear();

    cy.get("#react-select-2-option-1").click();
    cy.get(".css-1dimb5e-singleValue")
      .invoke("text")
      .then((text) => {
        cy.wrap(text).as("selectedMedicationLibrary");
      });
  }
);

When(
  "the user searches and selects {string} in the custom medication library dropdown",
  (libName: string) => {
    cy.get(".CustomMedicationLibrary").type(libName);
    cy.get("input").realPress("Tab");
  }
);

Then(
  "the following tabs are present in the Order Platform Setup Screen",
  (tabs: DataTable) => {
    tabs.hashes().forEach((row, index) => {
      cy.get(".tabs-left")
        .find('[id^="verticalTab"]')
        .eq(index)
        .then(($element) => {
          const header = $element.text().trim();
          expect(header).equal(row.tabName);
        });
    });
  }
);

Then(
  "{string} tab is selected in the Order Platform Setup Configuration",
  (tabName: string) => {
    cy.get("[id*=Tab]")
      .contains(tabName)
      .invoke("attr", "aria-selected")
      .should("equal", "true");
  }
);

Then(/^the user sees No Data Found in the table$/, () => {
  cy.get('[data-testid="NoDataFound"]').should("have.text", "No Data Found");
});

Then(/^there is no option to be selected$/, () => {
  cy.contains("No options");
});

Then(
  "the screen shows the facility configuration for the facility {string}",
  (facilityName: string) => {
    cy.get("h2").contains(facilityName);
  }
);

When(
  "the user clicks on Create New List button for {string}",
  (labelName: string) => {
    if (labelName == "Stock Medication/Supply List") {
      cy.get('[data-testid="btnAddNewList"]').click();
      cy.wait("@stockMedLib").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
        id = response?.body.id;
      });
    } else if (labelName == "Administration Schedule List") {
      cy.get(
        "#tab1content > div > div:nth-child(5) > div > div > div > button"
      ).click();
      cy.wait("@adminSchedList").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
        id = response?.body.id;
      });
    }
  }
);

Then(
  "the user will see the {string} list {string} is created|existed",
  (type: string, listName: string) => {
    if (type == "stock medication") {
      cy.get(".custom-single-select").last().contains(listName);
    } else if (type == "admin schedule") {
      cy.get(".custom-single-select").first().contains(listName);
    }
  }
);

When("the user clicks the {string} left tab", (tabName: string) => {
  cy.get('[id^="verticalTab"]').contains(tabName).click();
});

Then(
  "the user clicks on the {string} option on the View button beside {string}",
  (type: string, option: string) => {
    switch (option) {
      case "Administration Schedule List":
        cy.get(".form-group")
          .eq(1)
          .parent()
          .parent()
          .find("#dropdownMenuButton")
          .click()
          .get(".dropdown-item")
          .contains(type)
          .click({ force: true });
        break;
      case "Custom Medication Library":
        cy.get(".form-group")
          .eq(2)
          .parent()
          .parent()
          .find("#dropdownMenuButton")
          .click()
          .get(".dropdown-item")
          .contains(type)
          .click({ force: true });
        break;
      case "Stock Medication/Supply List":
        cy.get(".form-group")
          .eq(3)
          .parent()
          .parent()
          .find("#dropdownMenuButton")
          .click()
          .get(".dropdown-item")
          .contains(type)
          .click({ force: true });
        break;
    }
  }
);

Then("the user will see the Import or Export button to copy data", () => {
  cy.get(`[data-testid="btnImportSMSupply"]`).should("be.enabled");
  cy.get("#btnExportStockMedications").should("be.enabled");
});

Then("the user will see the Import or Export button to copy schedule on the Administration Schedule Page", () => {
  cy.get(`[data-testid="btnImportSchedules"]`).should("be.enabled");
  cy.get("#btnExportSchedules").should("be.enabled");
});

Then(
  "the user cannot see the Import or Export button on the stock medication page",
  () => {
    cy.get(`[data-testid="btnImportSchedules"]`).should("not.exist");
    cy.get("#btnExportSchedules").should("not.exist");
  }
);

Then(
  "the user cannot see the Import or Export button on the administration schedule list page",
  () => {
    cy.get(`[data-testid="btnImportSchedules"]`).should("not.exist");
    cy.get("#btnExportStockMedications").should("not.exist");
  }
);

Then(
  "the user selects a stock medication to verify delete button get activated",
  () => {
    cy.get(`[data-testid="masterSelect"]`).click();
    cy.get(`[data-testid="btnDeleteStockMedications"]`).should("be.enabled");
  }
);

Then(
  "the user selects a schedule to verify delete button get activated",
  () => {
    cy.get(`[data-testid="masterSelect"]`).click();
    cy.get(`[data-testid="btnDeleteSchedule"]`).should("be.enabled");
  }
);

Then(
  "user types {string} in the search text field in Order Platfrom Setup",
  (value: string) => {
    cy.get("#txtCustomSearch").clear().type(value);
  }
);

Then(
  "search results shows {string} in Order Platfrom Setup tab",
  (searchText: string) => {
    cy.get("#tab2content")
      .find(".table-striped")
      .find('[data-testid="libraryName"]')
      .each(($e1) => {
        //iterating through array of elements
        const StoreText = $e1.text(); //storing iterated element
        expect(StoreText).to.eql(searchText);
      });
  }
);

When(
  "the user clicks on the {string} in Order Platfrom Setup tab",
  (stringToClick: string) => {
    cy.get("#tab2content")
      .find(".table-striped")
      .find('[data-testid="libraryName"]')
      .contains(stringToClick)
      .should("be.visible")
      .click();
  }
);

Then(
  "the user navigates to {string} showing the stock medications in the list",
  (name: string) => {
    cy.get("h3").last().should("have.text", name);

    cy.get(".table-responsive>.table>thead>tr>th").contains(
      "Medication/Supply"
    );
  }
);

Then("the stock medication list test data created is deleted", () => {
  let endpoint: string =
    "/cloud-service/orders-pilot/api/stock-medication-library/{stockMedicationLibraryIds}?stockMedicationIds=" +
    id;
  cy.request("DELETE", endpoint).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Then(
  "the user cannot see the Delete button on the stock medication page",
  () => {
    cy.get(`[data-testid="btnDeleteStockMedications"]`).should("not.exist");
  }
);


Then(/^the user cannot see the Delete button on the Administration Schedule List page$/, (  ) =>{
  cy.get(`[data-testid="btnDeleteSchedule"]`).should("not.exist");
  } );
  

Then(
  "the user navigates to {string} showing the admin schedules in the list",
  (name: string) => {
    cy.get("h1").should("have.text", name);
  }
);

Then("the admin schedule list test data created is deleted", () => {
  let endpoint: string =
    "/cloud-service/orders-pilot/api/administration-schedule-list/{administartionScheduleListIds}?administartionScheduleIds=" +
    id;
  cy.request("DELETE", endpoint).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Then(
  "the user clicks on View button button beside {string}",
  (option: string) => {
    switch (option) {
      case "Administration Schedule List":
        cy.get(".form-group")
          .eq(1)
          .parent()
          .parent()
          .find("#dropdownMenuButton")
          .click();
        break;
      case "Custom Medication Library":
        cy.get(".form-group")
          .eq(2)
          .parent()
          .parent()
          .find("#dropdownMenuButton")
          .click();
        break;
      case "Stock Medication/Supply List":
        cy.get(".form-group")
          .eq(3)
          .parent()
          .parent()
          .find("#dropdownMenuButton")
          .click();
        break;
    }
  }
);

Then("the Enable Enhanced Order Search checkbox is enabled", () => {
  facilitySetupPage.chkEnabledMedSearch.should("be.enabled");
});

Then("the Enable Enhanced Order Search checkbox is disabled", () => {
  facilitySetupPage.chkEnabledMedSearch.should("not.be.enabled");
});

Then("check the Enable Enhanced Order Search option", () => {
  cy.get("#enhancedOrderSearchCheckbox").then((el) => {
    var flag: boolean;
    flag = el.prop("checked");
    if (flag == false) {
      facilitySetupPage.chkEnabledMedSearch.check();
    }
  });
});

When("the user clears the Custom Medication Library selection", () => {
  cy.get(".CustomMedicationLibrary").type(" ");
});
