import { When, Then, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import CustomMedication from "../../pages/CustomMedicationPage";
import CustMedSummaryPage from "../../pages/CustMedSummaryPage";
import medSearchPage from "../../pages/MedSearchPage";
const envPAGE = require("../../env.config.json");
let customMedName: string = "AutomationTestCustomMedication";

// Given("the user should launch {string}", (url: string) => {
//   cy.visit(url);
// });

Then(
  "the user sees the text box with label {string}",
  (txtboxlabel: string) => {
    cy.contains("label", txtboxlabel);
  }
);

Then("the user enters the custom medication name", () => {
  let rad = Math.floor(Math.random() * 10000) + 1;
  let timestamp = new Date().getTime();
  customMedName = customMedName + rad + timestamp;
  CustomMedication.txtCustomMedication.clear().type(customMedName);
});

Then("the user sees the message {string}", (message: any) => {
  cy.get(".alert", { timeout: 10000 })
    .invoke("text")
    .then((messageText) => {
      messageText.replace(/\s+/g, "");
      expect(messageText.replace(/\s+/g, "")).contains(
        message.replace(/\s+/g, "")
      );
    });
});

When(
  "the user enters alphanumeric character of length {string}",
  (textLength: any) => {
    let text = "";
    let possible =
      "Automation" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-()";
    for (let i = 0; i < textLength; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    let text1 = "Automation" + text;
    cy.get(".col-form-label").next("input").clear();
    cy.get(".col-form-label").next("input").type(text1);
  }
);

Then("the user navigates back to the Custom Medication Page", () => {
  CustMedSummaryPage.custMedNameHeader.should("be.visible");
});

Then(
  "the user check {string} button is disabled Status",
  (buttonText: string) => {
    cy.get("button").contains(buttonText).should("be.disabled");
  }
);

Then("the custom medication {string} is not present", (text: string) => {
  cy.contains(text).should("not.exist");
});

Then(
  "the user sees the Cancel popup with message {string} with {string} and {string} button",
  (message, buttonYes: string, buttonNo: string) => {
    CustomMedication.cancelPopUp.should("have.text", message);
    cy.contains("label", buttonYes);
    cy.contains("label", buttonNo);
  }
);

Then(
  "the user clicks controlled substance {string} button",
  (Value: string) => {
    CustomMedication.selectControlledSubstance(Value);
  }
);

When(
  "click on Schedule drop-down field and select {string}",
  (scheduleValue: string) => {
    CustomMedication.selectSchedule(scheduleValue);
    CustomMedication.drpdownSchedule.contains(scheduleValue);
  }
);

Then("check schedule field should be empty", () => {
  CustomMedication.drpdownSchedule.should("not.have.value");
});

When("click on Ingredients field drop-down", () => {
  CustomMedication.drpdownIngredients.click();
  cy.wait(1000);
});

Then("user selects 15 Ingredients from drop-down", () => {
  CustomMedication.chkboxIngredients.then((elements) => {
    const checkboxes = Array.from(elements).slice(0, 15);
    checkboxes.forEach((checkbox) => {
      cy.wrap(checkbox).click();
    });
  });
  CustomMedication.txtCustomMedication.click();
});

Then(
  "verify all {string} {string} are displayed",
  (count: string, type: string) => {
    if (type == "Ingredients")
      CustomMedication.ingredientsCount.should("have.text", count);
    else if (type == "Medication Groups")
      CustomMedication.medGroupCount.should("have.text", count);
  }
);

Then(
  "user clicks on Remove icon and checks the decrease of the count for {string}",
  (type: string) => {
    if (type == "Ingredients") {
      CustomMedication.ingredientsCount.then(($element) => {
        let removeCount = parseInt($element.text());
        for (let i = 1; i <= 15; i++) {
          cy.get('[data-testid="remove-ingredient"]')
            .first()
            .click({ force: true });
          removeCount = removeCount - 1;
          if (removeCount != 0) {
            CustomMedication.ingredientsCount.should("have.text", removeCount);
          }
        }
      });
    } else if (type == "Medication Groups") {
      CustomMedication.medGroupCount.then(($element) => {
        let removeCount = parseInt($element.text());
        for (let i = 1; i <= 15; i++) {
          cy.get('[data-testid="rm-medication-group"]')
            .first()
            .click({ force: true });
          removeCount = removeCount - 1;
          if (removeCount != 0) {
            CustomMedication.medGroupCount.should("have.text", removeCount);
          }
        }
      });
    }
  }
);

Then(
  "verify the message for {string} field {string}",
  (type: string, message: string) => {
    if (type == "Ingredients")
      cy.contains("No ingredients have been selected.").should(
        "have.text",
        message
      );
    else if (type == "Medication Groups")
      cy.contains("No medication groups have been selected.").should(
        "have.text",
        message
      );
  }
);

Then("verify message for Custom medication {string}", () => {
  cy.contains("Error: Please match the format requested.").should("be.visible");
});

Then(
  "verify the message for the {string} field after selecting 15 items {string}",
  (type: string, message: string) => {
    if (type == "Ingredients")
      cy.contains("You can select a maximum of 15 ingredients").should(
        "have.text",
        message
      );
    else if (type == "Medication Groups")
      cy.contains("You can select a maximum of 15 medication groups").should(
        "have.text",
        message
      );
  }
);

Then(
  "Enter {string} in the Custom Medication Name",
  (txtCustomMedicationName: string) => {
    CustomMedication.txtCustomMedication.clear().type(txtCustomMedicationName);
  }
);

Then(
  "Custom medication field should {string} highlighted with red border",
  (value: string) => {
    if (value == "be") {
      CustomMedication.customMedicationFieldBorderColor.should("be.visible");
    } else {
      CustomMedication.customMedicationFieldBorderColor.should("not.exist");
    }
  }
);

Then(
  "Schedule field should {string} highlighted with red border",
  (value: string) => {
    if (value == "be") {
      CustomMedication.scheduleFieldBorderColor.should("be.visible");
    } else {
      CustomMedication.scheduleFieldBorderColor.should("not.exist");
    }
  }
);

Then(
  "Custom medication field validation should {string} {string}",
  (value: string, validation: string) => {
    if (value == "be") {
      CustomMedication.lblCustomMedicationName
        .siblings("[class='invalid-feedback-message']")
        .should("have.text", validation);
    } else {
      CustomMedication.lblCustomMedicationName
        .siblings("[class='invalid-feedback-message']")
        .should("not.have.text", validation);
    }
  }
);

Then(
  "Schedule validation should {string} {string}",
  (value: string, validation: string) => {
    if (value == "be") {
      CustomMedication.drpdownSchedule
        .next("div")
        .should("have.text", validation);
    } else {
      CustomMedication.drpdownSchedule
        .next("div")
        .should("not.have.text", validation);
    }
  }
);

Then(
  "Controlled Substance radio buttons should {string} highlighted with red",
  (value: string) => {
    if (value == "be") {
      CustomMedication.controlledSubstanceColorForNo.should("be.visible");
      CustomMedication.controlledSubstanceColorForYes.should("be.visible");
    } else {
      CustomMedication.controlledSubstanceColorForNo.should("not.exist");
      CustomMedication.controlledSubstanceColorForYes.should("not.exist");
    }
  }
);

Then(
  "Controlled Substance validation should {string} {string}",
  (value: string, validation: string) => {
    if (value == "be") {
      CustomMedication.validationForControlledSubstance.contains(validation);
    } else {
      CustomMedication.yesBtn
        .siblings(".invalid-feedback-message")
        .should("not.exist");
    }
  }
);

Then("user toggles to status as {string}", (statusValue: string) => {
  CustomMedication.toggleStatus.click({ force: true });
  CustomMedication.toggleText.should("have.text", statusValue);
});

Then("the user reloads the browser", () => {
  cy.reload();
});

Then("Custom Medication Name field should be blank", () => {
  CustomMedication.txtCustomMedication.should("be.empty");
});

Then("Controlled substance radio button should not be selected", () => {
  CustomMedication.rdbtnControlledSubstanceYes.should("not.be.checked");
  CustomMedication.rdbtnControlledSubstanceNo.should("not.be.checked");
});

Then("Schedule dropdown should not be available", () => {
  CustomMedication.drpdownSchedule.should("not.exist");
});

Then("Ingredients field should be blank", () => {
  CustomMedication.drpdownIngredientsField.should("be.empty");
});

Then("Medication group field should be blank", () => {
  CustomMedication.drpdownMedicationGroup.should("be.empty");
});

Then("Status should be {string}", (statusValue: string) => {
  CustomMedication.toggleText.should("have.text", statusValue);
});

Then("mandatory field is present next to Custom medication name", () => {
  CustomMedication.mandatoryfieldCustomMedication.should("be.visible");
});

Then("the user is able to see mandatory field next to Schedule field", () => {
  CustomMedication.mandatoryfieldSchedule.should("be.visible");
});

Then("mandatory field is present next to Controlled Substance", () => {
  CustomMedication.mandatoryfieldControlledSubstance.should("be.visible");
});

Then("Schedule drop-down is not displayed", () => {
  CustomMedication.drpdownSchedule.should("not.exist");
});

Then("Schedule drop-down is displayed", () => {
  CustomMedication.drpdownSchedule.should("be.visible");
});

Then("status toggle button is Active by defualt", () => {
  CustomMedication.toggleText.contains("Active");
});

When(
  "user able to see {string} and {string} button is present",
  (saveButton: string, CancelButton: string) => {
    cy.get("button").contains(saveButton).should("be.visible");
    cy.get("button").contains(CancelButton).should("be.visible");
  }
);

When("click on Schedule drop-down field", () => {
  CustomMedication.drpdownSchedule.select;
});

Then(
  "Schedule II,Schedule III and Schedule IV ,Schedule V data is displayed on Schedule drop-down",
  (selectedValue: string) => {
    cy.get("#deaSchedule")
      .invoke("text")
      .then((selectedValue: any) => {
        cy.log(selectedValue);
      });
  }
);

Then("user mouseover on {string}", (buttonlabel: string) => {
  cy.contains("label", buttonlabel).trigger("mouseover").invoke("show");
  cy.get('[title="Mandatory field"]').should("be.visible");
});

When("click on Med-group field drop-down", () => {
  CustomMedication.drpdownMedicationGroup.click();
});

Then("user enter {string} on Ingredients text field", (Ingredients: string) => {
  CustomMedication.drpdownIngredients.type(Ingredients);
});

Then(
  "select the Ingredients {string} from the list and verify it is dispalyed",
  (ingredients: string) => {
    CustomMedication.chkboxfirstIngredients.first().click({ force: true });
    CustomMedication.selectedIngredient.should("have.text", ingredients);
  }
);

Then("user enters {string} in Med-Group search field", (MedGroup: string) => {
  CustomMedication.drpdownMedicationGroup.type(MedGroup);
});

Then(
  "select the Med-Group {string} from the list and verify it is dispalyed",
  (medgroup: string) => {
    CustomMedication.chkboxfirstMedGroup.first().click({ force: true });
    cy.get("h1").click();
    CustomMedication.selectedMedGroup.should("have.text", medgroup);
  }
);

Then(
  "check custom medication field text {string} should be visible",
  (message: string) => {
    CustomMedication.txtCustomMedication.should("have.have.value", message);
  }
);

Then("the user sees the label {string}", (txtlabel: string) => {
  CustomMedication.cutomMedicationfloatmessageforcharacters.contains(txtlabel);
});

Then("user mouseover and verify custom medication info icon tool tip", () => {
  cy.get("#customMedicationNameTooltip").as("tooltipIcon");
  cy.get("@tooltipIcon").trigger("mouseover");
  cy.get("@tooltipIcon")
    .invoke("attr", "title")
    .then((value: any) => {
      let text =
        "Only following characters are allowed -" +
        "\n1. Alpha-Numeric a - z, A - Z, 0 - 9" +
        "\n2. Special Characters ! @ # $ % ^ & * ( ) _ - + = { } [ ] | \\ : ” ; ’ < > , . ? /";
      expect(value).to.equal(text);
    });
});

Then(
  "the user checks for maximum characters for custom medication field",
  () => {
    CustomMedication.txtCustomMedication.invoke("val").then((text: any) => {
      expect(text.length).equal(70);
    });
  }
);

Then("Verify the validation message for non-printable characters", () => {
  CustomMedication.validationForControlledSubstance.then(($value) => {
    const getText = $value.text();
    console.log(getText);
    let text =
      '35/70Error: Only following characters are allowed -\n1. Alpha-Numeric a - z, A - Z, 0 - 9\n2. Special Characters ! @ # $ % ^ & * ( ) _ - + = { } [ ] | \\ : " ; ' +
      "'" +
      " < > , . ? /";
    CustomMedication.validationForControlledSubstance.should(
      "have.text",
      getText
    );
    expect(getText).to.equal(text);
  });
});

Then("the ingredients dropdown should {string} visible", (value: string) => {
  if (value == "be") {
    CustomMedication.drpdownIngredientsList.should("be.visible");
  } else {
    CustomMedication.drpdownIngredientsList.should("not.exist");
  }
});

Then("the user types characters as {string}", (character: string) => {
  CustomMedication.drpdownMedicationGroup.type(character);
  CustomMedication.drpdownMedicationGroup.should("have.value", character);
});

Then(
  "the results should be displayed according to search characters {string}",
  (character: any) => {
    let item: string;
    cy.request({
      method: "GET",
      url: "https://orders-qa.matrixcare.me/api/medication-groups",
      qs: {
        SearchText: character,
        PageLength: "100",
        PageNumber: "1",
      },
    }).then((response: any) => {
      const groupResult = response.body?.medicationGroupSearchResultsDto;
      expect(response.status).to.eq(200);
      for (let i = 0; i < groupResult?.totalRows; i++) {
        cy.get("#react-select-3-option-" + i + ">label")
          .invoke("text")
          .then((val: any) => {
            expect(val).to.equal(groupResult?.items[i]?.description);
          });
      }
    });
  }
);

Then(
  "the validation should appear as {string}",
  (validationMessage: string) => {
    CustomMedication.validationMessage.should("have.text", validationMessage);
  }
);

Then("the user clicks outside the dropdown", () => {
  cy.get("h1").click();
});

Then("the user clicks on the dropdown field", () => {
  CustomMedication.medGroupDropdown.click();
});

Then("the selected {string} med-group values appear", (values: number) => {
  CustomMedication.medicationGroupLabel
    .siblings(".badge")
    .should("have.text", values);
});

Then("the selected {string} Ingredients values appear", (values: number) => {
  CustomMedication.ingredientsLabel
    .siblings(".badge")
    .should("have.text", values);
});

Then(
  "the selected {string} Ingredients values unselected",
  (values: number) => {
    CustomMedication.IngredientCountCount.should("not.exist");
  }
);

Then("user selects {string} med-group values", (selectValues: string) => {
  CustomMedication.drpdownMedicationGroup.type(selectValues);
  cy.get("input").realPress("Tab");
});

Then("user selects {string} Ingredients values", (selectValues: number) => {
  for (let chkBoxIdx = 0; chkBoxIdx < selectValues; chkBoxIdx++) {
    cy.get('[id$="option-' + chkBoxIdx + '"]>input').click();
    cy.wait(500);
  }
});

Then("user deselects {string} Ingredients values", (selectValues: number) => {
  for (let i = selectValues - 1; i < 0; i--) {
    cy.get("#react-select-2-option-" + i).click();
  }
});

Then("the dropdown should {string} visible", (text: any) => {
  if (text === "be") {
    CustomMedication.MedGroupDropdownVisiblity.invoke("attr", "id").should(
      "equal",
      "react-select-3-listbox"
    );
  } else {
    CustomMedication.MedGroupDropdownInvisiblity.should("not.exist");
  }
});

Then("the Ingredients results is displayed", () => {
  CustomMedication.ingredientsListInDrpdwn.should("be.visible");
});

Then("the user enters characters as {string}", (character: string) => {
  CustomMedication.txtIngredientsbox.clear().type(character);
  CustomMedication.txtIngredientsbox.should("have.value", character);
});

Then(
  "the results is displayed according to search characters {string}",
  (character: any) => {
    let item: string;
    cy.request({
      method: "GET",
      url: "https://orders-qa.matrixcare.me/api/medications",
      qs: {
        SearchText: character,
        PageLength: "10",
        PageNumber: "1",
        MedicationAvailability: "0",
      },
    }).then((response: any) => {
      const groupResult = response.body?.medicationSearchResultsDto;
      item = groupResult?.items[0]?.description;
      expect(response.status).to.eq(200);

      for (let i = 0; i < groupResult?.totalRows; i++) {
        cy.get("#react-select-2-option-" + i + ">label")
          .invoke("text")
          .then((val: any) => {
            expect(val).to.equal(groupResult?.items[i]?.description);
          });
      }
    });
  }
);

Then("the Ingredients results is not displayed", () => {
  CustomMedication.ingredientsListInDrpdwn.should("not.exist");
});

Then(
  "the user sees the text Area with label {string}",
  (txtArealabel: string) => {
    cy.contains(txtArealabel).should("be.visible");
  }
);

Then("scroll till end to see message {string}", (message: string) => {
  for (let i = 0; i <= 245; i++) {
    cy.get("#react-select-2-option-" + i).scrollIntoView();
  }
  CustomMedication.ingredientScrolltoEndMsg.should("have.text", message);
});

Then("user click on outside the dropdown", () => {
  CustomMedication.maximumselectionmessage.click();
});

When("user unselect the one medgroup value", () => {
  CustomMedication.unselectMedgroup.click();
});

Then(
  "user clicks on Remove icon {string} times and checks the decrease of the count for {string}",
  (times: string, type: string) => {
    if (type == "Ingredients") {
      CustomMedication.ingredientsCount.then(($element) => {
        let removeCount = parseInt($element.text());
        for (let i = 1; i <= parseInt(times); i++) {
          cy.get('[data-testid="remove-ingredient"]')
            .first()
            .invoke("attr", "aria-label")
            .should("contain", "Remove Ingredient");
          cy.get('[data-testid="remove-ingredient"]').first().click();
          removeCount = removeCount - 1;
          if (removeCount != 0) {
            CustomMedication.ingredientsCount.should("have.text", removeCount);
          }
        }
      });
    } else if (type == "Medication Groups") {
      CustomMedication.medGroupCount.then(($element) => {
        let removeCount = parseInt($element.text());
        for (let i = 1; i <= parseInt(times); i++) {
          cy.get('[data-testid="rm-medication-group"]')
            .first()
            .click({ force: true });
          removeCount = removeCount - 1;
          if (removeCount != 0) {
            CustomMedication.medGroupCount.should("have.text", removeCount);
          }
        }
      });
    }
  }
);

Then(
  "user clicks on Remove icon and checks the decrease of the count for Medgroup",
  () => {
    let removeCount = 15;
    for (let i = 1; i <= 15; i++) {
      CustomMedication.iconRemove.click();
      removeCount = removeCount - 1;
      if (removeCount != 0) {
        // CustomMedication.medGroupCount.should('have.text', removeCount);
        cy.get('[for="medicationGroup"]')
          .siblings(".badge")
          .should("have.text", removeCount);
      }
    }
  }
);

Then("user clicks on the arrow button in med-group text field", () => {
  CustomMedication.drpdownMedicationGroup.click();
});

Then(
  "The user selects {string} values and verifies if selected values are coming in correct order in the list",
  (values: number) => {
    let selectedValues: any = [];
    let selectedValuesList: any = [];
    for (let i = 1; i <= values; i++) {
      cy.get("#react-select-3-option-" + i).click();
      cy.get("#react-select-3-listbox #react-select-3-option-" + i + ">label")
        .invoke("text")
        .then((val: any) => {
          selectedValues.push(val);
        });
    }
    console.log(selectedValues, "Selected Value");
    for (let i = 1; i <= values; i++) {
      cy.get(".bg-ingridents-med-group-items-box>li:nth-child(" + i + ")")
        .invoke("text")
        .then((val: any) => {
          selectedValuesList.push(val);
          console.log(selectedValuesList, "Selected Values List");
        })
        .then(() => {
          if (selectedValuesList.length === Number(values)) {
            selectedValuesList.map((arrEle: string, i: number) => {
              expect(selectedValues[selectedValues.length - (i + 1)]).to.equal(
                arrEle
              );
            });
          }
        });
    }
  }
);

Then(
  "The user selects {string} values and verifies if selected values are coming in correct order in the Ingridents list",
  (values: number) => {
    let selectedValues: any = [];
    let selectedValuesList: any = [];
    for (let i = 1; i <= values; i++) {
      cy.get("#react-select-2-option-" + i).click();
      cy.get("#react-select-2-listbox #react-select-2-option-" + i + ">label")
        .invoke("text")
        .then((val: any) => {
          selectedValues.push(val);
        });
    }
    console.log(selectedValues, "Selected Value");
    for (let i = 1; i <= values; i++) {
      cy.get(".bg-ingridents-med-group-items-box>li:nth-child(" + i + ")")
        .invoke("text")
        .then((val: any) => {
          selectedValuesList.push(val);
          console.log(selectedValuesList, "Selected Values List");
        })
        .then(() => {
          if (selectedValuesList.length === Number(values)) {
            selectedValuesList.map((arrEle: string, i: number) => {
              expect(selectedValues[selectedValues.length - (i + 1)]).to.equal(
                arrEle
              );
            });
          }
        });
    }
  }
);

Then("verify 2 Errors found warning message is not displayed", () => {
  CustomMedication.ErrorsFound.should("not.exist");
});

Then("verify {string}error link", (message: string) => {
  CustomMedication.customMedErrorlink.contains(message).should("be.visible");
  CustomMedication.customMedErrorlink
    .contains(message)
    .should("have.text", message);
});

Then("verify {string}error link in warning", (message: string) => {
  CustomMedication.customMedErrorlink.contains(message).should("be.visible");
  CustomMedication.customMedErrorlink
    .contains(message)
    .should("have.text", message);
});

Then("verify error reason next to Custom Medication field", () => {
  CustomMedication.lblCustomMedicationName
    .siblings("[class='invalid-feedback-message']")
    .should("be.visible");
});

Then("verify error reason next to Controlled substance field", () => {
  CustomMedication.validationForControlledSubstance.should("be.visible");
});

When("click on Custom Medication error link", () => {
  CustomMedication.customMedErrorlink
    .contains("Custom Medication Name")
    .click();
});

Then("user is navigated to Custom Medication name field", () => {
  cy.focused().should("have.id", "customMedicationName");
});

When("click on Controlled Substance error link", () => {
  CustomMedication.customMedErrorlink.contains("Controlled Substance").click();
});

Then("user is navigated to Controlled Substance No", () => {
  cy.focused().should("have.id", "isControlledSubstance");
});

Then("verify {string} error link and click", (message: string) => {
  CustomMedication.customMedErrorlink.contains(message).should("be.visible");
  CustomMedication.customMedErrorlink
    .contains(message)
    .should("have.text", message);
  CustomMedication.customMedErrorlink.contains(message).click();
});

Then("user is navigated to Schedule dropdown field", () => {
  cy.focused().should("have.id", "deaSchedule");
});

Then("verify Schedule error link is not displayed", () => {
  CustomMedication.ScheduleErrorlink.should("not.exist");
});

Then("verify Custom medication error link is not displayed", () => {
  CustomMedication.customMedErrorlink.should("not.exist");
});

Then("verify Controlled Substance error link is not displayed", () => {
  CustomMedication.customMedErrorlink.should("not.exist");
});

Then("verify close icon for warning message and click on it", () => {
  CustomMedication.errorCloseIcon.should("be.visible");
  CustomMedication.errorCloseIcon.click();
});

Then("the user clicks on Yes in cancel button", () => {
  cy.get('[data-testid="confirmButton"]').click();
});

Then("verify the error message {string}", (error: string) => {
  CustomMedication.ErrorsFound.then(($value) => {
    const getText = $value.text();
    console.log(getText);
    expect(getText).to.equal(error);
  });
});

Then("verify the warning message {string}", (warningMsg: string) => {
  CustomMedication.warningMessageforCustomMedicationfeild.then(($value) => {
    const getText = $value.text();
    console.log(getText);
    expect(getText).to.equal(warningMsg);
  });
});

When("user Enter input", () => {
  let text =
    "I am working on custom medication field and want to see the functioning and test";
  let textNew =
    "I am working on custom medication field and want to see the functioning and test or test testing";
  //CustomMedication.txtCustomMedication.type(text).trigger('focus')
  CustomMedication.txtCustomMedication.invoke("val", text);
  CustomMedication.txtCustomMedication
    .clear()
    .type(
      "I am working on custom medication field and want to see the functioni"
    );
  cy.wait(5000);
  CustomMedication.txtCustomMedication.invoke("val", textNew).trigger("click");
});

Then(
  "the user deletes custom medication {string} form DB post execution",
  (customMedName: string) => {
    let allcustMedId: any = [];
    let allcustMedName: any = [];
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `
        SELECT *	FROM public."CustomMedication" where "Description" like '` +
        customMedName +
        `%';
        `,
    })
      .then((result: any) => {
        let totalRows = result.rows.length;
        console.log(totalRows);
        for (let i = 0; i < totalRows; i++) {
          allcustMedId.push(result.rows[i].CustomMedicationId);
          allcustMedName.push(result.rows[i].Description);
        }
      })
      .then(() => {
        console.log(allcustMedId);
        console.log(allcustMedName);
        for (let i = 0; i < allcustMedId.length; i++) {
          cy.task("DATABASE", {
            dbConfig: envPAGE.env.QADBPGADMIN,
            sql:
              `
        DELETE FROM public."CustomMedicationIngredientMapping" WHERE "CustomMedicationId"='` +
              allcustMedId[i] +
              `';
        DELETE FROM public."CustomMedicationMedGroupMapping" WHERE "CustomMedicationId"='` +
              allcustMedId[i] +
              `';
        DELETE FROM public."CustomMedication" WHERE "Description"='` +
              allcustMedName[i] +
              `';
        `,
          });
        }
      });
  }
);

