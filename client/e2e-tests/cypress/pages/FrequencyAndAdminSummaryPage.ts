import FrequencyAndAdminPage from "./FrequencyAndAdminPage"

let frequencyData: any;
before(function () {
    cy.fixture('frequencyAndAdmin').then(function (data) {
        frequencyData = data
    })
})
interface DuplicateCheck {
    [key: string]: string;
}
let duplicateErrorMsg: DuplicateCheck = {
    'The administration schedule already exists. The schedule must be unique.': '.alert'
};

class FrequencyAndAdminSummaryPage {

    //Locators
    get adminSchedule() { return cy.get('.administration-schedule-name') }
    get titleAddSchedule() { return cy.contains("Add Schedule") }
    get frequencyDropDown() { return cy.get('*[data-testid="ddlFrequency"]') }
    get masterSelectCheckBox() { return cy.get('#masterSelect') }
    get gridHeader() { return cy.get('th') }
    get paginationBlock() { return cy.get('[class="pagination pagination-md justify-content-end pagination"]') }
    get searchTextBox() { return cy.get('#txtSearch') }
    get gridCheckboxColumn() { return cy.get('tbody > :nth-child(1) > td:nth-child(1) > input[type="checkbox"]') }
    get gridFrequencyColumn() { return cy.get('[data-testid="administrationScheduleName"]') }
    get gridAdminScheduleColumn() { return cy.get('tr>td:nth-child(4)') }
    get gridOrderTypeColumn() { return cy.get('tr>td:nth-child(5)') }
    get gridAssignedToColumn() { return cy.get('tr>td:nth-child(6)') }
    get deleteButton() { return cy.get('.btn.btn-danger') }
    get checkBox() { return cy.get("tr>td>[type='checkbox']") }
    get deletetext() { return cy.get(".modal-body>p>b") }
    get checkBoxcount() { return cy.get("[type='checkbox']") }
    get crossButton() { return cy.get("#btnCloseModal") }
    get deleteConfirmation() { return cy.get('[data-testid="confirmDeleteButton"]') }
    get deletenumber() { return cy.get(".dataTables_info.justify-content-end") }
    get nextPage() { return cy.get('[data-testid="nextPage"]') }
    get masterSelect() { return cy.get('#masterSelect') }
    get firstPage() { return cy.get("[data-testid=firstPage]") }
    get presetTab() { return cy.get("#presetsTab") }
    get presetTabList() { return cy.get(".bg-freq-schedule-items-box>li") }
    get selectCycleValueSelected() { return cy.get('[class^="input-field-select Select Cycle__single-value"]') }
    get firstRecord() { return cy.get(":nth-child(1) > .presets-schedule-link:nth-child(1) > .presets-schedule-link") }
    get customTab() { return cy.get('[data-testid="customTab"]> span') }
    get showLabel() { return cy.get('.showLabel') }
    get startTimeFieldCount() { return cy.get('[id^="StartTime"]') }
    get endTimeFieldCount() { return cy.get('[id^="EndTime"]') }
    get startTime1Field() { return cy.get('#StartTime1') }
    get EndTime1Field() { return cy.get('#EndTime1') }
    get adminSummaryLabel() { return cy.get("#summary") }
    get noDataFound() { return cy.get('.no-data') }
    get defaultPopupTitle() { return cy.get("h4.modal-title") }
    get defaultPopupMessageTitle() { return cy.get("#messageTitle>b") }
    get defaultPopupMessageContent() { return cy.get("#messageContent") }
    get toggleStatus() { return cy.get('[data-testid="status"]') }
    get defaultIcon() { return cy.get('td > div > i') }
    get facilitytextfield() { return cy.get('.Facility__input-container') }
    get noOptions() { return cy.get('[class^="input-field-select Facility__menu-notice"]') }
    get facilityLabel() { return cy.get('.showLabel') }
    get clearButton() { return cy.get('.Facility__clear-indicator') }
    get selectedUnits() { return cy.get('.assigned-to-box>div') }
    get header() { return cy.get('.header') }
    get exportDroddown() { return cy.get('.export-disabled-item') }
    get dataTable() { return cy.get('.dataTables_info') }
    get inLineMessage() { return cy.get('.inline-message') }
    get overrideMessage() { return cy.get('[for="chkIsDefault"]') }
    get assigenedMessage() { return cy.get('h3>b') }
    get selectUnits() { return cy.get('div>b') }
    get clearAllButton() { return cy.get('#btnClearAll') }


