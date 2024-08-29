import {
  Given,
  When,
  Then,
  DataTable
} from "@badeball/cypress-cucumber-preprocessor";
import FrequencyAndAdminPage from "../../pages/FrequencyAndAdminPage";
import FrequencyAndAdminSummaryPage from "../../pages/FrequencyAndAdminSummaryPage";
import { createMultipleFrequencyAndAdminRecords } from "../../api/frequencyAndAdminAPIS";
const envPAGE = require("../../env.config.json");

let frequencyData: any;
before(function () {
  cy.fixture('frequencyAndAdmin').then(function (data) {
    frequencyData = data
  })
})

let facilityID: any;
before(function () {
  cy.fixture('stockMedications').then(function (data) {
    facilityID = data
  })
})

Given("User clicks the first Administration Schedule", () => {
  FrequencyAndAdminSummaryPage.adminSchedule.first().click();
  cy.wait(2000)
})

Given("User clicks the second Administration Schedule", () => {
  FrequencyAndAdminSummaryPage.adminSchedule.eq(1).click();
  cy.wait(2000)
})

When("User creates Admin Schedule with repeats as given {string}", (repeats: string, dataTable: any) => {
  dataTable.hashes().forEach((row: any) => {
    if (repeats == "Daily") {
      FrequencyAndAdminPage.saveSchedule(row.frequency, row.orderTypeValue, row.medicationTypeValue, row.searchQuery, row.Unit, row.Room, row.prn)
      FrequencyAndAdminPage.saveDailyAdministrationSchedule(row.frequency, row.ChooseTime, row.Time, row.StartTime, row.EndTime);
      FrequencyAndAdminPage.saveDurationAndDurationType(row.Duration, row.DurationType)
      FrequencyAndAdminPage.toggledefaultButton(row.Status)
      FrequencyAndAdminPage.saveAdminAndSchedule();
    } else if (repeats == "Cyclical") {
      FrequencyAndAdminPage.saveSchedule(row.frequency, row.orderTypeValue, row.medicationTypeValue, row.searchQuery, row.Unit, row.Room, row.prn)
      FrequencyAndAdminPage.saveRepeats(repeats);
      FrequencyAndAdminPage.saveCyclicalAdministrationSchedule(row.CycleType, row.GiveDays, row.DonotGiveDays);
      FrequencyAndAdminPage.saveDailyAdministrationSchedule(row.frequency, row.ChooseTime, row.Time, row.StartTime, row.EndTime);
      FrequencyAndAdminPage.saveDurationAndDurationType(row.Duration, row.DurationType)
      FrequencyAndAdminPage.toggledefaultButton(row.Status)
      FrequencyAndAdminPage.saveAdminAndSchedule();
    } else if (repeats == "Weekly") {
      FrequencyAndAdminPage.saveSchedule(row.frequency, row.orderTypeValue, row.medicationTypeValue, row.searchQuery, row.Unit, row.Room, row.prn)
      FrequencyAndAdminPage.saveRepeats(repeats);
      FrequencyAndAdminPage.saveDailyAdministrationSchedule(row.frequency, row.ChooseTime, row.Time, row.StartTime, row.EndTime);
      FrequencyAndAdminSummaryPage.saveWeeklyAdministrationSchedule(row.EveryWeek, row.ChooseDays, row.ChooseTime);
      FrequencyAndAdminPage.saveDurationAndDurationType(row.Duration, row.DurationType)
      FrequencyAndAdminPage.toggledefaultButton(row.Status)
      FrequencyAndAdminPage.saveAdminAndSchedule();
    } else if (repeats == "Monthly") {
      FrequencyAndAdminPage.saveSchedule(row.frequency, row.orderTypeValue, row.medicationTypeValue, row.searchQuery, row.Unit, row.Room, row.prn)
      FrequencyAndAdminPage.saveRepeats(repeats);
      FrequencyAndAdminSummaryPage.saveMonthlyAdministration(row.TabSelection, row.ChooseDays, row.ChooseWeeks, row.Months, row.EveryMonth, row.Daysof, row.WeeksOfMonth)
      FrequencyAndAdminPage.saveDailyAdministrationSchedule(row.frequency, row.ChooseTime, row.Time, row.StartTime, row.EndTime);
      FrequencyAndAdminPage.saveDurationAndDurationType(row.Duration, row.DurationType)
      FrequencyAndAdminPage.toggledefaultButton(row.Status)
      FrequencyAndAdminPage.saveAdminAndSchedule();
    }
  })
})


