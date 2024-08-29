import { When, Then, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import orderWriterPage from "../../pages/OrderWriterPage";
let firstAdminDate: string;


Then(
  "the user navigates to the Order Writer Page with title {string}",
  (pageTitle: string) => {
    cy.url().should("include", "/cloud-orders/order-writer");
    orderWriterPage.OrderWriterTitle.contains(pageTitle).should("be.visible");
  }
);

Then(
  "the user navigates to the SNF Order Writer Page with title {string}",
  (pageTitle: string) => {
    cy.url().should("include", "isCustomOrder=true");
    orderWriterPage.OrderWriterTitle.contains(pageTitle).should("be.visible");
  }
);

Then(
  "the user navigates to the SNF General Order Page with title {string}",
  (pageTitle: string) => {
    cy.url().should("include", "ORDERGENERAL");
    orderWriterPage.OrderWriterTitle.contains(pageTitle).should("be.visible");
  }
);

Then(
  "the user navigates to the SNF Diagnostic Order Page with title {string}",
  (pageTitle: string) => {
    cy.url().should("include", "ancillaryOrder");
    orderWriterPage.OrderWriterTitle.contains(pageTitle).should("be.visible");
  }
);

Then(
  "the user navigates to the SNF Dietary Page with title {string}",
  (pageTitle: string) => {
    cy.url().should("include", "loadDietaryOrderScreen");
    orderWriterPage.OrderWriterTitle.contains(pageTitle).should("be.visible");
  }
);

Then(
  "the user navigates to the SNF Radiology Page with title {string}",
  (pageTitle: string) => {
    cy.url().should("include", "ORDERXRAYLAB");
    orderWriterPage.OrderWriterTitle.contains(pageTitle).should("be.visible");
  }
);

Then(
  "the user sees the pop window to add Order details with title {string}",
  (pageTitle: string) => {
    cy.get("h4").contains(pageTitle).should("be.visible");
  }
);

When("the user clicks the Cancel button", () => {
  cy.get(".btn.btn-cancel").click();
});

Then(
  "the user clicks the {string} link that navigates to customize scheduling sliding page",
  (link: string) => {
    cy.get(`[data-testid="btnCustomizeScheduling"]`).click();
  }
);
When(
  "Order details in the left panel with {string} medication name",
  (medName: string) => {
    orderWriterPage.medicationName.contains(medName);
    orderWriterPage.lblInstructions.should("be.visible");
    orderWriterPage.lblIcd10.should("be.visible");
    orderWriterPage.lblSchedule.should("be.visible");
    orderWriterPage.lblOrderBy.should("be.visible");
    orderWriterPage.lblOrderSource.should("be.visible");
  }
);

Then(
  /^the user observes that left panel and order status panel are sticky while scrolling the page (with|without)? order details$/,
  () => {
    cy.get("footer").scrollIntoView();
    cy.get("#stickynavigation-panel")
      .should("have.class", "sticky-top stickynavigation-panel")
      .scrollTo("top", { ensureScrollable: false });
    cy.get("#stickyside-panel")
      .should("have.class", "card sticky-top stickyside-panel")
      .scrollTo("right", { ensureScrollable: false });

    cy.get("header").scrollIntoView();
    cy.get("#stickyside-panel")
      .should("have.class", "card sticky-top stickyside-panel")
      .scrollTo("left", { ensureScrollable: false });
    cy.get("#stickynavigation-panel")
      .should("have.class", "sticky-top stickynavigation-panel")
      .scrollTo("top", { ensureScrollable: false });
  }
);

When("the user clicks on the sliding scale toggle button", () => {
  cy.get(`[data-testid='slidingScale']`).click();
});

When(
  "per sliding scale page shows where user fills with {string} header, body and footer details",
  (valueType: string, dataTable: DataTable) => {
    cy.get(".side-menu_content").should("be.visible");
    cy.get("#slidding_header > h4.modal-title").should(
      "have.text",
      "Per Sliding Scale"
    );
    if (cy.get("#chkLessThanCall").uncheck()) {
      //header by default uncheck
      cy.get("#txtLessThanCall1").should("be.disabled");
      cy.get("#ddLessThanCall").should("be.disabled");
    }
    orderWriterPage.verifyElementIsEnabled("#chkGreaterThanGive", "false"); //footer1 by default
    orderWriterPage.verifyElementIsEnabled("#txtGreaterThanGive1", "false");
    orderWriterPage.verifyElementIsEnabled("#txtGreaterThanGive2", "false");
    orderWriterPage.verifyElementIsEnabled("#chkGreaterThanCall", "false"); //footer2 by default
    orderWriterPage.verifyElementIsEnabled("#txtGreaterThanCall1", "false");
    orderWriterPage.verifyElementIsEnabled("#ddGreaterThanCall", "false");

    dataTable.hashes().forEach((row: any) => {
      cy.get("#chkLessThanCall").click();
      if (cy.get("#chkLessThanCall").check()) {
        orderWriterPage.verifyElementIsEnabled("#txtLessThanCall1", "true");
      }

      cy.get("#txtLessThanCall1").clear().type(row.headerValue1); //header Optional
      //error validation for header
      if (parseInt(row.headerValue1) > 800 || valueType == "invalid") {
        orderWriterPage.errorValidationOnTextField("LessThanCall0", valueType);
        cy.get("#txtLessThanCall1").clear();
        orderWriterPage.errorValidationOnTextField("LessThanCall0", valueType);
        cy.get("#txtLessThanCall1").clear().type(row.headerValue2);
      }
      orderWriterPage.verifyElementIsEnabled("#ddLessThanCall", "true");
      cy.get("#ddLessThanCall").select(row.selectOpt2);

      cy.get("#from0").clear().type(row.from0Value1); //mandatory body row 0 - error validation from0 Value
      if (parseInt(row.from0Value1) >= 800 || valueType == "invalid") {
        orderWriterPage.errorValidationOnTextField("from0", valueType);
        cy.get("#from0").clear();
        orderWriterPage.errorValidationOnTextField("from0", valueType);
        cy.get("#from0").clear().type(row.from0Value2);
      }
      cy.get("#to0").clear().type(row.to0Value1); //error validation to0 Value
      if (
        parseInt(row.to0Value1) < parseInt(row.from0Value2) ||
        valueType == "invalid"
      ) {
        orderWriterPage.errorValidationOnTextField("to0", valueType);
        cy.get("#to0").clear();
        orderWriterPage.errorValidationOnTextField("to0", valueType);
        cy.get("#to0").clear().type(row.to0Value2);
      }
      cy.get("#give0").type(row.give0Value1); //error validation give0 Value
      if (parseInt(row.give0Value1) > 200 || valueType == "invalid") {
        orderWriterPage.errorValidationOnTextField("give0", valueType);
        cy.get("#give0").clear();
        orderWriterPage.errorValidationOnTextField("give0", valueType);
        cy.get("#give0").clear().type(row.give0Value2);
      }
      if (valueType == "valid") {
        let fromvalue = row.to0Value1;
        fromvalue = ++fromvalue;
        if (cy.get(`button[aria-label='add']`).click()) {
          cy.get("#from0").should("be.disabled");
          cy.get("#to0").should("be.disabled");
          cy.get("#give0").should("be.disabled");
          cy.get("#from1").should("have.value", fromvalue); //additional body row 1
          cy.get("#from1").should("be.disabled");
          cy.get("#to1").clear().type(row.to1Value1);
          cy.get("#give1").clear().type(row.give1Value1);
        }
        fromvalue = row.to1Value1;
        fromvalue = ++fromvalue;
        if (cy.get(`button[aria-label='add']`).click()) {
          cy.get("#from0").should("be.disabled");
          cy.get("#to0").should("be.disabled");
          cy.get("#give0").should("be.disabled");
          cy.get("#from2").should("have.value", fromvalue); //additional body row 2
          cy.get("#from2").should("be.disabled");
          cy.get("#to2").clear().type(row.to2Value1);
          cy.get("#give2").clear().type(row.give2Value1);
        }
      }
      cy.get("#slidding_body").click();
      cy.get("#chkGreaterThanGive").click(); //footer1 Optional
      if (cy.get("#chkGreaterThanGive").should("be.checked")) {
        if (valueType == "valid") {
          cy.get("#txtGreaterThanGive1").should("have.value", row.to2Value1);
        } else {
          cy.get("#txtGreaterThanGive1").should("have.value", row.to0Value2);
        }
        cy.get("#txtGreaterThanGive2").type(row.footer1Give1);
        //error validation for footer1
        if (parseInt(row.footer1Give1) > 200) {
          orderWriterPage.errorValidationOnTextField(
            "GreaterThanGive1",
            valueType
          );
          cy.get("#txtGreaterThanGive2").clear().type(row.footer1Give2);
        }
      }
      if (valueType == "valid") {
        cy.get("#chkGreaterThanCall").click(); //footer2 Optional
        if (cy.get("#chkGreaterThanCall").should("be.checked")) {
          if (parseInt(row.to2Value1) >= parseInt(row.headerValue1)) {
            cy.get("#txtGreaterThanCall1").should("have.value", row.to2Value1);
          } else {
            cy.get("#txtGreaterThanCall1").should(
              "have.value",
              row.headerValue1
            );
          }
          cy.get("select#ddGreaterThanCall").select(row.selectOpt1);
        }
      }
    });
  }
);

Then(
  "the user clicks on confirm button to per sliding scale details on the order writer Page",
  () => {
    cy.get("#btnConfirm").click({ force: true });
    cy.get("[class^='col-md-12 mb-3']").should("be.visible");
  }
);

Then(
  "the user enters max blood Sugar and Give value in body which not allows adding new row option",
  (dataTable: DataTable) => {
    dataTable.hashes().forEach((row: any) => {
      let newValue = row.bloodSugar;
      cy.get("#to2").clear().type(row.bloodSugar);
      if (cy.get("#to2").should("have.value", 800)) {
        cy.get(`button[aria-label='add']`).should("not.be.visible");
        cy.get(`button[aria-label='delete']`).should("be.visible");
      }
      newValue = newValue - 100;
      cy.get("#to2").clear().type(newValue);
      cy.get("#give2").clear().type(row.give);
      if (cy.get("#give2").should("have.value", 200)) {
        cy.get(`button[aria-label='add']`).should("not.be.visible");
        cy.get(`button[aria-label='delete']`).should("be.visible");
      }
    });
  }
);

Then("the user clicks the delete icon button of body to delete a row", () => {
  cy.get("div.mt-4.ml-5 > div:nth-child(3)")
    .find(`button[aria-label='delete']`)
    .click({ force: true });
});

Then(
  "the user clicks first delete button to delete rows and clears data from mandatory body field",
  () => {
    cy.get(" div.mt-4.ml-5 > div:nth-child(1)")
      .find(`button[aria-label='delete']`)
      .click({ force: true });
    cy.get("div.mt-4.ml-5 > div:nth-child(1)")
      .find(".input-group")
      .should("not.have.value");
  }
);

Then(
  "the user selects a common instructions which displays in the left panel",
  () => {
    let instructionTxt: string, commonInstructionTxt: string;
    if (cy.get("#commonInstruction").should("exist")) {
      cy.get("[data-testid^='commonInstruction-item-0']").click();
      cy.get("#instructions-text")
        .invoke("text")
        .then((text1) => {
          text1.replace(/\s+/g, "");
          cy.get("#instructions-text").should("contain", text1);
        });
    }
  }
);

Then("the user sees on the left panel of the page under instructions", () => {
  cy.get("#instructions-text").should("be.visible");
  let instructionTxt: string, editPanelTxt: string;
  cy.get("#instructions-text")
    .invoke("text")
    .then((text1) => {
      instructionTxt = text1.replace(/\s+/g, "");
    });
  cy.get("#perSlidingEditPanel")
    .invoke("text")
    .then((text2) => {
      editPanelTxt = text2.replace(/\s+/g, "");
      expect(instructionTxt).to.include(editPanelTxt);
    });
});

When(
  "the user clicks on edit button on per sliding scale to edit values navigates to sliding scale window to {string}",
  (selectOption: string) => {
    cy.get("[aria-label^='edit']").click({ force: true });
    cy.get(".side-menu_content").should("be.visible");
    cy.get("select#ddGreaterThanCall").select(selectOption);
    cy.wait(1000);
  }
);

Then(
  "verify the warning message when user toggles the sliding scale button and selects {string}",
  (choice: string) => {
    let toggle_btn = "#slidingScale";
    (dataTable: DataTable) => {
      dataTable.hashes().forEach((row) => {
        cy.scrollTo("top", { ensureScrollable: false });
        if (row.choice == "No") {
          orderWriterPage.validateWarningMessaages(toggle_btn, choice);
          cy.get("#slidingScale").should("be.checked");
        } else if (row.choice == "Yes") {
          orderWriterPage.validateWarningMessaages(toggle_btn, choice);
          cy.get("#slidingScale").should("not.be.checked");
        }
      });
    };
  }
);

Then(
  "user clicks {string} after seeing a warning message when try to exit without saving the changes",
  (choice: string) => {
    let exitType: string;
    if (choice == "Yes") {
      exitType = "div[id='slidding_header'] button[type='button']";
      orderWriterPage.validateWarningMessaages(exitType, choice);
      cy.get(".side-menu_overlay").should("not.exist");
    } else if (choice == "No") {
      exitType = "div[id='slidding_header'] button[type='button']";
      orderWriterPage.validateWarningMessaages(exitType, choice);
      exitType = `[data-testid="cancelButton"]`;
      orderWriterPage.validateWarningMessaages(exitType, choice);
      exitType = "body";
      orderWriterPage.validateWarningMessaages(exitType, choice);
    }
  }
);

Then(
  /^the user sees for (discharge)? Order that the Primary Physician name in the Ordered by field for non-Physician user$/,
  (type: string) => {
    let physicianName = [];
    cy.get(".css-1dimb5e-singleValue")
      .invoke("text")
      .then((text) => {
        physicianName = text?.split(",");
      });
    if (physicianName && physicianName.length > 0) {
      if ((type = "discharge")) {
        let storephysicianName = localStorage.getItem(
          "storeDischargephysicianName"
        );
        expect(storephysicianName).include(physicianName);
        localStorage.setItem("storeDischargephysicianName", "");
      } else {
        cy.get("dd:nth-child(4) > a")
          .invoke("text")
          .should("include", physicianName[0]);
        cy.get("dd:nth-child(4) > a")
          .invoke("text")
          .should("include", physicianName[1]);
      }
    }
  }
);

Then(
  /^the user sees for  Order that the Physician name in the Ordered by field for Physician user$/,
  (type: string) => {
    let physicianName = [];
    cy.get(".css-1dimb5e-singleValue")
      .invoke("text")
      .then((text) => {
        physicianName = text?.split(",");
      });
    if (physicianName && physicianName.length > 0) {
      if ((type = "discharge")) {
        let storephysicianName = localStorage.getItem(
          "storeDischargephysicianName"
        );
        expect(storephysicianName).include(physicianName);
        localStorage.setItem("storeDischargephysicianName", "");
      } else {
        cy.get("#navbarUsernameMenu")
          .invoke("text")
          .should("include", physicianName[0]);
        cy.get("#navbarUsernameMenu")
          .invoke("text")
          .should("include", physicianName[1]);
      }
    }
  }
);

When("the user sees the Instructions section with all fields", () => {
  orderWriterPage.orderDetailsTitle.should("be.visible");
  orderWriterPage.instructionTitle.should("be.visible");
  orderWriterPage.lblInstOrderBy.should("be.visible");
  orderWriterPage.lblInstOrderSrc.should("be.visible");
  orderWriterPage.startDate.should("be.visible");
  orderWriterPage.endDate.should("be.visible");
  orderWriterPage.chkboxOpenEnded.should("be.visible");
  orderWriterPage.methodQueryDropdown.should("be.visible");
  orderWriterPage.routeQueryDropdown.should("be.visible");
  orderWriterPage.lblInstDosage.should("be.visible");
  orderWriterPage.txtInstDosage.should("be.visible");
  orderWriterPage.doseUnitQueryDropdown.should("be.visible");
  orderWriterPage.frequencyQueryDropdown.should("be.visible");
  orderWriterPage.chkboxInstPRN.should("be.visible");
  orderWriterPage.locationQueryDropdown.should("be.visible");
  orderWriterPage.lblInstDuration.should("be.visible");
  orderWriterPage.txtInstDuration.should("be.visible");
  orderWriterPage.durationTypeQueryDropdown.should("be.visible");
  orderWriterPage.chkboxInstfield.should("be.visible");
  orderWriterPage.indicationQueryDropdown.should("be.visible");
  orderWriterPage.lblAddInstructions.should("be.visible");
  orderWriterPage.txtAddInstructions.should("be.visible");
  orderWriterPage.lblMaxDailyDose.should("be.visible");
  orderWriterPage.txtMaxDailyDose.should("be.visible");
  orderWriterPage.lblInstDuration.should("be.visible");
  orderWriterPage.maxDailyDoseMeasureQueryDropdown.should("be.visible");
});

When(
  "the user enters the alphanumeric in the Additional Instruction field",
  () => {
    let strText =
      "This is the additional instructions to check the characters count in this field.";
    orderWriterPage.txtAddInstructions.type(strText);
    let textLength = strText.length;
    orderWriterPage.AddInstructionscount.contains(textLength);
  }
);

When(
  "the user observes the First Admin Date & Time shows current date by default",
  () => {
    const currentDate = new Date()
      .toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/,/, "");
    orderWriterPage.startDate.then(($value: any) => {
      const startDateValue = $value.attr("value");
      expect(startDateValue).to.equal(currentDate);
    });
  }
);