    verifyValuesForSchedule(frequency: string,orderTypeValue: string, medicationTypeValue: string, searchQuery: string, unit: string, room: string) {
        //Frequency
        FrequencyAndAdminPage.frequencyTextField.should('have.text', frequency);
        
        //OrderType
        if (orderTypeValue == "") {
            FrequencyAndAdminPage.orderTypeTextField.should('have.text', "Select...");
        } else {
            FrequencyAndAdminPage.orderTypeTextField.should('have.text', orderTypeValue);
        }

        //Medication Type
        if (medicationTypeValue !== "") {
            FrequencyAndAdminPage.medicationTypeTextField.should('have.text', medicationTypeValue);
        }
        //DrugName/MedicationGroup
        if (searchQuery !== "") {
            FrequencyAndAdminPage.drugNameDropDown.should('have.text', searchQuery);
        }
        //Assigned to
        FrequencyAndAdminPage.verifyAssignedToLabel(unit, room)

    }

    verifyValuesForDailyAdministrationSchedule(ChooseTime: string, Time: string, StartTime: string, EndTime: string, Duration: string, DurationType: string) {
        //Verify the time
        if (ChooseTime == 'Specific Time') {
            FrequencyAndAdminPage.specificTimeRadioBtn.should('be.checked');
            FrequencyAndAdminPage.verifyValuesInTimeFields(Time, "Time")
        }
        else {
            FrequencyAndAdminPage.radioButton.should('be.checked');
            FrequencyAndAdminPage.verifyValuesInTimeFields(StartTime, "StartTime")
            FrequencyAndAdminPage.verifyValuesInTimeFields(EndTime, "EndTime")
        }

        //Duration
        FrequencyAndAdminPage.durationTextFieldValue.should('have.text', Duration);

        //Duration Type
        FrequencyAndAdminPage.durationTypeTextFieldValue.should('have.text', DurationType);
    }

    verifyValuesForCyclicalAdministrationSchedule(CycleType: string, GiveDays: string, DonotGiveDays: string) {
        //Select Repeats
        FrequencyAndAdminPage.cyclicalBtn.should('have.class', 'active');

        //Choose Cycle Type
        if (CycleType == "Custom Days") {
            this.selectCycleValueSelected.contains(CycleType).should('be.visible')
            //Select Give days
            FrequencyAndAdminPage.giveTextField.first().should('have.text', GiveDays);

            //Select Do not give days
            FrequencyAndAdminPage.donotGiveTextField.should('have.text', DonotGiveDays);
        }
        else {
            this.selectCycleValueSelected.contains(CycleType).should('be.visible')
        }
    }
    saveWeeklyAdministrationSchedule(EveryWeek: string, ChooseDays: string, ChooseTime: string) {
        FrequencyAndAdminPage.label.contains(ChooseTime).click()
        FrequencyAndAdminPage.everyWeekTextField.type(EveryWeek)
        FrequencyAndAdminPage.selectFirstDropdownValue.click();
        if (ChooseDays !== "") {
            const Days = ChooseDays.split(',')
            Days.forEach((ele: string) =>
                FrequencyAndAdminPage.weeklyLinks.contains(ele.trim()).click())
        }
    }

