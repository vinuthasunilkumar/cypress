import { When, Then, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import FrequencyAndAdminPage from "../../pages/FrequencyAndAdminPage";
const envPAGE = require("../../env.config.json");

Then("user verifies the Customize Scheduling as title is displayed", () => {
  cy.get(".side-menu_content").should("be.visible");
  FrequencyAndAdminPage.titleCustomizeSchedule.should(
    "have.text",
    "Customize Scheduling"
  );
});

Then("user verifies the Add Schedule title is displayed", () => {
  FrequencyAndAdminPage.titleAddSchedule.should("be.visible");
});

Then("user verifies {string} button is displayed", (btn: string) => {
  cy.contains(btn).should("be.visible");
});

Then(
  "user verifies that Frequency dropdown is displayed which is mandatory field",
  () => {
    FrequencyAndAdminPage.labelFrequencyDropDown.should("be.visible");
    FrequencyAndAdminPage.frequencyDropDown.should("be.visible");
  }
);

Then("user verifies that Summary is displayed with frequency details", () => {
  FrequencyAndAdminPage.labelSummary.should("have.text", "Frequency Summary");
  FrequencyAndAdminPage.summaryText.should("be.visible");
});

Then(
  "user verifies that Administration Schedule is displayed which is mandatory field",
  () => {
    FrequencyAndAdminPage.labelAdminSchedule.should(
      "have.text",
      "Administration Schedule"
    );
    cy.get(`#presetsTab > span`).should("have.text", "Presets");
    cy.get("#customTab > span").should("have.text", "Custom");
  }
);

Then(
  "user sees the selected schedule in order writer page and in the left panel",
  () => {
    cy.get("#instructions-text").should("be.visible");
    let LeftPanelscheduleTxt: string, ScheduleTxt: string;
    cy.get("p.ml-2")
      .invoke("text")
      .then((text1) => {
        ScheduleTxt = text1.replace(/\s+/g, "");
      });
    cy.get("#administration-schedule-text")
      .invoke("text")
      .then((text2) => {
        LeftPanelscheduleTxt = text2.replace(/\s+/g, "");
        expect(ScheduleTxt).to.include(LeftPanelscheduleTxt);
      });
  }
);

When("user verifies that the Order Type dropdown is displayed", () => {
  FrequencyAndAdminPage.orderTypeDropDown.should("be.visible");
});

Then("user verifies the list of Order Type dropdown", () => {
  FrequencyAndAdminPage.verifyOrderTypeDropdownList();
});

When(
  "user selects blank in Order Type then Medication Type and DrugName dropdown field is not displayed",
  () => {
    FrequencyAndAdminPage.verifyIfBlankIsSelectedInOrderType();
  }
);

Then(
  "user selects Medication in Order Type then Medication Type and DrugName dropdown field is displayed",
  () => {
    FrequencyAndAdminPage.verifyIfMedicationIsSelectedInOrderType();
  }
);

When("user verifies the list of Medication Type dropdown", () => {
  FrequencyAndAdminPage.verifyMedicationTypeDropdownList();
});

Then("user selects {string} from Order Type dropdown", (orderType: string) => {
  FrequencyAndAdminPage.selectOptionFromOrderTypeDropdown(orderType);
});
Then(
  "user selects {string} from Medication Type dropdown",
  (medicationType: string) => {
    FrequencyAndAdminPage.selectOptionFromMedicationTypeDropdown(
      medicationType
    );
  }
);

Then("user search and select from DrugName dropdown", () => {
  FrequencyAndAdminPage.selectOptionFromMedicationTypeDropdown("Drug Name");
  FrequencyAndAdminPage.searchAndSelectFromDrugName("ty");
});

Then("user search and select from Medication Group dropdown", () => {
  FrequencyAndAdminPage.searchAndSelectFromDrugName("Ana");
});

Then("user verifies that {string} field is reset", () => {
  FrequencyAndAdminPage.verifyDrugNameFieldIsReset();
});

Then(
  "user verifies the next dropdown label {string}",
  (dropDownLabel: string) => {
    cy.contains("label", dropDownLabel);
  }
);

Then("user verifies that Include Generic checkbox is displayed", () => {
  FrequencyAndAdminPage.includeGenericCheckbox.should("be.visible");
});

Then("{string} link should be displayed", (text: string) => {
  FrequencyAndAdminPage.weeklyLinks.contains(text).should("be.visible");
});

Then("{string} label should be displayed", (text: string) => {
  FrequencyAndAdminPage.label.contains(text).should("have.text", text);
});

Then(
  "{string},{string},{string},{string},{string},{string},{string} checkboxes should be displayed",
  (
    sun: string,
    mon: string,
    tue: string,
    wed: string,
    thu: string,
    fri: string,
    sat: string
  ) => {
    FrequencyAndAdminPage.label.contains(sun).should("be.visible");
    FrequencyAndAdminPage.label.contains(mon).should("be.visible");
    FrequencyAndAdminPage.label.contains(tue).should("be.visible");
    FrequencyAndAdminPage.label.contains(wed).should("be.visible");
    FrequencyAndAdminPage.label.contains(thu).should("be.visible");
    FrequencyAndAdminPage.label.contains(fri).should("be.visible");
    FrequencyAndAdminPage.label.contains(sat).should("be.visible");
  }
);

When(
  "user verifies the values in the Duration Type dropdown when {string} is selected",
  (repeatsText: string) => {
    FrequencyAndAdminPage.verifyDurationTypeDropdownList(repeatsText);
  }
);

Then(
  "Verify checkboxes are {string} by default",
  (checkbox: any, dataTable: any) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.verifyCheckbox(checkbox, row.days);
    });
  }
);

