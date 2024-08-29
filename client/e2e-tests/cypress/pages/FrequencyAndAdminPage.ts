import FrequencyAndAdminSummaryPage from "./FrequencyAndAdminSummaryPage";

interface PopupSelectors {
    [key: string]: string;
}
let popupSelectors: PopupSelectors = {
    ' Delete Schedule': '.h4 > .modal-title',
    'Are you sure you want to delete this schedule?': '.modal-body > p > b',
    'You cannot undo this action.': '.modal.show > .modal-dialog > .modal-content > .modal-body > :nth-child(2)',
};
let cancelpopupSelectors: PopupSelectors = {
    ' Cancel Schedule': '[class="modal-title"]',
    'Are you sure you want to cancel this schedule entry?': '.modal-body > p > b',
    'All unsaved changes will be lost.': '.modal-body > p:last-child',
};
class FrequencyAndAdmin {

    //Locators
    get titleAddSchedule() { return cy.contains("Add Schedule") }
    get titleCustomizeSchedule() { return cy.get("#schedule_header >  h4.modal-title") }
    get labelFrequencyDropDown(){return cy.get("#ddlFrequency > div > div > label")}
    get frequencyDropDown() { return cy.get('*[data-testid="ddlFrequency"]').last() }
    get labelSummary(){return cy.get(`[for="summary"]`)}
    get summaryText(){return cy.get("#summary")}  
    get labelAdminSchedule(){return cy.get(`[for="AdministrationSchedule"]`)} 
    get orderTypeDropDown() { return cy.get('*[class^="orderType"]') }
    get medicationTypeDropDown() { return cy.get('*[class^="medicationType"]') }
    get drugNameDropDown() { return cy.get('#ddlDrugName') }
    get orderTypeDropDownList() { return cy.get('*[class^="input-field-select Order Type__menu"]') }
    get orderTypeDropDownBtn() { return cy.get('*[class^="input-field-select Order Type__control"]') }
    get medicationTypeDropdownBtn() { return cy.get('.input-field-select.Medication.Type__dropdown-indicator') }
    get includeGenericCheckbox() { return cy.get('#chkIncludegeneric') }
    get dropdownValues() { return cy.get('[id^="react-select"] > div') }
    get weeklyLinks() { return cy.get('#weeklyDays') }
    get label() { return cy.get('label') }
    get durationTypeField() { return cy.get('.ddlDurationType > .Type__control') }
    get frequencyTextBox() { return cy.get('#ddlFrequency > div > div > div:nth-child(2) > div > div > div > div.ddlFrequency.input-field-select__input-container')}
    get frequencyDropdownSelectFirstOption() { return cy.get('[class^="ddlFrequency input-field-select__option"] > div') }
    get timeFieldCount() { return cy.get('[id^="Time"]') }
    get time1Field() { return cy.get('#Time1') }
    get timeLabel() { return cy.get('[for="Time1"]') }
    get repeatBlock() { return cy.get('[class="nav-tabs-wrapper nav-tabs-bordered"]') }
    get durationTextBox() { return cy.get('[class^="ddlDuration "]') }
    get durationTextBoxSelectFirstOption() { return cy.get('[class^="ddlDuration input-field-select__option"] > div "]') }
    get setAsDefaultToggle() { return cy.get('#status') }
    get durationTypeDropdownList() { return cy.get('[class^="input-field-select Duration Type__menu"]') }
    get daysOfTheMonthRadioBtn() { return cy.get('#btnChooseDaysOfTheMonths') }
    get timeFields() { return cy.get('.form-control.time-picker-control') }
    get radioButton() { return cy.get('#btnTimeRange') }
    get startTime() { return cy.get('#StartTime') }
    get selectFirstDropdownValue() { return cy.get('[id$= "option-0"]') }
    get everyMonthTxtField() { return cy.get('.Every__single-value') }
    get everyWeekTextField() { return cy.get('.Every__input-container') }
    get chooseCheckbox() { return cy.get(".form-check-label") }
    get editAssignToHeader() { return cy.get('[class=""modal-title]') }
    get editAssignToCloseButton() { return cy.get("#btnCloseModal") }
    get eATSearchLabel() { return cy.get('[for="txtSearchQueryHere"]') }
    get eATSearchTextBox() { return cy.get("#txtSearchQueryHere") }
    get eATAssignedToLabel() { return cy.get('span[class="col-form-label"]') }
    get eATCheckAllBtn() { return cy.get("#btnCheckAll") }
    get eATClearAllBtn() { return cy.get("#btnClearAll") }
    get eATTreeContainer() { return cy.get('*[class^="tree-container"]') }
    get eATTree() { return cy.get('*[class^="react-checkbox-tree"] > ol > li') }
    get eATTreeExpandCollapseBtn() { return cy.get('span[class="rct-icon rct-icon-expand-all"]') }
    get eATTreeParentUnit() { return cy.get('.rct-node-parent') }
    get eATCancelBtn() { return cy.get('#btnCancel') }
    get eATCrossBtn() { return cy.get('#btnCloseModal') }
    get drugDropDownValue() { return cy.get('#ddlDrugName') }
    get noOptions() { return cy.get('[id^="react-select"]') }
    get durationDropdown() { return cy.get('.Duration__control') }
    get durationDropdownList() { return cy.get('[class^="input-field-select Duration__menu"]') }
    get textFieldBorder() { return cy.get('.medicationType > .Type__control') }
    get medicationTypeClearButton() { return cy.get('[class^="input-field-select Order Type__clear-indicator"] > svg > path') }
    get labelHighlited() { return cy.get('.col-form-label.has-error-label') }
    get invalidMessage() { return cy.get('.invalid-feedback-message') }
    get frequencyClearButton() { return cy.get('.input-field-select__clear-indicator') }
    get durationTypeClearButton() { return cy.get('.ddlDurationType > .Type__control > .Type__indicators > .Type__clear-indicator') }
    get durationClearButton() { return cy.get('.Duration__clear-indicator') }
    get ValueOnEveryField() { return cy.get('[class^="input-field-select Every__single-value"]') }
    get weekdaysError() { return cy.get('[class^="form-check-label has-error-label"]') }
    get chooseDays() { return cy.get('#chooseDays') }
    get buttonChooseDays() { return cy.get('#btnChooseDaysOfTheWeeks') }
    get sequenceDaysoftheMonth() { return cy.get('*[type="checkbox"]') }
    get ChooseMonth() { return cy.get('#chooseMonths > .form-check-label') }
    get chooseDaysofTheMonth() { return cy.get('[data-testid="btnChooseDaysOfTheMonths"]') }
    get labelcolour() { return cy.get('[for="btnChooseDaysOfTheMonths"]') }
    get numberOfErrors() { return cy.get("#num-of-errors-found") }
    get requiredFieldHyperlink() { return cy.get('[data-testid="focusToField"]') }
    get clearFrequency() { return cy.get(".input-field-select__clear-indicator") }
    get clearMedication() { return cy.get('.Type__clear-indicator') }
    get closeErrorMessage() { return cy.get("#alert-error-close-btn") }
    get addScheduleButton() { return cy.get('[data-testid="btnAddNewSchedule"]') }
    get medicationTypeDropDownList() { return cy.get(".Medication.Type__option") }
    get removeDuration() { return cy.get(".input-field-select.Duration__clear-indicator") }
    get orderTypeTextField() { return cy.get('.Order.Type__value-container') }
    get medicationTypeTextField() { return cy.get('.Medication.Type__value-container') }
    get durationTextField() { return cy.get('.Duration__input-container') }
    get durationTypeTextField() { return cy.get('.Duration.Type__value-container') }
    get deleteBtn() { return cy.get('#confirmDeleteButton') }
    get toastMessage() { return cy.get('.alert') }
    get noMatchesFound() { return cy.get('.no-data') }
    get cancelBtn() { return cy.get('#cancelDeleteButton') }
    get scheduleCheckbox() { return cy.get('.schedule-checkbox') }
    get searchText() { return cy.get('#txtSearch') }
    get donotGiveTextField() { return cy.get('.Do.Give__single-value') }
    get giveTextField() { return cy.get('.Give__single-value') }
    get cyclicalBtn() { return cy.get('#btnCyclical') }
    get durationTypeTextFieldValue() { return cy.get('.Duration.Type__single-value') }
    get durationTextFieldValue() { return cy.get('.Duration__single-value') }
    get specificTimeRadioBtn() { return cy.get('#btnSpecificTime') }
    get frequencyTextField() { return cy.get('.ddlFrequency.input-field-select__single-value') }
    get doNotGiveMenu() { return cy.get('.Do.Give__menu') }
    get giveMenu() { return cy.get('.Give__menu') }
    get doNotGiveContainer() { return cy.get('[class^="input-field-select Do Not Give__input-container"]') }
    get giveContainer() { return cy.get('[class^="input-field-select Give__input-container"]') }
    get button() { return cy.get('button') }
    get time2Field() { return cy.get('#Time2') }
    get time3Field() { return cy.get('#Time3') }
    get frequencyAdminTable() { return cy.get("tbody>tr") }
    get frequencyColumn() { return cy.get("tr>th") }
    get frequencyColumnHeader() { return cy.get(".schedule-list") }
    get searchTxt() { return cy.get('#txtSearch') }
    get searchedResult() { return cy.get('tbody > :nth-child(1) > td:nth-child(4)') }
    get noResultsFound() { return cy.get("tbody>tr>td>aside") }
    get previousArrow() { return cy.get('.pagination > :nth-child(1)') }
    get firstArrow() { return cy.get('.pagination > :nth-child(2)') }
    get nextArrow() { return cy.get('[data-testid="nextPage"]') }
    get lastArrow() { return cy.get('[data-testid="lastPage"]') }
    get pageNumber() { return cy.get(".page-link") }
    get adminScheduleSearchResult() { return cy.get('[data-testid="administrationScheduleName"]') }
    get everyMonthsTxtField() { return cy.get('.Every__input-container') }
    get EveryMonthnumber() { return cy.get('[class^="input-field-select Months__single-value"]') }
    get adminScheduleColumn() { return cy.get('tbody>tr>td:nth-child(3)') }
    get orderTypeColumn() { return cy.get('tbody>tr>td:nth-child(4)') }
    get assignedTo() { return cy.get('tbody>tr>td:nth-child(5)') }
    get upwardArrow() { return cy.get(".fa-arrow-up-short-wide") }
    get downwardArrow() { return cy.get(".fa-arrow-down-wide-short") }
    get prnFalse() { return cy.get('[data-testid="chkPRN"]') }
    get prnTrue() { return cy.get('[data-testid="chkPRN"][value="true"]') }
    get durationTypeDropdownBtn() { return cy.get('[class^="input-field-select Duration Type__menu"]') }
    get durationTypeDropdownField() { return cy.get('[class^="input-field-select Duration Type__option"]') }
    get selectCycleDropDown() { return cy.get('.Select.Cycle__value-container') }
    get selectCycleDropDownList() { return cy.get('*[class^="input-field-select Select Cycle__menu-list"]') }
    get selectCycleTextBox() { return cy.get('[class^="input-field-select Select Cycle__input-container"]') }
    get selectCycleDropdownSelectFirstOption() { return cy.get('[class^="input-field-select Select Cycle__option"]') }
    get giveDropDownField() { return cy.get('[class^="input-field-select Give__control"]') }
    get durationTypeMenuList() { return cy.get('.Type__menu-list>div') } get calendar() { return cy.get('#selectDates') }
    get selectMonthTab() { return cy.get("#selectMonthsTab>span") }
    get selectMonthdropDown() { return cy.get(".Select.Months__value-container") }
    get everyMonthDropDownValue() { return cy.get("#Every") }
    get selectCalendar() { return cy.get('#selectDates.calendar') }
    get weeksOfTheMonthDropDown() {return cy.get("#ddlWeeks")}
    get daysDropDown() {return cy.get("#Days")}
    get everyMonthTab() { return cy.get("#everyMonthsTab") }
    get monthCheckbox() { return cy.get(".Months__menu-list>div>input") }
    get selectMonthsTabContent() { return cy.get("#selectMonthsTabContent") }
    get everyMonthsTabContent() { return cy.get("#everyMonthsTabContent") }
    get starTimeField() { return cy.get("#StartTime") }
    get chooseDaysCheckbox() {return cy.get('#weeklyDays>div>input')} 
    get dailyButton() {return cy.get('#btnDaily')} 
    get cyclicalButton() {return cy.get('#btnCyclical')}
    get weeklyButton() {return cy.get('#btnWeekly')}
    get monthlyButton() {return cy.get('#btnMonthly')}
    get timesPerDayTitle() {return cy.get('#txtTimesPerDay')}
    get permissibleRange() {return cy.get('#timesPerDay>div>span')}
    get timesPerDayRange() {return cy.get('#timesPerDay>span')}
    get timesPerDayField() {return cy.get('[name="timesPerDay"]')}
    get cancelButton() {return cy.get('[data-testid="btnReset"]')}
    get backButton() {return cy.get('[data-testid="btnBack"]')}
    get txtTimesPerDay() {return cy.get('[data-testid="txtTimesPerDay"]')}
    get txtSpecifyMinutes() {return cy.get('[data-testid="txtspecifyMinutes"]')}
    get txtFirstAdminDateTime() { return cy.get("#schedule_body").find("#startDatePicker") }
    get txtLastAdminDateTime() { return cy.get("#schedule_body").find("#endDatePicker") }
    get chboxPRN() { return cy.get("#schedule_body").find("#chkPRN") }
    get chboxOpenEnded() { return cy.get("#schedule_body").find('[data-testid="openEnded-select"]') }
    get minutesTextField() {return cy.get('[name="specifyMinutes"]')}
    get permissibleRangeforMinutes() {return cy.get('#specifyMinutes>div>span')}
    get specifyMinutesRange() {return cy.get('#specifyMinutes>span')}