Then("User types {string} character in text field", (searchQuery: string) => {
  cy.wait(1000)
  FrequencyAndAdminPage.searchText.clear().type(searchQuery + "{enter}");
  cy.wait(3000)
})

Then("User verifies the data with repeats as Daily", (dataTable: any) => {
  dataTable.hashes().forEach((row: any) => {
    FrequencyAndAdminSummaryPage.verifyValuesForSchedule(row.frequency, row.orderTypeValue, row.medicationTypeValue, row.searchQuery, row.Unit, row.Room)
    FrequencyAndAdminSummaryPage.verifyValuesForDailyAdministrationSchedule(row.ChooseTime, row.Time, row.StartTime, row.EndTime, row.Duration, row.DurationType);
  })
})

Then("User verifies the data with repeats as Cyclical", (dataTable: any) => {
  dataTable.hashes().forEach((row: any) => {
    FrequencyAndAdminSummaryPage.verifyValuesForSchedule(row.frequency, row.orderTypeValue, row.medicationTypeValue, row.searchQuery, row.Unit, row.Room)
    FrequencyAndAdminSummaryPage.verifyValuesForCyclicalAdministrationSchedule(row.CycleType, row.GiveDays, row.DonotGiveDays);
    FrequencyAndAdminSummaryPage.verifyValuesForDailyAdministrationSchedule(row.ChooseTime, row.Time, row.StartTime, row.EndTime, row.Duration, row.DurationType);
  })
})

Then("User cpatures the Administration Schedule ID from Url", () => {
  FrequencyAndAdminPage.getIDFromUrl()
})

Then("User deletes the created Admin schedule {string} from DB", (scheduleID: string) => {
  cy.window().then((win) => {
    const adminScheduleID: string = win.localStorage.getItem('adminScheduleID') ?? '';
    let allAdminScheduleID: any = []
    let deleteSchedule: string = ""
    if (scheduleID == '0')
      deleteSchedule = " = '" + adminScheduleID
    else
      deleteSchedule = " != '" + scheduleID

    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `DELETE FROM public."ScheduleLocation" where "AdministrationScheduleId"` + deleteSchedule + `';`
    }).then(() => {
      cy.task("DATABASE", {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql:
          `DELETE FROM public."MonthlySchedule" where "AdministrationScheduleId"` + deleteSchedule + `';`
      })
    }).then(() => {
      cy.task("DATABASE", {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql:
          `DELETE FROM public."WeeklySchedule" where "AdministrationScheduleId"` + deleteSchedule + `';`
      })
    }).then(() => {
      cy.task("DATABASE", {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql:
          `DELETE FROM public."TimeSchedule" where "AdministrationScheduleId"` + deleteSchedule + `';`
      })
    }).then(() => {
      cy.task("DATABASE", {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql:
          `DELETE FROM public."AdministrationSchedule" where "AdministrationScheduleId"` + deleteSchedule + `';`
      })
    }).then((result: any) => {
      let totalRows = result.rows.length;
      for (let rowCount = 0; rowCount < totalRows; rowCount++) {
        allAdminScheduleID.push(result.rows[rowCount].AdministrationScheduleId);
      }
      cy.wrap(allAdminScheduleID).should('not.include', adminScheduleID);
    })
  })
})

Then("verifies {string} button {string} visible", (btnText: string, visibility: string) => {
  FrequencyAndAdminPage.btnIsVisible(btnText, visibility);
})

Then("the user verifies the record {string} visible in DB", (text: string) => {
  cy.window().then((win) => {
    const adminScheduleID: string = win.localStorage.getItem('adminScheduleID') ?? '';
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `SELECT * FROM public."AdministrationSchedule" where "AdministrationScheduleId" = '` + adminScheduleID + `';`
    }).then((result: any) => {
      let totalRows = result.rows.length;
      if (text === 'is not') {
        cy.wrap(totalRows).should('eq', 0);
      }
      else {
        cy.wrap(totalRows).should('eq', 1);
      }
    })
  })
})

