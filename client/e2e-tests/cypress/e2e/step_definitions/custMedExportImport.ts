import {
  Given,
  When,
  Then
} from "@badeball/cypress-cucumber-preprocessor";
import CustMedSummaryPage from "../../pages/CustMedSummaryPage";
import CustomMedicationExportImport from "../../pages/CustMedExportImportPage";

When("the {string} button is visible", (btnText: string) => {
  cy.contains("button", btnText).should("be.visible");
});

Then("a file in the CSV format is downloaded", () => {
  cy.window().then((win) => {
    const libraryName: string = win.localStorage.getItem('libraryName') ?? '';
    cy.wait(3000)
    const partialFileName = libraryName;
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.exec(`dir "${downloadsFolder}" /b`).its('stdout').then(stdout => {
      const filesInDownloads = stdout.split('\n').filter(fileName => fileName.trim() !== '');
      const matchingFile = filesInDownloads.find(file => file.includes(partialFileName));
      cy.wrap(matchingFile).should('exist', `File with partial name '${partialFileName}' not found.`);

      if (matchingFile) {
        let fullFileName: string
        fullFileName = `${downloadsFolder}\\${matchingFile}`;
        cy.log(`Full file name: ${fullFileName}`);
        cy.wrap(fullFileName).should('exist', `File with partial name '${partialFileName}' not found.`);
        let FileName = fullFileName.split("downloads")[1].substring(1).trim()
        cy.window().then((win) => {
          win.localStorage.setItem('FileName', FileName);
        });
      } else {
        cy.log(`No file with partial name '${partialFileName}' found.`);
      }
    });
  });
});

Then("user captures the created library ID from DB through created name", () => {
  cy.wait(2000)
  cy.url().then((url) => {
    const parts = url.split('/');
    const libraryId = parts[parts.length - 1];
    cy.window().then((win) => {
      win.localStorage.setItem('libraryId', libraryId);
    })
  })
})

Then("the column names should be correctly populated", () => {
  cy.window().then((win) => {
    const FileName: string = win.localStorage.getItem('FileName') ?? '';
    cy.readFile("cypress//downloads//" + FileName).then((fileContent) => {
      // Split the content into rows
      const rows = fileContent.split('\n');

      // Get the header row and split it into columns
      const header = rows[0].split(',');

      // Define the expected column names
      const expectedColumnNames =
        [
          'Custom Medication Name',
          'DEA Schedule',
          'Medication Groups',
          'Ingredient 1',
          'Ingredient 1 NDC',
          'Ingredient 2',
          'Ingredient 2 NDC',
          'Ingredient 3',
          'Ingredient 3 NDC',
          'Ingredient 4',
          'Ingredient 4 NDC',
          'Ingredient 5',
          'Ingredient 5 NDC',
          'Ingredient 6',
          'Ingredient 6 NDC',
          'Ingredient 7',
          'Ingredient 7 NDC',
          'Ingredient 8',
          'Ingredient 8 NDC',
          'Ingredient 9',
          'Ingredient 9 NDC',
          'Ingredient 10',
          'Ingredient 10 NDC',
          'Ingredient 11',
          'Ingredient 11 NDC',
          'Ingredient 12',
          'Ingredient 12 NDC',
          'Ingredient 13',
          'Ingredient 13 NDC',
          'Ingredient 14',
          'Ingredient 14 NDC',
          'Ingredient 15',
          'Ingredient 15 NDC'
        ];

      for (let i = 0; i < header?.length; i++) {
        expect(header[i].trim()).to.eq(expectedColumnNames[i].trim())
      }
    });
  })
});

Then("the {string} button should be {string}", (btnText: string, value: string) => {
  if (value == "disabled" && btnText == "Import Button") {
    CustMedSummaryPage.importButton.should('have.attr', value);
  }
  else if (value == "disabled" && btnText == "Export Button") {
    CustMedSummaryPage.exportButton.should('have.attr', value);
  }
  else if (value == "enabled" && btnText == "Export Button") {
    CustMedSummaryPage.exportButton.should('not.have.attr', "disabled");
  }
})

Then("the content of the file should be correctly populated", () => {
  CustomMedicationExportImport.verfiyCustMedExportedValues();
})

Then("user verifies the file name using regex", () => {
  cy.window().then((win) => {
    const libraryName: string = win.localStorage.getItem('libraryName') ?? '';
    const FileName: string = win.localStorage.getItem('FileName') ?? '';
    const regexStr = `^${libraryName} [A-Za-z]{3}\\d{2}\\d{4} \\d{2}\\d{2}\\d{2} IST\.csv$`;
    const regex = new RegExp(regexStr);
    const isValidFileName = regex.test(FileName);
    expect(isValidFileName).equal(true);
  })
})

Then("Import List page should be displayed", () => {
  CustMedSummaryPage.importListHeader.should("be.visible")
})

Then("the user selects the {string}", (fileName: string) => {
  CustomMedicationExportImport.btnChooseFile.attachFile(fileName)
});

Then("user should get error message as {string}", (errorMessage: string) => {
  cy.contains(errorMessage).should('be.visible')
})