    verifyOrderTypeDropdownList() {
        this.orderTypeDropDownBtn.click()
        this.orderTypeDropDownList.should($els => {
            const values = [...$els].map(el => el.innerText)
            expect(values).to.deep.eq(["", "Medication"])
        })
        this.titleAddSchedule.click()
    }

    verifyIfBlankIsSelectedInOrderType() {
        this.orderTypeDropDownBtn.click()
        this.orderTypeDropDownList.first().click()
        this.medicationTypeDropDown.should('not.exist')
        this.drugNameDropDown.should('not.exist')
    }

    verifyIfMedicationIsSelectedInOrderType() {
        this.orderTypeDropDownBtn.click()
        this.orderTypeDropDownList.contains('Medication').click()
        this.medicationTypeDropDown.should('be.visible')
        this.drugNameDropDown.should('not.exist')
    }

    verifyMedicationTypeDropdownList() {
        this.medicationTypeDropdownBtn.click()
        this.medicationTypeDropDownList.should($els => {
            const values = [...$els].map(el => el.innerText.trim())
            expect(values).to.deep.eq(["", "Drug Name", "Medication Group"])
        })
    }

    selectOptionFromOrderTypeDropdown(option: string) {
        if (option !== "") {
            this.orderTypeDropDownBtn.click()
            this.orderTypeDropDownList.contains(option).click()
        }
    }