    verifyValuesForWeeklyAdministrationSchedule(EveryWeek: string, ChooseDays: string, ChooseTime: string) {
        FrequencyAndAdminPage.label.contains(ChooseTime).click()
        if (ChooseTime === 'Specific Time') {
            FrequencyAndAdminPage.ValueOnEveryField.should('have.text', EveryWeek);
            const days = ChooseDays.split(',')
            days.forEach((ele: any) =>
                cy.get("#" + ele).should('be.checked'))
        }
        else {
            FrequencyAndAdminPage.ValueOnEveryField.should('have.text', EveryWeek);
            const days = ChooseDays.split(',')
            days.forEach((ele: any) =>
                cy.get("#" + ele).should('be.checked'))

        }
    }

    verifyTableSorting(locator: any, value: string) {
        let frequency: any = [];
        let temp: any = [];

        FrequencyAndAdminPage.frequencyAdminTable.each(($row, rowIdx, rowArray) => {
            cy.wrap($row).within(() => {
                // e is the element capturing the mentioned column name
                locator.then((e: any) => {
                    frequency.push(e.text());

                    if (rowIdx === rowArray.length - 1) {
                        // Assign the value of array to another temporary array
                        temp = [...frequency];
                        temp.sort((firstValue: any, secondValue: any) => firstValue.toLowerCase() - secondValue.toLowerCase());

                        if (value === 'asc') {
                            for (let count = 0; count < frequency.length; count++) {
                                expect(frequency[count]).to.eq(temp[count]);
                            }
                        } else {
                            temp.sort((firstValue: any, secondValue: any) => secondValue.toLowerCase() - firstValue.toLowerCase());
                            for (let count = 0; count < frequency.length; count++) {
                                expect(frequency[count]).to.eq(temp[count]);
                            }
                        }
                    }
                });
            });
        })
    }

    saveMonthlyAdministrationSchedule(ChooseTime: string, Time: string, StartTime: string, EndTime: string, Daysof: string) {

        cy.contains("Monthly").click();
        FrequencyAndAdminPage.label.contains(ChooseTime).click()

        //Enter values in time field
        if (ChooseTime == 'Specific Time') {
            FrequencyAndAdminPage.enterValuesInTimeFields(Time, "Time", "")
        }
        else {
            FrequencyAndAdminPage.enterValuesInTimeFields(StartTime, "StartTime", "")
            FrequencyAndAdminPage.enterValuesInTimeFields(EndTime, "EndTime", "")
        }
        FrequencyAndAdminPage.label.contains(Daysof).click()
    }

    saveMonthlyAdministration(TabSelection: string, ChooseDays: string, ChooseWeeks: string, Months: string, EveryMonth: string, Daysof: string, WeeksOfMonth: string) {
        if (TabSelection === 'Every Months') {
            FrequencyAndAdminPage.everyMonthsTxtField.type(EveryMonth);
            FrequencyAndAdminPage.selectFirstDropdownValue.click();

            if (Daysof === 'Days of the Month') {
                const days = ChooseDays.split(',')
                days.forEach((ele: string) =>
                    FrequencyAndAdminPage.selectCalendar.find('button').contains(ele).click())
            }
            else {
                FrequencyAndAdminPage.selectRadioButton(Daysof)
                if (ChooseWeeks !== "") {
                    FrequencyAndAdminPage.everyMonthsTabContent.find(".Days__control").click()
                    const days = ChooseWeeks.split(',')
                    days.forEach((ele: string) =>
                        cy.get('[data-testid=' + ele.trim() + ']').contains(ele.trim()).click())
                }
                if (WeeksOfMonth !== "") {
                    FrequencyAndAdminPage.everyMonthsTabContent.find(".Month__control").click()
                    const day = WeeksOfMonth.split(',')
                    day.forEach((ele: string) =>
                        cy.get('[data-testid=' + ele.trim() + ']').contains(ele.trim()).click())
                }
            }
        }
        else {

            FrequencyAndAdminPage.selectMonthTab.contains(TabSelection).click()
            FrequencyAndAdminPage.selectMonthdropDown.click()
            const Month = Months.split(',')
            Month.forEach((ele: any) =>
                cy.get('[data-testid=' + ele.trim() + ']').scrollIntoView().contains(ele.trim()).click()
            )

            if (Daysof === 'Days of the Month') {
                const days = ChooseDays.split(',')
                days.forEach((ele: string) =>
                    FrequencyAndAdminPage.selectCalendar.find('button').contains(ele).click())
            }
            else {
                cy.wait(2000)
                FrequencyAndAdminPage.selectRadioButton(Daysof)
                FrequencyAndAdminPage.selectMonthsTabContent.find(".Days__control").click()
                const days = ChooseWeeks.split(',')
                days.forEach((ele: string) =>
                    cy.get('[data-testid=' + ele.trim() + ']').contains(ele.trim()).click())

                FrequencyAndAdminPage.selectMonthsTabContent.find(".Month__control").click()
                const day = WeeksOfMonth.split(',')
                day.forEach((ele: string) =>
                    cy.get('[data-testid=' + ele.trim() + ']').contains(ele.trim()).click())
            }
        }
    }