Then(
  "Open Ended checkbox is by default enabled then Calculated Last Admin Date & Time is disabled",
  () => {
    if (orderWriterPage.chkboxOpenEnded.should("be.checked")) {
      orderWriterPage.endDate.should("be.disabled");
      orderWriterPage.endDate.should("be.empty");
    }
  }
);

Then(
  "the user unchecked the Open Ended checkbox then Calculated Last Admin Date & Time is enabled and same as First Admin Date & Time",
  () => {
    if (orderWriterPage.chkboxOpenEnded.uncheck()) {
      orderWriterPage.endDate.should("be.enabled");

      orderWriterPage.startDate.then(($value: any) => {
        const startDateValue = $value.attr("value");
        orderWriterPage.endDate.then(($value: any) => {
          const endDateValue = $value.attr("value");
          expect(endDateValue).to.equal(startDateValue);
        });
      });
    }
  }
);

When(
  "the user chose the First Admin Date & Time and the Calculated Last Admin Date & Time and verify that Calculated Last Admin Date & Time is equal or greater than Start Date",
  () => {
    const currentDate = new Date()
      .toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/,/, "");
    if (orderWriterPage.chkboxOpenEnded.uncheck()) {
      orderWriterPage.endDate.should("be.enabled");
      //Verify 1: Start Date = current Date and End Date changed to current Date +5
      orderWriterPage.endDate.click();
      const date = new Date();
      date.setDate(date.getDate() + 5);
      const futureDate = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`;
      orderWriterPage.endDate
        .clear()
        .type(futureDate)
        .trigger("change", { force: true })
        .trigger("blur", { force: true });
      orderWriterPage.startDate.then(($value: any) => {
        const startDateValue = $value.attr("value");
        expect(startDateValue).to.equal(currentDate);
        orderWriterPage.endDate.then(($value: any) => {
          const endDateValue = $value.attr("value");
          expect(new Date(endDateValue)).to.greaterThan(
            new Date(startDateValue)
          );

          // Verify 2: End Date is current Date +5  and Start Date changed to End Date -3
          date.setDate(date.getDate() - 3);
          const previousDate = `${
            date.getMonth() + 1
          }/${date.getDate()}/${date.getFullYear()}`;
          orderWriterPage.startDate
            .clear()
            .type(previousDate)
            .trigger("change", { force: true })
            .trigger("blur", { force: true });
          orderWriterPage.startDate.then(($value: any) => {
            const startDateValue = $value.attr("value");
            expect(new Date(endDateValue)).to.greaterThan(
              new Date(startDateValue)
            );
          });
          // Verify 3: End Date is current Date +5  and Start Date changed to End Date
          date.setDate(date.getDate() + 3);
          const newDate = `${
            date.getMonth() + 1
          }/${date.getDate()}/${date.getFullYear()}`;
          orderWriterPage.startDate
            .clear()
            .type(newDate)
            .trigger("change", { force: true })
            .trigger("blur", { force: true });
          orderWriterPage.startDate.then(($value: any) => {
            const startDateValue = $value.attr("value");
            expect(endDateValue).to.equal(startDateValue);
          });
        });
      });
    }
  }
);

When(
  "the user observes that there is no DUR acknowlegement section if DUR icon {string} not present",
  (DURIcon: string) => {
    if (cy.get(`img[data-testid="image-${DURIcon}"]`).should("not.exist")) {
      orderWriterPage.durTitle.should("not.exist");
    }
  }
);

When(
  "the user observes that DUR acknowlegement section available if DUR icon {string} present",
  (DURIcon: string) => {
    if (cy.get(`img[data-testid="image-${DURIcon}"]`).should("exist")) {
      orderWriterPage.durTitle.should("exist");
    }
  }
);

When(
  "DUR section will show the severity alerts with count for the medication",
  () => {
    orderWriterPage.tabContraindiction.should("be.visible");
    orderWriterPage.tabContraindictionCount.should("be.visible");
    orderWriterPage.tabSevere.should("be.visible");
    orderWriterPage.tabSevereCount.should("be.visible");
    orderWriterPage.tabModerate.should("be.visible");
    orderWriterPage.tabModerateCount.should("be.visible");
    orderWriterPage.tabInformational.should("be.visible");
    orderWriterPage.tabInformationalCount.should("be.visible");
  }
);

When(
  "severity alert count is greater than 0 then shows the Alert Type and Alert Description",
  () => {
    cy.get("#tab1").then(($span) => {
      const value = Number.parseInt($span.text());
      if (value > 0) {
        orderWriterPage.tabContraindiction.click();
      }
    });
    cy.get("#tab3").then(($span) => {
      const value = Number.parseInt($span.text());
      if (value > 0) {
        orderWriterPage.tabModerate.click();
      }
    });
    cy.get("div.col-md-4 > h3").should("contain", "Alert Type");
    cy.get("div.col-md-4 > textarea").should("have.attr", "readonly");
    cy.get("div.col-md-8 > h3").should("contain", "Alert Description");
    cy.get("div.col-md-8 > textarea").should("have.attr", "readonly");
  }
);

When("the user chooses the single Common Override Reason from dropdown", () => {
  orderWriterPage.lblCommonReason.should("be.visible");
  orderWriterPage.dropdwnCommonReason
    .select(1)
    .invoke("val")
    .should("contain", "prescriber_aware")
    .then((text) => {
      cy.wrap(text).as("CommonReason");
    });
});

When(
  "checkbox for instructions required field is disabled to show mandatory fields with mandatory icons",
  () => {
    if (orderWriterPage.chkboxInstfield.uncheck()) {
      cy.get(".form-group.Method.input-required").should("be.visible");
      cy.get("div.form-group.Route.input-required").should("be.visible");
      cy.get("div.form-group.Dosage.input-required").should("be.visible");
      cy.get("div.form-group.Dose.Unit.input-required").should("be.visible");
      cy.get("div.form-group.Frequency.input-required").should("be.visible");
    }
  }
);

When(
  "checkbox for instructions required field is enabled to not to show mandatory icon of field",
  () => {
    if (orderWriterPage.chkboxInstfield.check()) {
      cy.get("div.form-group.Method.input-required").should("not.exist");
      cy.get("div.form-group.Route.input-required").should("not.exist");
      cy.get("div.form-group.Dosage.input-required").should("not.exist");
      cy.get("div.form-group.Dose.Unit.input-required").should("not.exist");
      cy.get("div.form-group.Frequency.input-required").should("not.exist");
    }
  }
);

When("the user sees that the Order Source field is a mandatory field", () => {
  if (orderWriterPage.chkboxInstfield.check()) {
    cy.get("div.form-group.Order.Source.input-required").should("exist");
  }
  if (orderWriterPage.chkboxInstfield.uncheck()) {
    cy.get("div.form-group.Order.Source.input-required").should("exist");
  }
});

Then(
  "the user verifies that the Order Source dropdown has default value as {string} and able to select any value from dropdown for Physician user",
  (physicianSourcevalue: string) => {
    orderWriterPage.orderSourceDropdown
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        expect(text).eq("Prescriber Entered");
      });
    for (let i = 0; i <= 3; i++) {
      orderWriterPage.orderSourceDropdown.click();
      cy.get(`#react-select-3-option-${i}`)
        .click()
        // .find(".css-1dimb5e-singleValue")
        .invoke("text")
        .then((text) => {
          cy.wrap(text)
            .as("orderSourceValue")
            .should("be.oneOf", [
              "Prescriber Entered",
              "Phone",
              "Verbal",
              "Written",
            ]);
        });
    }
  }
);