Then("user verifies {string} is visible", (popupText: string) => {
  FrequencyAndAdminPage.verifyDeletePopup(popupText)
})

Then("user is redirected to Admin summary page", () => {
  cy.url().should('include', 'schedule-list');
})

Then("the user will click on {string} button", () => {
  FrequencyAndAdminPage.deleteBtn.last().click();
})

Then("user verifies message as {string}", (textMessage: string) => {
  FrequencyAndAdminPage.toastMessage.should('have.text', textMessage)
})

Then("user verifies {string} message", (textMessage: string) => {
  FrequencyAndAdminPage.noMatchesFound.should('have.text', textMessage)
})

Then("the user will click on Cancel button", () => {
  FrequencyAndAdminPage.cancelBtn.last().click();
})

Then("Schedule exists on the summary page", () => {
  FrequencyAndAdminPage.scheduleCheckbox.should('exist');
})

Then("Schedule exists on the edit schedule page", () => {
  cy.url().should('include', 'edit-schedule');
})

Then("user verifies pagination block is displayed", () => {
  FrequencyAndAdminSummaryPage.paginationBlock.should('be.visible')
})

Then("User verifies the data with repeats as Weekly", (dataTable: any) => {
  dataTable.hashes().forEach((row: any) => {
    FrequencyAndAdminSummaryPage.verifyValuesForSchedule(row.frequency,row.orderTypeValue, row.medicationTypeValue, row.searchQuery, row.Unit, row.Room)
    FrequencyAndAdminSummaryPage.verifyValuesForWeeklyAdministrationSchedule(row.EveryWeek, row.ChooseDays, row.ChooseTime)
    FrequencyAndAdminSummaryPage.verifyValuesForDailyAdministrationSchedule(row.ChooseTime, row.Time, row.StartTime, row.EndTime, row.Duration, row.DurationType);

  })
})

Then("User verifies the data with repeats as Monthly", (dataTable: any) => {
  dataTable.hashes().forEach((row: any) => {
    FrequencyAndAdminSummaryPage.verifyValuesForSchedule(row.frequency,row.orderTypeValue, row.medicationTypeValue, row.searchQuery, row.Unit, row.Room)
    FrequencyAndAdminSummaryPage.verifyValuesForDailyAdministrationSchedule(row.ChooseTime, row.Time, row.StartTime, row.EndTime, row.Duration, row.DurationType);
    FrequencyAndAdminSummaryPage.verifyValuesForMonthlyTab(row.TabSelection, row.ChooseDays, row.ChooseWeeks, row.Months, row.EveryMonth, row.Daysof, row.WeeksOfMonth)
  })
})

Then("user verifies Search field is displayed", () => {
  FrequencyAndAdminSummaryPage.searchTextBox.should('be.visible')
})

Then("user verify data of all the columns in summary grid", (dataTable: any) => {
  dataTable.hashes().forEach((row: any) => {
    FrequencyAndAdminSummaryPage.gridCheckboxColumn.should('be.visible')
    FrequencyAndAdminSummaryPage.gridFrequencyColumn.contains(row.frequency)
    FrequencyAndAdminSummaryPage.gridAdminScheduleColumn.invoke('text').then((text) => {
      expect(text.trim()).to.eq(String(row.adminSchedule))
    })
    FrequencyAndAdminSummaryPage.gridOrderTypeColumn.invoke('text').then((text) => {
      expect(text).to.eq(String(row.orderType))
    })
    FrequencyAndAdminSummaryPage.gridAssignedToColumn.contains(row.assignedTo)
  })
})

Then("user creates multiple records for FAS through API", () => {
  cy.window().then((win) => {
    createMultipleFrequencyAndAdminRecords()
  })
})

When("the user clicks on the arrow button next to {string} column", (columnName: string) => {
  FrequencyAndAdminPage.frequencyColumn.contains(columnName).children('[data-testid="sort-administration-schedules"]').click();
})

Then("user search for following name {string}", (search: string) => {
  FrequencyAndAdminPage.searchTxt.clear().click().type(search).type('{enter}');
  cy.wait(1000)
})

Then("searched result  should contain {string} in the table", (search: string) => {
  FrequencyAndAdminPage.searchedResult.then(($value) => {
    const getText = $value.text()
    console.log(getText);
    expect(getText).to.contains(search);
  });
})

