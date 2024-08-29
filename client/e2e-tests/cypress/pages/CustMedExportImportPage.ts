import { searchCustomMedication, importCustomMedicationAPI } from "../api/customMedicationAPIS";
import CustomMedicationSummary from "../pages/CustMedSummaryPage";

class CustomMedicationExportImport {
    get pagination() { return cy.get(".pagination") }
    get fileSizeWarningMsg() { return cy.get("#file-size-warning-msg") }
    get importListCloseIcon() { return cy.get('#close-import-list') }
    get btnChooseFile() { return cy.get("[type=file]") }
    get fileImportedSuccessMsg() { return cy.get("[class$='alert alert-success floating']") }
    get closeChooseFile() { return cy.get('#btnRemoveFile') }
    get noFileSelectedMsg() { return cy.get('#no-file-selected') }
    get validateErrorCloseIcon() { return cy.get('[data-testid="alert-import-error-close-btn"]') }
    get validateErrorMsg() { return cy.get('.alert-message-container') }
    get errorsTableScroll() { return cy.get(':nth-child(5) > .table-responsive') }
    get lastValidationMsg() { return cy.get('.dark-border-header > tbody > tr:last-child > td:nth-child(2)') }
    get fileImportValidAndErrorFreeMsg() { return cy.get('.alert-message-container > span') }
    get btnExportErrors() { return cy.get('#btnExportErrors') }
    get btnValidateAndUploadFile() { return cy.get('#btnValidateAndUploadFile') }
    get ingredients() { return cy.get(':nth-child(9) > .row > .bg-ingridents-med-group-items-box > li') }
    get selectFile() { return cy.get('#file-selected') }
    get medGroups() { return cy.get(":nth-child(11) > .row > .bg-ingridents-med-group-items-box > li") }
    get custMed() { return cy.get('[data-testid="txtCustomMedicationName"]') }
    get controlSubstance() { return cy.get('tbody>tr:nth-child(1)>td:nth-child(3)>span') }
    get tableBody() { return cy.get("tbody") }
    

    verfiyCustMedExportedValues() {
        cy.window().then((win) => {
            const libraryId = win.localStorage.getItem('libraryId');
            const FileName: string = win.localStorage.getItem('FileName') ?? '';
            searchCustomMedication('custom-medications', "", 1, libraryId, "true").then(response => {
                expect(response.status).to.eq(200);
                const apiResponse = response.body.customMedications;
                cy.readFile("cypress//downloads//" + FileName).then((fileContent) => {
                    const rows = fileContent.split('\n');
                    if (apiResponse?.length !== rows.length - 1) {
                        console.log('Rows count mismatch');
                        return false;
                    }
                    for (let currRow = 0; currRow < rows.length; currRow++) {
                        const custMedName = rows[currRow + 1]?.split(',');
                        if (custMedName) {
                            //Verify description
                            expect(apiResponse[currRow]?.description).to.eq(custMedName[0]);

                            //Verify DEA Schedule Column
                            if (apiResponse[currRow]?.deaClassId == 2) {
                                expect(custMedName[1]).to.eq('Schedule II')
                            }
                            else if (apiResponse[currRow]?.deaClassId == 3) {
                                expect(custMedName[1]).to.eq('Schedule III')
                            }
                            else if (apiResponse[currRow]?.deaClassId == 4) {
                                expect(custMedName[1]).to.eq('Schedule IV')
                            }
                            else if (apiResponse[currRow]?.deaClassId == 5) {
                                expect(custMedName[1]).to.eq('Schedule V')
                            }
                            else if (apiResponse[currRow]?.deaClassId == null) {
                                expect(custMedName[1]).to.eq('Not Controlled')
                            }

                            //Verify Med group Column
                            let str: string = "";
                            apiResponse[currRow]?.fdbMedGroupLists?.forEach((ele: any, i: number) =>
                                str += (i ? "; " : "") + ele?.description
                            );
                            expect(str).to.eq(custMedName[2]);

                            /* Verify Ingredients values */
                            let sheetHeader = 3;
                            const apiIngredList = apiResponse[currRow]?.fdbIngredientLists;
                            for (let i = 0; i < apiIngredList.length; i++) {
                                if (i) {
                                    sheetHeader = sheetHeader + 2;
                                }
                                expect(apiIngredList[i]?.description).to.eq(custMedName[sheetHeader]);
                                expect(apiIngredList[i]?.representativeNDC.trim()).to.eq(custMedName[sheetHeader + 1].trim());
                            }
                        }
                    }
                });
            })

        });
    }

