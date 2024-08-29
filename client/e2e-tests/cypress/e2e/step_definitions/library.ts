import {
    When,
    Then
} from "@badeball/cypress-cucumber-preprocessor";

import Library from "../../pages/libraryPage";
import CustomMedication from "../../pages/CustomMedicationPage";
import CustomMedicationSummary from "../../pages/CustMedSummaryPage";
import { saveCustomMedicationLibrary } from "../../api/libraryAPIS";
import libraryPage from "../../pages/libraryPage";

const envPAGE = require("../../env.config.json");
let libraryName: string

When("user should be redirected to the libraries page", () => {
    cy.url().should('include', '/custom-medication-libraries');
});

When("the {string} wizard opens", (headerText: string) => {
    Library.popup.should('have.text', headerText);
});

When("a text box with a label {string} should be displayed", (labelText: string) => {
    Library.libraryNameLbl.should('have.text', labelText);
});

When("user enters unique {string} name", (textName: string) => {
    let rad = Math.floor(Math.random() * 10000) + 1;
    let timestamp = new Date().getTime();
    libraryName = textName + rad + timestamp;
    Library.libraryNameTextField.clear().type(libraryName);
    cy.window().then((win) => {
        win.localStorage.setItem('libraryName', libraryName);
    });
});

When("enter {string} name", (textName: string) => {
    Library.libraryNameTextField.clear()
    Library.libraryNameTextField.clear().type(textName);
});


Then("the user searches and selects the newly created library in the custom medication library dropdown", () => {
    cy.get(".CustomMedicationLibrary").type(libraryName)
    cy.get('input').realPress('Tab')
});


When("the user searches the newly created library in the custom medication library dropdown", (  ) =>{
    cy.get(".CustomMedicationLibrary").type(libraryName)
} );



Then("the source column would show the library just created", (  ) =>{
    cy.get("tr td:nth-child(4)")
    .first()
    .each(($e1) => {
      const StoreText = $e1.text();
      expect(StoreText).to.equal(libraryName);
    });
    
} );


Then("the user searches and selects the custom medication library that was created", (  ) =>{
    libraryPage.searchFunctionality(libraryName)
} );




When("enter {string} name with spaces", (textName: string) => {
    const spaces = '        '; // The number of spaces you want to add
    let textToType = ''
    if (textName == 'Automation Leading') {
        textToType = spaces + textName;
        Library.libraryNameTextField.clear().type(textToType);
    }
    else if (textName == 'Automation Trailing') {
        textToType = textName + spaces;
        Library.libraryNameTextField.clear().type(textToType);
    }
    else if (textName == 'Automation Trailing and Leading') {
        textToType = spaces + textName + spaces;
        Library.libraryNameTextField.clear().type(textToType);
    }
    else if (textName == 'spaces') {
        Library.libraryNameTextField.clear().type(spaces);
    }

});

Then('the user clears the library field', () => {
    Library.libraryNameTextField.clear()
})

When("message and {string} is displayed", (statusText: string) => {
    Library.statusText.should('have.text', statusText);
    Library.messageText.should('have.text', "Manage availability of this custom medication library for current facility");

});

When("the default status should be set to {string}", (textStatus: string) => {
    Library.defaultStatusText.should('have.text', textStatus);
});

When("the user clicks on {string} toggle button", (textStatus: string) => {
    Library.defaultStatusText.invoke('text').then((text) => {
        if (text == textStatus) {
            Library.popup.click();
        }
        else {
            Library.defaultStatusText.click({ force: true })
            Library.defaultStatusText.should('have.text', textStatus);
        }
    })
});

When("user is navigated to Custom medication summary page", () => {
    cy.url().should('include', '/custom-medications');
});

Then("the user clicks on Cross sign", () => {
    Library.crossIconOnPopup.click()
})

When("the created {string} should {string} visible on the Custom medication summary page", (textName: string, value: string) => {
    if (value == 'be') {
        Library.libraryNameText.contains(textName).should('be.visible')
        Library.libraryNameText.invoke('text').then(labelText => {
            // Check for leading spaces
            const hasLeadingSpaces = labelText.startsWith(' ');
            expect(hasLeadingSpaces).to.be.false;

            // Check for trailing spaces
            const hasTrailingSpaces = labelText.endsWith(' ');
            expect(hasTrailingSpaces).to.be.false;
        });
    }
    else {
        Library.libraryNameText.should('not.contain', textName);
    }
});