Then(
  "the user verifies that the Order Source dropdown is displayed with values and able to select a value from dropdown for non-Physician User",
  () => {
    orderWriterPage.orderSourceDropdown.should("be.visible");
    for (let i = 0; i < 3; i++) {
      orderWriterPage.orderSourceDropdown.click();
      cy.get(`#react-select-3-option-${i}`)
        .click()
        .invoke("text")
        .then((text) => {
          cy.wrap(text)
            .as("orderSourceValue")
            .should("be.oneOf", ["Phone", "Verbal", "Written"])
            .should("not.be.oneOf", ["Prescriber Entered"]);
        });
    }
  }
);

Then(
  "the user observes that left panel get updated with the selected value",
  () => {
    cy.get("@orderSourceValue").then((orderSourceValue) => {
      // cy.get(".css-1dimb5e-singleValue")
      //   .invoke("text")
      //   .should("eq", orderSourceValue);
      cy.get("#orderSource").next("div").should("have.text", orderSourceValue);
    });
  }
);

When(
  "the user clicks Next button to navigate to next section of the Order Writer Page",
  () => {
    orderWriterPage.btnNext.click();
  }
);

When(
  "the user clicks Previous button to navigate to previous section of the Order Writer Page",
  () => {
    orderWriterPage.btnPrevious.click();
  }
);

