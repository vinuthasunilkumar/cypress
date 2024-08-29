import { When, Then, DataTable } from "@badeball/cypress-cucumber-preprocessor";

import CustomMedication from "../../pages/CustomMedicationPage";
import CustomMedicationSummary from "../../pages/CustMedSummaryPage";
import {
  deleteCustomMedication,
  saveCustomMedication,
} from "../../api/customMedicationAPIS";
import CommonComponentPage from "../../pages/CommonComponentPage";

const envPAGE = require("../../env.config.json");
let custMedName: any;

When(
  "user creates a new custom medication with {string}, {string}, {string}, {string}, {string}, {string}, {string}",
  (
    custMedName: string,
    controllSubstanceValue: string,
    scheduleValue: string,
    ingredientValue: number,
    medGroupValue: number,
    status: string,
    saveBtn: string
  ) => {
    let rad = Math.floor(Math.random() * 10000) + 1;
    let actCustMedName = custMedName + rad;

    CustomMedication.txtCustomMedication.clear().type(actCustMedName);

    CustomMedication.selectControlledSubstance(controllSubstanceValue);
    if (controllSubstanceValue == "Yes") {
      CustomMedication.selectSchedule(scheduleValue);
    }

    CustomMedication.drpdownIngredients.click().type("ba");
    for (let i = 0; i < ingredientValue; i++) {
      cy.get('[id$="option-' + i + '"]').click();
    }

    cy.get("h1").click();
    CustomMedication.drpdownMedicationGroup.click();
    cy.wait(2000);
    for (let i = 0; i < medGroupValue; i++) {
      cy.get('[id$="option-' + i + '"]').click();
    }

    CustomMedication.toggleText.invoke("text").then((text) => {
      if (text == status) {
        CustomMedication.heading.click();
      } else {
        CustomMedication.toggleStatus.click({ force: true });
        CustomMedication.toggleText.should("have.text", status);
      }

      CustomMedication.heading.click();
      CustomMedicationSummary.btn.contains(saveBtn).click();
      cy.wait(500);
      cy.url().should("include", "custom-medications");
    });
  }
);

When(
  "user creates {string} {string} custom medicines with name starting with {string} through API",
  (custMedNumber: number, status: any, textCustMedName: any) => {
    for (let i = 0; i < custMedNumber; i++) {
      let rad = Math.floor(Math.random() * 10000) + 1;
      let timestamp = new Date().getTime();
      let custMedName = textCustMedName + rad + timestamp;
      cy.window().then((win) => {
        const libraryId = win.localStorage.getItem("libraryId");
        let setStatus: any;
        if (status == "Active") {
          setStatus = true;
        } else {
          setStatus = false;
        }
        saveCustomMedication(
          custMedName,
          "custom-medications",
          libraryId,
          setStatus
        ).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body?.responseMessage).to.eq(
            "Custom medication saved successfully."
          );
        });
      });
    }
    // cy.window().then((win) => {
    //     win.localStorage.removeItem('libraryId');
    //   });
  }
);

When(
  "user deletes custom medicines with name starting with {string}",
  (custMedName: string) => {
    let allcustMedId: any = [];
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `
        SELECT "CustomMedicationId"	FROM public."CustomMedication" where "Description" like '` +
        custMedName +
        `%';
        `,
    })
      .then((result: any) => {
        let totalRows = result.rows.length;
        for (let i = 0; i < totalRows; i++) {
          allcustMedId.push(result.rows[i].CustomMedicationId);
        }
      })
      .then(() => {
        for (const element of allcustMedId) {
          deleteCustomMedication("custom-medications/", element).then(
            (response) => {
              expect(response.status).to.eq(200);
              expect(response.body?.responseMessage).to.eq(
                "Custom medication deleted successfully."
              );
            }
          );
        }
      });
  }
);

Then("Pagination should {string} visible", (visibility: string) => {
  if (visibility == "be") {
    CustomMedicationSummary.pagination.should("be.visible");
  } else {
    CustomMedicationSummary.pagination.should("not.exist");
  }
});