    svaeDurationAndDurationType(Duration: string, DurationType: string) {
        //Duration
        FrequencyAndAdminPage.selectValueFromDurationDropDown(Duration)

        //Duration Type
        FrequencyAndAdminPage.selectValueFromDropDown(DurationType)

        // this.label.contains(ChooseTime).click()
        FrequencyAndAdminPage.button.contains("Save").click();
    }

    verfiyPresetsData(freqAdminSummaryFromDB: string[]) {
        let freqAdminValuesFromPresetTab: string[] = [];
        this.presetTabList.should($els => {
            freqAdminValuesFromPresetTab = [...$els].map(el => el.innerText.trim())
        }).then(() => {
            cy.wrap(freqAdminValuesFromPresetTab).each((expectedItem, index) => {
                cy.wrap(freqAdminSummaryFromDB[index].replace(/\s+/g, ' ').trim()).should('eq', expectedItem);
            });
        })
    }

    verifyDuplicateErrorMsg(duplicateErrMsg: string) {
        const selector = duplicateErrorMsg[duplicateErrMsg] || '';
        cy.get(selector).should('have.text', duplicateErrMsg);
    }

    verifyValuesForMonthlyTab(TabSelection: string, ChooseDays: string, ChooseWeeks: string, Months: string, EveryMonth: string, Daysof: string, WeeksOfMonth: string) {
        if (TabSelection === 'Every Months') {
            FrequencyAndAdminPage.everyMonthTab.should('have.text', TabSelection);
            FrequencyAndAdminPage.everyMonthTxtField.should('have.text', EveryMonth);

            if (Daysof === 'Days of the Month') {
                const days = ChooseDays.split(',')
                days.forEach((ele: string) =>
                    cy.get('[data-testid="' + ele + '"]').should('have.class', 'selected-day'))
            }

            else {
                FrequencyAndAdminPage.everyMonthsTabContent.find(".Days__control").click()
                const days = ChooseWeeks.split(',')
                days.forEach((ele: string) => {
                    console.log("Ele  " + ele)
                    cy.get('[name="' + ele + '"]').should('be.checked')
                })
                FrequencyAndAdminPage.everyMonthsTabContent.find(".Month__control").click()
                const day = WeeksOfMonth.split(',')
                day.forEach((ele: string) => {
                    cy.get('[name="' + ele + '"]').should('be.checked')
                })
            }
        }
        else {
            FrequencyAndAdminPage.selectMonthTab.should('have.class', 'selected-tab-label');
            FrequencyAndAdminPage.selectMonthdropDown.click()
            const Month = Months.split(',')
            Month.forEach((ele: string) =>
                cy.get('[name="' + ele + '"]').should('be.checked')
            )

            if (Daysof === 'Days of the Month') {
                const days = ChooseDays.split(',')
                days.forEach((ele: string) =>
                    cy.get('[data-testid="' + ele + '"]').should('have.class', 'selected-day'))
            }
            else {
                FrequencyAndAdminPage.selectRadioButton(Daysof)
                FrequencyAndAdminPage.selectMonthsTabContent.find(".Days__control").click()
                const days = ChooseWeeks.split(',')
                days.forEach((ele: string) => {
                    cy.get('[name="' + ele + '"]').should('be.checked')
                })

                FrequencyAndAdminPage.selectMonthsTabContent.find(".Month__control").click()
                const day = WeeksOfMonth.split(',')
                day.forEach((ele: string) => {
                    cy.get('[name="' + ele + '"]').should('be.checked')
                })
            }
        }
    }