When(
  "the user clicks Save button to navigate to Save the Order Writer Page",
  () => {
    orderWriterPage.btnSave.click();
  }
);

When(
  "the user clicks Cancel button to navigate to cancel the Order Writer Page",
  () => {
    orderWriterPage.btnCancel.click();
  }
);

When("the user verifies the UI of the Diagnosis section on the page", () => {
  orderWriterPage.diagnosisTitle.then(($element) => {
    const title = $element.text();
    expect(title).equal("ICD-10 Diagnosis");
  });
  orderWriterPage.lblSearchDiagnosis.then(($element) => {
    const title = $element.text();
    expect(title).equal("ICD-10");
  });
  orderWriterPage.lblSelectedDiagnosis.then(($element) => {
    const title = $element.text();
    expect(title).equal("Selected ICD-10");
  });
});

Then(
  "the user observes the Active for Resident dropdown selected by default with another dropdown",
  () => {
    if (
      orderWriterPage.activeforResidentLeftDropdown.should(
        "have.value",
        "ActiveForResident"
      )
    ) {
      orderWriterPage.activeforResidentRightDropdown.should(
        "contain",
        "Select..."
      );
    }
  }
);

Then(
  "the user selects the Search All dropdown then shows all search dropdown",
  () => {
    if (orderWriterPage.searchDropdown.should("be.visible")) {
      orderWriterPage.searchAllLeftDropdown.should("have.value", "SearchAll");
      orderWriterPage.searchDropdown.select(1);
      orderWriterPage.searchAllRightDropdown.should(
        "contain",
        "Search query here"
      );
    }
  }
);