When(
  "results should be displayed on {string}st page according to the search criteria {string}",
  (pageNumber: number, searchText: string) => {
    CustomMedicationSummary.verfiyCustMedValues(pageNumber, searchText);
  }
);

When("the sort order of cust med names should be {string}", (Value: string) => {
  CommonComponentPage.verifySortOrder(Value,"td:nth-child(2)>a:nth-child(1)")
});

When(
  "in all the pages results should be displayed according to search results {string}- Verify Pagination and results",
  (searchText: string) => {
    // Get total number of pages
    let totalPages: any;
    let totalEntries: any;
    CustomMedicationSummary.totalEntriesTextInPagination.then((e) => {
      let myText = e.text();
      totalEntries = myText.substring(
        myText.indexOf("of") + 3,
        myText.indexOf("ent") - 1
      );
      totalPages = Math.ceil(parseInt(totalEntries) / 20);
      for (let i = 1; i <= totalPages; i++) {
        CustomMedicationSummary.verfiyCustMedValues(i, searchText);
        cy.wait(2000);
        if (i < totalPages) {
          CustomMedicationSummary.nextPageArrowBtn.click();
        }
      }
    });
  }
);

When("{string} validation appears", (validationText: string) => {
  CustomMedicationSummary.noResultsFound.should("have.text", validationText);
});

Then("user waits", () => {
  cy.wait(4000);
});

Then(
  "the {string} navigation arrow should be {string}",
  (navigationArrow: string, value: string) => {
    if (navigationArrow == "previuos" && value == "disabled") {
      CustomMedicationSummary.secondPageArrowBtn.should(
        "have.class",
        "disabled"
      );
    }
    if (navigationArrow == "first" && value == "disabled") {
      CustomMedicationSummary.firstPageArrowBtn.should(
        "have.class",
        "disabled"
      );
    }
    if (navigationArrow == "previuos" && value == "enabled") {
      CustomMedicationSummary.secondPageArrowBtn.should(
        "not.have.class",
        "disabled"
      );
    }
    if (navigationArrow == "first" && value == "enabled") {
      CustomMedicationSummary.firstPageArrowBtn.should(
        "not.have.class",
        "disabled"
      );
    }
    if (navigationArrow == "next" && value == "disabled") {
      CustomMedicationSummary.nextPageArrowBtn
        .parent(".page-item")
        .should("have.class", "disabled");
    }
    if (navigationArrow == "last" && value == "disabled") {
      CustomMedicationSummary.lastPageArrowBtn
        .parent(".page-item")
        .should("have.class", "disabled");
    }
    if (navigationArrow == "next" && value == "enabled") {
      CustomMedicationSummary.nextPageArrowBtn
        .parent(".page-item")
        .should("not.have.class", "disabled");
    }
    if (navigationArrow == "last" && value == "enabled") {
      CustomMedicationSummary.lastPageArrowBtn
        .parent(".page-item")
        .should("not.have.class", "disabled");
    }
  }
);

Then("the user navigates to last page", () => {
  CustomMedicationSummary.lastPageArrowBtn.click();
});

Then("user navigates to page number {string}", (pageNumber: number) => {
  CustomMedicationSummary.pageThreeInPagination.click();
});

Then(
  "the user clicks on the arrow button next to Custom medication column",
  () => {
    cy.get(".fa-arrow-down-wide-short").click();
  }
);

Then("User clicks on the next page button", () => {
  CustomMedicationSummary.nextPageArrowBtn.click();
});

When(
  "the user can view a table id with the {string} columns",
  (size: string, dataTable: DataTable) => {
    let n = 0;
    cy.get(".table>thead>tr>th").should("have.length", size);
    dataTable.hashes().forEach((row) => {
      n++;
      cy.get("th:nth-child(" + n + ")").then(($element) => {
        const header = $element.text().trim();
        expect(header).equal(row.column_header);
      });
    });
  }
);

Then("user is able to see 20 records in Summary page", () => {
  cy.wait(3000);
  cy.get("table")
    .find("tr")
    .its("length")
    .then((rowCount) => {
      cy.log("Number of rows in the table: " + rowCount);
      expect(rowCount - 1).to.be.eq(20);
    });
});