    VerifyValidationMessagesfromAPIandUI(fileName: any) {

        let errorMessagesOnUI: any = [];
        let errorMessagesOnAPI: any = [];
        let lineNumberOnAPI: any = [];
        let LineNumberOnUI: any = [];
        let libraryId: any;
        let fileNameToUse = "cypress//fixtures//" + fileName
        // define library id
        cy.url().then((url) => {
            const parts = url.split('/');
            libraryId = parts[parts.length - 1];
        }).then(() => {
            importCustomMedicationAPI('custom-medications/', libraryId, fileName).then(body => {
                let length = body?.validationErrors.length
                for (let i = 0; i < length; i++) {
                    errorMessagesOnAPI.push(body?.validationErrors[i]?.error)
                    lineNumberOnAPI.push(body?.validationErrors[i]?.lineNumber)
                }
            }).then(() => {
                cy.get('.overflow-auto>div>div:nth-child(5)>div>table>tbody>tr').each(($row) => {
                    const secondColumnText = $row.find('td:nth-child(2)').text().trim();
                    errorMessagesOnUI.push(secondColumnText);
                })
                cy.get('.overflow-auto>div>div:nth-child(5)>div>table>tbody>tr').each(($row) => {
                    const firstColumnText = $row.find('td:nth-child(1)>span').text().trim();
                    LineNumberOnUI.push(firstColumnText);
                    LineNumberOnUI = LineNumberOnUI.map((str: any) => parseInt(str));
                })
            }).then(() => {
                for (let i = 0; i < errorMessagesOnUI?.length; i++) {
                    expect(lineNumberOnAPI[i]).to.eq(LineNumberOnUI[i])
                    expect(errorMessagesOnAPI[i]).to.eq(errorMessagesOnUI[i])
                }
            })
        })

    }