    verifySearchFunctionality(search: string) {
        let counter = 0
        let rowLength = 0
        let searchText: boolean
        cy.get("table > tbody")
            .find("tr")
            .then((row) => {
                rowLength = row.length
                for (let rowIndex = 1; rowIndex <= rowLength; rowIndex++) {
                    cy.get("tbody > tr:nth-child(" + rowIndex + ") > td:nth-child(2) > a").invoke("text").then((text) => {
                        searchText = text.includes(search)
                    }).then(() => {
                        if (searchText === true) {
                            counter++
                        }
                    }).then(() => {
                        for (let columnIndex = 3; columnIndex <= 5; columnIndex++) {
                            cy.get("tbody > tr:nth-child(" + rowIndex + ") > td:nth-child(" + columnIndex + ")").invoke("text").then((text) => {
                                searchText = text.includes(search)
                            }).then(() => {
                                if (searchText === true) {
                                    counter++
                                }
                            })
                        }
                    }).then(() => {
                        expect(counter).to.greaterThan(0)
                        counter = 0
                    })
                }
            })
    }

    verifySpecificTimeFieldErrorMessage(errMsg: string) {
        FrequencyAndAdminPage.timeFieldCount.each(($ele) => {
            cy.wrap($ele).parents('[class="time-control-container form-group"]').find('[class="invalid-feedback-message"]').as('timeErrMsg')
            if (errMsg === "Required") {
                cy.wrap($ele).click()
                cy.wrap($ele).type('{esc}')
                cy.get('@timeErrMsg').should('have.text', 'Time is required.')
            } else if (errMsg === "Invalid") {
                cy.wrap($ele).type('111')
                cy.wrap($ele).type('{esc}')
                cy.get('@timeErrMsg').should('have.text', '111 is an invalid time.')
            }
        })
    }

    verifySpecificTimeFieldDuplicateErrorMessage() {
        FrequencyAndAdminPage.timeFieldCount
            .then(specificTimeFieldCount => {
                const timeFieldCount = Cypress.$(specificTimeFieldCount).length
                FrequencyAndAdminPage.time1Field.type('10:00 PM{enter}')
                for (let timeFieldIdx = 2; timeFieldIdx <= timeFieldCount; timeFieldIdx++) {
                    cy.get('#Time' + timeFieldIdx).click()
                    cy.get('#Time' + timeFieldIdx).type('10:00 PM{enter}')
                    cy.get('#Time' + timeFieldIdx).parents('[class="time-control-container form-group"]').find('[class="invalid-feedback-message"]').as('timeErrMsg')
                    cy.get('@timeErrMsg').should('have.text', 'Time should be unique.')
                }
                cy.get('#Time' + timeFieldCount).type('10:15 PM{enter}')
                FrequencyAndAdminPage.time1Field.clear().type('10:15 PM{enter}')
                FrequencyAndAdminPage.time1Field.parents('[class="time-control-container form-group"]').find('[class="invalid-feedback-message"]').as('timeErrMsg')
                cy.get('@timeErrMsg').should('have.text', 'Time should be unique.')
            })
    }