Then("User selects {string} from Choose days", (text: string) => {
  cy.get("#" + text).click();
});

Then("user clicks on {string} button", (btn: string) => {
  cy.contains(btn).click();
});

Then("user clicks on {string} radio button", (label: string) => {
  cy.contains(label).siblings("[id*=btn]").click();
});

Then(
  "user verifies {string} label {string} displayed",
  (labeltxt: string, isDisplayed: string) => {
    FrequencyAndAdminPage.verifylabelIdDisplayed(labeltxt, isDisplayed);
  }
);

Then(
  "the user verifies that the radio buttons are displayed with the labels {string}",
  (labelText: string) => {
    cy.contains(labelText).should("exist");
  }
);

Then(
  "{string} radio button {string} selected",
  (labelText: string, isselected: string) => {
    FrequencyAndAdminPage.verifyradioBtnIsSelected(labelText, isselected);
  }
);

Then(
  "verify {string} values in the {string} dropdown",
  (values: number, labelText: string) => {
    FrequencyAndAdminPage.verifyScroll(values, labelText);
  }
);

Then(
  "verify user {string} able to enter these Values in {string} text field",
  (valuesToEnter: string, labelText: string, dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.enterValuesInSelectDropDown(
        valuesToEnter,
        labelText,
        row.negativeValues,
        row.positiveValues
      );
    });
  }
);

Then(
  "Verify Randomly select any checkboxes and verify those are selected",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.verifyCheckRandomCheckbox(row.days);
    });
  }
);

When(
  "user selects Frequency {string} from dropdown in the Customize Scheduling Screen",
  (frequency: string) => {
    FrequencyAndAdminPage.selectFrequencyFromDropDown(frequency);
  }
);

Then("user selects Repeats tab {string}", (tab: string) => {
  FrequencyAndAdminPage.selectRepeatsTab(tab);
});

Then(
  "user clicks the confirm button to save the customize scheduling details",
  () => {
    cy.get("#btnScheduleConfirm").click();
    cy.get("p.ml-2").should("be.visible");
  }
);

When(
  "user selects Frequency and verifies the number of Time fields in Repeats Tab",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.verifyTimeFieldsCountAsPerFrequencyValue(
        row.frequency,
        row.count
      );
    });
  }
);

Then("user validate the Time field with values", (dataTable: DataTable) => {
  dataTable.hashes().forEach((row: any) => {
    FrequencyAndAdminPage.validationOfTimeField(row.time, row.values);
  });
});

Then("user verify Repeat block is displayed", () => {
  FrequencyAndAdminPage.repeatBlock.should("be.visible");
});

Then(
  "{string} Button should highlighted with blue border",
  (buttonText: string) => {
    cy.get("button")
      .contains(buttonText)
      .should("have.css", "background-color", "rgb(19, 107, 201)");
  }
);

Then("user click on {string} radio Button", (buttonText: string) => {
  FrequencyAndAdminPage.label.contains(buttonText).click({ force: true });
});

Then(
  "verify user {string} able to select values in {string} text field",
  (valuesToEnter: string, labelText: string, dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.enterValuesInSelectDropDownWithoutClear(
        valuesToEnter,
        labelText,
        row.negativeValues,
        row.positiveValues
      );
    });
  }
);

Then("the user verifies the {string} is displayed", (message: any) => {
  cy.get(".alert alert-success").should("have.text", message);
});

Then("user toggles Set as Default field {string}", (val: any) => {
  FrequencyAndAdminPage.toggleSetAsDefault(val);
});

Then("user enters {string} in Time field", (time: any) => {
  FrequencyAndAdminPage.enterValuesInTimeFields(time, "Time", "");
});

Then("user selects value {string} from dropdown field", (value: string) => {
  FrequencyAndAdminPage.selectValueFromDropDown(value);
});

/*
 *This function fetches the current UTC time.
 *It verifies the DB values with the values entered in the application
 */