    verifyImportErrorMessage(fileName: string) {
        let libraryId: any
        const errorMessagesOnAPI: string[] = []
        const lineNumberOnAPI: number[] = []
        let errMsg: string = ""
        let errorMessages: any = []
        let lineNumber: any = []
        cy.wait(3000)
        cy.url().then((url) => {
            const parts = url.split('/');
            libraryId = parts[parts.length - 1];
        }).then(() => {
            switch (fileName) {
                case "HeaderCountError1.csv":
                    errorMessages[0] = "Errors found in column headers. Expected 33 column headers in the import file, found 32."
                    lineNumber = [1]
                    break;
                case "HeaderCountError2.csv":
                    errorMessages[0] = "Errors found in column headers. Expected 33 column headers in the import file, found 39."
                    lineNumber = [1]
                    break;
                case "InvalidHeaderError.csv":
                    errorMessages[0] = "Errors found in column headers. Expected 'Custom Medication Name' found 'Custom Medication Name12'."
                    errorMessages[1] = "Errors found in column headers. Expected 'Ingredient 2' found 'Ingdient 2'."
                    errorMessages[2] = "Errors found in column headers. Expected 'Ingredient 5' found 'Ingredient 56'."
                    errorMessages[3] = "Errors found in column headers. Expected 'Ingredient 15 NDC' found 'Ingredient 15 NDC 15'."
                    lineNumber = [1, 1, 1, 1]
                    break;
                case "CustomMedicationErrors.csv":
                    errorMessages[0] = "Custom medication name is required."
                    errorMessages[1] = "DEA Schedule is required."
                    errorMessages[2] = "A custom medication already exists with the same name in this import file. The medication name must be unique."
                    errorMessages[3] = "A custom medication already exists with the same name in this import file. The medication name must be unique."
                    errorMessages[4] = "Invalid value in 'Custom Medication Name'. Error: Only following characters are allowed. Alpha-Numeric a - z, A - Z, 0 - 9. Special Characters ! @ # $ % ^ & * ( ) _ - + = { } [ ] | \\ : \" ; ' < > , . ? /"
                    errorMessages[5] = "Custom medication name must be at most 70 characters."
                    errorMessages[6] = "The medication name already exists in the Global Library. The medication name must be unique."
                    lineNumber = [2, 2, 3, 4, 5, 6, 8]
                    break;
                case "DEAErrors.csv":
                    errorMessages[0] = "Invalid value in 'DEA Schedule'."
                    errorMessages[1] = "Invalid value in 'DEA Schedule'."
                    errorMessages[2] = "DEA Schedule is required."
                    errorMessages[3] = "Invalid value in 'DEA Schedule'."
                    errorMessages[4] = "Invalid value in 'DEA Schedule'."
                    errorMessages[5] = "Invalid value in 'DEA Schedule'."
                    errorMessages[6] = "Invalid value in 'DEA Schedule'."
                    errorMessages[7] = "Invalid value in 'DEA Schedule'."
                    errorMessages[8] = "Invalid value in 'DEA Schedule'."
                    errorMessages[9] = "Invalid value in 'DEA Schedule'."
                    errorMessages[10] = "Invalid value in 'DEA Schedule'."
                    lineNumber = [2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 14]
                    break;
                case "MedGroupErrors.csv":
                    errorMessages[0] = "Invalid value(s) found in the column 'Medication Groups'. Note that multiple entries must be separated by a semicolon(;)."
                    errorMessages[1] = "Invalid value(s) found in the column 'Medication Groups'. Note that multiple entries must be separated by a semicolon(;)."
                    lineNumber = [2, 3]
                    break;
                case "IngredientErrors.csv":
                    errorMessages[0] = "Invalid Value in Ingredient 1 NDC. Value must be a valid NDC."
                    errorMessages[1] = "Invalid Value in Ingredient 2 NDC. Value must be a valid NDC that is not obsolete."
                    errorMessages[2] = "Invalid Value in Ingredient 15 NDC. Value must be a valid NDC."
                    errorMessages[3] = "Invalid Value in Ingredient 1 NDC. Value must be a valid NDC."
                    errorMessages[4] = "Invalid Value in Ingredient 2 NDC. Value must be a valid NDC that is not obsolete."
                    errorMessages[5] = "NDC is required in Ingredient 15 NDC if value is entered in Ingredient 15."
                    errorMessages[6] = "NDC is required in Ingredient 1 NDC if value is entered in Ingredient 1."
                    errorMessages[7] = "Invalid Value in Ingredient 1 NDC. Value must be a valid NDC."
                    errorMessages[8] = "NDC is required in Ingredient 1 NDC if value is entered in Ingredient 1."
                    errorMessages[9] = "Invalid Value in Ingredient 1 NDC. Value must be a valid NDC."
                    lineNumber = [2, 2, 2, 3, 3, 3, 4, 5, 6, 9]
                    break;
                case "DuplicateCustomMedicationErrors.csv":
                    errorMessages[0] = "A custom medication already exists with the same name. The medication name must be unique."
                    lineNumber = [2]
                    break;
            }
        }).then(() => {
            importCustomMedicationAPI('custom-medications/', libraryId, fileName).then(body => {
                let length = body?.validationErrors.length
                for (let i = 0; i < length; i++) {
                    errorMessagesOnAPI.push(body?.validationErrors[i]?.error)
                    lineNumberOnAPI.push(body?.validationErrors[i]?.lineNumber)
                }
            });
        }).then(() => {
            for (let i = 0; i < errorMessagesOnAPI?.length; i++) {
                expect(errorMessages[i]).to.eql(errorMessagesOnAPI[i].toString())
                expect(lineNumber[i]).to.equal(lineNumberOnAPI[i])
            }
        });

    }