    verifyTimeRangeTimeFieldErrorMessage(errorMsg: string) {
        this.startTimeFieldCount.each(($startTimeEle) => {
            cy.wrap($startTimeEle).parents('[class="form-group time-range-container"]').find('[class="invalid-feedback-message"]').as('timeErrorMsg')
            if (errorMsg === "Required") {
                cy.wrap($startTimeEle).click()
                cy.wrap($startTimeEle).type('{esc}')
                cy.get('@timeErrorMsg').should('have.text', 'Time is required.')
            } else if (errorMsg === "Invalid") {
                cy.wrap($startTimeEle).type('555')
                cy.wrap($startTimeEle).type('{esc}')
                cy.get('@timeErrorMsg').should('have.text', '555 is an invalid time.')
            }
        })
        this.endTimeFieldCount.each(($endTimeEle) => {
            cy.wrap($endTimeEle).parents('[class="form-group time-range-container-merge"]').find('[class="invalid-feedback-message"]').as('timeErrorMessage')
            if (errorMsg === "Required") {
                cy.wrap($endTimeEle).click()
                cy.wrap($endTimeEle).type('{esc}')
                cy.get('@timeErrorMessage').should('have.text', 'Time is required.')
            } else if (errorMsg === "Invalid") {
                cy.wrap($endTimeEle).type('666')
                cy.wrap($endTimeEle).type('{esc}')
                cy.get('@timeErrorMessage').should('have.text', '666 is an invalid time.')
            }
        })
    }

    verifyTimeRangeTimeFieldDuplicateErrorMessage() {
        this.startTimeFieldCount
            .then(startTimeFieldCount => {
                const strtTimeFieldCount = Cypress.$(startTimeFieldCount).length
                this.startTime1Field.type('10:00 PM{enter}')
                for (let startTimeFieldIdx = 2; startTimeFieldIdx <= strtTimeFieldCount; startTimeFieldIdx++) {
                    cy.get('#StartTime' + startTimeFieldIdx).click()
                    cy.get('#StartTime' + startTimeFieldIdx).type('10:00 PM{enter}')
                    cy.get('#StartTime' + startTimeFieldIdx).parents('[class="form-group time-range-container"]').find('[class="invalid-feedback-message"]').as('timeErrMsg')
                    cy.get('@timeErrMsg').should('have.text', 'Time should be unique.')
                }
                cy.get('#StartTime' + strtTimeFieldCount).type('10:20 PM{enter}')
                this.startTime1Field.clear().type('10:20 PM{enter}')
                this.startTime1Field.parents('[class="form-group time-range-container"]').find('[class="invalid-feedback-message"]').as('startTimeErrMsg')
                cy.get('@startTimeErrMsg').should('have.text', 'Time should be unique.')
            })
        this.endTimeFieldCount
            .then(fieldCount => {
                const endTimeFieldCount = Cypress.$(fieldCount).length
                this.EndTime1Field.type('10:00 PM{enter}')
                for (let endTimeFieldIdx = 2; endTimeFieldIdx <= endTimeFieldCount; endTimeFieldIdx++) {
                    cy.get('#EndTime' + endTimeFieldIdx).click()
                    cy.get('#EndTime' + endTimeFieldIdx).type('10:00 PM{enter}')
                    cy.get('#EndTime' + endTimeFieldIdx).parents('[class="form-group time-range-container-merge"]').find('[class="invalid-feedback-message"]').as('timeErrMsg')
                    cy.get('@timeErrMsg').should('have.text', 'Time should be unique.')
                }
                cy.get('#EndTime' + endTimeFieldCount).type('10:15 PM{enter}')
                this.EndTime1Field.clear().type('10:15 PM{enter}')
                this.EndTime1Field.parents('[class="form-group time-range-container-merge"]').find('[class="invalid-feedback-message"]').as('endTimeErrMsg')
                cy.get('@endTimeErrMsg').should('have.text', 'Time should be unique.')
            })
    }