When(
  "the user enters alphanumeric character of length {string} in Custom Medication",
  (textLength: any) => {
    let text = "";
    let possible =
      "Automation" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-()";
    for (let i = 0; i < textLength; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    let text1 = "Automation" + text;
    custMedName = text1;
    cy.wrap(text).as(custMedName);
    cy.get(".col-form-label").next("input").clear();
    cy.get(".col-form-label").next("input").type(text1);
  }
);

Then("click on Search field and enter the Custom Medication created", () => {
  cy.wait(3000);
  CommonComponentPage.searchTextField.type(custMedName);
});

Then("verify the searched Custom Medication is displayed", () => {
  cy.get('.custom-medication-name').then(($value) => {
    const getText = $value.text();
    console.log(getText);
    expect(getText).to.equal(custMedName);
  });
});

Then(
  "verify {string} is displayed under Controlled Substance column",
  (Value: string) => {
    cy.wait(3000);
    CustomMedicationSummary.controlledSubColumn.then(($value) => {
      const getText = $value.text();
      console.log(getText);
      expect(getText).to.equal(Value);
    });
  }
);

Then("click on Active toggle Button", () => {
  cy.get('[id^="status"]').first().click({force: true});
});

Then("click on last Active toggle Button", () => {
  CustomMedicationSummary.status.last().click();
});

Then("verify {string} in validation message", (verifymsg: string) => {
  cy.contains(verifymsg).should("be.visible");
});

Then("verify the status is still {string}", (status: string) => {
  CustomMedicationSummary.status.should("have.text", status);
});

When("click on close icon on validation message", () => {
  CustomMedicationSummary.statusCloseIcon.click();
});

Then("click on Inactive toggle Button", () => {
  CustomMedicationSummary.status.click({ force: true });
});

Then(
  "user enters {string} in Med-Group and select the Med-Group {string}",
  (MedGroup: string) => {
    CustomMedication.drpdownMedicationGroup.type(MedGroup);
    CustomMedication.chkboxfirstMedGroup.first().click({ force: true });
    CustomMedication.drpdownMedicationGroup.clear();
  }
);

Then(
  "verify {string} is displayed under MedGroup Column",
  (MedGroup: string) => {
    CustomMedicationSummary.medGroupColumnValue1.should("have.text", MedGroup);
  }
);

Then("user click on Custom Medication Name on summary page", () => {
  CustomMedicationSummary.CustomMedicationName.first().click();
});

Then("Verify user able to navigate set-up page", () => {
  CustomMedicationSummary.SetUppage.should("be.visible");
});

When("user creates a brand new custom medication", (dataTable: DataTable) => {
  dataTable.hashes().forEach((row: any) => {
    let rad = Math.floor(Math.random() * 10000) + 1;
    let custMedName = row.custMedName + rad;

    CustomMedication.txtCustomMedication.clear().type(custMedName);

    CustomMedication.selectControlledSubstance(row.controllSubstanceValue);
    if (row.controllSubstanceValue == "Yes") {
      CustomMedication.selectSchedule(row.scheduleValue);
    }

    CustomMedication.drpdownIngredients.type(row.ingredientValue);
    cy.wait(3000);
    CustomMedication.chkboxfirstIngredients.first().click({ force: true });
    CustomMedication.heading.click();

    CustomMedication.drpdownMedicationGroup.type(row.medGroupValue);
    CustomMedication.chkboxfirstMedGroup.first().click({ force: true });
    CustomMedication.drpdownMedicationGroup.clear();
    CustomMedication.heading.click();

    CustomMedication.toggleText.invoke("text").then((text) => {
      if (text == row.status) {
        CustomMedication.heading.click();
      } else {
        CustomMedication.toggleStatus.click({ force: true });
        CustomMedication.toggleText.should("have.text", row.status);
      }
    });

    CustomMedication.heading.click();
    CustomMedicationSummary.btn.contains(row.saveBtn).click();

    cy.wait(2000);
    cy.get("button").contains("Create New").click();
  });
});

When(
  "user creates a new Custom Medication and Save",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      let rad = Math.floor(Math.random() * 10000) + 1;
      let custMedName = row.custMedName + rad;

      CustomMedication.txtCustomMedication.clear().type(custMedName);

      CustomMedication.selectControlledSubstance(row.controllSubstanceValue);
      if (row.controllSubstanceValue == "Yes") {
        CustomMedication.selectSchedule(row.scheduleValue);
      }

      CustomMedication.drpdownIngredients.type(row.ingredientValue);
      cy.wait(3000);
      CustomMedication.chkboxfirstIngredients.first().click({ force: true });
      CustomMedication.heading.click();

      CustomMedication.drpdownMedicationGroup.type(row.medGroupValue);
      CustomMedication.chkboxfirstMedGroup.first().click({ force: true });
      CustomMedication.drpdownMedicationGroup.clear();
      CustomMedication.heading.click();

      CustomMedication.toggleText.invoke("text").then((text) => {
        if (text == row.status) {
          CustomMedication.heading.click();
        } else {
          CustomMedication.toggleStatus.click({ force: true });
          CustomMedication.toggleText.should("have.text", row.status);
        }
      });

      CustomMedication.heading.click();
      CustomMedicationSummary.btn.contains(row.saveBtn).click();
      cy.wait(2000);
    });
  }
);