Then(
  "the user sees the option for selecting the active existing diagnosis of the Resident",
  () => {
    orderWriterPage.activeforResidentRightDropdown.should("be.visible");
    orderWriterPage.activeforResidentRightDropdown.click();
    orderWriterPage.activeforResidentRightDropdown.should("contain.value", "");
  }
);

Then(
  "user enter {string} on the right dropdown of active for resident to select existing diagnosis",
  (DiagnosisByCodeOrDesc: string) => {
    orderWriterPage.activeforResidentRightDropdown
      .type(DiagnosisByCodeOrDesc)
      .wait(2000)
      .get("#react-select-13-option-1")
      .click();
    cy.get("#react-select-13-placeholder").should("contain", "Select...");
  }
);

When(
  "the user enter {string} on the right dropdown to search and select a diagnosis",
  (DiagnosisByCodeOrDesc: string) => {
    orderWriterPage.searchAllRightDropdown
      .type(DiagnosisByCodeOrDesc)
      .wait(2000)
      .get("#react-select-14-option-0")
      .click();
    cy.get("#react-select-14-placeholder").should(
      "contain",
      "Search query here"
    );
  }
);

When(
  "the user sees the Selected Diagnosis under Selected ICD10 section with delete button",
  () => {
    orderWriterPage.DeleteDiagnosisButton.should("be.visible");
    orderWriterPage.selectedDiagnosiscode.should("be.visible");
    orderWriterPage.selectedDiagnosisDesc.should("be.visible");
  }
);