    orderTypeSummary = (orderType: string, medicationType: string, searchQuery: string) => {
        let orderTypeSummary: string = ""
        if (orderType !== "" && medicationType !== "") {
            orderTypeSummary = "Order Type: " + orderType + ", " + medicationType + ": " + searchQuery
        } else if (orderType !== "" && medicationType === "") {
            orderTypeSummary = "Order Type: " + orderType + ", All"
        } else {
            orderTypeSummary = "Order Type: All"
        }
        return orderTypeSummary
    }

    dailySummary = (frequency: string, chooseTime: string, time: string, startTime: string, endTime: string) => {
        let dailySummary: string = ""
        if (chooseTime !== "") {
            if (chooseTime === "Specific Time") {
                dailySummary = dailySummary + this.specificTime(time)
                console.log("DS ST:: " + dailySummary)
            } else if (chooseTime === "Time Range") {
                dailySummary = dailySummary + this.timeRange(startTime, endTime)
                console.log("DS TR:: " + dailySummary)
            }
        }
        return dailySummary
    }

    cyclicalSummary = (cycleType: string, giveDays: string, doNotGiveDays: string) => {
        let cyclicalSummary: string = ""
        switch (cycleType) {
            case "Custom Days":
                cyclicalSummary = " give " + giveDays + " days, skip " + doNotGiveDays + " days"
                break;
            case "Every Other Day":
                cyclicalSummary = " on every other day"
                break;
            case "Even Dates":
                cyclicalSummary = " on Even Dates"
                break;
            case "Odd Dates":
                cyclicalSummary = " on Odd Dates"
                break;
        }
        return cyclicalSummary
    }

    weeklySummary = (every: string, chooseDays: string) => {
        let weeklySummary: string = ""
        if (every !== "" && chooseDays !== "") {
            let chooseDaysArr = chooseDays.split(",")
            if (chooseDaysArr.length === 1) {
                weeklySummary = " on " + chooseDaysArr[0] + " every " + every + " weeks"
            } else {
                weeklySummary = " on " + chooseDaysArr[0]
                for (let chooseDaysIdx = 1; chooseDaysIdx < chooseDaysArr.length; chooseDaysIdx++) {
                    weeklySummary = weeklySummary + "," + chooseDaysArr[chooseDaysIdx]
                }
                weeklySummary = weeklySummary + " every " + every + " weeks"
            }
        }
        return weeklySummary
    }

    monthlySummary = (tabSelection: string, daysOf: string, everyMonth: string, chooseDays: string, weeksOfMonth: string, chooseWeeks: string, months: string) => {
        let monthSummary: string = ""
        if (tabSelection === "Every Months") {
            monthSummary = this.everyMonthSummary(everyMonth, chooseDays, daysOf, weeksOfMonth, chooseWeeks)
        } else {
            monthSummary = this.selectMonthsSummary(daysOf, months, chooseDays, weeksOfMonth, chooseWeeks)
        }
        return monthSummary
    }

    everyMonthSummary = (everyMonth: string, chooseDays: string, daysOf: string, weeksOfMonth: string, chooseWeeks: string) => {
        let everyMonthSummary = " on "
        let chooseDaysArr: string[] = []
        let chooseDaysSuffix = this.chooseDaysSuffix(chooseDays)
        switch (daysOf) {
            case "Days of the Month":
                everyMonthSummary = everyMonthSummary + chooseDaysSuffix + " of every " + everyMonth + " months"
                break;
            case "Days of the Week":
                if (weeksOfMonth !== "" && chooseWeeks !== "") {
                    everyMonthSummary = everyMonthSummary + weeksOfMonth + " " + chooseWeeks + " of every " + everyMonth + " months"
                }
                break;
        }
        return everyMonthSummary
    }