Then("searched result should display as {string}", (noResult: string) => {
  FrequencyAndAdminPage.noResultsFound.should('have.text', noResult);
})

Then("verify {string} navigation arrow is {string}", (navigationArrow: string, value: string) => {
  if (navigationArrow == 'previous' && value == 'disabled') {
    FrequencyAndAdminPage.previousArrow.should('have.class', 'disabled')
  }
  if (navigationArrow == 'first' && value == 'disabled') {
    FrequencyAndAdminPage.firstArrow.should('have.class', 'disabled')
  }
  if (navigationArrow == 'previous' && value == 'enabled') {
    FrequencyAndAdminPage.previousArrow.should('not.have.class', 'disabled');
  }
  if (navigationArrow == 'first' && value == 'enabled') {
    FrequencyAndAdminPage.firstArrow.should('not.have.class', 'disabled');
  }
  if (navigationArrow == 'next' && value == 'disabled') {
    FrequencyAndAdminPage.nextArrow.parent('.page-item').should('have.class', 'disabled')
  }
  if (navigationArrow == 'last' && value == 'disabled') {
    FrequencyAndAdminPage.lastArrow.parent('.page-item').should('have.class', 'disabled')
  }
  if (navigationArrow == 'next' && value == 'enabled') {
    FrequencyAndAdminPage.nextArrow.parent('.page-item').should('not.have.class', 'disabled');
  }
  if (navigationArrow == 'last' && value == 'enabled') {
    FrequencyAndAdminPage.lastArrow.parent('.page-item').should('not.have.class', 'disabled');
  }
})

When("the user clicks on the first arrow in pagination", () => {
  FrequencyAndAdminPage.firstArrow.click();
})

Then("navigate to page {string} in pagination", (pagenumber: string) => {
  FrequencyAndAdminPage.pageNumber.contains(pagenumber).click();
})

Then("searched result  should contain {string} in frequency column", (search: string) => {
  FrequencyAndAdminPage.adminScheduleSearchResult.then(($value) => {
    const getText = $value.text()
    console.log(getText);
    expect(getText).to.contains(search);
  })
})

Then("remove the value entered in search field", () => {
  FrequencyAndAdminPage.searchTxt.clear().type('{enter}');
  cy.wait(1000)
})

Then("sort order of Frequency should be {string}", (value: string) => {
  FrequencyAndAdminSummaryPage.verifyTableSorting(FrequencyAndAdminPage.frequencyColumn, value)
})

Then("sort order of Administration should be {string}", (value: string) => {
  FrequencyAndAdminSummaryPage.verifyTableSorting(FrequencyAndAdminPage.adminScheduleColumn, value)
})

Then("sort order of Order Type should be {string}", (value: string) => {
  FrequencyAndAdminSummaryPage.verifyTableSorting(FrequencyAndAdminPage.orderTypeColumn, value)
})
Then("sort order of Assigned To should be {string}", (value: string) => {
  FrequencyAndAdminSummaryPage.verifyTableSorting(FrequencyAndAdminPage.assignedTo, value)
})

Then("User creates Admin Schedule with repeats {string} but does not save", (repeats: string, dataTable: any) => {
  dataTable.hashes().forEach((row: any) => {
    FrequencyAndAdminPage.saveSchedule(row.frequency, row.orderTypeValue, row.medicationTypeValue, row.searchQuery, row.Unit, row.Room, row.prn)
    FrequencyAndAdminPage.saveRepeats(repeats);
    FrequencyAndAdminPage.saveDailyAdministrationSchedule(row.frequency, row.ChooseTime, row.Time, row.StartTime, row.EndTime);
    FrequencyAndAdminSummaryPage.saveMonthlyAdministration(row.TabSelection, row.ChooseDays, row.ChooseWeeks, row.Months, row.EveryMonth, row.Daysof, row.WeeksOfMonth)
    FrequencyAndAdminPage.saveDurationAndDurationType(row.Duration, row.DurationType)
  })
})

Then("the user verifies {string} is visible", (popupText: string) => {
  FrequencyAndAdminPage.verifyCancelPopup(popupText)
})