Then(
  "the left panel get updated with the selected Diagnosis with ICD10 code",
  () => {
    let selectedDiagnosisCode: string,
      selectedDiagnosisDesc: string,
      leftICD10: string;
    orderWriterPage.selectedDiagnosiscode
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        selectedDiagnosisCode = text;
      });
    orderWriterPage.selectedDiagnosisDesc
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        selectedDiagnosisDesc = text;
      });
    cy.get("#icd-10")
      .next("div")
      .invoke("text") //left panel ICD-10 Description
      .then((text) => {
        leftICD10 = text;
        let rightICD10 = selectedDiagnosisCode + " " + selectedDiagnosisDesc;
        expect(leftICD10).to.eq(rightICD10);
      });
  }
);

Then(
  "the user able to delete the selected diagnosis by delete button icon",
  () => {
    orderWriterPage.DeleteDiagnosisButton.click();
    orderWriterPage.selectedDiagnosiscode.should("not.exist");
    orderWriterPage.selectedDiagnosisDesc.should("not.exist");
    cy.get("#icd-10")
      .next("div")
      .invoke("text")
      .then((text) => {
        cy.wrap(text).as("ICD-10").should("be.empty");
      });
    //after deleting the diagnosis dropdown get reset to active for resident search feild dropdown
    cy.get("#react-select-13-placeholder,#react-select-15-placeholder").should(
      "contain",
      "Select..."
    );
  }
);