When("user clears all the values", () => {
  cy.wait(5000);
  CustomMedication.txtCustomMedication.focus().clear();

  CustomMedication.rdbtnControlledSubstanceNo.check().should("be.checked");
  CustomMedication.iconRemove.first().click();
  CustomMedication.iconRemove.last().click();
});

When("user edits all the fields", (dataTable: DataTable) => {
  dataTable.hashes().forEach((row: any) => {
    let rad = Math.floor(Math.random() * 10000) + 1;
    let custMedName = row.custMedName + rad;

    cy.wait(3000);
    CustomMedication.txtCustomMedication.focus().clear();
    CustomMedication.txtCustomMedication.type(custMedName);

    CustomMedication.selectControlledSubstance(row.controllSubstanceValue);
    if (row.controllSubstanceValue == "Yes") {
      CustomMedication.selectSchedule(row.scheduleValue);
    }

    CustomMedication.crossIcon.should("be.visible").then((closeEle) => {
      if (closeEle.length > 0) {
        CustomMedication.iconRemove.first().click();
        CustomMedication.iconRemove.last().click();
      } else {
        CustomMedication.heading.click();
      }
    });

    CustomMedication.drpdownIngredients.type(row.ingredientValue);
    CustomMedication.chkboxfirstIngredientsDuringEdit
      .first()
      .click({ force: true });
    CustomMedication.heading.click();

    CustomMedication.drpdownMedicationGroup.type(row.medGroupValue);
    CustomMedication.chkboxfirstMedGroup.first().click({ force: true });
    CustomMedication.heading.click();

    CustomMedication.toggleText.invoke("text").then((text) => {
      if (text == row.status) {
        CustomMedication.heading.click();
      } else {
        CustomMedication.toggleStatus.click({ force: true });
        CustomMedication.toggleText.should("have.text", row.status);
      }
    });
  });
});

When(
  "the new changes should be reflected on the UI",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row1: any) => {
      cy.wait(2000);
      CustomMedicationSummary.getFirstRowInTable.each((row, rowIndex) => {
        const status = row.find("td>div>label").text();
        const name = row.find("td>a").text();
        const scheduleValue = row.find("td:nth-child(3)>span").text();
        const medGroupValue = row.find("td:nth-child(4)>span>span").text();
        expect(status).to.eq(row1.status);
        expect(name).to.contain(row1.custMedName);
        expect(scheduleValue).to.eq(row1.controllSubstanceValue);
        expect(medGroupValue).to.eq(row1.medGroupValue);
      });
    });
  }
);