Then("User wait for synchronization", () => {
  cy.wait(4000);
});

Then(
  "user is able to see the custom medication in the custom library details page",
  () => {
    CustomMedication.summarypage.should("be.visible");
    cy.contains(customMedName);
  }
);

When(
  "the user type the newly created custom medication name in the search bar",
  () => {
    medSearchPage.typeSearch(customMedName);
  }
);

Then(
  "User verifies Custom Medication Name {string} from database",
  (Name: string) => {
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `SELECT * FROM public."CustomMedication" WHERE "Description" LIKE '` +
        Name +
        `%';`,
    }).then((result: any) => {
      console.log(result.rows);
      const Description = result.rows[0].Description;
      console.log(Description);
      expect(Description).to.contain(Name);
    });
  }
);

Then(
  "user Enter {string} Custom Medication name",
  (txtCustomMedicationName: string) => {
    let rad = Math.floor(Math.random() * 1000) + 1;
    let timestamp = new Date().getTime();
    let custMedName = txtCustomMedicationName + rad + timestamp;
    CustomMedication.txtCustomMedication.clear().type(custMedName);
  }
);

Then(
  "user selects {string} of the following in the {string} field",
  (count: string, type: string, dataTable: DataTable) => {
    let displayCount = 0;
    if (type == "Ingredients") {
      dataTable.hashes().forEach((row) => {
        CustomMedication.drpdownIngredients.type(row.IngredientName);
        cy.wait(2000);
        cy.get("input").realPress("Tab");
        cy.get("h1").click();
        displayCount++;
        CustomMedication.ingredientsCount.should("have.text", displayCount);
      });
      expect(displayCount).to.equal(parseInt(count));
    } else if (type == "Medication Groups") {
      cy.log("hello");
      dataTable.hashes().forEach((row) => {
        CustomMedication.drpdownMedicationGroup.type(row.MedGroupName);
        cy.wait(2000);
        cy.get("input").realPress("Tab");
        cy.get("h1").click();
        displayCount++;
        CustomMedication.medGroupCount.should("have.text", displayCount);
        CustomMedication.drpdownMedicationGroup.clear();
      });
      expect(displayCount).to.equal(parseInt(count));
    }
  }
);