When(
  "the user clicks on the first common instruction under the 'Common Instructions' section",
  () => {
    cy.get('[data-testid="commonInstruction-container"]')
      .find('[data-testid^="commonInstruction-item-"]')
      .first()
      .invoke("text")
      .then((instructionText) => {
        cy.contains(instructionText.trim()).click();
        cy.wrap(instructionText.trim()).as("selectedInstruction");
      });
  }
);

Then(
  "the 'Instructions' field in the left panel is populated with the selected common instruction text",
  () => {
    cy.get("@selectedInstruction").then((expectedText) => {
      cy.get('[data-testid="instructions-text"]').should(
        "contain.text",
        expectedText
      );
    });
  }
);

When(
  "the user selects a different option from the {string} dropdown",
  (dropdownName) => {
    cy.get(`.ddl${dropdownName}.input-field-select__control`).click();
    cy.get(`.ddl${dropdownName}.input-field-select__menu`)
      .should("be.visible")
      .then(() => {
        cy.get(`.ddl${dropdownName}.input-field-select__single-value`)
          .invoke("text")
          .then((currentSelection) => {
            cy.get(
              `.ddl${dropdownName}.input-field-select__menu .ddl${dropdownName}.input-field-select__option`
            )
              .filter((index, element) => {
                const text = Cypress.$(element).text().trim();
                return text !== currentSelection && text !== "";
              })
              .first()
              .click();
          });
      });
  }
);