Then(
  "User verifies saved values {string},{string},{string},{string},{string},{string},{string},{string},{string} for {string} in database",
  (
    frequency: any,
    order: number,
    cycle: string,
    give: number,
    donotgive: number,
    duration: number,
    durationType: string,
    status: string,
    time: any,
    block: any
  ) => {
    cy.window().then((win) => {
      const newDate = new Date(win.Date());
      let utcTime = FrequencyAndAdminPage.calculateUtcTime(newDate);
      const timearr: any[] = utcTime.split(",");
      let startTime = timearr[0];
      let endTime = timearr[1];
      //query to fecth the data from AdministrationSchedule
      cy.task("DATABASE", {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql:
          `Select *
        From "AdministrationSchedule" A
        INNER JOIN "TimeSchedule" T
        ON A."AdministrationScheduleId" = T."AdministrationScheduleId" 
        Where A."CreatedDateTime" BETWEEN '` +
          startTime +
          `' AND '` +
          endTime +
          `'`,
        //Verifying the DB values with the values entered in the app
      }).then((result: any) => {
        expect(result.rows[0].FrequencyCode).to.equals(frequency);
        expect(result.rows[0].OrderType).to.equals(1);
        expect(result.rows[0].Duration).to.equals(Number(duration));
        expect(result.rows[0].DurationType).to.equals(durationType);
        if (status == "1") {
          expect(result.rows[0].IsDefault).to.equals(true);
        } else {
          expect(result.rows[0].IsDefault).to.equals(false);
        }
      });

      //query to fecth the data from TimeSchedule
      cy.task("DATABASE", {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql:
          `Select *
        From "AdministrationSchedule" A
        INNER JOIN "TimeSchedule" T
        ON A."AdministrationScheduleId" = T."AdministrationScheduleId"
        Where A."CreatedDateTime" BETWEEN '` +
          startTime +
          `' AND '` +
          endTime +
          `'`,
        //Verifying the DB values with the values entered in the app
      }).then((result1: any) => {
        let arrayTime: string[] = time.split(",");
        for (let i = 0; i <= result1.rows.length - 1; i++) {
          expect(result1.rows[i].StartTime).to.equals(
            arrayTime[arrayTime.length - 1 - i]
          );
        }
      });
      //verifying cyclical table
      if (block == "Cyclical") {
        cy.task("DATABASE", {
          dbConfig: envPAGE.env.QADBPGADMIN,
          sql:
            `Select *
        From "AdministrationSchedule" A
        INNER JOIN "CyclicalSchedule" C
        ON A."AdministrationScheduleId" = C."AdministrationScheduleId" 
        Where A."CreatedDateTime" BETWEEN '` +
            startTime +
            `' AND '` +
            endTime +
            `'`,
          //Verifying the DB values with the values entered in the app
        }).then((result: any) => {
          if (cycle == "Specific Cycle") {
            expect(result.rows[0].Cycle).to.equals(1);
            expect(result.rows[0].GiveDays).to.equals(Number(give));
            expect(result.rows[0].SkipDays).to.equals(Number(donotgive));
          } else if (cycle == "Every Other Day") {
            expect(result.rows[0].Cycle).to.equals(2);
            expect(result.rows[0].GiveDays).to.equals(0);
            expect(result.rows[0].SkipDays).to.equals(0);
          } else if (cycle == "Even Dates") {
            expect(result.rows[0].Cycle).to.equals(3);
            expect(result.rows[0].GiveDays).to.equals(0);
            expect(result.rows[0].SkipDays).to.equals(0);
          } else {
            expect(result.rows[0].Cycle).to.equals(4);
            expect(result.rows[0].GiveDays).to.equals(0);
            expect(result.rows[0].SkipDays).to.equals(0);
          }
        });
      } else if (block == "Weekly") {
        //verify weekly table

        cy.task("DATABASE", {
          dbConfig: envPAGE.env.QADBPGADMIN,
          sql:
            `Select *
        From "AdministrationSchedule" A
        INNER JOIN "WeeklySchedule" C
        ON A."AdministrationScheduleId" = C."AdministrationScheduleId" 
        Where A."CreatedDateTime" BETWEEN '` +
            startTime +
            `' AND '` +
            endTime +
            `'`,

          //Verifying the DB values with the values entered in the app
        }).then((result: any) => {
          expect(result.rows[0].EveryWeek).to.equals(Number(give));
          if (donotgive.toString() == "All") {
            expect(result.rows[0].SelectedDays).to.equals("M,T,W,Th,F,Sat,Sun");
          } else if (donotgive.toString() == "MWF") {
            expect(result.rows[0].SelectedDays).to.equals("M,W,F");
          } else if (donotgive.toString() == "TTh") {
            expect(result.rows[0].SelectedDays).to.equals("T,Th");
          } else if (donotgive.toString() == "Sat/Sun") {
            expect(result.rows[0].SelectedDays).to.equals("Sat,Sun");
          }
        });
      } else if (block == "Monthly") {
        //verify monthly table

        cy.task("DATABASE", {
          dbConfig: envPAGE.env.QADBPGADMIN,
          sql:
            `Select *
          From "AdministrationSchedule" A
          INNER JOIN "MonthlySchedule" C
          ON A."AdministrationScheduleId" = C."AdministrationScheduleId" 
          Where A."CreatedDateTime" BETWEEN '` +
            startTime +
            `' AND '` +
            endTime +
            `'`,

          //Verifying the DB values with the values entered in the app
        }).then((result: any) => {
          console.log("value  = " + status);
          if (status === "ChooseMonth") {
            expect(result.rows[0].ChooseMonth).to.equals(status);
          } else if (status === "SelectedDaysOfWeek") {
            expect(result.rows[0].SelectedDaysOfWeek).to.equals(status);
          }
        });
      }
    });
  }
);

Then(
  "user verify {string} checkboxes are displayed for {string} days as part of {string}",
  (number: any, month: any) => {
    FrequencyAndAdminPage.verifyDaysOfMonth(number, month);
  }
);

Then("user select {string} radio button", (labelText: any) => {
  FrequencyAndAdminPage.selectRadioButton(labelText);
});

Then(
  "user verify months, days of the week and days of the months checkboxes are unchecked and labels are displayed",
  (dataTable: any) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.verifyMonthLabelAndCheckboxes(row.Months_Days);
    });
  }
);

Then("user selects all the checkboxes for {string}", (radioButtonName: any) => {
  FrequencyAndAdminPage.selectAllCheckboxesAndVerify(radioButtonName);
});

Then("user verify that Set As Default toggle is inactive by default", () => {
  FrequencyAndAdminPage.setAsDefaultToggle.should("have.value", "false");
});

Then(
  "user selects Frequency and verifies the number of Time fields for {string} in repeat block",
  (chooseTime: string, dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.verifyTimeFieldsCount(chooseTime, row.frequency);
    });
  }
);