Then(
  "user selects {string} on Ingredients field",
  (Ingredientsname: string) => {
    CustomMedication.drpdownIngredients.type(Ingredientsname);
    cy.get("input").realPress("Tab");
  }
);

Then(
  "user check the api response for search text  {string} and verify UI as per the equivalentAvailable flag value",
  (character: any) => {
    let item: any = [];
    let availabilityFlag: string;
    cy.request({
      method: "GET",
      url: "https://orders-qa.matrixcare.me/api/medications",
      qs: {
        SearchText: character,
        PageLength: "10",
        PageNumber: "20",
        MedicationAvailability: "1",
      },
    }).then((response: any) => {
      const groupResult = response.body?.medicationSearchResultsDto;
      item = groupResult?.items[0]?.description;
      let itemlength = groupResult?.items?.length;
      availabilityFlag = groupResult?.items[0]?.elements.availability;
      expect(response.status).to.eq(200);

      for (let i = 0; i < itemlength; i++) {
        CustomMedication.drpdownIngredients.type(
          groupResult?.items[i]?.description
        );
        availabilityFlag = groupResult?.items[i]?.elements.availability;
        console.log(
          groupResult?.items[i]?.description +
            " Flag availability " +
            availabilityFlag
        );
        let lentext = groupResult?.items[i]?.description.length;
        console.log("length of the string is " + lentext);
        if (lentext > 30) {
          let splitText = groupResult?.items[i]?.description.split(" ");
          splitText = splitText[0] + " " + splitText[1];
          cy.get("h1").click();
          CustomMedication.drpdownIngredients.type(splitText);
          cy.wait(1000);
        } else {
          CustomMedication.drpdownIngredients.type(
            groupResult?.items[i]?.description
          );
          cy.wait(1000);
        }
        if (availabilityFlag == "Available") {
          CustomMedication.drpdownIngredientsList.should("be.visible");
        } else {
          CustomMedication.drpdownIngredientsList.then(($val: any) => {
            const getText = $val.text();
            console.log(getText);

            if (groupResult?.items[i]?.description !== getText) {
              console.log("Not available in UI");
            } else {
              CustomMedication.validationMessage.contains("No matches found");
            }
          });
        }
      }
    });
  }
);