Then("verify frequency column arrow is in upwards direction", () => {
  FrequencyAndAdminPage.upwardArrow.should("be.visible")
})

Then("verify frequency column arrow is in downards direction", () => {
  FrequencyAndAdminPage.downwardArrow.should("be.visible")
})

Then("user select {string} Record in the page", (count: number) => {
  for (let checkboxcount = 1; checkboxcount <= count; checkboxcount++) {
    cy.wait(2000)
    FrequencyAndAdminSummaryPage.checkBox.eq(checkboxcount).check()
  }
})

Then("user verifies the {string} messages on the popup", (message: string) => {
  FrequencyAndAdminSummaryPage.deletetext.should("have.text", message)
})

Then("selected Item should be deselected", () => {
  FrequencyAndAdminSummaryPage.checkBoxcount.should('not.be.checked')
})

Then("user click on X Button", () => {
  FrequencyAndAdminSummaryPage.crossButton.click()
})

Then("the user clicks on confirmation {string} button", () => {
  FrequencyAndAdminSummaryPage.deleteConfirmation.click()
})

Then("user able to see {string} total number of records in the grid", (value: number) => {
  FrequencyAndAdminSummaryPage.deletenumber.contains(value)
})

Then("the user clicks Next button on pagegrid", () => {
  FrequencyAndAdminSummaryPage.nextPage.click()
})

Then("user click on SelectAll checkbox", () => {
  FrequencyAndAdminSummaryPage.masterSelect.click()
})

Then("all checkboxes should be select", () => {
  FrequencyAndAdminSummaryPage.checkBox.should('be.checked')
})

Then("Verify checkbox should not be select", () => {
  FrequencyAndAdminSummaryPage.checkBox.should('not.be.checked')
})

Then("user navigate to previous page", () => {
  FrequencyAndAdminSummaryPage.firstPage.click()

})

Then("user is able to see {string} records in Summary page", (count: number) => {
  cy.wait(3000);
  cy.get("table").find('tr').its('length').then((rowCount) => {
    cy.log('Number of rows in the table: ' + rowCount);
    expect(rowCount - 1).to.be.eq(4);
  })
})

Then("user verifies the count {string} of records in DB", (records: string) => {
  cy.window().then((win) => {
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `Select COUNT(*)
          From "AdministrationSchedule"`
    }).then((result: any) => {
      expect(result.rows[0].count).to.equals(records)
    });
  })
})

Then("Delete Button should be {string} state", (value: string) => {
  FrequencyAndAdminSummaryPage.deleteButton.should('have.attr', value);
})

Then("Button should not be in {string} state", (state: string) => {
  FrequencyAndAdminSummaryPage.deleteButton.should('have.not.attr', state);
})

Then("user selects {string}", (frequencyCode: string) => {
  FrequencyAndAdminPage.frequencyTextBox.click()
  FrequencyAndAdminPage.frequencyTextBox.type(frequencyCode)
  cy.wait(500)
  FrequencyAndAdminPage.frequencyDropdownSelectFirstOption.contains(frequencyCode).click()
  cy.wait(500)
})

Then("user clicks on preset Tab", () => {
  FrequencyAndAdminSummaryPage.presetTab.click();
})

Then("verifies the {string} list of records present in Administration schedule table as per the selected {string}", (text: string, frequencyCode: string) => {
  let freqAdminSummaryFromDB: any = []

  cy.window().then((win) => {
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `SELECT "FrequencyCode", "Summary"
        FROM public."AdministrationSchedule" where "FrequencyCode" = '` + frequencyCode + `';`
    }).then((result: any) => {
      let totalRows = result.rows.length;
      for (let results = 0; results < totalRows; results++) {
        freqAdminSummaryFromDB.push(result.rows[results].Summary);
      }

      switch (text) {
        case "edited":
          if (freqAdminSummaryFromDB.length === 1) {
            FrequencyAndAdminSummaryPage.presetTabList.should('have.text', "No matches found")
          }
          else if (freqAdminSummaryFromDB.length > 1) {
            FrequencyAndAdminSummaryPage.verfiyPresetsData(freqAdminSummaryFromDB);
          }
          break;
        case "created":
          if (!freqAdminSummaryFromDB.length) {
            FrequencyAndAdminSummaryPage.presetTabList.should('have.text', "No matches found")
          }
          else {
            FrequencyAndAdminSummaryPage.verfiyPresetsData(freqAdminSummaryFromDB);
          }
          break;
      }
    })
  })
})