    verifyImportedDataOnUI(fileName: string, folderName: string) {
        let custMedNameOnUI: any;
        cy.wait(2000)
        cy.readFile("cypress//" + folderName + "//" + fileName).then((fileContent) => {
            const rows = fileContent.split('\n');
            for (let currRow = 0; currRow < rows.length; currRow++) {
                const fileData = rows[currRow + 1]?.split(',');
                if (fileData?.length) {
                    let i: number;
                    //Search custom medication
                    let text = fileData[0].split("");
                    for (i = 0; i < text?.length; i++) {
                        CustomMedicationSummary.searchTextField.type(text[i]);
                    }
                    // Verify Control substance
                    this.controlSubstance.invoke('text').then
                        ((controlSubstanceOnUI) => {
                            if (fileData[1] === "2" || fileData[1] === "Schedule 2" || fileData[1] === "Schedule ii" || fileData[1] === "Schedule II") {
                                fileData[1] = "Schedule II";
                                expect(fileData[1]).to.eq(controlSubstanceOnUI);
                            }
                            else if (fileData[1] === "3" || fileData[1] === "Schedule 3" || fileData[1] === "Schedule iii" || fileData[1] === "Schedule III") {
                                fileData[1] = "Schedule III";
                                expect(fileData[1]).to.eq(controlSubstanceOnUI);
                            }
                            else if (fileData[1] === "4" || fileData[1] === "Schedule 4" || fileData[1] === "Schedule iv" || fileData[1] === "Schedule IV") {
                                fileData[1] = "Schedule IV";
                                expect(fileData[1]).to.eq(controlSubstanceOnUI);
                            }
                            else if (fileData[1] === "5" || fileData[1] === "Schedule 5" || fileData[1] === "Schedule v" || fileData[1] === "Schedule V") {
                                fileData[1] = "Schedule V";
                                expect(fileData[1]).to.eq(controlSubstanceOnUI);
                            }
                            else if (fileData[1] === "Not Controlled") {
                                fileData[1] = "Not Controlled";
                                expect(fileData[1]).to.eq(controlSubstanceOnUI);
                            }
                        })
                        // Open custom medication
                        .then(() => {
                            CustomMedicationSummary.CustomMedicationName.click();
                            cy.wait(3000)
                        })
                        .then(() => {
                            if (fileName === "CorrectData.csv" || fileName.startsWith("Automation")) {
                                // Verfiy Custom medication name
                                this.custMed.invoke('val').then((custMedName) => {
                                    custMedNameOnUI = custMedName
                                    expect(fileData[0]).to.eq(custMedNameOnUI);
                                })
                                    // Verify Ingredient values
                                    .then(() => {
                                        let sheetHeader = 3
                                        const ingr: any = [];
                                        this.ingredients
                                            .should(($lis) => {
                                                if ($lis.length === 0) {
                                                    return
                                                }
                                                else {
                                                    for (let i = 0; i < $lis.length; i++) {
                                                        const $li = $lis.eq(i);
                                                        ingr.push($li?.text().trim());
                                                    }
                                                    for (let i = 0; i < ingr.length; i++) {
                                                        const expectedIngr = fileData[sheetHeader].trim();
                                                        const ingrIndex = ingr.indexOf(expectedIngr);
                                                        if (ingrIndex !== -1) {
                                                            expect(ingr[ingrIndex]).to.eq(expectedIngr);
                                                        } else {
                                                            expect(false).to.eq(expectedIngr);
                                                        }
                                                        sheetHeader = sheetHeader + 2;
                                                    }
                                                }
                                            });
                                    })
                                    // Verify Med group values
                                    .then(() => {
                                        const medGrup: any = [];
                                        this.medGroups
                                            .should(($lis) => {
                                                if ($lis.length === 0) {
                                                    return
                                                }
                                                else {
                                                    for (let i = 0; i < $lis.length; i++) {
                                                        const $li = $lis.eq(i);
                                                        medGrup.push($li?.text().trim());
                                                    }
                                                    for (let i = 0; i < medGrup.length; i++) {
                                                        const expectedMedgrp = fileData[2].split(';');
                                                        const ingrIndex = medGrup.indexOf(expectedMedgrp[expectedMedgrp?.length - (i + 1)]?.trim());
                                                        if (ingrIndex !== -1) {
                                                            expect(medGrup[ingrIndex]).to.eq(expectedMedgrp[expectedMedgrp?.length - (i + 1)]?.trim());
                                                        } else {
                                                            expect(false).to.eq(expectedMedgrp[expectedMedgrp?.length - (i + 1)]?.trim());
                                                        }
                                                    }
                                                }
                                            });
                                    })
                                    //Verify Status is Active 
                                    .then(() => {
                                        CustomMedicationSummary.status.should('have.text', 'Active')
                                    })
                                    // Return back to the custom medication summary page
                                    .then(() => {
                                        cy.go('back')
                                        cy.wait(2000)
                                    })
                            }

                            if (fileName === "CorrectDataWithMultipleSameIngredients.csv") {
                                this.ingredients
                                    .should(($lis) => {
                                        if ($lis.length === 0) {
                                            return
                                        }
                                        else {
                                            // const expectedIngr: any = [];
                                            for (let i = $lis.length - 1; i >= 0; i--) {
                                                const $li = $lis.eq(i);
                                                const ingr = $li.text().trim();
                                                expect(ingr.trim()).to.eq(fileData[3].trim());
                                            }
                                        }
                                    }).then(() => {
                                        this.medGroups
                                            .should(($lis) => {
                                                if ($lis.length === 0) {
                                                    return
                                                }
                                                else {
                                                    for (let i = $lis.length - 1; i >= 0; i--) {
                                                        const $li = $lis.eq(i);
                                                        const ingr = $li.text().trim();
                                                        const expectedMedgrp = fileData[2].split(';');
                                                        expect(ingr.trim()).to.eq(expectedMedgrp[expectedMedgrp?.length - (i + 1)]?.trim());
                                                    }
                                                }
                                            })
                                    })
                            }
                            if (fileName === "CorrectDataWithInvalidIngredientValue.csv") {
                                const expectedIngr1: any = ['(d)-limonene flavor (bulk) 100 % liquid', 'Tracleer 125 mg tablet'];
                                this.ingredients
                                    .invoke('text').then((text: any) => {
                                        cy.log(text);
                                        expect(expectedIngr1).to.contain(text);
                                    })
                                    .then(() => {
                                        cy.go('back')
                                        cy.wait(2000)
                                    })
                            }
                        })
                }
            }
        })
    }

    verfiytotalNumberOFRowsInExcelAndUIWhileImport(fileName: string, folderName: string) {
        cy.wait(3000)
        cy.readFile("cypress//" + folderName + "//" + fileName).then((fileContent) => {
            const rows = fileContent.split('\n');
            const custMedInFile = rows.length - 1
            this.tableBody.find('tr').should("have.length", custMedInFile);
        })
    }

    verifyExportedFileNameIsDisplayed() {
        cy.window().then((win) => {
            const FileName: string = win.localStorage.getItem('FileName') ?? '';
            this.selectFile.then(($value) => {
                const getText = $value.text()
                expect(getText.trim()).to.equal(FileName);
            });
        })
    }
}
export default new CustomMedicationExportImport