    selectOptionFromMedicationTypeDropdown(option: string) {
        if (option !== "") {
            this.medicationTypeDropdownBtn.click()
            this.medicationTypeDropDownList.contains(option).click()
        }
    }

    searchAndSelectFromDrugName(searchKey: string) {
        if (searchKey !== "") {
            this.drugNameDropDown.click()
            this.drugNameDropDown.should('contain', 'Search query here').type(searchKey)
            cy.wait(3000)
            this.dropdownValues.first().click()
        }
    }

    verifyDrugNameFieldIsReset() {
        this.drugNameDropDown.should('contain', 'Search query here').should('be.visible')
    }

    verifyDurationTypeDropdownList(repeatsText: string) {
        cy.wait(2000)
        this.durationTypeField.click()
        switch (repeatsText) {
            case "Daily":
            case "Cyclical":
                this.durationTypeMenuList.should($els => {
                    const values = [...$els].map(el => el.innerText.trim())
                    expect(values).to.deep.equal([ "Days","Months", "Weeks" ])
                })
                break

            case "Weekly":
                this.durationTypeMenuList.should($els => {
                    const values = [...$els].map(el => el.innerText.trim())
                    expect(values).to.deep.equal(["Months","Weeks"])
                })
                break

            case "Monthly":
                this.durationTypeMenuList.should($els => {
                    const values = [...$els].map(el => el.innerText.trim())
                    expect(values).to.deep.equal(["Months"])
                })
                break
        }
    }