    selectMonthsSummary = (daysOf: string, months: string, chooseDays: string, weeksOfMonth: string, chooseWeeks: string) => {
        let selectMonthsSummary: string = " on "
        let chooseDaysArr: string[] = []
        let chooseDaysSuffix = this.chooseDaysSuffix(chooseDays)
        switch (daysOf) {
            case "Days of the Month":
                selectMonthsSummary = selectMonthsSummary + chooseDaysSuffix + " of " + months
                break;
            case "Days of the Week":
                selectMonthsSummary = selectMonthsSummary + weeksOfMonth + " " + chooseWeeks + " of " + months
                break;
        }
        return selectMonthsSummary
    }

    chooseDaysSuffix = (chooseDays: string) => {
        let concatChooseDays: string = ""
        let chooseDaysArr = chooseDays.split(",")
        chooseDaysArr.forEach(element => {
            element = element.trim()
            if (element.trim().length === 1) {
                element = '0' + element;
            }
            switch (true) {
                case element === "01" || element === "21" || element === "31":
                    element = element + 'st';
                    break;
                case element === "02" || element === "22":
                    element = element + 'nd';
                    break;
                case element === "03" || element === "23":
                    element = element + 'rd';
                    break;
                default:
                    element = element + 'th'
            }
            concatChooseDays = concatChooseDays + ", " + element
        });
        return concatChooseDays.slice(2)
    }

    durationSummary = (duration: string, durationType: string) => {
        let durationSummary: string = " for "
        if (duration !== "" && durationType !== "") {
            durationSummary = durationSummary + duration + " " + durationType
        }
        return durationSummary
    }

    assignToSummary = (unit: string, room: string) => {
        let unitArr = unit.split(",")
        let roomArr = room.split(";")
        let assignToSummary: string = ""
        if (unit !== "" && room !== "") {
            assignToSummary = " Assign To: "
            if (unitArr.length === 1 && roomArr.length === 1) {
                assignToSummary = assignToSummary + unitArr[0] + " - " + roomArr[0]
            } else {
                assignToSummary = assignToSummary + unitArr[0] + " - " + roomArr[0]
                for (let unitIdx = 1; unitIdx < unitArr.length; unitIdx++) {
                    assignToSummary = assignToSummary + "; " + unitArr[unitIdx] + " - " + roomArr[unitIdx]
                }
            }
        }
        return assignToSummary
    }

    specificTime = (time: string) => {
        let specificTime: string = ""
        let timeArr = time.split(",")
        if (timeArr.length !== -1) {
            if (timeArr.length === 1) {
                specificTime = time
            } else {
                specificTime = timeArr[0]
                for (let timeIdx = 1; timeIdx < timeArr.length; timeIdx++) {
                    specificTime = specificTime + ", " + timeArr[timeIdx]
                }
            }
        }
        return specificTime
    }

    timeRange = (startTime: string, endTime: string) => {
        let timeRange: string = ""
        let startTimeArr = startTime.split(",")
        let endTimeArr = endTime.split(",")
        if (startTimeArr.length === endTimeArr.length && startTimeArr.length !== -1 && endTimeArr.length !== -1) {
            if (startTimeArr.length === endTimeArr.length && endTimeArr.length === 1) {
                timeRange = startTimeArr[0] + " - " + endTimeArr[0]
            } else {
                timeRange = startTimeArr[0] + " - " + endTimeArr[0]
                for (let startTimeIdx = 1; startTimeIdx < startTimeArr.length; startTimeIdx++) {
                    timeRange = timeRange + ", " + startTimeArr[startTimeIdx] + " - " + endTimeArr[startTimeIdx]
                }
            }
        }
        return timeRange
    }
    
    verifyValuesForMinutesSchedule(frequency: string,unit: string, room: string,Duration:string, DurationType:string){
        FrequencyAndAdminPage.frequencyTextField.should('have.text', frequency);
        FrequencyAndAdminPage.verifyAssignedToLabel(unit, room)
        FrequencyAndAdminPage.durationTextFieldValue.should('have.text', Duration);
        FrequencyAndAdminPage.durationTypeTextFieldValue.should('have.text', DurationType);

    }
}

export default new FrequencyAndAdminSummaryPage