When("{string} should be present in the library text field", (libraryName: string) => {
    Library.libraryNameTextField.invoke('val').then((text) => {
        expect(text).to.contain(libraryName)
    });
})

When("user clicks on the pen icon to edit", () => {
    Library.editPenIcon.click()
});

When("the created {string} should {string} visible on the Libraries page", (textName: string, value: string) => {
    if (value == 'be') {
        let libraryNames: any = [];
        Library.libraryNameOnLibrariesPage.each(($li) => {
            const text = $li.text();
            libraryNames.push(text)
        }).then(() => {
            let isValExist = libraryNames.filter((ele: string) => ele.includes(textName));
            let eleExists = !!isValExist?.length
            expect(eleExists).equal(true);
        });
    }
    else {
        let libraryNames: any = [];
        Library.libraryNameOnLibrariesPage.each(($li) => {
            const text = $li.text();
            libraryNames.push(text)
        }).then(() => {
            let isValExist = libraryNames.filter((ele: string) => ele.includes(textName));
            let eleExists = !!isValExist?.length
            expect(eleExists).equal(false);
        });
    }
});

Then("user sees the validation message as {string}", (messageText: string) => {
    Library.invalidFeedbackMessage.should('have.text', messageText);
})

Then("user sees the validation alert as {string}", (messageText: string) => {
    Library.alertMessage.should('have.text', messageText);
})

Then("User clicks on back button", () => {
    cy.go('back')
})

Then("the user checks for maximum characters", () => {
    Library.libraryNameTextField.invoke('val').then((text: any) => {
        expect(text.length).equal(70);
    });
})

Then("user deletes libraries with name starting with {string}", (libraryName: string) => {
    let allLibraryId: any = []
    let allLibraryName: any = []
    cy.task('DATABASE', {
        dbConfig: envPAGE.env.QADBPGADMIN,
        sql: `
          Select * from "CustomMedicationLibrary" where "Description" like '%`+ libraryName + `%';
          `,
    }).then((result: any) => {
        let totalRows = result.rows.length;
        for (let i = 0; i < totalRows; i++) {
            allLibraryId.push(result.rows[i].Id);
        }
    }).then(() => {
        for (const element of allLibraryId) {
            cy.task('DATABASE', {
                dbConfig: envPAGE.env.QADBPGADMIN,
                sql: `
          DELETE FROM public."CustomMedicationLibrary" where "Id" = '`+ element + `';
          `,
            });
        }
    })
})

Then("Verify the name {string} and status {string} are correct", (libName: string, statusText: string) => {
    let totalPages: any;
    let totalEntries: any;
    CustomMedicationSummary.totalEntriesTextInPagination.then((e) => {
        let myText = e.text();
        totalEntries = myText.substring(myText.indexOf('of') + 3, myText.indexOf('ent') - 1);
        totalPages = Math.ceil((parseInt(totalEntries)) / 10)
        for (let i = 1; i <= totalPages; i++) {
            Library.getLibraryName(libName, statusText);
            if (i < totalPages) {
                CustomMedicationSummary.nextPageArrowBtn.click();
                cy.wait(3000)
            }
        }
    })
})

Then("user is able to see {string} on list page", (header: string) => {
    Library.customMedicationLibraryList.should('have.text', header)
})

Then("user is able to see {string} and {string} Button", (Import: string, Export: string) => {
    Library.importBtn.should('have.text', Import)
    Library.exportBtn.should('have.text', Export)
})

Then("{string} button should be displayed on list page", (button: string) => {
    Library.createNewLibrary.should('have.text', button)
})