Then(
  "user select Hours Frequency and verify Time Range radio Button should be disable",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.verifyRadioButton(
        row.HoursFrequency,
        row.RadioButtonStatus
      );
    });
  }
);

Then("the user enter {string} in Every text field", (every: any) => {
  FrequencyAndAdminPage.everyWeekTextField.type(every);
  FrequencyAndAdminPage.selectFirstDropdownValue.click();
});

Then("click {string} choose days link", (chooseDays: any) => {
  FrequencyAndAdminPage.weeklyLinks.contains(chooseDays).click();
});

Then("the user enter {string} in EveryMonth text field", (EveryMonth: any) => {
  FrequencyAndAdminPage.everyWeekTextField.click();
  FrequencyAndAdminPage.everyMonthDropDownValue.contains(EveryMonth).click();
});

Then(
  "user choose {string} in Frequency and Administration",
  (chooseDays: any) => {
    const days = chooseDays.split(",");
    days.forEach((ele: any) =>
      cy.get("[data-testid=" + ele.trim() + "]").click()
    );
  }
);

Then("verifies Time fields should be blank", () => {
  FrequencyAndAdminPage.verifyBlankTimeFields();
});

Then("user enters {string} in Start Time field", (time: any) => {
  FrequencyAndAdminPage.enterValuesInStartTimeField(time);
});

Then("user verifies that Edit Assign To popup is displayed", () => {
  FrequencyAndAdminPage.eATAssignedToLabel.should("be.visible");
});

Then(
  "user selects {string} {string} checkbox",
  (unit: string, room: string) => {
    FrequencyAndAdminPage.userSelectsUnitsCheckbox(unit, room);
  }
);

Then("user verifies selection is updated in the label", () => {
  cy.contains("Unit 1 - Room 1").should("be.visible");
});

When("the user clicks on Cancel button", () => {
  FrequencyAndAdminPage.eATCancelBtn.click();
});

Then(
  "user verifies selection is not updated in Frequency and Admin page",
  () => {
    cy.contains("Unit 1 - Room 1").should("not.exist");
  }
);

When("the user clicks on Close button", () => {
  FrequencyAndAdminPage.eATCrossBtn.click();
});

Then("user clicks on {string} All button", (operation: string) => {
  FrequencyAndAdminPage.clickCheckCLearButton(operation);
});

Then(
  "user verifies that all the checkboxes is {string}",
  (isChecked: string) => {
    FrequencyAndAdminPage.verifyEATCheckboxesCheckedOrNot(isChecked);
  }
);

Then(
  "user enter invalid value {string} in search box and verify no record is displayed",
  (invalidVal: string) => {
    FrequencyAndAdminPage.verifyInvalidSearch(invalidVal);
  }
);

Then(
  "user verifies the selection {string} {string} is updated in Assigned To label",
  (unit: string, room: string) => {
    FrequencyAndAdminPage.verifyAssignedToLabel(unit, room);
  }
);

Then(
  "user verifies the selected name {string} is updated in Assigned To label",
  (facilityName: string) => {
    FrequencyAndAdminPage.verifyFacilityName(facilityName);
  }
);

Then("user selects {string} checkbox", (units: string) => {
  FrequencyAndAdminPage.userSelectsRoomsCheckbox(units);
});

Then(
  "user verifies time {string} recorded in DB as per the hour {string} selected",
  (time: string, frequency: string) => {
    cy.window().then((win) => {
      const newDate = new Date(win.Date());
      let time = FrequencyAndAdminPage.calculateUtcTime(newDate);
      const timearr: any[] = time.split(",");
      let startTime = timearr[0];
      let endTime = timearr[1];
      cy.task("DATABASE", {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql:
          `Select *
          From "AdministrationSchedule" A
          INNER JOIN "TimeSchedule" T
          ON A."AdministrationScheduleId" = T."AdministrationScheduleId"
          Where A."CreatedDateTime" BETWEEN '` +
          startTime +
          `' AND '` +
          endTime +
          `'`,
        //Verifying the DB values with the values entered in the app
      }).then((result1: any) => {
        let match = /\d+/.exec(frequency);
        let extractedNumber;
        if (match) {
          extractedNumber = parseInt(match[0]);
          const timeArray = [];
          timeArray.push(time);
          let originalTime = new Date("2000-01-01 " + time);
          for (let i = 1; i < 24 / extractedNumber; i++) {
            originalTime.setHours(originalTime.getHours() + extractedNumber);
            let updatedTimeString = originalTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            timeArray.push(updatedTimeString);
          }
          for (let i = 0; i <= result1.rows.length - 1; i++) {
            expect(result1.rows[i].StartTime).to.equals(
              timeArray[timeArray.length - 1 - i]
            );
          }
        } else {
          extractedNumber = 1;
          const timeArray = [];
          timeArray.push(time);
          let originalTime = new Date("2000-01-01 " + time);
          for (let i = 1; i < 24 / extractedNumber; i++) {
            originalTime.setHours(originalTime.getHours() + extractedNumber);
            let updatedTimeString = originalTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            timeArray.push(updatedTimeString);
          }
          for (let i = 0; i <= result1.rows.length - 1; i++) {
            expect(result1.rows[i].StartTime).to.equals(
              timeArray[timeArray.length - 1 - i]
            );
          }
        }
      });
    });
  }
);
 
Then(
  "user search {string} and verify only particular name is displayed",
  (drugName: string) => {
    FrequencyAndAdminPage.drugNameDropDown.click();
    FrequencyAndAdminPage.drugNameDropDown
      .should("contain", "Search query here")
      .type(drugName);
  }
);