Then("presets tab should display {string}", (textMessage: string) => {
  FrequencyAndAdminSummaryPage.presetTabList.should('have.text', textMessage)
})

Then("user verify data of {string} in summary grid", (column: string) => {
  FrequencyAndAdminSummaryPage.gridOrderTypeColumn.contains(column)
})

Then("User verifies saved value for OrdeTypeDropdown {string} in database", (column: number) => {
  cy.window().then((win) => {
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `SELECT "AdministrationScheduleId", "FrequencyCode", "FrequencyCodeDescription", "Summary", "OrderType", "MedicationType", "FdbMedicationGroupId", "GcnSeqNo", "IsDefault", "IsPrn", "ScheduleType", "Duration", "DurationType", "FdbDrugId", "CreatedDateTime", "CreatedBy", "ModifiedDateTime", "ModifiedBy", "AssignedToSummary", "OrderTypeSummary"
        FROM public."AdministrationSchedule";`
    }).then((result: any) => {
      expect(result.rows[0].MedicationType).to.equals(Number(column));
    })
  });
})

Then("user updates the data and make the record unique and save", (dataTable: any) => {
  dataTable.hashes().forEach((row: any) => {
    FrequencyAndAdminPage.selectValueFromDropDown(row.DurationType)
    FrequencyAndAdminPage.button.contains("Save").click();
  });
})

Then("user verifies the Duplicate error message {string} is visible", (duplicateErrMsg: string) => {
  FrequencyAndAdminSummaryPage.verifyDuplicateErrorMsg(duplicateErrMsg)
})

Then("user verifies that search didn't happen with single character", () => {
  FrequencyAndAdminSummaryPage.paginationBlock.should('be.visible')
})

Then("searched result should contain {string} in the FAS table", (search: string) => {
  FrequencyAndAdminSummaryPage.verifySearchFunctionality(search)
})

Then("user click on Hyperlink", () => {
  FrequencyAndAdminSummaryPage.firstRecord.click()
})

Then("user click on Custom Tab", () => {
  FrequencyAndAdminSummaryPage.customTab.click()
})

Then("User select the Ordertype,Medication Type,Drug Name, Assigned To", (dataTable: any) => {
  dataTable.hashes().forEach((row: any) => {
    FrequencyAndAdminPage.saveSchedule(row.frequency, row.orderTypeValue, row.medicationTypeValue, row.searchQuery, row.Unit, row.Room, row.prn)
  })
})

Then("user is navigated to {string} page", (pageTitle: string) => {
  cy.contains(pageTitle).should('be.visible')
})

Then("user verifies that there is no record present in list page", () => {
  FrequencyAndAdminSummaryPage.noDataFound.contains('No matches found').should('be.visible')
})

Then("Days label should be highlighted with red color", () => {
  cy.get('.showLabel').contains('Days').should('have.css', 'color', 'rgb(220, 53, 69)')
})

Then("user focus and defocus all the specific Time fields and verify {string} error message", (errMsg: string) => {
  FrequencyAndAdminSummaryPage.verifySpecificTimeFieldErrorMessage(errMsg)
})

Then("user focus and defocus all the specific Time fields and verify duplicate error message", () => {
  FrequencyAndAdminSummaryPage.verifySpecificTimeFieldDuplicateErrorMessage()
})

Then("user focus and defocus all the Time Range fields and verify {string} error message", (errMsg: string) => {
  FrequencyAndAdminSummaryPage.verifyTimeRangeTimeFieldErrorMessage(errMsg)
})

When("user select Time Range radio button", () => {
  FrequencyAndAdminPage.radioButton.click()
})

Then("user focus and defocus all the Time Range fields and verify duplicate error message", () => {
  FrequencyAndAdminSummaryPage.verifyTimeRangeTimeFieldDuplicateErrorMessage()
})