Then(
  "the 'Instructions' field in the left panel is updated according to the {string} selection",
  (dropdownTestId) => {
    cy.get(
      `[data-testid="ddl${dropdownTestId}"] .input-field-select__single-value`
    )
      .invoke("text")
      .then((currentSelectedText) => {
        const trimmedCurrentText = currentSelectedText.trim();
        cy.get('[data-testid="instructions-text"]').should(
          "contain.text",
          trimmedCurrentText
        );
      });
  }
);

Then(
  "the text in the {string} dropdown matches the 'Instructions' field in the left panel",
  (dropdownTestId) => {
    cy.get(
      `[data-testid="ddl${dropdownTestId}"] .input-field-select__single-value`
    )
      .invoke("text")
      .then((dropdownText) => {
        const trimmedDropdownText = dropdownText.trim();
        cy.get('[data-testid="instructions-text"]').should(
          "contain.text",
          trimmedDropdownText
        );
      });
  }
);

Then(
  "the {string} in the left hand panel shows {string}",
  (area: string, text: string) => {
    if (area == "Administration Schedule") {
      orderWriterPage.administrationScheduleLeftPanel.contains(text);
    } else if (area == "Additional Details") {
      orderWriterPage.additionalDetailsLeftPanel.contains(text);
    }
  }
);

When("the user clicks on the Additional Datails tab", () => {
  orderWriterPage.additionalDetailTab.click();
});

Then("the Pharmacy shows as {string}", (pharmacyName: string) => {
  orderWriterPage.pharmacyValueLbl.contains(pharmacyName);
});

Then("the user enters {string} for the eKit value", (value: string) => {
  orderWriterPage.ekitDosesTxt.type(value);
});

Then("the ekit value accepts {string}", (value: string) => {
  orderWriterPage.ekitDosesTxt.should("have.value", parseInt(value));
});

Then(
  "the user adds {string} in the Pharmacy Notes text area",
  (pharmacyNotesValue: string) => {
    orderWriterPage.pharmacyNotesTextAre.type(pharmacyNotesValue);
  }
);

Then(
  "the Administration Schedule in the Order Details tab shows {string}",
  (schedule: string) => {
    orderWriterPage.administrationScheduleOrderDetails.should(($element) => {
      const text = $element.text().replace(/\n/g, " ").trim();

      expect(text).to.equal(schedule);
    });
  }
);


When("user selects Frequency {string} from dropdown in the Order Details tab", ( frequency: string ) =>{
  orderWriterPage.selectFrequencyFromDropDown(frequency);
} );


When(/^the user notes the value of First Admin Date & Time and Calculated Last Admin Date & Time in the Order Details tab$/, (  ) =>{
  orderWriterPage.startDate.invoke("val").then((value) => {
    cy.wrap(value).as("firstAdminDateTimeOrderDetails");
  });
  orderWriterPage.endDate.invoke("val").then((value) => {
    cy.wrap(value).as("lastAdminDateTimeOrderDetails");
  });;
} );



Then(/^the value of First Admin Date & Time and Calculated Last Admin Date & Time in the Order Details tab is same as Customize Scheduling screen$/, (  ) =>{
  orderWriterPage.verifyAdminDateTimeWithCustomizeScheduling();
} );


Then(/^the value of First Admin Date & Time and Calculated Last Admin Date & Time in the left panel is same as Order Details tab$/, (  ) =>{
  orderWriterPage.verifyAdminDateTimeWithLeftPanel();
} );