Then(
  "verify only {string} is displayed in the dropdown",
  (drugName: string) => {
    FrequencyAndAdminPage.drugDropDownValue
      .children("div")
      .eq(1)
      .children("div")
      .its("length")
      .should("eq", 1);
    FrequencyAndAdminPage.drugDropDownValue
      .children("div")
      .eq(1)
      .children("div")
      .should("contain", drugName);
  }
);

Then("verify {string} is displayed in the dropdown", (noOptions: string) => {
  FrequencyAndAdminPage.noOptions.should("contain", noOptions);
});

Then("user verifies the {string} of records in DB", (records: string) => {
  cy.window().then((win) => {
    const newDate = new Date(win.Date());
    let time = FrequencyAndAdminPage.calculateUtcTime(newDate);
    const timearr: any[] = time.split(",");
    let startTime = timearr[0];
    let endTime = timearr[1];
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `Select COUNT(*)
          From "ScheduleLocation"
          Where "CreatedDateTime" BETWEEN '` +
        startTime +
        `' AND '` +
        endTime +
        `'`,
    }).then((result: any) => {
      expect(result.rows[0].count).to.equals(records);
    });
  });
});
Then("user click on {string} Button", () => {
  FrequencyAndAdminPage.medicationTypeClearButton.click();
});

Then("dropdown text field should {string} highlighted with red border", () => {
  FrequencyAndAdminPage.textFieldBorder.should(
    "have.css",
    "border-color",
    "rgb(220, 53, 69)"
  );
});

Then(
  "{string} label should {string} highlighted with red border",
  (value: string) => {
    FrequencyAndAdminPage.labelHighlited.should("have.text", value);
    FrequencyAndAdminPage.labelHighlited.should(
      "have.css",
      "border-color",
      "rgb(220, 53, 69)"
    );
  }
);

Then(
  "validation should {string} displayed {string}",
  (st: string, value: string) => {
    if (st == "be") {
      FrequencyAndAdminPage.invalidMessage.contains(value).should("be.visible");
      FrequencyAndAdminPage.invalidMessage
        .contains(value)
        .should("have.css", "border-color", "rgb(220, 53, 69)");
    } else {
      FrequencyAndAdminPage.invalidMessage.contains(value).should("not.exist");
    }
  }
);

Then("user click on X Button on Drugname drop down", () => {
  cy.get("#ddlDrugName")
    .children("div")
    .children("div")
    .eq(1)
    .children("div")
    .eq(0)
    .click();
});

Then("user click on x Button on freqency", () => {
  FrequencyAndAdminPage.frequencyClearButton.click();
});

Then(
  "user selects value {string} from Duration dropdown field",
  (value: string) => {
    FrequencyAndAdminPage.selectValueFromDurationDropDown(value);
  }
);

Then("user click on X Button on Duration Type field", () => {
  FrequencyAndAdminPage.durationTypeClearButton.click();
});

Then("user click on X Button on Duration field", () => {
  FrequencyAndAdminPage.durationClearButton.click();
});

Then(
  "user enters the {string} in the start Time field",
  (startTime: string) => {
    FrequencyAndAdminPage.enterValuesInTimeFields(startTime, "StartTime", "");
  }
);

Then(
  "user enters the {string} and {string} in the start time and end time fields",
  (startTime: string, endTime: string) => {
    FrequencyAndAdminPage.enterValuesInTimeFields(startTime, "StartTime", "");
    FrequencyAndAdminPage.enterValuesInTimeFields(endTime, "EndTime", "");
  }
);

Then("user enters the {string} in the end Time field", (endTime: string) => {
  FrequencyAndAdminPage.enterValuesInTimeFields(endTime, "EndTime", "");
});

Then(
  "User verifies saved values for {string} and {string} for Daily in database",
  (startTimeOnUI: string, endTimeOnUI: string) => {
    cy.window().then((win) => {
      const newDate = new Date(win.Date());
      let time = FrequencyAndAdminPage.calculateUtcTime(newDate);
      const timearr: any[] = time.split(",");
      let startTime = timearr[0];
      let endTime = timearr[1];
      cy.task("DATABASE", {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql:
          `Select *
            From "TimeSchedule"
            Where "CreatedDateTime" BETWEEN '` +
          startTime +
          `' AND '` +
          endTime +
          `'`,
        //Verifying the DB values with the values entered in the app
      }).then((result1: any) => {
        let arrayStartTime: string[] = startTimeOnUI.split(",");
        let arrayEndTime: string[] = endTimeOnUI.split(",");
        for (
          let resultArr = 0;
          resultArr <= result1.rows.length - 1;
          resultArr++
        ) {
          expect(result1.rows[resultArr].StartTime).to.equals(
            arrayStartTime[resultArr]
          );
          expect(result1.rows[resultArr].EndTime).to.equals(
            arrayEndTime[resultArr]
          );
        }
      });
    });
  }
);

Then(
  "user verify by default {string} value should be display on Every text field",
  (value: string) => {
    FrequencyAndAdminPage.ValueOnEveryField.should("have.text", value);
  }
);

Then("Hyperlinks should {string} highlighted with red border", () => {
  FrequencyAndAdminPage.chooseDays.should(
    "have.css",
    "border-color",
    "rgb(51, 51, 51)"
  );
});

Then(
  "week days text should {string} highlighted with red border",
  (value: string) => {
    FrequencyAndAdminPage.weekdaysError.should(
      "have.css",
      "border-color",
      "rgb(220, 53, 69)"
    );
  }
);