    verifyCheckbox(checkbox: any, days: any) {
        switch (checkbox) {
            case "unchecked":
                cy.get("#" + days).should('not.be.checked')
                break
            case "All":
                cy.get("#" + days).should('be.checked')
                break
            case "MWF":
                cy.get("#" + days).should('be.checked')
                break
            case "TTH":
                cy.get("#" + days).should('be.checked')
                break
            case "SS":
                cy.get("#" + days).should('be.checked')
                break
        }
    }

    verifyradioBtnIsSelected(labelText: string, isselected: string) {
        if (isselected == 'is not') {
            cy.contains(labelText).siblings('[id*=btn]').should('not.be.checked');
        }
        else if (isselected == 'is') {
            cy.contains(labelText).siblings('[id*=btn]').should('be.checked');
        }
    }

    verifylabelIdDisplayed(labelText: string, isdisplayed: string) {
        if (isdisplayed == 'is not') {
            cy.contains(labelText).should('not.exist');
        }

        else if (isdisplayed == 'is') {
            cy.contains(labelText).should('exist').and('be.visible');
        }
    }

    verifyScroll(num: number, labelText: string) {
        if (labelText == "Every") {
            cy.get('.Every__value-container').click()
        } else {
            cy.get('[for="' + labelText + '"]').siblings('.custom-single-select').click()
        }
        for (let i = 0; i <= num; i++) {
            cy.get('[id$="option-' + i + '"]').scrollIntoView()
        }
        let text = Number(num) + 1;
        cy.get('[id$="option-' + num + '"]').should('have.text', text)
    }

    enterValuesInSelectDropDown(valuesToEnter: string, labelText: string, negativeValues: string, positiveValues: string) {
        if (valuesToEnter == "is not") {
            cy.get('[class^="input-field-select ' + labelText + '__input-container"]').as('inputValue')
            cy.get('@inputValue').click()
            cy.get('@inputValue').type(negativeValues)
            debugger;
            cy.get('[class^="input-field-select ' + labelText + '__menu-notice"]').should('have.text', "No options")
            cy.get('@inputValue').type('{selectall}{backspace}');
            cy.wait(1000)
        }
        else if (valuesToEnter == "is") {
            cy.get('[class^="input-field-select ' + labelText + '__input-container"] ').as('inputValue')
            cy.get('@inputValue').type(positiveValues)
            cy.get('[id$=option-0]').click()
        }
    }
    verifyCheckRandomCheckbox(days: string) {
        cy.get("#" + days).click()
        cy.get("#" + days).should('be.checked')
    }

    selectFrequencyFromDropDown(frequency: string) {
        this.frequencyDropDown.click()
        this.frequencyDropDown.type(frequency)
        this.frequencyDropdownSelectFirstOption.contains(frequency).click();        
    }

    selectRepeatsTab(tab: string) {
        cy.get('[class^="btn btn-primary"]').contains(tab).click()
    }