Then("user verifies the summary description for {string} summary fields", (repeats: string, dataTable: DataTable) => {
  dataTable.hashes().forEach((row: any) => {
    let frequencyCode: string[] = frequencyData.frequencyCode.split("|")
    let num = frequencyCode.indexOf(row.frequency)
    let fCode: string[] = frequencyData.frequencyCodeDescription.split("|")
    let fCodeDesc = fCode.at(num)
    let orderTypeSummary: string = FrequencyAndAdminSummaryPage.orderTypeSummary(row.orderTypeValue, row.medicationTypeValue, row.searchQuery)
    let dailySummary: string = FrequencyAndAdminSummaryPage.dailySummary(row.frequency, row.ChooseTime, row.Time, row.StartTime, row.EndTime)
    let durationSummary: string = FrequencyAndAdminSummaryPage.durationSummary(row.Duration, row.DurationType)
    let AssignedToSummary: string = FrequencyAndAdminSummaryPage.assignToSummary(row.Unit, row.Room)
    let finalSummary: string = ""
    let cyclicalSummary: string = ""
    let weeklySummary: string = ""
    let monthlySummary: string = ""
    let prn: string = ""
    let dailySummaryPrefix: string = ""

    if (row.prn === "true") {
      prn = " as needed"
    }
    if (row.frequency.charAt(2) === "H") {
      dailySummaryPrefix = " starting at "
    } else {
      dailySummaryPrefix = " at "
    }

    switch (repeats) {
      case "Daily":
        finalSummary = fCodeDesc + dailySummaryPrefix + dailySummary + durationSummary + prn + "; " + orderTypeSummary + ";" + AssignedToSummary
        FrequencyAndAdminSummaryPage.adminSummaryLabel.invoke('text').should('eq', finalSummary)
        break;
      case "Cyclical":
        cyclicalSummary = FrequencyAndAdminSummaryPage.cyclicalSummary(row.CycleType, row.GiveDays, row.DonotGiveDays)
        finalSummary = fCodeDesc + cyclicalSummary + dailySummaryPrefix + dailySummary + durationSummary + prn + "; " + orderTypeSummary + ";" + AssignedToSummary
        FrequencyAndAdminSummaryPage.adminSummaryLabel.invoke('text').should('eq', finalSummary)
        break;
      case "Weekly":
        weeklySummary = FrequencyAndAdminSummaryPage.weeklySummary(row.EveryWeek, row.ChooseDays)
        finalSummary = fCodeDesc + weeklySummary + dailySummaryPrefix + dailySummary + durationSummary + prn + "; " + orderTypeSummary + ";" + AssignedToSummary
        FrequencyAndAdminSummaryPage.adminSummaryLabel.invoke('text').should('eq', finalSummary)
        break;
      case "Monthly":
        monthlySummary = FrequencyAndAdminSummaryPage.monthlySummary(row.TabSelection, row.Daysof, row.EveryMonth, row.ChooseDays, row.WeeksOfMonth, row.ChooseWeeks, row.Months)
        finalSummary = fCodeDesc + monthlySummary + dailySummaryPrefix + dailySummary + durationSummary + prn + "; " + orderTypeSummary + ";" + AssignedToSummary
        FrequencyAndAdminSummaryPage.adminSummaryLabel.invoke('text').should('eq', finalSummary)
        break;
    }
  })
})

Then("{string} pop up appears", (textMessage: string) => {
  FrequencyAndAdminSummaryPage.defaultPopupTitle.invoke('text').then((modalTitleText) => {
    expect(modalTitleText.trim()).to.equal(textMessage.trim());
  });
})

Then("user verifies the popup message for {string}", (time: string, dataTable: DataTable) => {
  dataTable.hashes().forEach((row: any) => {
    const message = "A default Administration Schedule already exists. Do you want to replace it to "
    if (/Q(24|1?\d|2H)/.test(row.frequency)) {
      FrequencyAndAdminSummaryPage.defaultPopupMessageTitle.invoke('text').then((modalTitleText) => {
        expect(modalTitleText.trim()).to.equal(message + "starting at " + time + "?");
      })
    }
    else {
      FrequencyAndAdminSummaryPage.defaultPopupMessageTitle.invoke('text').then((modalTitleText) => {
        expect(modalTitleText.trim()).to.equal(message + time + "?");
      })
    }
    FrequencyAndAdminSummaryPage.defaultPopupMessageContent.should('have.text', "Administration Schedule will be created as a default.")
  })
})