Then(
  "{string} label should {string} highlighted with red color",
  (value: string) => {
    FrequencyAndAdminPage.labelcolour.should(
      "have.css",
      "border-bottom-color",
      "rgb(51, 51, 51)"
    );
  }
);

Then("user selects {string} on Repeat tab", (value: string) => {
  FrequencyAndAdminPage.buttonChooseDays.click();
});

Then("all label text should {string} highlighted with red color", () => {
  FrequencyAndAdminPage.weekdaysError.should(
    "have.css",
    "border-color",
    "rgb(220, 53, 69)"
  );
});

Then("user click on sequence of dayof the month", () => {
  FrequencyAndAdminPage.sequenceDaysoftheMonth.not(":last").check();
});

Then("user selects {string} on Monthly section", (value: string) => {
  FrequencyAndAdminPage.ChooseMonth.should("have.text", value);
  FrequencyAndAdminPage.ChooseMonth.click();
});

Then("user selects {string} on choose section", () => {
  FrequencyAndAdminPage.chooseDaysofTheMonth.click();
});

Then(
  "verify {string} error message should {string} displayed",
  (value: string, error: string) => {
    if (error === "be") {
      FrequencyAndAdminPage.numberOfErrors.should("have.text", value);
    } else {
      FrequencyAndAdminPage.numberOfErrors.should("not.exist");
    }
  }
);

Then("verify {string} hyperlink", (hyperlink: string) => {
  FrequencyAndAdminPage.requiredFieldHyperlink
    .contains(hyperlink)
    .should("be.visible");
});

Then("click remove the Frequency selected from dropdown", () => {
  FrequencyAndAdminPage.clearFrequency.scrollIntoView().click();
});

Then("click on {string} hyperlink", (hyperlink: string) => {
  FrequencyAndAdminPage.requiredFieldHyperlink.scrollIntoView().click();
});

When("user closes the validation message", () => {
  FrequencyAndAdminPage.closeErrorMessage.click();
});

Then("remove the Medication type from dropdown", () => {
  FrequencyAndAdminPage.clearMedication.scrollIntoView().click();
});

Then("remove the added duration from the dropdown", () => {
  FrequencyAndAdminPage.removeDuration.click();
});

Then("{string} Field should be blank", (labelText: string) => {
  FrequencyAndAdminPage.verifytextfieldValue;
});

Then("user checks {string} should be not selected", (Months: string) => {
  const Month = Months.split(",");
  Month.forEach((ele: any) =>
    cy.get('[name="' + ele + '"]').should("not.be.checked")
  );
});

Then("choose {string}", (chooseDays: string) => {
  const days = chooseDays.split(",");
  days.forEach((ele: string) =>
    FrequencyAndAdminPage.chooseCheckbox.contains(ele).click()
  );
});

Then("user focus and defocus on Time field", () => {
  FrequencyAndAdminPage.time1Field.click();
  FrequencyAndAdminPage.time1Field.type("111");
  FrequencyAndAdminPage.time1Field.type("{enter}");
  FrequencyAndAdminPage.durationDropdown.click();
});

Then("user verifies the border color and label of the Time Field", () => {
  FrequencyAndAdminPage.time1Field.should(
    "have.css",
    "border-bottom-color",
    "rgb(220, 53, 69)"
  );
  FrequencyAndAdminPage.label
    .contains("Time 1")
    .should("have.css", "color", "rgb(220, 53, 69)");
});

Then("user enter valid value in time field", () => {
  FrequencyAndAdminPage.time1Field.click();
  FrequencyAndAdminPage.time1Field.clear();
  FrequencyAndAdminPage.time1Field.type("10:45 AM");
  FrequencyAndAdminPage.time1Field.type("{enter}");
  FrequencyAndAdminPage.time1Field.should(
    "have.css",
    "border-bottom-color",
    "rgb(136, 136, 136)"
  );
  FrequencyAndAdminPage.label
    .contains("Time 1")
    .should("have.css", "color", "rgb(51, 51, 51)");
});

Then("user enters same values for two time fields", () => {
  FrequencyAndAdminPage.time1Field.click();
  FrequencyAndAdminPage.time1Field.clear();
  FrequencyAndAdminPage.time1Field.type("10:45 AM");
  FrequencyAndAdminPage.time1Field.type("{enter}");
  FrequencyAndAdminPage.time2Field.click();
  FrequencyAndAdminPage.time2Field.clear();
  FrequencyAndAdminPage.time2Field.type("10:45 AM");
  FrequencyAndAdminPage.time2Field.type("{enter}");
});

Then("user enter valid value in 3rd time field", () => {
  FrequencyAndAdminPage.time3Field.click();
  FrequencyAndAdminPage.time3Field.clear();
  FrequencyAndAdminPage.time3Field.type("11:45 AM");
  FrequencyAndAdminPage.time3Field.type("{enter}");
});

Then("user verifies 31 dates in the calendar", () => {
  let btnCount;
  FrequencyAndAdminPage.calendar.find("button").then((num) => {
    btnCount = Cypress.$(num).length;
    expect(btnCount).to.eq(31);
  });
});

Then("user verifies that Select Cycle dropdown is displayed", () => {
  FrequencyAndAdminPage.selectCycleDropDown.should("be.visible");
});

Then("user verifies the list of Select cycle dropdown", () => {
  FrequencyAndAdminPage.verifySelectCycleDropdownList();
});