When(
  "user enters name as {string} and sees validation message as {string}",
  (name: string, message: string) => {
    cy.wait(3000);
    CustomMedication.txtCustomMedication.focus().clear();

    if (
      name == "Acifreezol - Antiacid" ||
      name == "12 Hour Nasal Spray 0.05 %"
    ) {
      CustomMedication.txtCustomMedication.clear().type(name);
      CustomMedication.rdbtnControlledSubstanceNo.check().should("be.checked");
      CustomMedicationSummary.btn.contains("Save").click();
      CustomMedication.oneErrorfound.should("have.text", message);
    } else if (name == "Ω") {
      CustomMedication.txtCustomMedication.clear().type(name);
      CustomMedication.validationForControlledSubstance.then(($value) => {
        const getText = $value.text();
        console.log(getText);
        let text =
          'Error: Only following characters are allowed -\n1. Alpha-Numeric a - z, A - Z, 0 - 9\n2. Special Characters ! @ # $ % ^ & * ( ) _ - + = { } [ ] | \\ : " ; ' +
          "'" +
          " < > , . ? /";
        CustomMedication.validationForControlledSubstance.should(
          "have.text",
          getText
        );
        expect(getText).to.contain(text);
      });
    } else if (name === "Typing 30 characters to verify") {
      CustomMedication.txtCustomMedication.clear().type(name);
      CustomMedication.cutomMedicationfloatmessageforcharacters.should(
        "have.text",
        message
      );
    }
  }
);

Then("user verifies the text messages on the popup", (dataTable: DataTable) => {
  dataTable.hashes().forEach((row: any) => {
    cy.contains(row.Heading).should("be.visible");
    CustomMedicationSummary.firstLineOnPopup.should("have.text", row.firstLine);
    CustomMedicationSummary.lastLineOnPopup.should("have.text", row.lastLine);
    CustomMedicationSummary.YesBtnOnPopup.should("have.text", row.YesBtn);
    CustomMedicationSummary.noBtnOnPopup.should("have.text", row.NoBtn);
  });
});

Then(
  "The correct data should be reflected in all the fields",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      cy.wait(3000);
      CustomMedication.txtCustomMedication.invoke("val").then((text) => {
        cy.log("Text from the text field: " + text);
        expect(text).to.contain(row.custMedName);
      });

      if (row.controllSubstanceValue == "Yes") {
        CustomMedication.rdbtnControlledSubstanceYes.should("be.checked");
        CustomMedication.drpdownSchedule.invoke("val").then((text) => {
          cy.log("Text from the text field: " + text);
          expect(text).to.contain(row.scheduleValue);
        });
      } else {
        CustomMedication.rdbtnControlledSubstanceNo.should("be.checked");
      }

      CustomMedication.selectedIngredient.first().contains(row.ingredientValue);
      CustomMedication.selectedIngredient.last().contains(row.medGroupValue);
      CustomMedication.toggleText.should("have.text", row.status);
    });
  }
);

Then("the user clears all the mandatory values", () => {
  cy.wait(3000);
  CustomMedication.txtCustomMedication.focus().clear();
  CustomMedication.rdbtnControlledSubstanceNo.check().should("be.checked");
});

Then("verify {string} button is present", (DeleteButton: string) => {
  CustomMedicationSummary.btnDelete.should("have.text", DeleteButton);
});

Then("verify {string} button is not present", (DeleteButton: string) => {
  CustomMedicationSummary.btnDelete.should("not.exist");
});

Then("the user clicks on Cancel button on delete validation message", () => {
  CustomMedicationSummary.cancelDeleteBtn.click();
});

Then("verify delete validation pop-up message", () => {
  CustomMedicationSummary.deleteValidationMsg
    .and("contain", "Delete Custom Medication")
    .and("contain", "Are you sure you want to delete this custom medication?")
    .and("contain", "You cannot undo this action.");
});

Then("on pop-up message user clicks on Delete button", () => {
  CustomMedicationSummary.confirmDeleteBtn.click();
});

Then("user is navigated back to Summary page", () => {
  CustomMedicationSummary.addNewBtn.should("be.visible");
});

Then(
  "verify {string} message is displayed in summary page",
  (noData: string) => {
    CustomMedicationSummary.noDataFoundMesaage.should("have.text", noData);
  }
);

Then("the user refreshes the page", () => {
  cy.reload();
  cy.wait(3000);
});