    verifyTimeFieldsCountAsPerFrequencyValue(frequency: string, count: string) {
        this.frequencyTextBox.click()
        this.frequencyTextBox.type(frequency)
        this.frequencyDropdownSelectFirstOption.contains(frequency).click()
        const frequencyMap = new Map([
            ["QD", 1],
            ["BID", 2],
            ["TID", 3],
            ["QID", 4],
            ["5XD", 5],
            ["6XD", 6]
        ]);

        const length = frequencyMap.get(frequency.substring(0, 3))

        if (length !== undefined) {
            this.timeFieldCount.should('have.length', length);
        }
    }

    validationOfTimeField(time: string, value: string) {
        let strTime: string
        if (value == "invalid") {
            this.time1Field.click()
            this.time1Field.clear()
            this.time1Field.type(time)
            this.time1Field.type('{enter}')
            cy.window().then((win) => {
                this.time1Field.should('have.value', "")
            })
        } else if (value == "valid") {
            this.time1Field.click()
            this.time1Field.clear()
            this.time1Field.type(time)
            this.time1Field.type('{enter}')
            const regEx = new RegExp(/^(\d)([ :.';’,-]?)(\d{2})(\s?)([a-zA-Z]*)$/);
            const regExStr = new RegExp(/^(\d{2})([ :.';’,-]?)(\d{2})(\s?)([a-zA-Z]*)$/);
            const matchSingleHour = regEx.exec(time);
            const matchDoubleHour = regExStr.exec(time);
            debugger
            if (matchSingleHour) {
                time = "0" + time;
                time = this.specialChToColonCh(time);
                time = this.addColonBetweenHrsMins(time);
                time = this.hour12GreaterRemoveMeridiem(time);
                let hours = parseInt(time.slice(0, 2), 10)
                let minutes = parseInt(time.slice(3, 5), 10)
                if (time.toLocaleLowerCase().includes('am') || time.toLocaleLowerCase().includes('pm')) {
                    hours = hours % 12;
                    hours = hours || 12; // the hour '0' should be '12'
                    strTime = String(hours).padStart(2, '0') + ':' + minutes + " " + time.slice(-2).toLocaleUpperCase();
                } else {
                    let ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours || 12; // the hour '0' should be '12'
                    strTime = String(hours).padStart(2, '0') + ':' + minutes + ' ' + ampm;
                }
                this.time1Field.should('have.value', strTime)
            }
            else if (matchDoubleHour) {
                time = this.specialChToColonCh(time);
                time = this.addColonBetweenHrsMins(time);
                time = this.hour12GreaterRemoveMeridiem(time);
                let hours = parseInt(time.slice(0, 2), 10)
                let minutes = parseInt(time.slice(3, 5), 10)
                if (time.toLocaleLowerCase().includes('am') || time.toLocaleLowerCase().includes('pm')) {
                    hours = hours % 12;
                    hours = hours || 12; // the hour '0' should be '12'
                    strTime = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + " " + time.slice(-2).toLocaleUpperCase();

                } else {
                    let ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours || 12; // the hour '0' should be '12'
                    strTime = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ' ' + ampm;
                }
                this.time1Field.should('have.value', strTime)
            }
            else {
                this.time1Field.should('have.value', time)
            }

        }
    }

    specialChToColonCh = (string: string) => {
        string = string.replaceAll(".", ":").replaceAll("'", ":").replaceAll("’", ":").replaceAll(";", ":").replaceAll("-", ":").replaceAll(",", ":");
        return string;
    }

    addColonBetweenHrsMins = (string: string) => {
        if (string.charAt(2) !== ":" && string.charAt(2) !== " ") {
            string = string.slice(0, 2) + ":" + string.slice(2);
        } else if (string.charAt(2) === " ") {
            string = string.slice(0, 2) + ":" + string.slice(2).trimStart();
        }
        return string;
    }

    // greater than 12 hours then remove am or pm as hours takes precedence meridiem
    hour12GreaterRemoveMeridiem = (string: string) => {
        let hours = Number(string.slice(0, 2));
        if (hours > 12 && (string.toLowerCase().endsWith("am") || string.toLowerCase().endsWith("pm"))) {
            string = string.slice(0, -2);
        }
        return string;
    }

    enterValuesInSelectDropDownWithoutClear(valuesToEnter: string, labelText: string, negativeValues: string, positiveValues: string) {
        if (valuesToEnter == "is not") {
            cy.get('[class^="input-field-select ' + labelText + '__input-container"]').as('inputValue').as('inputValue')
            cy.get('@inputValue').type(negativeValues)
            cy.get('[class^="input-field-select ' + labelText + '__menu-notice"]').should('have.text', "No options")
            cy.get('@inputValue').type('{selectall}{backspace}');
            cy.wait(1000)
        }
        else if (valuesToEnter == "is") {
            cy.get('[class^="input-field-select ' + labelText + '__input-container"]').as('inputValue')
            cy.get('@inputValue').type(positiveValues)
            cy.get('[id$=option-0]').click()
        }
    }

    toggleSetAsDefault(value: any) {
        if (this.setAsDefaultToggle.should('have.value', 'false')) {
            if (value == 1) {
                this.label.contains('Set as Default').click()
            }
        } else if (this.setAsDefaultToggle.should('have.value', 'true')) {
            if (value == 1) {
                this.label.contains('Set as Default').click()
            }
        } else {
            this.label.contains('Set as Default').should('be.visible')
        }

    }

    enterValuesInStartTimeField(time: string) {
        this.startTime.clear().type(time)
        this.label.contains("Repeats").click()
    }

    selectValueFromDropDown(value: string) {
        this.durationTypeField.click()
        this.durationTypeDropdownList.contains(value).click()
    }

    verifyDaysOfMonth(number: any, month: any) {
        for (let i = 1; i <= number; i++) {
            let padNumber = String(i).padStart(2, '0')
            console.log(padNumber)
            cy.get('*[for="' + padNumber + '"]').contains(padNumber).should('exist')
            cy.get('*[for="' + padNumber + '"]').siblings().should('have.id', padNumber).should('exist')
        }
    }

    selectRadioButton(labelText: any) {
        cy.contains(labelText).siblings('[id*=btn]').click()
    }

    verifyMonthLabelAndCheckboxes(months_days: any) {
        cy.get('[for=' + months_days + ']').as('monthDaysDropdown');
        cy.get('@monthDaysDropdown').scrollIntoView().should('be.visible')
        cy.get('@monthDaysDropdown').scrollIntoView().should('exist')
        cy.get('@monthDaysDropdown').scrollIntoView().siblings().should('not.be.checked')
        cy.get('@monthDaysDropdown').scrollIntoView().siblings().click()
        cy.get('@monthDaysDropdown').scrollIntoView().siblings().should('be.checked')
    }

    selectAllCheckboxesAndVerify(radioButtonName: any) {
        if (radioButtonName == "Day(s) of the Month") {
            this.daysOfTheMonthRadioBtn.should('be.checked')
            for (let i = 1; i <= 31; i++) {
                let padNumber = String(i).padStart(2, '0')
                console.log(padNumber)
                cy.get('*[for="' + padNumber + '"]').siblings().should('have.id', padNumber).click()
                cy.get('*[for="' + padNumber + '"]').siblings().should('have.id', padNumber).should('be.checked')
            }
        } else if (radioButtonName == "Day(s) of the Week") {
            cy.get('*[type="checkbox"]').not(':last').check()
            cy.get('*[type="checkbox"]').not(':last').should('be.checked')
        }
    }

    verifyTimeFieldsCount(chooseTime: string, frequency: string) {
        this.frequencyTextBox.click()
        this.frequencyTextBox.type(frequency)
        this.frequencyDropdownSelectFirstOption.contains(frequency).click()
        this.label.contains(chooseTime).click()
        const frequencyMap = new Map([
            ["QD", 2],
            ["QD+PC", 2],
            ["QD+AC", 2],
            ["QD + Meal", 2],
            ["QAM ", 2],
            ["QPM", 2],
            ["QHS", 2],
            ["BID", 4],
            ["BID+PC", 4],
            ["BID+AC", 4],
            ["BID+Meal", 4],
            ["TID", 6],
            ["TID+PC", 6],
            ["TID+AC", 6],
            ["TID+Meal ", 6],
            ["QID", 8],
            ["QID+PC+HQ", 8],
            ["QID+AC+HQ", 8],
            ["QID+Meal+HQ ", 8],
            ["5XD", 10],
            ["6XD", 12]
        ]);

        const length = frequencyMap.get(frequency)
        if (length !== undefined) {
            this.timeFields.should('have.length', length);
        }
    }

    verifyRadioButton(HoursFrequency: string, RadioButtonStatus: string) {
        this.frequencyTextBox.click()
        this.frequencyTextBox.type(HoursFrequency)
        this.frequencyDropdownSelectFirstOption.contains(HoursFrequency).click()
        this.radioButton.should('have.value', RadioButtonStatus)
    }

    verifyBlankTimeFields() {
        this.timeFields.invoke('attr', 'Value').then((value: any) => {
            let text = ""
            expect(value).to.equal(text);
        })
    }

    userSelectsUnitsCheckbox(unit: string, room: string) {
        cy.window().then((win) => {
            if (unit !== "" || room !== "") {
                cy.wait(2000)
                const unitArray: string[] = unit.split(",")
                const roomArray2: string[] = room.split(";")
                for (let i = 0; i < unitArray.length; i++) {
                    let roomArr = roomArray2[i]
                    const arrayRoomSelect: string[] = roomArr.split(",")
                    //this.eATClearAllBtn.click()
                    for (let val of arrayRoomSelect) {
                        cy.get('.rct-node-parent')
                            .contains(unitArray[i].trim())
                            .parent()
                            .siblings('ol')
                            .find('.rct-title')
                            .contains(val.trim())
                            .click();
                    }
                }
            }
        });
    }

    clickCheckCLearButton(operation: string) {
        cy.wait(2000)
        if (operation == "Check") {
            this.eATCheckAllBtn.click()
        } else if (operation == "Clear") {
            this.eATClearAllBtn.click()
        }
    }

    verifyEATCheckboxesCheckedOrNot(isChecked: string) {
        if (isChecked == "checked") {
            cy.get('.rct-node-parent>span>label>span:nth-child(2)').should('have.attr', 'aria-checked', 'true')
        } else if (isChecked == "not checked") {
            cy.get('.rct-node-parent>span>label>span:nth-child(2)').should('have.attr', 'aria-checked', 'false')
        }
    }

    verifyInvalidSearch(invalidVal: string) {
        this.eATSearchTextBox.click()
        this.eATSearchTextBox.type(invalidVal)
        this.eATTreeExpandCollapseBtn.should('not.exist')
    }

    verifyAssignedToLabel(unit: string, room: string) {
        
        const unitArray: string[] = unit.split(",")
        const roomArray2: string[] = room.split(";")
        let assignTo = ""
        if(unit !== "" && room !== ""){
            for (let unitIndex = 0; unitIndex < unitArray.length; unitIndex++) {
                const roomArr = roomArray2[unitIndex]
                const arrayRoomSelect: string[] = roomArr.split(",")
                if (assignTo != "") {
                    assignTo = assignTo + "; "
                }
                assignTo = assignTo + unitArray[unitIndex].trim() + " - "
                for (let roomIndex = 0; roomIndex < arrayRoomSelect.length; roomIndex++) {
                    assignTo = assignTo + arrayRoomSelect[roomIndex].trim()
                    if (roomIndex !== arrayRoomSelect.length - 1) {
                        assignTo = assignTo + ", "
                    }
                }
            }
            cy.contains(assignTo).should('be.visible')
        }
    }

    verifyFacilityName(facilityName: string) {
        cy.contains(facilityName).should('be.visible')
    }

    userSelectsRoomsCheckbox(units: string) {
        cy.wait(2000)
        this.eATTreeExpandCollapseBtn.first().click()
        this.eATTreeParentUnit.contains(units).click()
    }
    selectValueFromDurationDropDown(value: string) {
        this.durationDropdown.click()
        this.durationTextBox.type(value)
        this.durationDropdownList.contains(value).click()
    }

    enterValuesInTimeFields(time: string, locator: string, frequency: string) {
        let arrayTime: string[] = time.split(",")
            for (let timeArr = 0; timeArr <= arrayTime.length - 1; timeArr++) {
                cy.get("#" + locator + (timeArr + 1)).as('Time')
                cy.get('@Time').click()
                cy.get('@Time').type(arrayTime[timeArr].trim())
                this.label.contains("Repeats").click()
            }
        }
    

    calculateUtcTime(newDate: any): any {
        let hours = newDate.getUTCHours();
        let minutes: any = newDate.getUTCMinutes();
        let secs = newDate.getUTCSeconds()
        let secsStart = secs - 3; //subtracting 3 from seconds to fetch the correct record
        let secsEnd = secs + 5 //adding 3 from seconds to fetch the correct record
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let startTime: string = newDate.getUTCFullYear() + '-' + ((newDate.getUTCMonth()) + 1) + '-' + newDate.getUTCDate() + " " + String(hours).padStart(2, '0') + ':' + minutes + ':' + String(secsStart).padStart(2, '0')
        let endTime: string = newDate.getUTCFullYear() + '-' + ((newDate.getUTCMonth()) + 1) + '-' + newDate.getUTCDate() + " " + String(hours).padStart(2, '0') + ':' + minutes + ':' + secsEnd
        let time = startTime + "," + endTime;
        return time;
    }

    verifyValuesInTimeFields(time: string, locator: string) {
        let arrayTime: string[] = time.split(",")
        for (let timeArr = 0; timeArr <= arrayTime.length - 1; timeArr++) {
            cy.get("#" + locator + (timeArr + 1)).as('Time')
            cy.get('@Time').should('have.value', arrayTime[timeArr]);
        }
    }

    getIDFromUrl() {
        let adminScheduleID: string;
        cy.url().then((url) => {
            const parts = url.split('/');
            adminScheduleID = parts[parts.length - 1];
        });
        cy.window().then((win) => {
            win.localStorage.setItem('adminScheduleID', adminScheduleID);
        });
    }

    saveSchedule(frequency: string, orderTypeValue: string, medicationTypeValue: string, searchQuery: string, unit: string, room: string, prn: string) {
        //Frequency
        this.selectFrequencyFromDropDown(frequency)

        //PRN
        this.selectPRNCheckbox(prn)

        //OrderType
        this.selectOptionFromOrderTypeDropdown(orderTypeValue)

        //Medication Type
        this.selectOptionFromMedicationTypeDropdown(medicationTypeValue)

        //DrugName/MedicationGroup
        this.searchAndSelectFromDrugName(searchQuery)

        //Edit button
        this.button.contains("Edit").click();

        //Room
        this.userSelectsUnitsCheckbox(unit, room)

        //Confirm button
        this.button.contains("Confirm").click();
    }

    saveDailyAdministrationSchedule(frequency: string, ChooseTime: string, Time: string, StartTime: string, EndTime: string) {
        //Choose Time
        this.label.contains(ChooseTime).click({ force: true })

        //Enter values in time field
        if (ChooseTime === 'Specific Time') {
           
                this.enterValuesInTimeFields(Time, "Time", frequency) 
        }
        else {
            this.enterValuesInTimeFields(StartTime, "StartTime", frequency)
            this.enterValuesInTimeFields(EndTime, "EndTime", frequency)
        }
    
    }

    saveRepeats(repeats: string) {
        if (repeats == "Cyclical") {
            cy.contains("Cyclical").click();
        }
        else if (repeats == "Weekly") {
            cy.contains("Weekly").click();
        }
        else if (repeats == "Monthly") {
            cy.contains("Monthly").click();
        }
    }

    saveAdminAndSchedule() {
        this.button.contains("Save").click();
    }

    toggledefaultButton(Status: string) {
        if(Status === "true") 
        FrequencyAndAdminSummaryPage.toggleStatus.click()
    }

    isDefaultStatus(Status:string){
        this.setAsDefaultToggle.should('have.attr', 'value', Status);
    }
    

    saveDurationAndDurationType(Duration: string, DurationType: string) {
        //Duration
        this.selectValueFromDurationDropDown(Duration)

        //Duration Type
        this.selectValueFromDropDown(DurationType)
    }

    saveCyclicalAdministrationSchedule(CycleType: string, GiveDays: string, DonotGiveDays: string) {

        //Choose Cycle Type
        if (CycleType == "Custom Days") {
            this.selectCycleFromDropDown(CycleType)
            //Select Give days
            this.giveContainer.first().click();
            this.giveMenu.contains(GiveDays).click()

            //Select Do not give days
            this.doNotGiveContainer.first().click();
            this.doNotGiveMenu.contains(DonotGiveDays).click()
        }
        else {
            this.selectCycleFromDropDown(CycleType)
        }
    }

    verifytextfieldValue(labelText: any) {
        cy.get('[class^="ddl' + labelText + '"] > .input-field-select__control > .input-field-select__value-container > .input-field-select__input-container').as('inputValue')
        cy.get('@inputValue')
    }

    btnIsVisible(btnText: string, visibility: string) {
        if (visibility === 'is') {
            cy.get("button").contains(btnText).should("be.visible");
        }
        else {
            cy.get("button").contains(btnText).should("not.exist");
        }
    }

    verifyDeletePopup(popupText: string) {
        const selector = popupSelectors[popupText] || '';
        cy.get(selector).should('have.text', popupText);
    }

    verifyCancelPopup(popupText: string) {
        const selector = cancelpopupSelectors[popupText] || '';
        cy.get(selector).should('have.text', popupText);
    }

    selectPRNCheckbox(prn: string) {
        if (prn !== "") {
            if (prn === "true") {
                this.prnFalse.click({force:true})
            } else {
                this.prnTrue.click({force:true})
            }
        }
    }

    verifySelectCycleDropdownList() {
        this.selectCycleDropDown.click()
        this.selectCycleDropdownSelectFirstOption
            .invoke('text')
            .should('eq', 'Custom DaysEvery Other DayEven DatesOdd Dates')
    }

    selectCycleFromDropDown(cycle: string) {
        this.selectCycleTextBox.click()
        this.selectCycleTextBox.type(cycle)
        this.selectCycleDropdownSelectFirstOption.contains(cycle).click()
    }

    validationOfTimeFieldIn24HrFormat(time: string, value: string, exactTime: string) {
        let strTime: string
        if (value == "invalid") {
            this.time1Field.click()
            this.time1Field.clear()
            this.time1Field.type(time)
            this.time1Field.type('{enter}')
            let invalidMsg: string = time + " is an invalid time."
            cy.get("#specificTime .invalid-feedback-message").should("have.text", invalidMsg)
        } else if (value == "valid") {
            this.time1Field.click()
            this.time1Field.clear()
            this.time1Field.type(time)
            this.time1Field.type('{enter}')
            this.time1Field.should('have.value', exactTime)
        }
    }

    verifyAdminDateTimeWithOrderDetails() {
        this.txtFirstAdminDateTime.invoke("val").then((value) => {
            cy.wrap(value).as("firstAdminDateTimeCustomizeScheduling");
          });
        this.txtLastAdminDateTime.invoke("val").then((value) => {
            cy.wrap(value).as("lastAdminDateTimeCustomizeScheduling");
          });

          cy.get("@firstAdminDateTimeOrderDetails").then((firstAdminDateTimeOrderDetails) => {
            cy.get("@lastAdminDateTimeOrderDetails").then((lastAdminDateTimeOrderDetails) => {
              cy.get("@firstAdminDateTimeCustomizeScheduling").should("eq", firstAdminDateTimeOrderDetails);
              cy.get("@lastAdminDateTimeCustomizeScheduling").should("eq", lastAdminDateTimeOrderDetails);
            });
          });
    }
}
export default new FrequencyAndAdmin