When("user selects {string} from select cycle dropdown", (cycle: string) => {
  FrequencyAndAdminPage.selectCycleFromDropDown(cycle);
});

Then(
  "label {string} and field border should be highlighted red",
  (val: string) => {
    FrequencyAndAdminPage.labelHighlited
      .contains(val)
      .should("have.css", "border-color", "rgb(220, 53, 69)");
    cy.get('[class^="input-field-select ' + val + '__control"]').should(
      "have.css",
      "border-color",
      "rgb(220, 53, 69)"
    );
  }
);

Then("user click on x Button on Medication Type", () => {
  cy.get(".Type__clear-indicator").eq(1).click();
});

Then("user clicks on Select Months dropdown", () => {
  FrequencyAndAdminPage.selectMonthdropDown.click();
});

Then("user click on Days drop down in Every Months Tab", () => {
  FrequencyAndAdminPage.everyMonthsTabContent.find(".Days__control").click();
});

Then("user click on Days drop down in Select Months Tab", () => {
  FrequencyAndAdminPage.selectMonthsTabContent.find(".Days__control").click();
});

Then("user clicks on Weeks of the Month drop down in Every Months Tab", () => {
  FrequencyAndAdminPage.everyMonthsTabContent.find(".Month__control").click();
});

Then("user clicks on Weeks of the Month drop down in Select Months Tab", () => {
  FrequencyAndAdminPage.selectMonthsTabContent.find(".Month__control").click();
});

Then("user selects dates {string} form the calendar", (chooseDays: any) => {
  const days = chooseDays.split(",");
  days.forEach((ele: any) =>
    FrequencyAndAdminPage.selectCalendar.find("button").contains(ele).click()
  );
});

Then("user select {string} tab in Monthly", (everyMonth: string) => {
  FrequencyAndAdminPage.everyMonthTab.contains(everyMonth).click();
});

Then("user checks {string} should be not checked", (months: string) => {
  FrequencyAndAdminPage.monthCheckbox.should("not.be.checked");
});

Then(
  "user selects Frequency and verifies the number of Time fields in Daiy section",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.verifyTimeFieldsCount(row.frequency, row.count);
    });
  }
);

Then(
  "user validates the Time field with 24 hour format",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.validationOfTimeFieldIn24HrFormat(
        row.time,
        row.values,
        row.exactTime
      );
    });
  }
);

Then("user clicks on {string} tab", (tab: string) => {
  cy.get(".nav-link").contains(tab).click();
});

Then(
  "verify {string} repeats is enabled and other repeats is disabled",
  (repeats: string) => {
    if (repeats === "Weekly") {
      FrequencyAndAdminPage.dailyButton.should("be.disabled");
      FrequencyAndAdminPage.cyclicalButton.should("be.disabled");
      FrequencyAndAdminPage.weeklyButton.should("be.enabled");
      FrequencyAndAdminPage.monthlyButton.should("be.disabled");
    } else if (repeats === "Monthly") {
      FrequencyAndAdminPage.dailyButton.should("be.disabled");
      FrequencyAndAdminPage.cyclicalButton.should("be.disabled");
      FrequencyAndAdminPage.weeklyButton.should("be.disabled");
      FrequencyAndAdminPage.monthlyButton.should("be.enabled");
    } else if (repeats === "Cyclical") {
      FrequencyAndAdminPage.dailyButton.should("be.disabled");
      FrequencyAndAdminPage.cyclicalButton.should("be.enabled");
      FrequencyAndAdminPage.weeklyButton.should("be.disabled");
      FrequencyAndAdminPage.monthlyButton.should("be.disabled");
    }
  }
);

Then("user check {string} from ChooseDays", (ChooseDays: string) => {
  if (ChooseDays !== "") {
    const Days = ChooseDays.split(",");
    Days.forEach((ele: string) =>
      FrequencyAndAdminPage.weeklyLinks.contains(ele.trim()).click()
    );
  }
});

Then("verify {string} checkboxes are disabled", (noOfCheckbox: number) => {
  FrequencyAndAdminPage.chooseDaysCheckbox
    .eq(noOfCheckbox)
    .should("be.disabled");
});

Then("verify all the checkboxes are enabled", () => {
  FrequencyAndAdminPage.chooseDaysCheckbox.should("not.be.disabled");
});

Then(
  "user select {string} date {string} from select dates",
  (noOfDate: string, ChooseDays: string) => {
    if (noOfDate === "one") {
      const days = ChooseDays.split(",");
      days.forEach((ele: any) =>
        FrequencyAndAdminPage.selectCalendar
          .find("button")
          .contains(ele)
          .click()
      );
    } else {
      const days = ChooseDays.split(",");
      days.forEach((ele: string) =>
        cy
          .get('[data-testid="' + ele + '"]')
          .should("have.not.class", "selected-day")
      );
    }
  }
);

Then(
  "verify {string} checkboxes of Month are disabled",
  (chooseDays: string) => {
    const days = chooseDays.split(",");
    days.forEach((ele: any) =>
      cy.get("[name=" + ele.trim() + "]").should("be.disabled")
    );
  }
);

Then("verify {string} field is dispalyed", (Timesfield: string) => {
  FrequencyAndAdminPage.timesPerDayTitle.should("have.text", Timesfield);
});

Then(
  "verify {string} and {string} message",
  (message: string, value: string) => {
    FrequencyAndAdminPage.permissibleRange.should("have.text", message);
    FrequencyAndAdminPage.timesPerDayRange.should("have.text", value);
  }
);