When(
  "Dynamically hit the ingredients API with mock data {string}",
  (custMedName: string) => {
    let allcustMedId: any;
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `
        SELECT "CustomMedicationId"	FROM public."CustomMedication" where "Description" like '` +
        custMedName +
        `%';
        `,
    })
      .then((result: any) => {
        let totalRows = result.rows.length;
        for (let i = 0; i < totalRows; i++) {
          allcustMedId = result.rows[i].CustomMedicationId;
        }
      })
      .then(() => {
        cy.intercept(
          {
            method: "GET",
            url:
              "https://orders-qa.matrixcare.me/api/custom-medications/" +
              allcustMedId,
          },
          {
            statusCode: 200,
            body: {
              customMedications: [
                {
                  description: custMedName,
                  deaClassId: null,
                  isActive: true,
                  createdDateTime: "0001-01-01T00:00:00+00:00",
                  createdBy: null,
                  modifiedDateTime: "2023-08-03T05:49:50.174682+00:00",
                  modifiedBy: null,
                  fdbMedGroupLists: [
                    {
                      id: 2,
                      description: "Antianxiety",
                    },
                    {
                      id: 3,
                      description: "Antibiotics",
                    },
                  ],
                  fdbIngredientLists: [
                    {
                      isObsolete: false,
                      id: 566001,
                      description: "1,3-butanediol (bulk) 100 % liquid",
                    },
                    {
                      isObsolete: true,
                      id: 563658,
                      description: "1,2-pentanediol (bulk) 100 % liquid",
                    },
                  ],
                  id: allcustMedId,
                },
              ],
              pagination: null,
            },
          }
        ).as("customMedication");
        CustomMedicationSummary.CustomMedicationName.click().then(() => {
          cy.wait("@customMedication");
          CustomMedicationSummary.obseleteIngredients
            .contains("obsolete")
            .should("be.visible");
        });
      });
  }
);

When(
  "the user creates a custom medication with dynamic fields",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      let rad = Math.floor(Math.random() * 10000) + 1;
      let custMedName = row.custMedName + rad;

      CustomMedication.txtCustomMedication.clear().type(custMedName);

      CustomMedication.selectControlledSubstance(row.controllSubstanceValue);
      if (row.controllSubstanceValue == "Yes") {
        CustomMedication.selectSchedule(row.scheduleValue);
      }

      CustomMedication.drpdownIngredients.click().type("ba");
      for (let i = 0; i < row.ingredientValue; i++) {
        cy.get('[id$="option-' + i + '"]').click();
      }

      cy.get("h1").click();
      CustomMedication.drpdownMedicationGroup.click();
      cy.wait(2000);
      for (let i = 0; i < row.medGroupValue; i++) {
        cy.get('[id$="option-' + i + '"]').click();
      }

      CustomMedication.toggleText.invoke("text").then((text) => {
        if (text == row.status) {
          CustomMedication.heading.click();
        } else {
          CustomMedication.toggleStatus.click({ force: true });
          CustomMedication.toggleText.should("have.text", row.status);
        }
      });

      CustomMedication.heading.click();
      CustomMedicationSummary.btn.contains(row.saveBtn).click();

      cy.wait(2000);

      cy.get("button").contains("Create New").click();
    });
  }
);

When("user navigates to the page number {string}", () => {
  CustomMedicationSummary.nextPageArrowBtn.click();
});

When("user navigates to {string} page", () => {
  CustomMedicationSummary.firstPageArrowBtn.click();
});

When("user navigates to page number 3", () => {
  CustomMedicationSummary.pageThreeInPagination.click();
});

Then("user clicks on Custom Medication first record", () => {
  CustomMedicationSummary.firstCustomMedication.click();
});

When("user navigates to Custom Medication page number 3", () => {
  CustomMedicationSummary.pageThreeCustomMedication.click();
});

Then("verify user is on same page", () => {
  cy.wait(2000);
  CustomMedicationSummary.pageThreeCustomMedication.should("exist");
});

Then("user able to see summary page", () => {
  cy.url().should('include', '/custom-medications');
})

When("user clears the search text field",() => {
  CustomMedicationSummary.searchTextField.clear()
})