Then("User verifies the status as {string}", (status: string) => {
  FrequencyAndAdminPage.isDefaultStatus(status);
})

Then("Schedule exists on the add schedule page", () => {
  cy.url().should('include', 'add-schedule');
})

Then("user verifies the popup message for Location {string},{string}", (Location: string, time: string, dataTable: DataTable) => {
  dataTable.hashes().forEach((row: any) => {
    const message = "A default Administration Schedule already exists. Do you want to create a new default for "
    FrequencyAndAdminSummaryPage.defaultPopupMessageTitle.invoke('text').then((modalTitleText) => {
      expect(modalTitleText.trim()).to.equal(message + Location + " at " + time + "?");
    })
    FrequencyAndAdminSummaryPage.defaultPopupMessageContent.should('have.text', "Administration Schedule will be created as a default.")
  })
})

Then("verify the default icon {string} present", (icon: string) => {
  if (icon === "is") {
    FrequencyAndAdminSummaryPage.defaultIcon.first().should("be.visible")
  }
  else {
    FrequencyAndAdminSummaryPage.defaultIcon.should("not.exist")
  }
})

Then("User Verify {string} should be display", (options: string) => {
  FrequencyAndAdminSummaryPage.noOptions.should('have.text', options)
})

Then("Facility label should be highlighted with red color", () => {
  FrequencyAndAdminSummaryPage.facilityLabel.should('have.css', 'border-bottom-color', 'rgb(220, 53, 69)');
})

Then("user click on clear button", () => {
  FrequencyAndAdminSummaryPage.clearButton.click()
})

Then("user select {string} and it should be displayed in selected unit section", (data: string) => {
  FrequencyAndAdminSummaryPage.selectedUnits.contains(data)
})

Then("the user verifies {string} popup appears", (text: string) => {
  FrequencyAndAdminSummaryPage.header.should('have.text', text)
})

Then("user verify the {string} button is disabled", (button: string) => {
  if (button === "disabled") {
    FrequencyAndAdminSummaryPage.exportDroddown.should('have.attr', 'disabled')
  }
  else {
    FrequencyAndAdminSummaryPage.exportDroddown.should('not.have.attr', 'disabled')
  }
})

Then("user is able to see {string} Records in {string} facility", (freqAdmincount: number, facilityName : string) => {
  cy.window().then((win) => {
      cy.task("DATABASE", {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql:
          `SELECT COUNT(*)
          FROM public."AdministrationSchedule" 
          where "FacilityId" = '` + facilityID[facilityName] + `';`
      }).then((result: any) => {
        expect(result.rows[0].count).to.equals(freqAdmincount);
      })
    })
})

Then("user deletes the Admin schedule in the {string} facility in DB", (facilityName: string) => {
  cy.window().then((win) => {
    cy.task("DATABASE", {
      dbConfig: envPAGE.env.QADBPGADMIN,
      sql:
        `DELETE FROM public."TimeSchedule"`
    }).then(()=>{
      cy.task("DATABASE", {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql:
          `DELETE FROM public."AdministrationSchedule"
          where "FacilityId" = '` + facilityID[facilityName] + `';`
      })
    })
  })
})

Then("user Verify data of {string}",(location: number) => {
  FrequencyAndAdminSummaryPage.gridAssignedToColumn.contains(location)
})

Then("the user verifies {string}",(message: string) => {
  FrequencyAndAdminSummaryPage.inLineMessage.should('have.text', message)
})

Then("user verifies {string}",(message: string) => {
  FrequencyAndAdminSummaryPage.overrideMessage.should('have.text', message)
})

Then("User verify {string}",(message: string)=> {
 FrequencyAndAdminSummaryPage.assigenedMessage.should('have.text', message)
})

Then ("User able see {string}",(text:string)=>{
 FrequencyAndAdminSummaryPage.selectUnits.should('have.text', text)
})

Then ("user clicks on ClearAll Button",()=>{
  FrequencyAndAdminSummaryPage.clearAllButton.click()
})
Then("User verifies repeats for every minute",(dataTable: any)=>{
  dataTable.hashes().forEach((row: any) => {
    FrequencyAndAdminSummaryPage.verifyValuesForMinutesSchedule(row.frequency, row.unit, row.room, row.Duration,row.DurationType)
  })
})