Then("the validation error message should {string} displayed with {string} of error count", (value: string, count: number) => {
  cy.get('.alert-message-container>span').then(($value) => {
    const getText = $value.text()
    let expectedMessage
    if (count == 1) {
      expectedMessage = 'File upload failed due to the following ' + count + ' error found during validation. Fix the errors and retry.'
    }
    else {
      expectedMessage = 'File upload failed due to the following ' + count + ' errors found during validation. Fix the errors and retry.'
    }
    expect(getText.trim()).to.equal(expectedMessage.trim());
  });
})

Then("user verifies the validation messages from API response to UI according to {string}", (fileName: string) => {
  CustomMedicationExportImport.VerifyValidationMessagesfromAPIandUI(fileName);
})

Then("the {string} is displayed", (fileName: string) => {
  cy.wait(2000)
  cy.get('#file-selected').then(($value) => {
    const getText = $value.text()
    expect(getText.trim()).to.equal(fileName);
  });
})

Then("a warning message {string} should appear", () => {
  CustomMedicationExportImport.fileSizeWarningMsg.should('be.visible');
})

Then("{string} control should be displayed", () => {
  CustomMedicationExportImport.importListCloseIcon.should('be.visible');
})

Then("{string} message should be displayed", (fileImportedSuccessMsg: string) => {
  CustomMedicationExportImport.fileImportedSuccessMsg.should('be.visible', fileImportedSuccessMsg);
})

Then("the user clicks on close icon next to selected file", () => {
  CustomMedicationExportImport.closeChooseFile.click();
})

Then("the {string} message is displayed", (noFileSelectedMsg: string) => {
  CustomMedicationExportImport.noFileSelectedMsg.should('be.visible', noFileSelectedMsg);
})

Then("verify {string} title is displayed", (validationErrors: string) => {
  cy.get('h4').should('exist', validationErrors);
})

Then("{string} and {string} column header should be present", (lines: string, details: string) => {
  cy.contains('*[class^="dark-border-header"]', lines).should('exist');
  cy.contains('*[class^="dark-border-header"]', details).should('exist');
})

Then("the user clicks on close for validation message", () => {
  cy.wait(3000)
  CustomMedicationExportImport.validateErrorCloseIcon.click();
})

Then("the validation error message disappears", () => {
  CustomMedicationExportImport.validateErrorMsg.should('not.exist')
})

Then("scroll to bottom to see last validation error", () => {
  CustomMedicationExportImport.errorsTableScroll.scrollTo('bottom');
})

Then("verify the validation {string}", (lastValidationMsg: string) => {
  CustomMedicationExportImport.lastValidationMsg.should('be.visible', lastValidationMsg)
})

Then("scroll to top to see first validation error", () => {
  CustomMedicationExportImport.errorsTableScroll.scrollTo('top');
})

Then("verify {string} is not displayed after 3sec", (message: string) => {
  CustomMedicationExportImport.fileImportValidAndErrorFreeMsg.should('exist', message)
  cy.wait(3100)
  CustomMedicationExportImport.fileImportValidAndErrorFreeMsg.should('not.exist', message)
})

Then("{string} button is not displayed", (exportErrorsbtn: string) => {
  CustomMedicationExportImport.btnExportErrors.should('not.exist', exportErrorsbtn)
})

Then('{string} button should disappear', (ValidateAndUploadFilebtn: string) => {
  CustomMedicationExportImport.btnValidateAndUploadFile.should('not.exist', ValidateAndUploadFilebtn);
})

Then("File is downloaded in csv format", () => {
  cy.window().then((win) => {
    const libraryName: string = win.localStorage.getItem('libraryName') ?? '';
    cy.wait(3000)
    const partialFileName = libraryName + " Custom Medications Import Errors";
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.exec(`dir "${downloadsFolder}" /b`).its('stdout').then(stdout => {
      const filesInDownloads = stdout.split('\n').filter(fileName => fileName.trim() !== '');
      const matchingFile = filesInDownloads.find(file => file.includes(partialFileName));
      cy.wrap(matchingFile).should('exist', `File with partial name '${partialFileName}' not found.`);

      if (matchingFile) {
        let fullFileName: string
        fullFileName = `${downloadsFolder}\\${matchingFile}`;
        cy.log(`Full file name: ${fullFileName}`);
        cy.wrap(fullFileName).should('exist', `File with partial name '${partialFileName}' not found.`);
        let FileName = fullFileName.split("downloads")[1].substring(1).trim()
        cy.window().then((win) => {
          win.localStorage.setItem('FileName', FileName);
        });
      } else {
        cy.log(`No file with partial name '${partialFileName}' found.`);
      }
    });
  });
});