Then("enter value {string} in Times per Day field", (value: string) => {
  FrequencyAndAdminPage.timesPerDayField.clear().type(value);
});

Then("clear the value in Times per Day field", () => {
  FrequencyAndAdminPage.timesPerDayField.clear();
});

Then("verify {string} clock instance is dispalyed", (value: number) => {
  FrequencyAndAdminPage.timeFieldCount
    .should("have.length", value)
    .then(($items) => {
      expect($items).to.have.lengthOf(value);
    });
});

Then("Summary shows {string}", (summaryText: string) => {
  FrequencyAndAdminPage.summaryText.contains(summaryText);
});

Then(
  "the user enters {string} Give Days and {string} Do Not Give Days",
  (give: string, doNotGive: string) => {
    FrequencyAndAdminPage.giveContainer.type(give);
    cy.get("input").realPress("Tab");
    FrequencyAndAdminPage.doNotGiveContainer.type(doNotGive);
    cy.get("input").realPress("Tab");
  }
);

When(
  "the user enters {string} in the {string} field",
  (value: string, fieldName: string) => {
    cy.get("#" + fieldName).type(value);
  }
);

Then("the user enters {string} in the Times Per Day", (value: string) => {
  FrequencyAndAdminPage.txtTimesPerDay.clear().type(value);
});

Then(
  "user selects the following in the {string}",
  (ddl: string, dataTable: DataTable) => {
    var element;
    if (ddl == "Select Months")
      element = FrequencyAndAdminPage.selectMonthdropDown;
    else if (ddl == "Weeks of the Month")
      element = FrequencyAndAdminPage.weeksOfTheMonthDropDown;
    else if (ddl == "Days") element = FrequencyAndAdminPage.daysDropDown;
    dataTable.hashes().forEach((row: any) => {
      element.type(row.values);
      cy.get("input").realPress("Tab");
    });
  }
);

Then("user selects {string} in the Every Months ddl", (value: string) => {
  FrequencyAndAdminPage.everyMonthDropDownValue.type(value);
  cy.get("input").realPress("Tab");
});

Then(
  "user clicks the following in the Select Dates calendar",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      FrequencyAndAdminPage.selectCalendar
        .find('[data-testid="' + row.values + '"]')
        .click();
    });
  }
);

Then("the user click on Cancel button", () => {
  FrequencyAndAdminPage.cancelButton.click();
});

Then("User click on back Button", () => {
  FrequencyAndAdminPage.backButton.click();
});

Then("there is a validation message {string} displayed", (text: string) => {
  FrequencyAndAdminPage.invalidMessage.contains(text);
});

Then("the user enters {string} in Specify Minutes", (minutes: string) => {
  FrequencyAndAdminPage.txtSpecifyMinutes.clear().type(minutes);
});

Then(
  "the Frequency ddl is selected as {string} in the Customize Scheduling Screen",
  (value: string) => {
    FrequencyAndAdminPage.frequencyDropDown.should("have.text", value);
  }
);

Then(
  /^the value of First Admin Date & Time and Calculated Last Admin Date & Time in the Customize Scheduling screen is same as Order Details tab$/,
  () => {
    cy.scrollTo("bottom", { ensureScrollable: false });
    FrequencyAndAdminPage.verifyAdminDateTimeWithOrderDetails();
  }
);

Then(
  /^the Calculated Last Admin Date & Time is same as First Admin Date & Time in the Customize Scheduling screen$/,
  () => {
    FrequencyAndAdminPage.txtFirstAdminDateTime.invoke("val").then((startDate: any) => { 
      
      FrequencyAndAdminPage.txtLastAdminDateTime
        .invoke("val")
        .then((value: any) => {
          expect(value).to.equal(startDate);
          cy.wrap(value).as("lastAdminDateTimeCustomizeScheduling");
        });
    });
  }
);

Then("the user clicks the {string} checkbox in the Customize Scheduling Screen", (checkboxName: string) => {
  cy.contains("label", checkboxName).first()
    .siblings("input[type=checkbox]")
    .click({ force: true });
});

Then("the {string} checkbox is checked in the Customize Scheduling Screen", (checkboxName: string) => {
  cy.contains("label", checkboxName).first()
    // this will get checkbox input
    .siblings("input[type=checkbox]")
    .should("be.checked");
});

Then("the {string} checkbox is unchecked in the Customize Scheduling Screen", (checkboxName: string) => {
  cy.contains("label", checkboxName).first()
    // this will get checkbox input
    .siblings("input[type=checkbox]")
    .should("not.be.checked");
});



When(/^the user clicks the PRN checkbox in the Customize Scheduling Screen$/, (  ) =>{
  FrequencyAndAdminPage.chboxPRN.click();
} );



When(/^the user clicks the Open Ended checkbox in the Customize Scheduling Screen$/, (  ) =>{
  FrequencyAndAdminPage.chboxOpenEnded.click();
} );

When("user selects Frequency {string} from dropdown", (frequency: string) => {
  FrequencyAndAdminPage.selectFrequencyFromDropDown(frequency);
});

Then("enter value {string} in Specify Minutes field",(value:string)=>{
  FrequencyAndAdminPage.minutesTextField.clear().type(value);
})

Then ("clear the value in Specify Minutes field",()=>{
  FrequencyAndAdminPage.minutesTextField.clear();
})

Then ("verify {string} and {string} text",(message: string, value: string)=>{
  FrequencyAndAdminPage.permissibleRangeforMinutes.should("have.text", message);
  FrequencyAndAdminPage.specifyMinutesRange.should("have.text", value);
})