When("the sort order of cust med Library should be {string}", (Value: string) => {
    cy.wait(4000)
    let custMedLibrary: any = [];
    let temp: any = [];
    CustomMedicationSummary.tableRow.each(($row, idx, array) => {
        cy.wrap($row).within(() => {
            CustomMedicationSummary.custMedNameInTable.then((e) => {
                custMedLibrary.push(e.text());
                if (idx === array.length - 1) {
                    temp = [...custMedLibrary];
                    temp.sort((a: any, b: any) => a.toLowerCase() - b.toLowerCase());
                    if (Value == 'asc') {
                        for (let i = 0; i < custMedLibrary?.length; i++) {
                            expect(custMedLibrary[i]).to.eq(temp[i])
                        }
                    }
                    else {
                        temp.sort((a: any, b: any) => b.toLowerCase() - a.toLowerCase());
                        for (let i = 0; i < custMedLibrary?.length; i++) {
                            expect(custMedLibrary[i]).to.eq(temp[i])
                        }
                    }
                }
            })
        })
    })
})

Then("the user clicks on the arrow button next to Library Name", () => {
    Library.arrowButton.click()
})

When("user creates {string} custom medication Library with name starting with {string} through API", (custMedNumber: number, textCustMedName: any) => {
    for (let i = 0; i < custMedNumber; i++) {
        let rad = Math.floor(Math.random() * 10000) + 1;
        let timestamp = new Date().getTime();
        let custMedName = textCustMedName + rad + timestamp;
        saveCustomMedicationLibrary(custMedName, 'custom-medication-library').then(response => {
            expect(response.status).to.eq(200)
            // libraryId  = response.body?.id; 
            // cy.window().then((win) => {
            //     win.localStorage.setItem('libraryId', response.body?.id);
            //   });
        })
    }
})

Then("user is able to see 10 records in Library page", () => {
    cy.wait(3000);
    cy.get("table").find('tr').its('length').then((rowCount) => {
        cy.log('Number of rows in the table: ' + rowCount);
        expect(rowCount - 1).to.be.eq(10);
    })
})


When("user Enter {string} in Custom Medication name under library", (MedicationName: string) => {
    CustomMedication.txtCustomMedication.clear().type(MedicationName);
})

Then("user clicks on Custom Medication Library first record", () => {
    Library.firstCustomMedicationLibrary.click()
})

Then("verify up arrow icon", () => {
    Library.upArrowIcon.should('be.visible')
})

Then("verify down arrow icon", () => {
    Library.downArrowIcon.should('be.visible')
})

Then("first page should display", () => {
    Library.firstPage.should('have.css', 'background-color', 'rgb(242, 101, 34)');
})

Then("close the application", () => {
    cy.window().then((win) => {
        win.close();
    });
})

Then("user deletes the existing custom medications and libraries from DB", () => {
    cy.task('DATABASE', {
        dbConfig: Cypress.env('DB'),
        sql: `
        DELETE FROM public."CustomMedicationIngredientMapping" as CMI
        using public."CustomMedication" as CM
        WHERE CM."CustomMedicationId" = CMI."CustomMedicationId"
        AND CM."CustomMedicationId" >= 20000;
          `,
    }).then(() => {
        cy.task('DATABASE', {
            dbConfig: envPAGE.env.QADBPGADMIN,
            sql: `
            DELETE FROM public."CustomMedicationMedGroupMapping" as cmg
            using public."CustomMedication" as CM
            WHERE CM."CustomMedicationId" = cmg."CustomMedicationId"
            AND CM."CustomMedicationId" >= 20000
              `,
        })
    })
        .then(() => {
            cy.task('DATABASE', {
                dbConfig: envPAGE.env.QADBPGADMIN,
                sql: `
            DELETE FROM public."CustomMedication" as CM
            WHERE  CM."CustomMedicationId" >= 20000
              `,
            })
        })
        .then(() => {
            cy.task('DATABASE', {
                dbConfig: envPAGE.env.QADBPGADMIN,
                sql: `
            DELETE FROM public."CustomMedicationLibrary" as CM
            WHERE  CM."Id" >= 5000
              `,
            })
        })
})

Then("User clicks on {string} hyperlink", (text: string) => {
    cy.contains("a", text).click()
})

Then("user open view tab", () => {
    Library.view.click();
})

Then("searched result should contain {string} in the table", (text: string) => {
    Library.searchFunctionality(text);
})