Then("user verifies the validation messages from UI and the exported CSV file", () => {
  let errorMessagesOnUI: any = [];
  let lineNumberOnUI: any = [];
  let errorMessagesInFile: any = [];
  let lineNumberInFile: any = [];
  let libraryId: any;
  // define library id
  cy.url().then((url) => {
    const parts = url.split('/');
    libraryId = parts[parts.length - 1];
  }).then(() => {
    cy.get('.overflow-auto>div>div:nth-child(5)>div>table>tbody>tr').each(($row) => {
      const secondColumnText = $row.find('td:nth-child(2)').text().trim();
      errorMessagesOnUI.push(secondColumnText);
    })
    cy.get('.overflow-auto>div>div:nth-child(5)>div>table>tbody>tr').each(($row) => {
      const firstColumnText = $row.find('td:nth-child(1)').text().trim();
      lineNumberOnUI.push(firstColumnText);
    })
  }).then(() => {
    cy.window().then((win) => {
      const FileName: string = win.localStorage.getItem('FileName') ?? '';
      cy.readFile("cypress//downloads//" + FileName).then((fileContent) => {
        const rows = fileContent.split('\n');
        for (let currRow = 1; currRow < rows.length; currRow++) {
          rows[currRow] = rows[currRow]?.replaceAll(", ", "abcdef")
          rows[currRow] = rows[currRow]?.replace('""', '"')
          let errorMessages = rows[currRow]?.split(',')

          for (let i = 0; i < errorMessages.length; i++) {
            const isPartialTextInArray = errorMessages[i].includes("abcdef");
            if (isPartialTextInArray) {
              errorMessages[i] = errorMessages[i].replaceAll("abcdef", ", ")
              errorMessages[i] = errorMessages[i].slice(0, -1);
              errorMessages[i] = errorMessages[i].replace(/^"|"$/g, '');
            }
          }
          if (errorMessages) {
            lineNumberInFile.push(errorMessages[0]);
            errorMessagesInFile.push(errorMessages[1]);
          }
        }
      })
    })
  }).then(() => {
    for (let i = 0; i < errorMessagesOnUI?.length; i++) {
      errorMessagesOnUI[i] = errorMessagesOnUI[i].toString()
      errorMessagesInFile[i] = errorMessagesInFile[i].toString()
      expect(errorMessagesOnUI[i]).to.eq(errorMessagesInFile[i].trim())
      expect(lineNumberOnUI[i]).to.eq(lineNumberInFile[i])
    }
  })
})

Then("the column names of the exported error file should be correctly populated", () => {
  cy.window().then((win) => {
    const FileName: string = win.localStorage.getItem('FileName') ?? '';
    cy.readFile("cypress//downloads//" + FileName).then((fileContent) => {
      // Split the content into rows
      const rows = fileContent.split('\n');

      // Get the header row and split it into columns
      const header = rows[0].split(',');

      // Define the expected column names
      const expectedColumnNames =
        [
          'Lines',
          'Details'
        ];

      for (let i = 0; i < header?.length; i++) {
        expect(header[i].trim()).to.eq(expectedColumnNames[i].trim())
      }
    });
  })
})

Then("user verifies the export errors file name using regex", () => {
  cy.window().then((win) => {
    const libraryName: string = win.localStorage.getItem('libraryName') ?? '';
    const partialFileName: string = libraryName + ' Custom Medications Import Errors'
    const FileName: string = win.localStorage.getItem('FileName') ?? '';
    const regexStr = `^${partialFileName} [A-Za-z]{3}\\d{2}\\d{4} \\d{2}\\d{2}\\d{2} IST\.csv$`;
    const regex = new RegExp(regexStr);
    const isValidFileName = regex.test(FileName);
    expect(isValidFileName).equal(true);
  })
})

Given("user verifies the validation messages in the API response according to {string}", (filename: string) => {
  CustomMedicationExportImport.verifyImportErrorMessage(filename)
})

Then("user verifies the imported data from {string} in the library in {string} folder", (filename: string, folderName: string) => {
  CustomMedicationExportImport.verifyImportedDataOnUI(filename, folderName)
})

Then("verify the total number of records imported in the {string} in {string} folder", (filename: string, folderName: string) => {
  CustomMedicationExportImport.verfiytotalNumberOFRowsInExcelAndUIWhileImport(filename, folderName)
})

Then("the user selects the Exported file", () => {
  cy.window().then((win) => {
    const FileName: string = win.localStorage.getItem('FileName') ?? '';
    CustomMedicationExportImport.btnChooseFile.attachFile("..//downloads//" + FileName)
  })
})

Then("the exported filename is displayed", () => {
  cy.wait(2000)
  CustomMedicationExportImport.verifyExportedFileNameIsDisplayed()
})

Then("verify the total number of records imported through the exported file in {string} folder", (folderName: string) => {
  cy.window().then((win) => {
    const FileName: string = win.localStorage.getItem('FileName') ?? '';
    CustomMedicationExportImport.verfiytotalNumberOFRowsInExcelAndUIWhileImport(FileName, folderName)
  })
})

Then("user verifies the imported data from the exported file in the library in {string} folder", (folderName: string) => {
  cy.window().then((win) => {
    const FileName: string = win.localStorage.getItem('FileName') ?? '';
    CustomMedicationExportImport.verifyImportedDataOnUI(FileName, folderName)
  })

})
